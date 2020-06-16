/* eslint-disable no-console */
const multibase = require('multibase');
const ForgeSDK = require('@arcblock/forge-sdk');
const { fromTokenToUnit, toHex, toBN } = require('@arcblock/forge-util');
const { fromAddress } = require('@arcblock/forge-wallet');
const { decodeAny } = require('@arcblock/forge-message');

const { wallet } = require('../../libs/auth');
const { PAYMENT_AMOUNT } = require('../../libs/constant');

module.exports = {
  action: 'payment',
  claims: {
    signature: async ({ extraParams: { locale } }) => {
      const { state } = await ForgeSDK.getForgeState(
        {},
        { ignoreFields: ['state.protocols', /\.txConfig$/, /\.gas$/] }
      );

      const description = {
        en: `Please pay 2 ${state.token.symbol} to unlock the secret document`,
        zh: `请支付 2 ${state.token.symbol} 以解锁加密的文档`,
      };

      return {
        type: 'TransferTx',
        data: {
          itx: {
            to: wallet.toAddress(),
            value: fromTokenToUnit(PAYMENT_AMOUNT, state.token.decimal),
          },
        },
        description: description[locale] || description.en,
      };
    },
  },
  onAuth: async ({ claims, userDid, extraParams: { locale = 'en' } }) => {
    console.log('pay.onAuth', { claims, userDid });
    try {
      const claim = claims.find(x => x.type === 'signature');
      const tx = ForgeSDK.decodeTx(multibase.decode(claim.origin));

      const { state } = await ForgeSDK.getForgeState(
        {},
        { ignoreFields: ['state.protocols', /\.txConfig$/, /\.gas$/] }
      );

      const paymentAmount = fromTokenToUnit(PAYMENT_AMOUNT, state.token.decimal);
      const amount = toBN(toHex(decodeAny(tx.itx).value.value.value));
      if (!paymentAmount.eq(amount)) {
        const errors = {
          en: 'Payment failed: Incorrect pay amount!',
          zh: '支付失败: 支付金额不正确',
        };

        console.error('pay.onAuth.error', errors[locale]);
        throw new Error(errors[locale]);
      }

      const user = fromAddress(userDid);

      const hash = await ForgeSDK.sendTransferTx({
        tx,
        wallet: user,
        signature: claim.sig,
      });

      console.log('pay.onAuth', hash);
      return { hash, tx: claim.origin };
    } catch (err) {
      console.error('pay.onAuth.error', err);
      const errors = {
        en: 'Payment failed!',
        zh: '支付失败',
      };
      throw new Error(errors[locale] || errors.en);
    }
  },
};
