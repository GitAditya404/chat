import jwt from 'jsonwebtoken'

const  generateToken = (email) => {
    const token = jwt.sign({email:email}, 'secretword')
    return token;
}

export default generateToken