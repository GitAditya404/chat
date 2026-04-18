const Login = () => {
    return <>
         <div class="w-full flex h-screen bg-[#2C2638] gap-5  text-white p-5">
            <div class="w-2/5  ml-[7vw] mt-[15vh]">
                <h3 class="text-3xl text-semibold ">Hello,</h3>
                <h3 class="text-3xl text-semibold mb-5">Welcome Back</h3>
                <p class="tracking-tight">Enter your email and password to access your account</p>
                <form class="w-full mt-8"  >
                    <input class="px-3 py-2  w-3/5 outline-none bg-[#3C364C] border-2 border-zinc-800 rounded-md" type="text" name="email" placeholder="email" />

                    <input class="px-3 mt-5 py-2 w-3/5 outline-none bg-[#3C364C] border-2 border-zinc-800 rounded-md" type="text" name="password" placeholder="password" />
                    <button className="px-3 block mt-8 py-2 bg-blue-500 rounded-md">Login</button>
                    <p class="tracking-tight mt-8 inline-block">Don't have an account? </p>
                    <a class="text-blue-500 underline ml-2  mt-8" href="/signup">Sign up</a>
                </form>
            </div>

            <div class="w-1/2 h-full  rounded-xl overflow-hidden">
                <img class="h-full w-full object-cover  " src="" alt="" />
            </div>


    </div>   
    </>
}

export default Login