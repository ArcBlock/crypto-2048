/* eslint-disable operator-linebreak */
module.exports = {
  appId:
    process.env.BLOCKLET_APP_ID ||
    process.env.REACT_APP_APP_ID ||
    process.env.GATSBY_APP_ID ||
    process.env.APP_ID ||
    process.env.appId ||
    '',
  appName:
    process.env.REACT_APP_APP_NAME ||
    process.env.GATSBY_APP_NAME ||
    process.env.APP_NAME ||
    process.env.appName ||
    'Crypto 2048',
  appDescription:
    process.env.REACT_APP_APP_DESCRIPTION ||
    process.env.GATSBY_APP_DESCRIPTION ||
    process.env.APP_DESCRIPTION ||
    process.env.appDescription ||
    'A simple 2048 clone that demos how to integrate games with ArcBlock technologies',
  baseUrl:
    process.env.BLOCKLET_BASE_URL ||
    process.env.REACT_APP_BASE_URL ||
    process.env.GATSBY_BASE_URL ||
    process.env.BASE_URL ||
    process.env.baseUrl ||
    '',
  apiPrefix:
    process.env.REACT_APP_API_PREFIX ||
    process.env.GATSBY_API_PREFIX ||
    process.env.NF_API_PREFIX ||
    process.env.API_PREFIX ||
    process.env.apiPrefix ||
    '',
  chainId:
    process.env.LOCAL_CHAIN_ID ||
    process.env.REACT_APP_CHAIN_ID ||
    process.env.GATSBY_CHAIN_ID ||
    process.env.CHAIN_ID ||
    process.env.chainId,
  chainHost:
    process.env.LOCAL_CHAIN_HOST ||
    process.env.REACT_APP_CHAIN_HOST ||
    process.env.GATSBY_CHAIN_HOST ||
    process.env.CHAIN_HOST ||
    process.env.chainHost,
  assetChainId:
    process.env.FOREIGN_CHAIN_ID ||
    process.env.REACT_APP_ASSET_CHAIN_ID ||
    process.env.GATSBY_ASSET_CHAIN_ID ||
    process.env.ASSET_CHAIN_ID ||
    process.env.assetChainId,
  assetChainHost:
    process.env.FOREIGN_CHAIN_HOST ||
    process.env.REACT_APP_ASSET_CHAIN_HOST ||
    process.env.GATSBY_ASSET_CHAIN_HOST ||
    process.env.ASSET_CHAIN_HOST ||
    process.env.assetChainHost,
};
