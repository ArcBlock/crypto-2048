/* eslint-disable no-console */
const ForgeSDK = require('@arcblock/forge-sdk');
const { verifyTxAsync } = require('@arcblock/tx-util');
const { toDelegateAddress } = require('@arcblock/did-util');

const env = require('../../libs/env');
const { wallet } = require('../../libs/auth');

module.exports = {
  action: 'authorize',
  claims: {
    signature: async ({ userDid }) => {
      const address = toDelegateAddress(userDid, wallet.toAddress());
      const amount = await ForgeSDK.fromTokenToUnit(2);

      const { state } = await ForgeSDK.getAccountState({ address: userDid });
      if ((await ForgeSDK.fromUnitToToken(state.balance).toString()) <= 2) {
        throw new Error('Your play balance is too low to play this game');
      }

      return {
        type: 'DelegateTx',
        data: {
          itx: {
            address,
            to: wallet.toAddress(),
            ops: [
              {
                typeUrl: 'fg:t:transfer',
                rules: [`itx.value == ${amount.toString()} and itx.assets == [] and itx.to == "${wallet.toAddress()}"`],
              },
            ],
          },
        },
        description: 'Sign this transaction to enable auto payment when start new game',
      };
    },
  },

  onAuth: async ({ claims, userDid }) => {
    const claim = claims.find(x => x.type === 'signature');
    const tx = ForgeSDK.decodeTx(claim.origin);
    const user = ForgeSDK.Wallet.fromAddress(userDid);

    const hash = await ForgeSDK.sendTransferTx({
      tx,
      wallet: user,
      signature: claim.sig,
    });

    console.info('delegate.send', { claims, userDid, hash });

    await verifyTxAsync({ hash, chainId: env.chainId, chainHost: env.chainHost });

    const hash2 = await ForgeSDK.transfer({
      to: wallet.toAddress(),
      delegator: userDid,
      token: 2,
      memo: 'play game',
      wallet,
    });

    console.log('try charge', hash2);

    return { hash, tx: claim.origin };
  },
};
