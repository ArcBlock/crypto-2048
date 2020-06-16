/* eslint-disable no-console */
require('dotenv').config();

const { server } = require('./functions/app');

const port = parseInt(process.env.BLOCKLET_PORT || process.env.APP_PORT, 10) || 3000;
server.listen(port, err => {
  if (err) throw err;
  console.log(`> app ready on ${port}`);
});
