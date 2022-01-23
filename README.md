# unit-webhook-server

1. Run `npm install`
2. Set environemnt variables:
- `PORT` - the node js server port
- `UNIT_BASE_API_URL` - Unit's API endpoint 
- `UNIT_API_TOKEN` - Unit's API token (without the "Bearer" text)
3. Run `npm run dev`

Example:
```
PORT=4400 UNIT_BASE_API_URL=https://api.s.unit.sh UNIT_API_TOKEN=v2.public.eyJyb2xlIjoic3VwZXIi...  npm run dev
```
