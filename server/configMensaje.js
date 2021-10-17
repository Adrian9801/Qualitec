const nodemailer = require('nodemailer');

module.exports = (formulario) => {
    var transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: 'estudiante1QualiTec@outlook.com', 
            pass: 'estudiante258369' 
        }
    });
    const mailOptions = {
        from: 'estudiante1QualiTec@outlook.com',
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