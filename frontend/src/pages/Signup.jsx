const Signup = () => {
    return <>
        <div className="w-full flex h-screen bg-[#2C2638] gap-5  text-white p-5">

            <div className="w-1/2 h-full  rounded-xl overflow-hidden">
                <img className="h-full w-full object-cover  " src="/mountain.jpg" alt="" />
            </div>

            <div className="w-2/5  ml-[7vw] mt-[15vh]">

                <h3 className="text-4xl text-semibold ">Create an account</h3>
                <div className="flex mt-4">
                    <p className="tracking-tight ">Already have an account?</p>
                    <a className="text-blue-500 underline ml-2" href="">Log in </a>
                </div>

                <form className="w-full  mt-8" >
                    <input className="px-3 py-2  w-3/5 outline-none bg-[#3C364C] border-2 border-zinc-800 rounded-md" type="text" name="fullname" placeholder="Full name" />

                    <input className="px-3 py-2 mt-6  w-3/5 outline-none bg-[#3C364C] border-2 border-zinc-800 rounded-md" type="text" name="email" placeholder="email" />

                    <input className="px-3  py-2 w-3/5 mt-6 outline-none bg-[#3C364C] border-2 border-zinc-800 rounded-md" type="text" name="password" placeholder="password" />

                    <button type="submit" className="px-3 block mt-8 py-2 bg-blue-500 rounded-md">Sign Up</button>
                </form>
            </div>




        </div>
    </>
}

export default Signup