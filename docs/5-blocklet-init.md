# Blocklet init

## 1. Run blocklet.init

```json
{
  "name": "crypto-2048",
  "title": "Crypto 2048",
  "description": "A demo game that demos possibilities of integrating ArcBlock technologies into a game",
  "group": "dapp",
  "provider": "devcon",
  "public_url": "/",
  "main": "api/index.js",
  "color": "primary",
  "hooks": {
    "pre-start": "node api/hooks/pre-start.js"
  },
  "hookFiles": ["api/hooks/pre-start.js"],
  "requiredEnvironments": [
    {
      "name": "MONGO_URI",
      "description": "Connection string to mongodb",
      "required": true,
      "default": ""
    },
    {
      "name": "LOCAL_CHAIN_ID",
      "description": "ID of the chain game coin lives",
      "required": true,
      "default": ""
    },
    {
      "name": "LOCAL_CHAIN_HOST",
      "description": "Host of the chain game coin lives",
      "required": true,
      "default": ""
    },
    {
      "name": "FOREIGN_CHAIN_ID",
      "description": "ID of the chain native token lives",
      "required": true,
      "default": ""
    },
    {
      "name": "FOREIGN_CHAIN_HOST",
      "description": "Host of the chain native token lives",
      "required": true,
      "default": ""
    }
  ]
}
```
