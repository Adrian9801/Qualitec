  const  config = {
    user:  'AdminQualiTec', // sql user
    password:  'qualitec12345', //sql user password
    server:  'DESKTOP-3R01DVU', // if it does not work try- localhost
    database:  'db_a79624_qualitec',
    options: {
      trustedconnection:  true,
      enableArithAbort:  true,
      instancename:  'DESKTOP-3R01DVU'  // SQL Server instance name
    },
    port:  1433
  }
  
  module.exports = config;