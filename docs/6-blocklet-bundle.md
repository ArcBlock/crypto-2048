# Blocklet Bundle

## 1. update package.json

```json
{
    "bundle": "yarn clean && npm-run-all bundle:*",
    "bundle:client": "REACT_APP_API_PREFIX=\"\" REACT_APP_APP_NAME=\"Crypto 2048\" react-scripts build",
    "bundle:server": "NODE_ENV=production abtnode bundle",
    "prepublishOnly": "npm run bundle && rm -f _blocklet/build/**/*.{js,css}.map",
}
```
