/* eslint-disable no-console */
const ForgeSDK = require('@arcblock/forge-sdk');

const env = require('../../libs/env');
const { swapStorage, wallet } = require('../../libs/auth');

module.exports = {
  action: 'swap',
  claims: {
    swap: async ({ userDid, extraParams: { tid, amount = 1000 } }) => {
      if (Number(amount) <= 0) {
        throw new Error('Invalid swap amount param for swap token action');
      }

      const rate = 1000;

      const payload = {
        offerChainId: env.chainId,
        offerChainHost: env.chainHost,
        offerAssets: [],
        offerToken: (await ForgeSDK.fromTokenToUnit(amount, { conn: env.chainId })).toString(),
        offerUserAddress: wallet.toAddress(), // 卖家地址

        demandChainId: env.assetChainId,
        demandChainHost: env.assetChainHost,
        demandAssets: [],
        demandToken: (await ForgeSDK.fromTokenToUnit(amount / rate, { conn: env.assetChainId })).toString(),
        demandUserAddress: userDid, // 买家地址
        demandLocktime: await ForgeSDK.toLocktime(2400, { conn: env.assetChainId }),
      };

      const res = await swapStorage.finalize(tid, payload);
      console.info('swap.finalize', res);
      const swap = await swapStorage.read(tid);

      return {
        swapId: tid,
        receiver: wallet.toAddress(),
        ...swap,
      };
    },
  },

  onAuth: async () => {},
};
