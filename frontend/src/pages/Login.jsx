import axios from 'axios'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const navigate = useNavigate();
    
    async function loginHandler() {
        const resp = await axios.post('http://localhost:3000/login',
            {
                email: emailRef.current.value,
                password : passwordRef.current.value 
            },
            {withCredentials: true}
        )
        navigate('/')

    }


    return <>
         <div className="w-full flex h-screen bg-[#2C2638] gap-5  text-white p-5">
            <div className="w-2/5  ml-[7vw] mt-[15vh]">
                <h3 className="text-3xl text-semibold ">Hello,</h3>
                <h3 className="text-3xl text-semibold mb-5">Welcome Back</h3>
                <p className="tracking-tight">Enter your email and password to access your account</p>
                <div className="w-full mt-8"  >
                    <input ref={emailRef} className="px-3 py-2  w-3/5 outline-none bg-[#3C364C] border-2 border-zinc-800 rounded-md" type="text" name="email" placeholder="email" />

                    <input ref={passwordRef} className="px-3 mt-5 py-2 w-3/5 outline-none bg-[#3C364C] border-2 border-zinc-800 rounded-md" type="text" name="password" placeholder="password" />

                    <button onClick={loginHandler} className="px-3 block mt-8 py-2 bg-blue-500 rounded-md">Login</button>

                    <p className="tracking-tight mt-8 inline-block">Don't have an account? </p>
                    <a className="text-blue-500 underline ml-2  mt-8" href="/signup">Sign up</a>
                </div>
            </div>

            <div className="w-1/2 h-full  rounded-xl overflow-hidden">
                <img className="h-full w-full object-cover  " src="../public/loginimg.png" alt="" />
            </div>


    </div>   
    </>
}

export default Login