import jwt from 'jsonwebtoken'

const  generateToken = (email) => {
    const token = jwt.sign({email:email}, process.env.JWT_SECRET)
    return token;
}

export default generateToken