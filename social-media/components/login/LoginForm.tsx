'use client'


import Link from "next/link"
import { LoginErrorsType } from "@/utils/Types"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"






export default function LoginForm(){

    const [loginFormErrors,setLoginFormErrors] = useState<LoginErrorsType>({})
    const router = useRouter()

    useEffect(()=>{
        const access = localStorage.getItem('access')
        if(access) router.push('/profile')
    },[])

    return (
            <form className=" w-full h-[90%] md:w-[40%] bg-white md:h-full rounded-xl md:rounded-none md:rounded-tr-xl md:rounded-br-xl flex flex-col justify-center items-center gap-2" action={async(formData:FormData)=>{
                    const errors:LoginErrorsType = {}
                    const username = formData.get('username')
                    const password = formData.get('password')
                
                    if(!username){
                        errors.username = 'you must provide a username!'
                    }
                    if(!password){
                        errors.password = 'You must provide a password!'
                    }
                
                    if(Object.keys(errors).length == 0){
                        try{
                            const response = await fetch('http://localhost:8000/api/auth/jwt/create/',{
                                method:'POST',
                                body:formData,
                                credentials:'include',
                            })
                            if(!response.ok){
                                errors.general = 'Something went wrong!'
                                setLoginFormErrors(errors)
                            }
                            const data = await response.json()
                            if(data.access) localStorage.setItem('access',data.access)
                            router.push('/profile')
                            
                            
                        }catch(e){
                            const error = e as Error
                            errors.general = error.message
                            setLoginFormErrors(errors)
                        }
                
                    }else{
                        setLoginFormErrors(errors)
                    }
            }}>
                {loginFormErrors.general && <div className="w-[70%] bg-red-100 py-4 px-2 rounded-md flex justify-center"><span className="text-red-500 text-sm font-medium" >{loginFormErrors.general}</span></div> }
                <h1 className="text-2xl font-medium mb-2">Login to your Account</h1>
                <label htmlFor="username" className="w-[70%] cursor-pointer">Username</label>
                <input type="text" name="username" id="username" placeholder="Enter your username" className="w-[70%] py-4 px-2 focus:outline-none border border-gray-200 focus:border focus:border-[#B75A4E] rounded-md" />
                {loginFormErrors.username &&  <span className="w-[70%] text-red-500 text-sm font-medium" >{loginFormErrors.username}</span> }
                <label htmlFor="password" className="w-[70%] cursor-pointer">Password</label>
                <input type="password" name="password" id="password" placeholder="Enter your password" className="w-[70%] py-4 px-2 border border-gray-200 focus:outline-none focus:border focus:border-[#B75A4E] rounded-md" />
                {loginFormErrors.password &&  <span className="w-[70%] text-red-500 text-sm font-medium" >{loginFormErrors.password}</span> }
                <Link href="/recover" className="w-[70%] text-[#7F265B] text-xs font-medium text-right">Forgot your password?</Link>
                <input type="submit" value="Login" className="w-[50%] bg-[#7F265B] mt-2 text-white py-2 text-lg font-medium rounded-md cursor-pointer hover:bg-[#74124d]  " />
                <p className="text-gray-400 mt-8">Not registered yet?  <Link href="/register"><span className="text-[#7F265B] font-medium">Create an account</span></Link></p>
            </form>
    )
}