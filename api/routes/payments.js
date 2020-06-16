/* eslint-disable no-console */
const ForgeSDK = require('@arcblock/forge-sdk');
const get = require('lodash/get');
const { toAddress } = require('@arcblock/did');
const { wallet } = require('../libs/auth');

module.exports = {
  init(app) {
    app.get('/api/payments', async (req, res) => {
      try {
        if (req.user) {
          const { transactions } = await ForgeSDK.listTransactions({
            addressFilter: { sender: toAddress(req.user.did), receiver: wallet.toAddress() },
            typeFilter: { types: ['transfer'] },
          });
          const amount = (await ForgeSDK.fromTokenToUnit(2)).toString();
          const tx = (transactions || [])
            .filter(x => get(x, 'tx.itxJson.value'))
            .filter(x => x.code === 'OK' && get(x, 'tx.itxJson.value').toString() === amount)
            .shift();
          if (tx && tx.hash) {
            res.json(tx);
            return;
          }
        }
        res.json(null);
      } catch (err) {
        console.error('api.payments.error', err);
        res.json(null);
      }
    });
  },
};
