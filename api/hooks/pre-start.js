/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
require('dotenv').config();
require('@abtnode/util/lib/error-handler');

const ForgeSDK = require('@arcblock/forge-sdk');
const { verifyTxAsync, verifyAccountAsync } = require('@arcblock/tx-util');
const batchPromises = require('batch-promises');
const range = require('lodash/range');

const { wallet } = require('../libs/auth');
const env = require('../libs/env');

const address = wallet.toAddress();

// Check for application account
const ensureAccountDeclared = async chainId => {
  const { state } = await ForgeSDK.getAccountState({ address }, { conn: chainId });
  if (!state) {
    console.error('Application account not declared on chain');

    const hash = await ForgeSDK.declare(
      {
        moniker: 'crypto_2048',
        wallet,
      },
      { conn: chainId }
    );

    console.log(`Application declared on chain ${chainId}`, hash);
    return { balance: 0, address };
  }

  return state;
};

const ensureAccountFunded = async (chainId, chainHost) => {
  const { state } = await ForgeSDK.getAccountState({ address }, { conn: chainId });

  // console.log('application account state', state);

  const balance = await ForgeSDK.fromUnitToToken(state.balance, { conn: chainId });
  console.info(`application account balance on chain ${chainId} is ${balance}`);
  const amount = 250;
  if (+balance < amount) {
    const limit = amount / 25;
    await batchPromises(5, range(1, limit + 1), async () => {
      const slave = ForgeSDK.Wallet.fromRandom();
      try {
        await ForgeSDK.declare({ moniker: 'sweeper', wallet: slave }, { conn: chainId });
        await verifyAccountAsync({ chainId, chainHost, address: slave.toAddress() });
        const hash = await ForgeSDK.checkin({ wallet: slave }, { conn: chainId });
        await verifyTxAsync({ chainId, chainHost, hash });
        await ForgeSDK.transfer({ to: address, token: 25, wallet: slave }, { conn: chainId });
        console.info('Collect success', slave.toAddress());
      } catch (err) {
        console.info('Collect failed', err);
      }
    });
    console.info(`Application account funded with another ${amount}`);
  } else {
    console.info(`Application account balance greater than ${amount}`);
  }
};

(async () => {
  try {
    if (env.chainId) {
      await ensureAccountDeclared(env.chainId);
      await verifyAccountAsync({ chainId: env.chainId, chainHost: env.chainHost, address });
      await ensureAccountFunded(env.chainId, env.chainHost);
    }

    if (env.assetChainId) {
      await ensureAccountDeclared(env.assetChainId);
      await verifyAccountAsync({ chainId: env.assetChainId, chainHost: env.assetChainHost, address });
      // await ensureAccountFunded(env.assetChainId, env.assetChainHost);
    }
    process.exit(0);
  } catch (err) {
    console.error('crypto-2048 pre-start error', err);
    process.exit(1);
  }
})();
