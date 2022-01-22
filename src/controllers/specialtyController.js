import specialtyService from '../services/specialtyService'

let createSpecialty =  async (req, res) =>{
    try{
        let infor = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(infor);
}catch(e){
    return res.status(200).json({
        errCode: -1 ,
        errMessage: 'Error from server' + e.message,

    })
}
}


module.exports = {
    createSpecialty :  createSpecialty  
}