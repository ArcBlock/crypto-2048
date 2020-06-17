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
        exist.name = profile.fullName;
        exist.avatar = profile.avatar;
        await exist.save();
      } else {
        const user = new User({
          did: userDid,
          name: profile.fullName,
          email: profile.email,
          avatar: profile.avatar,
        });
        await user.save();
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
