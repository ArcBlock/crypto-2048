/* eslint-disable no-console */
const ForgeSDK = require('@arcblock/forge-sdk');
const { NFTFactory, NFTRecipient } = require('@arcblock/nft');
const { createZippedSvgDisplay } = require('@arcblock/nft-template');

const env = require('../../libs/env');
const template = require('../../libs/trophy');
const { wallet } = require('../../libs/auth');

const factory = new NFTFactory({
  chainId: env.chainId,
  chainHost: env.chainHost,
  wallet,
  issuer: {
    name: 'Crypto 2048',
    url: 'https://devcon.arcblock.io',
    logo: 'https://releases.arcblockio.cn/dapps/labs.png',
  },
});

const createBadge = async ({ userPk, userDid }) => {
  const [asset] = await factory.createBadge({
    display: createZippedSvgDisplay(template(userDid)),
    data: {
      name: 'Crypto 2048 Master',
      description: 'Award on high score in crypto 2048 game',
      reason: 'Score over 2048',
      type: 'Crypto2048Master',
      issueTime: Date.now(),
      expireTime: -1,
      recipient: new NFTRecipient({
        wallet: ForgeSDK.Wallet.fromPublicKey(userPk),
        name: userDid,
        location: 'Online',
      }),
    },
  });

  return asset;
};

module.exports = {
  action: 'trophy',
  claims: {
    signature: async ({ userDid, userPk }) => {
      const badge = await createBadge({ userPk, userDid });

      return {
        description: 'Sign the text to get your trophy badge',
        data: JSON.stringify(badge.address),
        type: 'mime:text/plain',
        display: JSON.stringify(badge.data.value.credentialSubject.display),
      };
    },
  },

  onAuth: async ({ claims, userPk, userDid }) => {
    const claim = claims.find(x => x.type === 'signature');
    const user = ForgeSDK.Wallet.fromPublicKey(userPk);
    if (user.verify(claim.origin, claim.sig) === false) {
      throw new Error('signature invalid');
    }

    const asset = JSON.parse(ForgeSDK.Util.fromBase58(claim.origin));
    const hash = await ForgeSDK.transfer({
      to: userDid,
      assets: [asset],
      wallet,
    });

    return { hash };
  },
};
