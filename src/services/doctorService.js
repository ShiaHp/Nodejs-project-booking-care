import db from '../models/index';
import bcrypt from 'bcryptjs';
import _ from 'lodash'
require('dotenv').config();
const MAX_NUMBER_SCHEDULE  = process.env.MAX_NUMBER_SCHEDULE ;
let getTopDoctorHome = (limitInput) => {
    // limit truyen vao
    return new Promise( async (resolve, reject) => {
        try{
            let users = await db.User.findAll({ 
                limit : limitInput,
                where : 
                  {  roleId : 'R2'}
                ,
                order:   [['createdAt','DESC']],
                attributes: {
                    exclude: ['password']
                },
                include : [
                    {model:db.Allcode, as : 'positionData',attributes:['valueEn','valueVi']},
                    {model:db.Allcode, as : 'genderData',attributes:['valueEn','valueVi']}
                ],
                raw: true,
                nest:true,
                })
                resolve({
                    errCode: 0,
                    data:users
            })
        }catch(e){
            reject(e);
        }
    })
}
let getAllDoctors = () => {
    return new Promise( async (resolve, reject) => {
        try{
            let doctors = await db.User.findAll({
                where : {roleId : 'R2'},
                attributes: {
                    exclude:  ['password','image']
                }              
            },
            )

            resolve({
                errCode : 0,
                data : doctors
            })
        }catch(e){
            reject(e);
        }
    })
}


