import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken';

async function verifyUser(token){
    try{
        var decoded = jwt.verify(token, 'secretword');
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