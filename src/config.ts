import {assertIsDefined} from "./utils"

assertIsDefined(process.env.PORT)
export const PORT = parseInt(process.env.PORT) || 4400

export const UNIT_BASE_API_URL = process.env.UNIT_BASE_API_URL
export const UNIT_API_TOKEN = process.env.UNIT_API_TOKEN