let checkRequireFields = (inputData) => {
    let arrFields = ['doctorId','contentHTML','contentMarkdown','action','selectPrice',
'selectPayment','selectProvince','note','nameClinic','addressClinic','specialtyId'
];


let isTheValid = true;
let element = '';
    for(let i = 0; i < arrFields.length;i++){
            if(!inputData[arrFields[i]]){
                isTheValid = false;
                element = arrFields[i]
                break;
            }
    }
    return {
        isTheValid: isTheValid,
        element: element
    }
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise( async (resolve, reject) => {
        try{

            let checkObj = checkRequireFields(inputData);

                if(checkObj.isTheValid === false){
                    resolve({
                        errCode : 1,
                        errMessage : ` Missing required parameter:  ${checkObj.element}`
                    })
                } else{
                    if(inputData.action === 'CREATE'){
                        await db.Markdown.create({
                            contentHTML : inputData.contentHTML,
                            contentMarkdown : inputData.contentMarkdown,
                            description : inputData.description,
                            doctorId : inputData.doctorId,
                            
                        })
                    } else if (inputData.action === 'EDIT'){
                        let doctorMarkdown = await db.Markdown.findOne
                        ({
                            where : {doctorId : inputData.doctorId},
                            raw : false
                        })

                        if(doctorMarkdown){
                            doctorMarkdown.contentHTML = inputData.contentHTML,
                            doctorMarkdown.contentMarkdown = inputData.contentMarkdown,
                            doctorMarkdown.description = inputData.description,

                            doctorMarkdown.updateAt = new Date();
                            await doctorMarkdown.save()
                        }

                    }
                        
                    // upsert to doctorInfor table

                     let doctorInfor = await db.Doctor_Infor.findOne({
                         where: {
                             doctorId : inputData.doctorId,
                            
                         }, raw : false
                     })

                     if(doctorInfor){
                        //  update
                        doctorInfor.priceId = inputData.selectPrice;
                        doctorInfor.provinceId = inputData.selectProvince;
                        doctorInfor.paymentId = inputData.selectPayment;
                        doctorInfor.doctorId = inputData.doctorId;
                        doctorInfor.nameClinic= inputData.nameClinic;
                        doctorInfor.addressClinic = inputData.addressClinic ;
                        doctorInfor.note = inputData.note;
                        doctorInfor.specialtyId = inputData.specialtyId ;
                        doctorInfor.clinicId = inputData.clinicId ;
                        await doctorInfor.save()
                     } else{
                        //  create
                        await db.Doctor_Infor.create({
                         priceId : inputData.selectPrice,
                         provinceId : inputData.selectProvince,
                         paymentId : inputData.selectPayment,
                        doctorId : inputData.doctorId,
                         nameClinic: inputData.nameClinic,
                         addressClinic : inputData.addressClinic ,
                         note : inputData.note,
                        specialtyId : inputData.specialtyId,
                        clinicId : inputData.clinicId,
                        })
                     }
                        resolve({
                            errCode : 0,
                            errMessage : 'Save infor doctor successfully saved'
                        })
                    }

        }catch(e){
            reject(e);
        }
    })
}
let getDetailDoctorById = (inputData) =>{
    return new Promise( async (resolve, reject) => {
        try{

        if(!inputData){
            resolve({
                errCode : 1,
                errMessage : ' Missing required parameter '
            })
        }
         else{
             let data = await db.User.findOne({
                 where: {
                     id: inputData,
                    
                    },
                    attributes: {
                        exclude:  ['password']
                    }    ,
                    include : [
                        // join two table
                        {model:db.Markdown,attributes : ['description','contentHTML','contentMarkdown'] },
                        //  lấy thông tin user và thông tin của nó tồn tại trong bảng markdown 
                        {  model:db.Allcode, as : 'positionData',attributes:['valueEn','valueVi']},         
                      {model:db.Doctor_Infor ,
                        attributes: { 
                             exclude : ['id','doctorId']}
        
                          , include : [
                            {model:db.Allcode, as : 'priceTypeData',attributes:['valueEn','valueVi']},
                            {model:db.Allcode, as : 'provinceTypeData',attributes:['valueEn','valueVi']},
                            {model:db.Allcode, as : 'paymentTypeData',attributes:['valueEn','valueVi']},
                        ],
                    }
                    ],
                    raw: true,
                    nest:true,
             })
             if(data && data.image ){
                 data.image = new Buffer(data.image,'base64').toString('binary');
             }

             if(!data) data = {};
             resolve({
                 errCode : 0,
                 data: data
             })
         }

        }catch(e){
            reject(e);
        }
    })
}
    let  bulkCreateSchedule =(data) => {
     return new Promise( async (resolve, reject) => {
            try{
                if(!data.arrSchedule || !data.doctorId || !data.formatedDate)
                {
                    resolve({
                        errCode : 1,
                        errMessage : 'Missing required parameter'
                    })
                } else{
                    let schedule = data.arrSchedule;
                    if(schedule && schedule.length >0){
                        schedule = schedule.map(item =>{
                            item.maxNumber = MAX_NUMBER_SCHEDULE;
                            return item
                        })
                    }

                let existing = await db.Schedule.findAll({
                    where: { doctorId : data.doctorId ,date: data.formatedDate},
                    attributes: ['timeType','date','doctorId','maxNumber'],
                    raw: true,

                })
                    // console.log('check existing',existing)
                    // console.log('check create :' ,schedule)
                    
                
                    // convert date
                    // if(existing && existing.length >0){
                    //     existing = existing.map(item =>{
                    //         item.date = new Date(item.date).getTime()
                    //         return item
                    //     })
                    // }

                    // compare different 

                        let toCreate = _.differenceWith(schedule,existing,(a,b) =>{
                            return a.timeType === b.timeType & +a.date === +b.date
                        })
                // a = '5'
                // b  = +a =>b =5 
                        // create data 
                        if(toCreate && toCreate.length >0){
                            await db.Schedule.bulkCreate(toCreate);
                        }
                resolve({
                    errCode : 0,
                    errMessage : 'OK'
                })
                }
              
            }catch(e){
                reject(e);
            }
})
}
let getScheduleByDate = (doctorId,date) => {
    return new Promise( async (resolve, reject) => {
        try{
            if(!doctorId|| !date){
                resolve({
                    errCode : 1,
                    errMessage : ' Missing required parameter '
                })
            } else{
                let dataSchedule = await db.Schedule.findAll({
                    where : 
                    { doctorId  : doctorId 
                         , date:date },
                 include : [                       
                      {model:db.Allcode, as :'timeTypeData', attributes:['valueEn','valueVi']},         
                      {model:db.User, as :'doctorData', attributes:['firstName','lastName']},     
                      

                        ],
                        raw: true,
                        nest :true,
                })
            
                if(!dataSchedule) dataSchedule = [];
                resolve({
                    errCode: 0,
                    data : dataSchedule
                })
            }
       
        } catch(e){
            reject(e);
        }
    })
}

