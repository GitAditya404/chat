import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'

export const registerUser = async  (req,res) => {

    try{

        const {fullname ,email ,password } = req.body;
        const user = await userModel.findOne({email:email})
        if(user)
            return res.status(400).send('email already registered')
        
        const saltRounds = 10 ;

        bcrypt.hash(password, saltRounds,async function(err, hash) {
            const createdUser = await userModel.create ({
                fullname : fullname,
                email : email,
                password : hash
            })
            res.send(createdUser)

        });

    }
    catch(e) {
        console.log('error' + e)
    }
}

export const loginUser = async (req,res) => {
    const {email,password} = req.body;
    const user = await userModel.findOne({email})
    if(!user)
        return res.status(404).send("email Incorrect")

    const hash = user.password
    bcrypt.compare(password, hash, function(err, result) {
        if(!result)
            return res.status(404).send("Password Incorrect")
        
        res.send(user)
    });
}
