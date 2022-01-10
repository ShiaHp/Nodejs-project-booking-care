import db from '../models/index';
import bcrypt from 'bcryptjs';

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

let saveDetailInforDoctor = (inputData) => {
    return new Promise( async (resolve, reject) => {
        try{
                if(!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown ){
                    resolve({
                        errCode : 1,
                        errMessage : ' Missing required parameter '
                    })
                } else{
                        await db.Markdown.create({
                            contentHTML : inputData.contentHTML,
                            contentMarkdown : inputData.contentMarkdown,
                            description : inputData.description,
                            doctorId : inputData.doctorId,

                        })
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
                        exclude:  ['password','image']
                    }    ,
                    include : [
                        // join two table
                        {model:db.Markdown,attributes : ['description','contentHTML','contentMarkdown'] },
                        //  lấy thông tin user và thông tin của nó tồn tại trong bảng markdown 
                        {  model:db.Allcode, as : 'positionData',attributes:['valueEn','valueVi']},
                      
                    ],
                    raw: true,
                    nest:true,
             })
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

module.exports =
{
    getTopDoctorHome:getTopDoctorHome,
    getAllDoctors : getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    // key value 
    getDetailDoctorById:getDetailDoctorById,
}