let getExtraInForDoctorById = (idInput) => {
    return new Promise( async(resolve, reject) => {
            try{
                    if(!idInput){
                        resolve({
                            errCode : -1,
                            errMessage : 'Missing required parameter'
                        })
                        
                    } else{
                        let data  = await db.Doctor_Infor.findOne({
                            where : {doctorId:idInput},

                            attributes: {  exclude : ['id','doctorId']}
                        
                            , include : [
                                {model:db.Allcode, as : 'priceTypeData',attributes:['valueEn','valueVi']},
                                {model:db.Allcode, as : 'provinceTypeData',attributes:['valueEn','valueVi']},
                                {model:db.Allcode, as : 'paymentTypeData',attributes:['valueEn','valueVi']},
                            ],
                            raw:false,
                            nest: true
                        })
                        if(!data) data= {};
                        resolve({
                            errCode : 0,
                            data: data
                        })
                    }

            }catch(e){
                reject(e);
            }
    })
}
let getProfileDoctorById = (inputId) =>{
    return new Promise( async (resolve, reject) => {
            try{
            if(!inputId){
            resolve({
                errCode : 1,
                errMessage : ' Missing required parameter '
            })
        } else{
            let data = await db.User.findOne({
                where: {
                    id: inputId                   
                   },
                   attributes: {
                       exclude:  ['password']
                   }    ,
                   include : [               
                    {model:db.Markdown,attributes : ['description','contentHTML','contentMarkdown'] },                      
                       {  model:db.Allcode, as : 'positionData',attributes:['valueEn','valueVi']}, 


                        {model:db.Doctor_Infor ,

                        attributes: {  exclude : ['id','doctorId'],
                    
                    }
                       
                       , include : [
                           {model:db.Allcode, as : 'priceTypeData',attributes:['valueEn','valueVi']},
                           {model:db.Allcode, as : 'provinceTypeData',attributes:['valueEn','valueVi']},
                           {model:db.Allcode, as : 'paymentTypeData',attributes:['valueEn','valueVi']},
                       ],
                   }
                   ],
                   raw: true,
                   nest:true,
            })
            if(data && data.image ){
                data.image = new Buffer(data.image,'base64').toString('binary');
            }

            if(!data) data = {};
            resolve({
                errCode : 0,
                data: data
            })
        }

            }catch(e){
                reject(e);
            }
    })
}

let getListPatientForDoctor  = (doctorId,date) =>{
        return new Promise( async (resolve, reject) => {
            try {
                if(!doctorId || !date){
                    resolve({
                        errCode : 1,
                        errMessage : ' Missing required parameter '
                    })
                    } else{
                    let data = await db.Booking.findAll({
                        where: { statusId : 'S2' , 
                        doctorId : doctorId,
                        date: date
                    } , 
                    include : [
                        {model:db.User , as : 'patientData' ,attributes:['email','firstName','address','gender'] ,
                    include : [{model:db.Allcode,as : 'genderData',attributes:['valueEn','valueVi']}]
                    },
                    //    mối quan hệ giữa User và Allcode 

                    {
                        model:db.Allcode , as : 'timeTypeDataPatient' ,attributes:['valueEn','valueVi']
                    }
                ],
                    
                    raw: true,
                    nest:true,
                })
                    resolve({
                        errCode : 0,
                        data: data
                    })
                 

                        }

            } catch (error) {
                reject(error);
            }
        })
}
module.exports =
{
    getTopDoctorHome:getTopDoctorHome,
    getAllDoctors : getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    // key value 
    getDetailDoctorById:getDetailDoctorById,
    bulkCreateSchedule:bulkCreateSchedule,
    getScheduleByDate:getScheduleByDate,
    getExtraInForDoctorById:getExtraInForDoctorById,
    getProfileDoctorById:getProfileDoctorById ,
    getListPatientForDoctor  : getListPatientForDoctor 
}