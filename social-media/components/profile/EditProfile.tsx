import { AppContext } from "@/contexts/AppContext";
import { fetchWithAuth } from "@/utils/Helpers";
import { RegisterErrorsType as UpdateErrorsType, UpdateProfileErrorsType } from "@/utils/Types";
import Image from "next/image";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";


export default function EditProfile(){
    const [isOpen,setIsOpen] = useState<Boolean>(false)
    const [updateFormErrors,setUpdateFormErrors] = useState<UpdateErrorsType>({})
    const [profileImage,setProfileImage] = useState<string>('')
    const { userProfile,setUserProfile } = useContext(AppContext)
    return (
        <>
        <FaRegEdit className="absolute top-2 right-2 text-[#7F265B] w-6 h-6 cursor-pointer hover:scale-110 transition duration-200 ease-in-out"  onClick={()=>{setIsOpen((prev:Boolean)=>!prev)
        setProfileImage('')
        }}/>
        {
            isOpen &&
            <div className="overlay fixed z-[60] top-0 left-0 w-full h-screen bg-black/35 flex justify-center items-center" onClick={()=>{setIsOpen((prev:Boolean)=>!prev)
            setProfileImage('')
            }}>
                <form className="relative w-[90%] h-[90%] overflow-y-scroll md:overflow-auto pb-4 md:w-[40%] md:h-[90%]  bg-white rounded-md flex flex-col items-center" action={async(formData:FormData)=>{
                    const fields = ['avatar','user.first_name','user.last_name','user.username','user.email']
                    const errors:UpdateProfileErrorsType = {}
                    const newFormData = new FormData
                    const avatar = formData.get('updated-avatar')
                    const bio = formData.get('bio')
                    const first_name = formData.get('first_name')
                    const last_name = formData.get('last_name')
                    const username = formData.get('username')
                    const email = formData.get('email')

                    if(avatar instanceof File &&  avatar.size > 0){
                        newFormData.append('avatar',avatar)
                    }
                    if(bio){
                        newFormData.append('bio',bio)
                    }
                    if(first_name){
                        newFormData.append('user.first_name',first_name)
                    }
                    if(last_name){
                        newFormData.append('user.last_name',last_name)
                    }
                    if(username){
                        newFormData.append('user.username',username)
                    }
                    if(email){
                        newFormData.append('user.email',email)
                    }
                    const isFullUpdate = fields.every(field => newFormData.has(field) )
                    const requestMethod = isFullUpdate ? 'PUT' : 'PATCH'
                    console.log(requestMethod)
                    if(Object.keys(errors).length == 10){
                        
                        try{
                            const response = await fetchWithAuth('http://localhost:8000/api/update/profile/',{
                                method:'PATCH',
                                body:newFormData
                            })
                            if(!response.ok){
                                const data = await response.json()
                                errors.general = JSON.stringify(data)
                                setUpdateFormErrors(errors)
                            }
                            const data = await response.json()
                            toast.success('Profile updated successfully')
                            setUserProfile(data)
                            setIsOpen((prev:Boolean)=>!prev)
                        }catch(e){
                            const error = e as Error
                            errors.general = error.message
                            setUpdateFormErrors(errors)

                        }
                    }

                }} onClick={(e)=>e.stopPropagation()} >
                    <IoClose className="absolute top-2 right-2 w-6 h-6 text-red-600 cursor-pointer hover:text-red-700 hover:scale-110 transition duration-300 ease-in-out" onClick={()=>setIsOpen((prev:Boolean)=>!prev)} />
                <h1 className="text-2xl font-medium my-8">Update your informations</h1>
                <div className="w-[70%] flex items-center justify-center gap-4">
                    <Image src={profileImage ? profileImage : userProfile.avatar} width={100} height={100} alt="user profile image" className="w-[100px] h-[100px] object-fit"/>
                    <div className="">
                            <label htmlFor="avatar" className="flex flex-col items-center justify-center w-[80%] h-12 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex items-center justify-center py-4">
                                    <svg className="w-8 h-8 my-6 mx-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    {/* <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center"><span className="font-semibold">Click to upload</span> or drag and drop</p> */}
                                    {/* <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p> */}
                                </div>
                                <input id="avatar" name="updated-avatar" type="file" className="hidden" accept="image/*" onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{ e.target.files && setProfileImage(URL.createObjectURL(e.target.files[0]))}}
                                />
                            </label>
                        </div>
                </div>
            <div className="w-[90%] flex flex-col md:justify-center md:gap-4 gap-2">
                <label htmlFor="first_name" className="w-[70%] cursor-pointer">First name</label>
                <input type="text" name="first_name" id="first_name" placeholder="Enter your first name" className=" md:w-full py-4 px-2 focus:outline-none border border-gray-200 focus:border focus:border-[#B75A4E] rounded-md" />
                {updateFormErrors.first_name &&  <span className="w-[70%] text-red-500 text-sm font-medium" >{updateFormErrors.first_name}</span> }
                <label htmlFor="username" className="w-[70%] cursor-pointer">Last name</label>
                <input type="text" name="last_name" id="last_name" placeholder="Enter your username" className="py-4 px-2 focus:outline-none border border-gray-200 focus:border focus:border-[#B75A4E] rounded-md" />
                {updateFormErrors.last_name &&  <span className="w-[70%] text-red-500 text-sm font-medium" >{updateFormErrors.last_name}</span> }
                <label htmlFor="username" className="w-[70%] cursor-pointer">Username</label>
                <input type="text" name="username" id="username" placeholder="Enter your username" className="py-4 px-2 focus:outline-none border border-gray-200 focus:border focus:border-[#B75A4E] rounded-md" />
                {updateFormErrors.username &&  <span className="w-[70%] text-red-500 text-sm font-medium" >{updateFormErrors.username}</span> }
                <label htmlFor="email" className="w-[70%] cursor-pointer">Email</label>
                <input type="text" name="email" id="email" placeholder="Enter your email" className="py-4 px-2 focus:outline-none border border-gray-200 focus:border focus:border-[#B75A4E] rounded-md" />
                {updateFormErrors.email &&  <span className="w-[70%] text-red-500 text-sm font-medium" >{updateFormErrors.email}</span> }
            </div>
            <input type="submit" value="Update" className="w-[50%] bg-[#7F265B] mt-6 text-white py-2 text-lg font-medium rounded-md cursor-pointer hover:bg-[#74124d]" />
                </form>
            </div>

        }
        </>
    )
}