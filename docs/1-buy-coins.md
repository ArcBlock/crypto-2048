# Buy Coins

## 1. Add dependencies

`yarn add @arcblock/did-auth @arcblock/did-rect`

## 2. Add backend handler

### 2.1 Create `api/routes/auth/swap.js`

```javascript
/* eslint-disable no-console */
const ForgeSDK = require('@arcblock/forge-sdk');

const env = require('../../libs/env');
const { swapStorage, wallet } = require('../../libs/auth');

module.exports = {
  action: 'swap',
  claims: {
    swap: async ({ userDid, extraParams: { tid } }) => {
      const amount = 100;
      const rate = 100;

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
```

### 2.2 Load the new route in `api/functions/app.js`

```javascript
const { handlers, swapHandlers } = require('../libs/auth');
// ...
swapHandlers.attach(Object.assign({ app: router }, require('../routes/auth/swap')));
// ...
```

## 3. Add atomic-swap frontend

In `src/pages/index.js`:

```javascript
  const [swapOpen, setSwapOpen] = useState(false);
  const onSwapClose = () => setSwapOpen(false);
  const onSwapOpen = async () => {
    const res = await api.post('/api/did/swap', {});
    setSwapOpen(res.data.traceId);
  };
  const onSwapSuccess = () => {
    setTimeout(onSwapClose, 1000);
  };

          <Button size="small" variant="outlined" color="secondary" onClick={onSwapOpen}>
            Buy Coins
          </Button>

        {!!swapOpen && (
          <DidAuth
            responsive
            action="swap"
            checkFn={api.get}
            onClose={onSwapClose}
            onSuccess={onSwapSuccess}
            checkTimeout={5 * 60 * 1000}
            extraParams={{ tid: swapOpen }}
            messages={{
              title: 'Buy Game Coins',
              scan: 'Scan qrcode to buy game coins at rate 1 TBA = 100 Coin',
              confirm: 'Review this operation on ABT Wallet',
              success: 'Operation Success',
            }}
          />
        )}
```

## 4. Test Buy Coins
