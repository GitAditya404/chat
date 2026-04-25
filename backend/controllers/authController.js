import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import generateToken from '../utils/generateToken.js';
import zod from 'zod'

export const registerUser = async  (req,res) => {

    const bodySchema = zod.object({
            email : zod.string().email(),
            fullname : zod.string().min(3).max(100),
            password : zod.string()
                    .min(5, "Password must be at least 5 characters")
                    .max(10, "Password must be maxm 10 characters")
                    .regex(/[a-z]/, "Must contain at least one lowercase letter")
                    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
                    .regex(/[0-9]/, "Must contain at least one number")
                    .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character")
    })

    const result = bodySchema.safeParse(req.body)
    if(!result.success) {
            return res.status(400).json({
                msg: `${result.error.issues[0].path} -> ${result.error.issues[0].message}`
            })
    }
    
    const {email, fullname, password} = result.data;
    try{

        const user = await userModel.findOne({email:email})
        if(user)
            return res.status(400).json({
                msg : "Email already registered"
            })
        
        const saltRounds = 10 ;

        bcrypt.hash(password, saltRounds,async function(err, hash) {
            const createdUser = await userModel.create ({
                fullname : fullname,
                email : email,
                password : hash
            })
            const token  = generateToken(email)
            res.cookie("token", token);
            console.log('token created')
            res.send(createdUser)

        });

    }
    catch(e) {
        return res.status(400).json({
            msg : "Internal Server Error"
        })
    }
}


export const loginUser = async (req,res) => {

    const bodySchema = zod.object({
            email : zod.string().email(),
            password : zod.string()
    })


    const result = bodySchema.safeParse(req.body)
    if(!result.success) {
        return res.status(400).json({
                msg: `${result.error.issues[0].path} -> ${result.error.issues[0].message}`
            })
    }

    const {email,password} = result.data;

    try{
        const user = await userModel.findOne({email})
        if(!user)
            return res.status(404).json({
                msg: "Email Incorrect"
            })

        const hash = user.password
        bcrypt.compare(password, hash, function(err, result) {
            if(!result)
                return res.status(404).json({
                    msg: "Password Incorrect"
                })
            
            const token = generateToken(email)
            res.cookie("token" , token)
            res.send('cookie stored')
        });
    }

    catch(err){
        return res.status(400).json({
            msg : "Internal Server error"
        })
    }

}
