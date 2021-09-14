const nodemailer = require('nodemailer');

module.exports = (formulario) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'qualitec.cr@gmail.com', 
            pass: 'admin258369' 
        }
    });
    const mailOptions = {
        from: 'qualitec.cr@gmail.com',
        to: formulario.Correo, 
        subject: 'Recuperación de cuenta',
        html: `
        Tu código de verificación de QualiTec es: <strong>${formulario.Code}</strong>`
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err){
            return false;
        }
        else{
            return true;
        }
    });
}