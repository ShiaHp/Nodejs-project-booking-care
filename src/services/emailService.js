require('dotenv').config()
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {
     // async..await is not allowed in global scope, must use a wrapper
 
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();
    
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD , // generated ethereal password
        },
      });
    

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Shia boo 👻" <thienxa282003@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "thông tin đặt lệnh khám bệnh ", // Subject line    
        html: getBodyHTMLEmail(dataSend)
        
       // html body
      });
}

let getBodyHTMLEmail = (dataSend) => {
  let result = [];
    if(dataSend.language === 'vi' ){
result =    `
<h3> Xin chào khách hàng ${dataSend.patientName}</h3>
<p>  Bạn nhận được email này vì đã đặt lịch khám bệnh online trên trangweb vớ vẩn nào đó . Giờ nôn tiền ra nào hohohoho    </p>
<p> Thông tin đặt lệnh khám bệnh : </p>
<div>  <b> Thời gian : ${dataSend.time} </b></div>

<div>  <b> Bác sĩ  : ${dataSend.doctorName} </b></div>


<p> Nếu các thông tin trên là đúng sự thật vui lòng click vào đường link bên dưới , để xác nhận hoàn tất thủ tục đặt lịch khám bệnh

</p>

<div>  <a href=${dataSend.redirectLink} target= "_blank"> Click here</a></div>       
`
    }
    if(dataSend.language === 'en'){
      result  =    `
      <h3> Hello patient ${dataSend.patientName}</h3>
      <p>  You has been received this email from me . The lord of castle demon     </p>
      <p> Thông tin đặt lệnh khám bệnh : </p>
      <div>  <b> Thời gian : ${dataSend.time} </b></div>

      <div>  <b> Bác sĩ  : ${dataSend.doctorName} </b></div>


      <p> Nếu các thông tin trên là đúng sự thật vui lòng click vào đường link bên dưới , để xác nhận hoàn tất thủ tục đặt lịch khám bệnh
      
      </p>

      <div>  <a href=${dataSend.redirectLink} target= "_blank"> Click here</a></div>       
      `
    }

    return result;
}

module.exports = {
    sendSimpleEmail   : sendSimpleEmail
}