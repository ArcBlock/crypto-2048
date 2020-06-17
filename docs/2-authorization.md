# Add authorization

## 1. Add dependencies

`yarn add @arcblock/did-util @arcblock/tx-util`

## 2. Add backend handler

### 2.1 Create `api/routes/auth/authorize.js`

```javascript
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

    // const hash2 = await ForgeSDK.transfer({
    //   to: wallet.toAddress(),
    //   delegator: userDid,
    //   token: 2,
    //   memo: 'play game',
    //   wallet,
    // });
    // console.log('try charge', hash2);

    return { hash, tx: claim.origin };
  },
};
```

### 2.2 Load the new route in `api/functions/app.js`

```javascript
// ...
handlers.attach(Object.assign({ app: router }, require('../routes/auth/authorize')));
// ...
```

## 3. Add atomic-swap frontend

In `src/pages/index.js`:

```javascript
  const [authOpen, setAuthOpen] = useState(false);
  const onAuthClose = () => setAuthOpen(false);
  const onAuthSuccess = () => {
    setTimeout(onAuthClose, 1000);
  };


          <Button size="small" variant="outlined" color="primary" onClick={() => setAuthOpen(true)}>
            Sign Agreement
          </Button>

        {authOpen && (
          <DidAuth
            responsive
            action="authorize"
            checkFn={api.get}
            onClose={onAuthClose}
            onSuccess={onAuthSuccess}
            checkTimeout={5 * 60 * 1000}
            extraParams={{}}
            messages={{
              title: 'Signature Required',
              scan: 'Scan qrcode to authorize the game to charge you when start new game',
              confirm: 'Review this operation on ABT Wallet',
              success: 'Operation Success',
            }}
          />
        )}
```

## 4. Test Authentication
