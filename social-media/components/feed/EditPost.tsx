'use client'

import { AppContext } from "@/contexts/AppContext"
import { fetchWithAuth } from "@/utils/Helpers"
import { Media, PostType } from "@/utils/Types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { GoVideo } from "react-icons/go"
import { IoCloseOutline } from "react-icons/io5"
import { MdInsertPhoto } from "react-icons/md"
import Emojis from "../posts/Emojis"



export default function EditPost({setIsEditPost,post}:{setIsEditPost:React.Dispatch<React.SetStateAction<Boolean>>,post:PostType}){
    const { userProfile,setPostsList} = useContext(AppContext)
    const router = useRouter()
    const ref = useRef(null)
    const [postImages,setPostImages] = useState<File[]>([])
    const [postVideo,setPostVideo] = useState<File>()
    const [accessToken,setAccessToken] = useState<string | null>(null)


    useEffect(()=>{
        const access = localStorage.getItem('access')
        if(access){
            setAccessToken(access)
        }
    },[])


    return (
        <div className="fixed top-0 left-0 flex justify-center items-center bg-black/20 z-50 w-full h-screen overflow-hidden" onClick={()=>setIsEditPost(false)}>
            <div className="relative w-[80%] flex justify-center bg-white py-8" onClick={(e)=>e.stopPropagation()}>
            <IoCloseOutline className="absolute top-2 right-2 w-6 h-6 text-red-500 hover:scale-125 transition duration-200 ease-in-out cursor-pointer" onClick={()=>setIsEditPost(false)}  />
            <div className="flex py-2 mt-4">
                {userProfile && <Image src={userProfile.avatar} alt="user profile picture" width={30} height={30} className="w-[30px] h-[30px] rounded-full" />}
            </div>
            <form className=" w-[90%] h-full flex flex-col gap-2" action={async(formData:FormData)=>{
                const content = formData.get('content')
                if( postImages.length == 0 && !postVideo && !content){
                    toast.error('Add content to publish a post')
                }

                try{
                    const response =  await fetchWithAuth('https://tornado008.pythonanywhere.com/api/posts/update/',{
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
                }catch(e){
                    const error = e as Error
                    toast.error(error.message)
                }
            }} >
                <div className="flex gap-4 w-full">
                <textarea disabled={accessToken ? false : true} ref={ref} name="content" id="content" value={post.content} className="w-[80%] h-[60px] md:h-[90px] bg-gray-100 placeholder-gray-300 mt-4 pt-2 pl-4 focus:outline-none" placeholder="What's on your mind"  />
                <div className="flex flex-col gap-1 justify-end">
                    <Emojis inputRef={ref} access={accessToken}  />
                    <input type="submit" disabled={accessToken ? false : true} value="Update" className="text-sm text-white font-semibold rounded-md bg-[#7F265B] disabled:bg-slate-100 disabled:text-black p-2 cursor-pointer self-end" />
                </div>
                </div>
                <div className="attachements flex gap-6 text-md font-semibold text-[#7F265B] ">
                    <div className="flex gap-1" >
                        <input type="checkbox" name="is_public" id="is_public" defaultChecked={post.is_public as boolean} disabled={accessToken ? false : true} />
                        <label htmlFor="is_public" onClick={()=>!accessToken && toast.error('You must login to create a post!')} >Share publicly</label>
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
                { post.media.length > 0 && post.media.map((media:Media)=>{
                                return (
                                    <div className="relative" key={media.id} >
                                        <Image  src={media.file} width={60} height={60}  alt="uploaded post image" />
                                        <IoCloseOutline className="absolute top-0 right-0 z-50  w-5 h-5 font-bold text-red-500 bg-slate-100 rounded-full cursor-pointer" onClick={()=>{

                                        }} />
                                    </div>
                                )
                            })
                            }
                    {postImages.length > 0 &&
                        <div className="flex gap-2 my-2" >                        
                            { postImages.map((postImage:File,index:number)=>{
                                    return (
                                        <div className="relative" key={index} >
                                            <Image key={index} src={URL.createObjectURL(postImage)} width={40} height={40}  alt="uploaded post image" />
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
                        <div className="relative" >
                            <video
                            src={URL.createObjectURL(postVideo)} // Generate a temporary URL for the video
                            controls
                            width={50} height={50}></video>
                            <IoCloseOutline className="absolute top-0 right-0 z-50  w-5 h-5 font-bold text-red-500 bg-slate-100 rounded-full cursor-pointer" onClick={()=>setPostVideo(undefined)} />
                        </div>
                    }
                </div>
            </form>
            </div>
        </div>
    )
}