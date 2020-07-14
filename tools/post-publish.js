/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require('axios');

(async () => {
  try {
    const res = await axios.post('https://api.netlify.com/build_hooks/5d71fd6472feae0bb5d28671');
    console.log('trigger blocklets build success:', res.status);
  } catch (error) {
    console.error('trigger blocklets build failed:', error);
  }
  process.exit(0);
})();
