'use client'

import { useRef, useState,useEffect, useContext } from "react"
import Emojis from "../posts/Emojis"
import { MdInsertPhoto } from "react-icons/md";
import { GoVideo } from "react-icons/go";
import Image from "next/image";
import { IoCloseOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { AppContext } from "@/contexts/AppContext";
import { fetchWithAuth } from "@/utils/Helpers";
import { useRouter } from "next/navigation";
import { PostType } from "@/utils/Types";



export default function CreatePostForm(){
    const ref = useRef<HTMLTextAreaElement>(null)
    const router = useRouter()
    const { userProfile,setUserProfile,setPostsList} = useContext(AppContext)
    const [postImages,setPostImages] = useState<File[]>([])
    const [postVideo,setPostVideo] = useState<File>()
    const [accessToken,setAccessToken] = useState<string | null>(null)



    useEffect(()=>{
        const access = localStorage.getItem('access')
        if(access){
            setAccessToken(access)
        }
    },[])

    useEffect(()=>{
        const getUserProfile = async ()=>{
            const access = localStorage.getItem('access')
            if(access){
                console.log('fetching user profile')
                try{
                    const response = await fetchWithAuth('https://tornado008.pythonanywhere.com/api/get/profile/',{
                        headers:{
                            'Content-Type':'application/json',
                        }
                    })
                    if(!response.ok){
                        throw new Error('Something went wrong')
                    }
                    const data = await response.json()
                    console.log('user profile: ',data)
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
        <>
            <div className="flex mt-4">
                {userProfile && <Image src={userProfile.avatar} alt="user profile picture" width={40} height={40} className="w-[40px] h-[40px] rounded-full" />}
            </div>
            <form className="h-full flex-1 flex flex-col gap-4" action={async(formData:FormData)=>{
                const content = formData.get('content')
                if( postImages.length == 0 && !postVideo && !content){
                    toast.error('Add content to publish a post')
                }

                try{
                    const response =  await fetchWithAuth('https://tornado008.pythonanywhere.com/api/posts/create/',{
                        method: 'POST',
                        body:formData
                    })
                    if(!response.ok){
                        if(response.status == 401){
                            router.push('/login')
                        }
                        const error = await response.json()
                        toast.error(JSON.stringify(error))
                    }

                    const data = await response.json()
                    setPostsList((prev:PostType[])=>[data,...prev])
                    setPostImages([])
                    setPostVideo(undefined)
                    ref.current!.value = ""
                }catch(e){
                    const error = e as Error
                    toast.error(error.message)
                }
            }} >
                <div className="flex gap-4">
                    <textarea disabled={accessToken ? false : true} ref={ref} name="content" id="content" className="flex-1 w-full  h-[60px] md:h-[90px] bg-gray-100 disabled:placeholder-gray-300 placeholder-bg-gray-500 mt-4 pt-2 pl-4 focus:outline-none rounded-md focus:border focus:border-[#7F265B]" placeholder="What's on your mind"  />
                    <div className="flex flex-col gap-1 justify-end">
                        <Emojis inputRef={ref} access={accessToken}  />
                        <input type="submit" disabled={accessToken ? false : true} value="Publish" className="text-sm text-white font-semibold rounded-md bg-[#7F265B] disabled:bg-slate-100 disabled:text-black p-2 cursor-pointer self-end" />
                    </div>
                </div>
                <div className="attachements  flex gap-6 text-md font-semibold text-[#7F265B] ">
                    <div className="flex gap-1" >
                        <input type="checkbox" name="is_public" id="is_public" disabled={accessToken ? false : true} />
                        <label htmlFor="is_public" onClick={()=>!accessToken && toast.error('You must login to create a post!')} >Public</label>
                    </div>
                    <label htmlFor="image-input" className="flex items-center gap-1 cursor-pointer" onClick={()=>!accessToken && toast.error('You must login to create a post!')} ><MdInsertPhoto className="w-4 h-4" /> Photo</label>
                    <input  type="file" name="media" disabled={accessToken ? false : true} id="image-input" accept="image/*" className="hidden" multiple onChange={(e)=>{
                        if(e.target.files){
                            if(e.target.files.length > 0 ){
                                const files = e.target.files
                                for(let i =0; i < files.length; i++ ){

                                        setPostImages((prev:File[])=>[...prev,files[i]])

                                }
                            }

                        }
                    }} />
                    <label htmlFor="video-input"  className="flex items-center gap-1 cursor-pointer" onClick={()=>!accessToken && toast.error('You must login to create a post!')}><GoVideo className="w-4 h-4" /> Video</label>
                    <input  type="file" name="media" disabled={accessToken ? false : true} id="video-input" accept="video/*" className="hidden" onChange={(e)=>{
                        if(e.target.files){
                            if(e.target.files[0] && e.target.files[0].type.startsWith('video/')){
                                setPostVideo(e.target.files[0])
                            }
                        }
                    }} />
                </div>
                {/* Uploaded post media */}
                <div className="flex gap-2">
                    {postImages.length > 0 &&
                        <div className="flex gap-2 my-2" >
                        
                            { postImages.map((postImage:File,index:number)=>{
                                    return (
                                        <div key={index} className="relative" >
                                            <Image  src={URL.createObjectURL(postImage)} width={40} height={40}  alt="uploaded post image" />
                                            <IoCloseOutline className="absolute top-0 right-0 z-50  w-5 h-5 font-bold text-red-500 bg-slate-100 rounded-full cursor-pointer" onClick={()=>{
                                                const updatedPostImages = postImages.filter((_,i)=> i !== index)
                                                setPostImages(updatedPostImages)
                                            }} />
                                        </div>
                                    )
                                })
                                }

                            
                        </div>
                    }

                    {
                        postVideo && 
                        <div className="relative">
                            <video
                            src={URL.createObjectURL(postVideo)} // Generate a temporary URL for the video
                            controls
                            width={50} height={50}></video>
                            <IoCloseOutline className="absolute top-0 right-0 z-50  w-5 h-5 font-bold text-red-500 bg-slate-100 rounded-full cursor-pointer" onClick={()=>setPostVideo(undefined)} />
                        </div>
                    }
                </div>
            </form>
        </>
    )
}