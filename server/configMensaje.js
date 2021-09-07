const nodemailer = require('nodemailer');

module.exports = (formulario) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'qualitec.cr@gmail.com', // Cambialo por tu email
            pass: 'admin258369' // Cambialo por tu password
        }
    });
    const mailOptions = {
        from: 'qualitec.cr@gmail.com',
        to: formulario.Correo, // Cambia esta parte por el destinatario
        subject: 'Recuperación de cuenta',
        html: `
        <strong>El código de verificación es: </strong>` + formulario.Code
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err){
            console.log(err);
            return false;
        }
        else{
            return true;
        }
    });
}