import {PORT, UNIT_BASE_API_URL, UNIT_API_TOKEN} from "./config"
import axios, {AxiosResponse} from "axios"
import {V1} from "paseto"
import express from "express"
import bodyParser from "body-parser"
import {
    assertIsDefined,
    logError,
    logInfo
} from "./utils"

import moment from "moment"
import {minBy, toInteger, flatten, parseInt} from "lodash"

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req, rep) => rep.status(200).send("Hello"))

app.post("/webhooks", async (req, res) => {
    
    const message = JSON.stringify(req.body)
    logInfo(`Webhook call received. Payload: ${message}`)

    const webhookType = req.body.data[0].type

    if (webhookType === "authorizationRequest.pending") {
        handlePendingAuthorizationRequest(req)
    }
    else if (webhookType === "authorizationRequest.approved") {
        handleApprovedAuthorizationRequest(req)
    } else {
        logInfo(`Unhandled webhook type. Payload: ${message}`)
    }

    return res.status(200)
})

async function handlePendingAuthorizationRequest(req: express.Request) {
    const authorizationRequestId = req.body.data[0].relationships.authorizationRequest.data.id
    const partialApprovalAllowed = req.body.data[0].attributes.partialApprovalAllowed
    const totalHealthcareAmount = req.body.data[0].attributes.healthCareAmounts != null ? toInteger(req.body.data[0].attributes.healthCareAmounts.totalHealthcareAmount) : 0

    const response = await axios.post(`${UNIT_BASE_API_URL}/authorization-requests/${authorizationRequestId}/approve`, 
        getApproveRequestBody(partialApprovalAllowed, totalHealthcareAmount), {
            headers: {"AUTHORIZATION": `Bearer ${UNIT_API_TOKEN}`, "content-type": "application/vnd.api+json"},
        })

    if (response.status != 200) {
        logError(`Failed to approve authorization request with id: ${authorizationRequestId}`)
    }
}

function getApproveRequestBody(partialApprovalAllowed: boolean, totalHealthcareAmount: number) {
    if (partialApprovalAllowed && totalHealthcareAmount != 0) {
        logInfo("Approving partial amount for healthcare authorization request")
        return {
            "data": {
                "type": "approveAuthorizationRequest",
                "attributes": {
                    "amount": totalHealthcareAmount
                }
            }
        }
    }
    else {
        logInfo("Approving original authorization request amount")
        return {
            "data": {
                "type": "approveAuthorizationRequest",
                "attributes": {
                }
            }
        }
    }
}

function handleApprovedAuthorizationRequest(req: express.Request) {
    const authorizationRequestId = req.body.data[0].relationships.authorizationRequest.data.id
    logInfo(`Authorization request id: ${authorizationRequestId} was approved.`)
}

const server = app.listen(PORT, () => console.log("level=info service=unit.webhookserver msg=\"unit.webhookserver running\""))
server.keepAliveTimeout = 65 * 1000
server.headersTimeout = 70 * 1000

