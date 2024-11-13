'use client'

import { CommentType, PostType } from "@/utils/Types";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LuHeart } from "react-icons/lu";
import { FaCommentDots } from "react-icons/fa";
import { PiShareFatFill } from "react-icons/pi";
import { fetchWithAuth } from "@/utils/Helpers";
import toast from "react-hot-toast";
import CommentsList from "./CommentsList";
import Emojis from "../posts/Emojis";




export default function PostMediaSlider({post,setShowMediaSlider,mediaIndex}:{post:PostType,setShowMediaSlider:React.Dispatch<React.SetStateAction<Boolean>>,mediaIndex:number}){
    const [shownMedia,setShownMedia] = useState<string>(post.media[mediaIndex].file)
    const [sliderMediaIndex,setSliderMediaIndex] = useState<number>(mediaIndex)
    const [commentsCount,setCommentsCount] = useState<number>(post.comments_count as number)
    const [isLiked,setIsLiked] = useState<Boolean>(post.is_liked as Boolean)
    const [likesCount,setLikesCount] = useState<number>(post.likes as number)
    const [accessToken,setAccessToken] = useState<string>('')
    const [comments,setComments] = useState<CommentType[]>(post.comments)
    const ref = useRef<HTMLTextAreaElement>(null)


    const timeAgo = formatDistanceToNowStrict(new Date(post.created_at == post.updated_at ? post.created_at! : post.updated_at!),{
        addSuffix:true,})



    useEffect(()=>{
        const access = localStorage.getItem('access')
        if(access){
            setAccessToken(access)
        }
    },[])

        const handlePostLike = async(post:PostType)=>{
            if(accessToken){
                if(isLiked){
                    try{
                        const response = await fetchWithAuth('https://tornado008.pythonanywhere.com/api/post/unlike/',{
                            method:'DELETE',
                            headers:{
                                'Content-Type':'application/json',
                            },
                            body: JSON.stringify({'post_id':post.id})
                        })
                        if(!response.ok){
                            const error = await response.json()
                            toast.error(JSON.stringify(error))
                        }
                        const data = await response.json()
                        setIsLiked(false)
                        setLikesCount((prev:number)=>prev - 1)
                    }catch(e){
                        const error = e as Error
                        toast.error(error.message)
                    }
                }else{
                    try{
                        const response = await fetchWithAuth('https://tornado008.pythonanywhere.com/api/post/like/',{
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json',
                            },
                            body: JSON.stringify({'post_id':post.id})
                        })
                        if(!response.ok){
                            const error = await response.json()
                            toast.error(JSON.stringify(error))
                        }
                        const data = await response.json()
                        setIsLiked(true)
                        setLikesCount((prev:number)=>prev + 1)
                    }catch(e){
                        const error = e as Error
                        toast.error(error.message)
                    }
                }
            }else{
                toast.error('You need to login to like a post!')
            }
        }


    const handlePrevious = ()=>{
        if(sliderMediaIndex!=0){
            setShownMedia(post.media[sliderMediaIndex - 1].file)
            setSliderMediaIndex((prev:number)=> prev - 1)
        }
    }

    const handleNext = ()=>{
        if(sliderMediaIndex < post.media.length - 1){
            setShownMedia(post.media[sliderMediaIndex + 1].file)
            setSliderMediaIndex((prev:number)=> prev + 1)
        }
    }

    return (
        <>
        {
        post &&
        <div className="fixed top-0 left-0 bg-black/30 w-full h-screen overflow-y-hidden flex justify-center items-center z-[60] " onClick={(e)=>{
            e.stopPropagation()
            setShowMediaSlider(false)
        }} >
            <div className="w-[90%] max-h-[80dvh] md:w-[80%] md:h-[60vh] bg-white rounded-md flex flex-col md:flex-row overflow-y-auto" onClick={(e)=>e.stopPropagation()}>
                <div className="relative md:full md:w-[60%] flex flex-col pl-4 py-4 md:flex-row md:justify-center">
                    <div className="relative w-full flex items-center gap-2 mb-4 md:hidden">
                        <Image src={post.author?.userprofile?.avatar!} width={50} height={50} alt="Post author profile picture" className="w-[50px] h-[50px] rounded-full" />
                        <Link href={`/profile/${post.author?.id}`} ><p className="text-[#7F265B] font-semibold">{post.author?.username}</p></Link>
                        <p className="text-xs font-normal text-gray-400 self-end absolute left-14 top-9" >{timeAgo}</p>
                    </div>
                    <div className="md:hidden block" >
                        <p>{post.content}</p>
                    </div>
                    {post.media.length > 1 && 
                        <button className="absolute top-1/2 right-4 text-[#7F265B] text-lg font-medium" onClick={()=>handleNext()}>Next</button>
                    }
                    {post.media.length > 1 && 
                        <button className="absolute top-1/2 left-4 text-[#7F265B] text-lg font-medium" onClick={()=>handlePrevious()}>Previous</button>
                    }
                    {post.media.length > 0 && <Image src={shownMedia} width={400} height={400} alt="post media image" className="object-contain w-auto h-auto" />}
                </div>
                <div className="w-full md:w-[40%] pl-4 pt-2 md:pt-4 rounded-r-md flex flex-col gap-4 ">
                    <div className="hidden relative md:flex justify- items-center gap-2">
                        <Image src={post.author?.userprofile?.avatar!} width={50} height={50} alt="Post author profile picture" className="w-[50px] h-[50px] rounded-full" />
                        <Link href={`/profile/${post.author?.id}`} ><p className="text-[#7F265B] font-semibold">{post.author?.username}</p></Link>
                        <p className="text-xs font-normal text-gray-400 self-end absolute left-14 top-9" >{timeAgo}</p>
                    </div>
                    <div className="hidden">
                        <p>{post.content}</p>
                    </div>
                    <div className=" ml-2 md:ml-0 flex gap-4 pb-4" >
                        <div className="flex cursor-pointer gap-1 items-center bg-gray-50 p-2 group" onClick={()=>handlePostLike(post)}>
                            <LuHeart fill={isLiked ? '#7F265B' : 'transparent'} className="cursor-pointer w-5 h-5  text-[#7F265B] group-hover:fill-[#7F265B] mr-2" />
                            <p className="text-xs md:text-sm font-medium border-l border-[#7F265B] px-2 whitespace-nowrap">{likesCount} Likes</p>
                        </div>
                        <div className="flex cursor-pointer gap-1 items-center bg-gray-50 p-2">
                            <FaCommentDots className="w-5 h-5 text-[#7F265B] hover:fill-[#7F265B] mr-2" />
                            <p className="text-xs md:text-sm font-medium border-l border-[#7F265B] px-2 whitespace-nowrap">{commentsCount} Comments</p>
                        </div>
                        <div className="flex cursor-pointer gap-1 items-center bg-gray-50 p-2 self-end">
                            <PiShareFatFill className="cursor-pointer w-5 h-5 text-[#7F265B] hover:fill-[#7F265B] mr-2" />
                            <p className="text-xs md:text-sm font-medium border-l border-[#7F265B] px-2">Share</p>
                        </div>
                    </div>
                    <div className="w-full overflow-y-auto pb-4" >
                        <form className="w-full flex gap-2" action={async(formData:FormData)=>{
                        formData.append('post_id',post.id?.toString() as string)
                        
                        try{
                            const response = await fetchWithAuth('https://tornado008.pythonanywhere.com/api/comments/create/',{
                                method:'POST',
                                body:formData
                            })

                            if(!response.ok){
                                const error = await response.json()
                                toast.error(JSON.stringify(error))
                            }
                            const data = await response.json()
                            setComments((prev:CommentType[])=>[data,...prev])
                            setCommentsCount((prev:number)=>prev + 1)
                            ref.current!.value = ''
                        }catch(e){
                            const error = e as Error
                            toast.error(error.message)
                        }
                    }}>
                        <textarea ref={ref} name="content" disabled={accessToken ? false : true} placeholder="Write a comment" className="w-[80%] bg-slate-100 h-full placeholder:text-gray-500 p-2 disabled:placeholder:text-gray-300 rounded-md focus:outline-none focus:border focus:border-[#7F265B]" />
                        <div className="flex flex-col justify-end gap-2">
                            <Emojis inputRef={ref} access={accessToken} />
                            <input type="submit" value="Post" disabled={accessToken ? false : true} className="text-white h-fit bg-[#7F265B] py-2 px-3 rounded-md font-medium disabled:bg-slate-100 disabled:text-gray-300 cursor-pointer"  />
                        </div>
                        </form>
                        <CommentsList comments={comments} setComments={setComments} postId={post.id as number} setCommentsCount={setCommentsCount} />
                    </div>
                </div>
            </div>
        </div>
        }
    </>
    )
}