# Add payment

## 2. Add backend handler

### 2.1 Create `api/routes/game.js`

```javascript
/* eslint-disable no-console */
const ForgeSDK = require('@arcblock/forge-sdk');
const { verifyTxAsync } = require('@arcblock/tx-util');

const env = require('../libs/env');
const { wallet } = require('../libs/auth');

module.exports = {
  init(app) {
    app.post('/api/game/start', async (req, res) => {
      if (req.user) {
        const hash = await ForgeSDK.transfer({
          to: wallet.toAddress(),
          delegator: req.user.did,
          token: 2,
          memo: 'start new game',
          wallet,
        });

        console.info('start new game', { user: req.user.did, hash });

        await verifyTxAsync({ hash, chainId: env.chainId, chainHost: env.chainHost });
        res.json({ hash });
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    });
  },
};
```

### 2.2 Load the new route in `api/functions/app.js`

```javascript
// ...
require('../routes/game').init(router);
// ...
```

## 3. Add frontend

In `src/pages/index.js`:

```javascript
  const onGameStart = done => {
    api
      .post('/api/game/start')
      .then(async data => {
        await session.refresh();
        done(null, data);
      })
      .catch(err => {
        done(err.message);
      });
  };

          <Game chainInfo={{ chain, assetChain }} onGameStart={onGameStart} />
```

## 4. Test Start Game
