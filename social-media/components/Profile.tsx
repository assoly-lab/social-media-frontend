'use client'


import { fetchWithAuth } from "@/utils/Helpers"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChangeEvent, useContext, useEffect, useState } from "react"
import EditProfile from "./profile/EditProfile"
import { MdModeEditOutline } from "react-icons/md";
import {motion} from "framer-motion"
import toast from "react-hot-toast"
import { AppContext } from "@/contexts/AppContext"






export default function Profile(){
    const { userProfile,setUserProfile } = useContext(AppContext)
    const router = useRouter()
    const [updatedUserProfile,setUpdatedUserProfile] = useState<string>('')

    useEffect(()=>{
        const access = localStorage.getItem('access')
        if(!access){
            router.push('/login')
        }
    },[])

    useEffect(()=>{
        const getUserProfile = async ()=>{
            const access = localStorage.getItem('access')
            if(access){
                try{
                    const response = await fetchWithAuth('http://localhost:8000/api/get/profile/',{
                        headers:{
                            'Content-Type':'application/json',
                        }
                    })
                    if(!response.ok){
                        throw new Error('Something went wrong')
                    }
                    const data = await response.json()
                    setUserProfile(data)
                }catch(e){
                    const error = e as Error
                    return error.message
                }
            }
        }
        getUserProfile()
    },[])

    
    return (
        <div className="relative w-[90%] md:w-[70%] min-h-[80vh] bg-white rounded-lg ">
            {userProfile && 
            <EditProfile />
            }
            {userProfile &&
            <>
                <Image 
                    className="rounded-full absolute left-[50%] translate-x-[-50%] translate-y-[-45%] border-2 border-[#7F265B] cursor-pointer w-[150px] h-[150px] object-cover" 
                    src={updatedUserProfile ? updatedUserProfile : userProfile.avatar} width={150} height={150} alt="user profile image" 
                    priority
                    />
                    <UploadInput setUpdatedUserProfile={setUpdatedUserProfile} />
                <p className="text-2xl text-black font-semibold text-center mt-20 capitalize  ">{userProfile.user.first_name} {userProfile.user.last_name}</p>
                <p className="text-base text-gray-400 text-center ">@{userProfile.user.username} </p>
                <p className="text-center">Bio:</p>
                <p className="mx-auto text-sm text-gray-400 w-[200px]">{userProfile.bio ? userProfile.bio : 'Empty bio'}</p>
                <div className="w-full flex justify-center gap-4 mt-4">
                    <div className="rounded-md hover:bg-slate-100 p-2 cursor-pointer">
                        <p className="font-semibold">Followers</p>
                        <p className="text-center font-semibold">{userProfile.followers_count}</p>
                    </div>
                    <div className="w-[3px] bg-black "></div>
                    <div className="rounded-md hover:bg-slate-100 p-2 cursor-pointer">
                        <p className="font-semibold">Following</p>
                        <p className="text-center font-semibold">{userProfile.following_count}</p>
                    </div>
                </div>
                <div className="w-full flex justify-center mt-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <p className="flex-1 text-lg font-semibold">Username: </p>
                            <p className="flex-1 text-lg">{userProfile.user.username}</p>
                        </div>
                        <div className="flex gap-4">
                            <p className="flex-1 text-lg font-semibold">Firstname: </p>
                            <p className="flex-1 text-lg">{userProfile.user.first_name}</p>
                        </div>
                        <div className="flex gap-4">
                            <p className="flex-1 text-lg font-semibold">Lastname: </p>
                            <p className="flex-1 text-lg">{userProfile.user.last_name}</p>
                        </div>
                        <div className="flex gap-4">
                            <p className="flex-1 text-lg font-semibold">Email: </p>
                            <p className="flex-1 text-lg">{userProfile.user.email}</p>
                        </div>
                    </div>

                </div>
            </>
            }
        </div>
    )
}











const UploadInput = ({setUpdatedUserProfile}:{setUpdatedUserProfile:React.Dispatch<React.SetStateAction<string>>})=>{
    return (
        <motion.label 
        initial={{opacity:0}}
        whileHover={{opacity:1}}
        exit={{opacity:0}}
        htmlFor="profile-pic" className="absolute left-[50%] translate-x-[-50%] translate-y-[-45%] w-[150px] h-[150px] z-50 rounded-full bg-black/15 flex justify-end items-end overflow-hidden cursor-pointer ">
            <input id="profile-pic" type="file" name="avatar" className="hidden" accept="image/*" onChange={(async(e:ChangeEvent<HTMLInputElement>)=>{
                if(e.target.files){
                    if(e.target.files[0]){
                        try{
                        const formData = new FormData
                        formData.append('avatar',e.target.files[0])
                        const response = await fetchWithAuth('http://localhost:8000/api/update/profile/pic/',{
                            method: 'PUT',
                            body:formData

                        })
                        
                        if(!response.ok){
                            throw new Error('Something went wrong!')
                        }
                        toast.success('Profile image updated successfully!')
                        setUpdatedUserProfile(URL.createObjectURL(e.target.files[0]))


                    }catch(e){
                        const error = e as Error
                        toast.error(error.message)
                    }

                    }
                }
            })} />
            <MdModeEditOutline className="w-6 h-6 mb-4 mr-6 text-white bg-black/35 cursor-pointer" />
        </motion.label>
    )
}