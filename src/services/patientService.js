import db from '../models/index';
require('dotenv').config()
import emailService from './emailService'

let postBookAppointment = (data) => {
    return new Promise( async (resolve, reject) => {
        try {
                if(!data.email || !data.doctorId || !data.date || !data.timeType  || !data.fullName) {
                    resolve({
                        errCode : 1,
                        errMessage : 'Missing required parameter'
                    })
                } else {
                      

                    await emailService.sendSimpleEmail({
                        receiverEmail : data.email,
                        patientName : data.fullName,
                        time: data.timeString,
                        doctorName : data.doctorName,
                        language : data.language,
                        redirectLink : 'https://www.youtube.com/watch?v=ExYvqpziqgg&list=RDExYvqpziqgg&start_radio=1'
                    }) 


                        // upsert
                let user =  await db.User.findOrCreate({
                        where : {email : data.email},
                        defaults :{
                            email : data.email,
                            roleId : 'R3',
                         
                        },
                      
                    })

                    //  create a booking record 
               
                    if(user && user[0]){
                            await db.Booking.findOrCreate({
                                    where : { patientId : user[0].id},
                                    defaults : {
                                        statusId :'S1',
                                        patientId : user[0].id,
                                        doctorId: data.doctorId,
                                        date :data.date,
                                        timeType : data.timeType
                                    }                          
                            })
                    }               

                    resolve({             
                        errCode : 0,
                        errMessage : 'Save infor patient successfully'
                    })
                }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    postBookAppointment : postBookAppointment
}