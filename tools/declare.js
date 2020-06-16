/* eslint-disable no-console */
require('dotenv').config();

// eslint-disable-next-line import/no-extraneous-dependencies
const ForgeSDK = require('@arcblock/forge-sdk');
const env = require('../api/libs/env');
const { wallet } = require('../api/libs/auth');

(async () => {
  try {
    const hash1 = await ForgeSDK.declare(
      {
        moniker: 'workshop_blockchain_game',
        wallet,
      },
      { conn: env.chainId }
    );

    const hash2 = await ForgeSDK.declare(
      {
        moniker: 'workshop_blockchain_game',
        wallet,
      },
      { conn: env.assetChainId }
    );

    console.log('Application wallet declared', hash1);
    console.log('Application wallet declared', hash2);
    process.exit(0);
  } catch (err) {
    console.error(err);
    console.error(err.errors);
    process.exit(1);
  }
})();
