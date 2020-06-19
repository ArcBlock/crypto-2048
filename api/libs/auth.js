const path = require('path');
const Mcrypto = require('@arcblock/mcrypto');
const ForgeSDK = require('@arcblock/forge-sdk');
const AuthStorage = require('@arcblock/did-auth-storage-nedb');
const SwapStorage = require('@arcblock/swap-storage-nedb');
const { fromSecretKey, WalletType } = require('@arcblock/forge-wallet');
const { WalletAuthenticator, WalletHandlers, SwapHandlers } = require('@arcblock/did-auth');
const env = require('./env');

const type = WalletType({
  role: Mcrypto.types.RoleType.ROLE_APPLICATION,
  pk: Mcrypto.types.KeyType.ED25519,
  hash: Mcrypto.types.HashType.SHA3,
});

if (env.chainHost) {
  ForgeSDK.connect(env.chainHost, {
    chainId: env.chainId,
    name: env.chainId,
    default: true,
  });
  if (env.assetChainHost) {
    ForgeSDK.connect(env.assetChainHost, {
      chainId: env.assetChainId,
      name: env.assetChainId,
    });
  }
}

const wallet = fromSecretKey(process.env.BLOCKLET_APP_SK || process.env.APP_SK, type);
const walletJSON = wallet.toJSON();

const walletAuth = new WalletAuthenticator({
  wallet: walletJSON,
  baseUrl: env.baseUrl,
  appInfo: {
    name: env.appName,
    description: env.appDescription,
    icon: 'https://arcblock.oss-cn-beijing.aliyuncs.com/images/wallet-round.png',
    link: env.baseUrl,
  },
  chainInfo: {
    host: env.chainHost,
    id: env.chainId,
  },
});

const dataDir = process.env.BLOCKLET_DATA_DIR || process.env.DATA_DIR;

const tokenStorage = new AuthStorage({ dbPath: path.join(dataDir, 'auth.db') });
const swapStorage = new SwapStorage({ dbPath: path.join(dataDir, 'swap.db') });

const walletHandlers = new WalletHandlers({
  authenticator: walletAuth,
  tokenGenerator: () => Date.now().toString(),
  tokenStorage,
});

const swapHandlers = new SwapHandlers({
  authenticator: walletAuth,
  tokenStorage,
  swapStorage,
  swapContext: {
    offerChainId: env.chainId,
    offerChainHost: env.chainHost,
    demandChainId: env.assetChainId,
    demandChainHost: env.assetChainHost,
  },
  options: {
    swapKey: 'tid',
  },
});

module.exports = {
  authenticator: walletAuth,
  handlers: walletHandlers,
  swapHandlers,
  swapStorage,
  wallet,
  dataDir,
};
