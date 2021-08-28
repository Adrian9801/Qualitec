const  config = {
    user:  'admin', // sql user
    password:  'admin1234', //sql user password
    server:  'localhost', // if it does not work try- localhost
    database:  'qualitec',
    options: {
      trustedconnection:  true,
      enableArithAbort:  true,
      instancename:  'DESKTOP-3R01DVU'  // SQL Server instance name
    },
    port:  1433
  }
  
  module.exports = config;