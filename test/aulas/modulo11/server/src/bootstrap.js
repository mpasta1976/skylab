// Para poder definir qual arquivo sera carregado //
const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});
