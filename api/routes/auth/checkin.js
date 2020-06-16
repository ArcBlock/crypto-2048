/* eslint-disable no-console */
const multibase = require('multibase');
const moment = require('moment');
const ForgeSDK = require('@arcblock/forge-sdk');
const { fromAddress } = require('@arcblock/forge-wallet');

module.exports = {
  action: 'checkin',
  claims: {
    signature: async ({ extraParams: { locale } }) => {
      const { state } = await ForgeSDK.getForgeState();

      const description = {
        en: `Sign this transaction to receive ${state.txConfig.poke.amount} ${state.token.symbol} for test purpose`,
        zh: `签名该交易，你将获得 ${state.txConfig.poke.amount} 个测试用的 ${state.token.symbol}`,
      };

      return {
        type: 'PokeTx',
        data: {
          nonce: 0,
          itx: {
            date: moment(new Date().toISOString())
              .utc()
              .format('YYYY-MM-DD'),
            address: 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
          },
        },
        description: description[locale] || description.en,
      };
    },
  },

  onAuth: async ({ claims, userDid, extraParams: { locale } }) => {
    try {
      const claim = claims.find(x => x.type === 'signature');
      const tx = ForgeSDK.decodeTx(multibase.decode(claim.origin));
      const wallet = fromAddress(userDid);
      console.log('poke.onAuth.payload', { tx, claim });

      const hash = await ForgeSDK.sendPokeTx({
        tx,
        wallet,
        signature: claim.sig,
      });
      console.log('poke.onAuth', hash);
      return { hash, tx: claim.origin };
    } catch (err) {
      console.error('poke.onAuth.error', err);
      const errors = {
        en: 'Checkin failed, please try tomorrow!',
        zh: '签到失败，请明天重试',
      };
      throw new Error(errors[locale] || errors.en);
    }
  },
};
