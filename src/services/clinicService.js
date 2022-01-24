
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

module.exports = {
    createClinic :createClinic
}