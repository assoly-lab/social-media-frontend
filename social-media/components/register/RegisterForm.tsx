'use client'

import { RegisterErrorsType } from "@/utils/Types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function RegisterForm(){
    const [registerFormErrors,setRegisterFormErrors] = useState<RegisterErrorsType>({})
    const router = useRouter()

    useEffect(()=>{
        const access = localStorage.getItem('access')
        if(access)router.push('/profile')
    },[])

    return(
        <form className=" w-full py-4 md:py-0 md:w-[60%] bg-white md:h-full rounded-xl md:rounded-none md:rounded-tr-xl md:rounded-br-xl flex flex-col justify-center items-center gap-2" action={async(formData:FormData)=>{
            const errors:RegisterErrorsType = {}
                    const username = formData.get('username')
                    const first_name = formData.get('first_name')
                    const last_name = formData.get('last_name')
                    const email = formData.get('email')
                    const password = formData.get('password')
                    const re_password = formData.get('re_password')
                
                    if(!username){
                        errors.username = 'you must provide a username!'
                    }
                    if(!first_name){
                        errors.first_name = 'you must provide your first name!'
                    }
                    if(!last_name){
                        errors.last_name = 'you must provide your last name!'
                    }
                    if(!email){
                        errors.email = 'you must provide an email!'
                    }
                    if(!password){
                        errors.password = 'You must provide a password!'
                    }
                    if(!re_password){
                        errors.re_password = 'you must confirm your password!'
                    }
                    
                    if(password != re_password){
                        errors.general = "Passwords don't match!"
                    }
                
                    if(Object.keys(errors).length == 0){

                        try{
                            const response = await fetch('http://localhost:8000/api/auth/users/',{
                                method:'POST',
                                body:formData,
                            })
                            if(!response.ok){
                                errors.general = 'Something went wrong!'
                                setRegisterFormErrors(errors)
                            }

                            if(response.status == 201){
                                router.push('/login')
                            }
                            
                            
                        }catch(e){
                            const error = e as Error
                            errors.general = error.message
                            setRegisterFormErrors(errors)
                        }
                
                    }else{
                        setRegisterFormErrors(errors)
                    }

        }}>
            {registerFormErrors.general && <div className="w-[70%] bg-red-100 py-4 px-2 rounded-md flex justify-center"><span className="text-red-500 text-sm font-medium" >{registerFormErrors.general}</span></div> }
            <h1 className="text-2xl font-medium mb-2">Register your Account</h1>
            <div className="w-[90%] flex flex-col md:flex-row md:justify-center md:gap-4 gap-2">
                <div className="md:flex-1 flex flex-col gap-2">
                    <label htmlFor="first_name" className="w-[70%] cursor-pointer">First name</label>
                    <input type="text" name="first_name" id="first_name" placeholder="Enter your first name" className=" md:w-full py-4 px-2 focus:outline-none border border-gray-200 focus:border focus:border-[#B75A4E] rounded-md" />
                    {registerFormErrors.first_name &&  <span className="w-[70%] text-red-500 text-sm font-medium" >{registerFormErrors.first_name}</span> }
                    <label htmlFor="username" className="w-[70%] cursor-pointer">Last name</label>
                    <input type="text" name="last_name" id="last_name" placeholder="Enter your username" className="py-4 px-2 focus:outline-none border border-gray-200 focus:border focus:border-[#B75A4E] rounded-md" />
                    {registerFormErrors.last_name &&  <span className="w-[70%] text-red-500 text-sm font-medium" >{registerFormErrors.last_name}</span> }
                    <label htmlFor="username" className="w-[70%] cursor-pointer">Username</label>
                    <input type="text" name="username" id="username" placeholder="Enter your username" className="py-4 px-2 focus:outline-none border border-gray-200 focus:border focus:border-[#B75A4E] rounded-md" />
                    {registerFormErrors.username &&  <span className="w-[70%] text-red-500 text-sm font-medium" >{registerFormErrors.username}</span> }
                </div>
                <div className="md:flex-1 flex flex-col gap-2">
                <label htmlFor="email" className="w-[70%] cursor-pointer">Email</label>
                <input type="text" name="email" id="email" placeholder="Enter your email" className="py-4 px-2 focus:outline-none border border-gray-200 focus:border focus:border-[#B75A4E] rounded-md" />
                {registerFormErrors.email &&  <span className="w-[70%] text-red-500 text-sm font-medium" >{registerFormErrors.email}</span> }
                <label htmlFor="password" className="w-[70%] cursor-pointer">Password</label>
                <input type="password" name="password" id="password" placeholder="Enter your password" className="py-4 px-2 border border-gray-200 focus:outline-none focus:border focus:border-[#B75A4E] rounded-md" />
                {registerFormErrors.password &&  <span className="w-[70%] text-red-500 text-sm font-medium" >{registerFormErrors.password}</span> }
                <label htmlFor="re_password" className="w-[70%] cursor-pointer">Confirm password</label>
                <input type="password" name="re_password" id="re_password" placeholder="Confirm your password" className="py-4 px-2 border border-gray-200 focus:outline-none focus:border focus:border-[#B75A4E] rounded-md" />
                {registerFormErrors.re_password &&  <span className="w-[70%] text-red-500 text-sm font-medium" >{registerFormErrors.re_password}</span> }
                </div>
            </div>
            <input type="submit" value="Register" className="w-[50%] bg-[#7F265B] mt-2 text-white py-2 text-lg font-medium rounded-md cursor-pointer hover:bg-[#74124d]" />
            <p className="text-gray-400 mt-4">Already have an account?  <Link href="/login"><span className="text-[#7F265B] font-medium">Login</span></Link></p>
        </form>
    )
}