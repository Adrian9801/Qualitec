const  config = {
    user:  'admin', // sql user
    password:  'admin1234', //sql user password
    server:  'localhost', // if it does not work try- localhost
    database:  'qualitec',
    options: {
      trustedconnection:  true,
      enableArithAbort:  true,
    },
    port:  1433
  }
  
  module.exports = config;