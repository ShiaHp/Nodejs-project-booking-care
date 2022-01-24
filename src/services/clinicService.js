
import db from '../models/index'

let createClinic = (data) =>{
        return new Promise( async (resolve, reject) => {
            try{
                if(!data.name ||
                     !data.imageBase64 ||
                      !data.descriptionHTML ||
                       !data.descriptionMarkdown ||
                       !data.address) {
                    resolve({
                        errCode : 1,
                        errMessage : 'Missing required parameter'
                    })
                } else {
                        await db.Clinic.create({
                            name : data.name,
                            image : data.imageBase64,
                            descriptionHTML : data.descriptionHTML,
                            descriptionMarkdown : data.descriptionMarkdown,
                            address : data.address,
                        })
                        resolve({
                            errCode : 0,
                            errMessage : 'Success'
                        })
                }
            } catch(e){
                reject(e);
            }
        })
}


let getAllClinic = () =>{
    return new Promise( async (resolve, reject) => {

        try {
            let data = await db.Clinic.findAll();
           
            if(data && data.length >0){
                data.map(item => {
                    item.image = new Buffer(item.image,'base64').toString('binary');
                    return item
                })
                
            }
            resolve({
                errCode : 0,
                errMessage : 'OK',
                data
            })
        } catch (error) {
            reject(error)
        }
               
        
            })
}
let getDetailClinicById = (inputId) =>{


    return new Promise( async (resolve, reject) => {
        try {
            
            if(!inputId ) {
                resolve({
                    errCode : 1,
                    errMessage : 'Missing required parameter'
                })
            } else {   
                  let data = await db.Clinic.findOne({
                        where: { id : inputId} ,
                        attributes : ['descriptionHTML','descriptionMarkdown' , 'name', 'address']
                    })
                 
                  if(data) {
                      let doctorClinic = [];
                      
                      doctorClinic  = await db.Doctor_Infor.findAll({
                            where: { clinicId :inputId } ,
                            attributes : ['doctorId']
                        })
                     
                    


                    data.doctorClinic=    doctorClinic;
                        // gán tiếp 
            
        }  else data = {};
            resolve({
                errCode : 0,
                errMessage : 'ok',
                data
            })
                   
        }

        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createClinic :createClinic ,
    getAllClinic :getAllClinic ,
    getDetailClinicById  : getDetailClinicById
}