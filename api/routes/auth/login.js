/* eslint-disable no-underscore-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
const env = require('../../libs/env');
const { User } = require('../../models');
const { login } = require('../../libs/jwt');

const description = {
  en: `Login ${env.appName} with your ABT Wallet`,
  zh: `用 ABT 钱包登录 ${env.appName}`,
};

module.exports = {
  action: 'login',
  claims: {
    profile: ({ extraParams: { locale } }) => ({
      fields: ['fullName', 'email', 'avatar'],
      description: description[locale] || description.en,
    }),
  },
  onAuth: async ({ claims, userDid, token, storage }) => {
    try {
      const profile = claims.find(x => x.type === 'profile');

      const exist = await User.findOne({ did: userDid });
      if (exist) {
        await User.update(
          { _id: exist._id },
          { name: profile.fullName, avatar: profile.avatar },
          { multi: false, upsert: false }
        );
      } else {
        await User.insert({
          did: userDid,
          name: profile.fullName,
          email: profile.email,
          avatar: profile.avatar,
        });
      }

      // Generate new session token that client can save to localStorage
      const sessionToken = await login(userDid);
      await storage.update(token, { did: userDid, sessionToken });
      console.error('login.onAuth.login', { userDid, sessionToken });
    } catch (err) {
      console.error('login.onAuth.error', err);
    }
  },
};
