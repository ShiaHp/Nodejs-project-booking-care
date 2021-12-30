import userService from "../services/userService";


let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password){
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameters'
        })
    }

    let userData = await userService.handleUserLogin(email, password);
    console.log(userData)
  

    return res.status(200).json({    
        errCode : userData.errorCode,
        message : userData.errorMessage,
      user:userData.user ? userData.user : {    }
        });
  
        }         
        

  


module.exports = {handleLogin:handleLogin}