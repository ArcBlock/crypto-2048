/* eslint-disable prefer-destructuring */
const ForgeSDK = require('@arcblock/forge-sdk');
const env = require('../libs/env');

module.exports = {
  init(app) {
    app.get('/api/did/session', async (req, res) => {
      const [chainState, assetChainState] = await Promise.all([
        ForgeSDK.getForgeState({ conn: env.chainId }),
        ForgeSDK.getForgeState({ conn: env.assetChainId }),
      ]);

      const balances = {};
      if (req.user) {
        const result = await Promise.all([
          ForgeSDK.getAccountState({ address: req.user.did }, { conn: env.chainId }),
          ForgeSDK.getAccountState({ address: req.user.did }, { conn: env.assetChainId }),
        ]);

        balances[env.chainId] = result[0].state
          ? await ForgeSDK.fromUnitToToken(result[0].state.balance, { conn: env.chainId })
          : 0;
        balances[env.assetChainId] = result[1].state
          ? await ForgeSDK.fromUnitToToken(result[1].state.balance, { conn: env.assetChainId })
          : 0;
      }

      res.json({
        user: req.user,
        [env.chainId]: {
          token: chainState.state.token,
          balance: balances[env.chainId],
        },
        [env.assetChainId]: {
          token: assetChainState.state.token,
          balance: balances[env.assetChainId],
        },
      });
    });

    app.post('/api/did/logout', (req, res) => {
      req.user = null;
      res.json({ user: null });
    });

    app.get('/api/env', (req, res) => {
      res.type('js');
      res.send(`window.env = ${JSON.stringify(env, null, 2)}`);
    });
  },
};
