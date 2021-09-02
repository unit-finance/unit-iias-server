import {assertIsDefined} from "./utils"

assertIsDefined(process.env.PORT, "PORT")
export const PORT = parseInt(process.env.PORT) || 4400

assertIsDefined(process.env.UNIT_BASE_API_URL, "UNIT_BASE_API_URL")
export const UNIT_BASE_API_URL = process.env.UNIT_BASE_API_URL

assertIsDefined(process.env.UNIT_API_TOKEN, "UNIT_API_TOKEN")
export const UNIT_API_TOKEN = process.env.UNIT_API_TOKEN
