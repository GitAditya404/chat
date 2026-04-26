import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken';

async function verifyUser(token){  //created this to verify websocket request b/c it cant use middleware like isLoggedIn
    try{
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({email:decoded.email}).select('-password')
        if(!user)
            return "User no longer exists"
        return user;
    }
    catch(e){
        return "Invalid or expired Cookie"
    }

}

export default verifyUser