  const  config = {
    user:  'db_a79624_qualitec_admin', // sql user
    password:  'qualitec12345', //sql user password
    server:  'sql5061.site4now.net', // if it does not work try- localhost
    database:  'db_a79624_qualitec',
    options: {
      trustedconnection:  true,
      enableArithAbort:  true,
      instancename:  'sql5061.site4now.net'  // SQL Server instance name
    },
    port:  1433
  }
  
  module.exports = config;