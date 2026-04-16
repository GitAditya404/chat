import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

async function isLoggedIn(req,res,next) {
    const token = req.cookies.token;

    try{
    const decoded = jwt.verify(token,"secretword")  // if there is error it goes in catch 
    
        const user = await userModel.findOne({email:decoded.email}).select('-password')
        if(!user)
            return res.status(403).send('User no longer exists')
        req.user = user
        next();

    }
    catch(e){
        return res.status(401).send('Invalid or expired token')
        
    }
}

export default isLoggedIn