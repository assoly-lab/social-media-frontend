import { PostType,Media,CommentType } from "@/utils/Types";
import Image from "next/image";
import { useContext, useState, useEffect, useRef } from "react";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import PostSettings from "./PostSettings";
import {AnimatePresence} from "framer-motion"
import { AppContext } from "@/contexts/AppContext";
import EditPost from "./EditPost";
import { formatDistanceToNowStrict } from "date-fns";
import PostMediaSlider from "./PostMediaSlider";
import { LuHeart } from "react-icons/lu";
import { FaCommentDots } from "react-icons/fa";
import { PiShareFatFill } from "react-icons/pi";
import Emojis from "../posts/Emojis";
import toast from "react-hot-toast";
import { fetchWithAuth } from "@/utils/Helpers";
import CommentsList from "./CommentsList";
import Link from "next/link";


export default function Post({post}:{post:PostType}){

    const [showSettings,setShowSettings] = useState<boolean>(false)
    const [showMediaSlider,setShowMediaSlider] = useState<boolean>(false)
    const [accessToken,setAccessToken] = useState<string>('')
    const [mediaIndex,setMediaIndex] = useState<number>(0)
    const [likesCount,setLikesCount] = useState<number>(post.likes as number)
    const [comments,setComments] = useState<CommentType[]>(post.comments)
    const [commentsCount,setCommentsCount] = useState<number>(post.comments_count as number)
    const [isLiked,setIsLiked] = useState<boolean>(post.is_liked as boolean)
    const ref = useRef<HTMLTextAreaElement>(null)
    const [isEditPost,setIsEditPost] = useState<boolean>(false)
    const {userProfile} = useContext(AppContext)

    const timeAgo = formatDistanceToNowStrict(new Date(post.created_at == post.updated_at ? post.created_at! : post.updated_at!),{
        addSuffix:true,
    })

    console.log(post.author.userprofile.avatar.startsWith('http') ? post.author.userprofile.avatar : `https://tornado008.pythonanywhere.com${post.author.userprofile.avatar}`)

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
                    // const data = await response.json()
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
                    // const data = await response.json()
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



    useEffect(()=>{
        const access = localStorage.getItem('access')
        if(access){
            setAccessToken(access)
        }
    },[])

    return (
        <>
        {isEditPost &&
            <EditPost post={post} setIsEditPost={setIsEditPost} />
            }
        {
        showMediaSlider && 

        <PostMediaSlider post={post} setShowMediaSlider={setShowMediaSlider} mediaIndex={mediaIndex} />

        }

           
        {post && 
            <div className="w-[90%] pt-4 flex flex-col gap-2" onClick={()=>setShowSettings((prev:boolean)=> prev==true && false)} >
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col ">
                <div className="relative flex items-center justify-center gap-4" >
                    <Image src={post.author.userprofile.avatar.startsWith('http') ? post.author.userprofile.avatar : `https://tornado008.pythonanywhere.com${post.author.userprofile.avatar}`} width={40} height={40} alt="user profile picture" className="w-[40px] h-[40px] rounded-full"  />
                    <Link href={userProfile ? userProfile.user.id === post.author?.id ?'/profile' : `/profile/${post?.author?.id}` : `/profile/${post?.author?.id}`}><p className="text-lg font-semibold text-[#7F265B]">{post.author?.username}</p></Link>
                    <p className="absolute left-14 top-8 text-xs font-normal text-gray-400">{timeAgo}</p>
                </div>
                </div>
                {userProfile && userProfile.user.id == post.author?.id && 
                <div>
                    <span className="relative hover:bg-slate-100 rounded-full cursor-pointer" onClick={(e)=>{
                        e.stopPropagation()
                        setShowSettings((prev:boolean)=>!prev)}} > {showSettings ? <MdOutlineKeyboardArrowUp className="w-6 h-6 text-[#7F265B] " /> : <MdOutlineKeyboardArrowDown className="w-6 h-6 text-[#7F265B] " />}
                    <AnimatePresence >
                        {showSettings &&
                        <PostSettings post={post} setShowSettings={setShowSettings} setIsEditPost={setIsEditPost} />
                        }
                    </AnimatePresence>
                    </span>
                </div>
                }
            </div>
            <p className="text-lg text-black py-4 md:py-0">{post.content}</p>
            {post.media!.length > 0 && 
            <div className={`relative w-full my-4 grid gap-4 ${
                post.media!.length === 1
                  ? 'grid-cols-1'
                  : post.media!.length === 2

                  ? 'grid-cols-2'

                  : 'grid-cols-3 grid-rows-4' // Custom rows for 4+ items
              }`}>

                {
                post.media.length > 4 ?
                post.media!.slice(0,4).map((media:Media,index:number)=>{
                    return (
                        <div key={media.id} className={`relative flex cursor-pointer justify-center ${post.media!.length >= 3 && index === 0 ? 'row-span-4' : post.media!.length >= 3 && index === 1 ? 'row-span-2' : post.media!.length >= 3 && index === 2  ? 'row-span-2' : post.media!.length >= 3 && index === 3 && 'row-span-2 col-start-2 row-start-3'}`} onClick={()=>setShowMediaSlider(true)} >
                        { media.media_type == 'image' ?
                        <Image src={media.file.startsWith('http') ? media.file : `https://tornado008.pythonanywhere.com${media.file}` }  width={300} height={300} alt="Post media file" className="w-auto h-auto object-cover z-40" onClick={()=>setMediaIndex(index)}/>
                        :
                        <video src={media.file.startsWith('http') ? media.file : `https://tornado008.pythonanywhere.com${media.file}` }  width={300} height={300} controls className="w-auto h-auto object-cover z-40 cursor-pointer pointer-events-none"  ></video>

                        }
                        </div>
                    )
                })
            
                : post.media!.map((media:Media,index:number)=>{
                    return (
                        <div key={media.id} className={`relative flex cursor-pointer ${post.media!.length >= 3 && index === 0 ? 'row-span-4' : post.media!.length >= 3 && index === 1 ? 'row-span-4' : post.media!.length >= 3 && index === 2  ? 'row-span-2' : post.media!.length >= 3 && index === 3 && 'row-span-2 col-start-3 row-start-3'}`} onClick={()=>setShowMediaSlider(true)} >
                        { media.media_type == 'image' ?
                        <Image src={media.file.startsWith('http') ? media.file : `https://tornado008.pythonanywhere.com${media.file}` } width={300} height={300} alt="Post media file" className="w-auto h-auto object-cover z-40" onClick={()=>setMediaIndex(index)} />
                        :
                        <video src={media.file.startsWith('http') ? media.file : `https://tornado008.pythonanywhere.com${media.file}` } width={300} height={300} controls className="w-auto h-auto object-cover z-40 pointer-events-none" ></video>

                        }
                        </div>
                    )
                })
                
                }
                {
                    post.media.length > 4 &&
                    <div className="relative row-span-2 col-start-3 row-start-3 bg-black/30 flex justify-center items-center" >
                        <p className="text-3xl text-white font-semibold">+ {post.media.length - 4}</p>
                    </div>
                }


            </div>}
        </div>}

        <div className="w-full flex flex-col items-center justify-center gap-4">
            <div className=" ml-2 md:ml-0 w-[90%] flex gap-4" >
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
            {/* Adding Comment section */}
            <div className="w-full flex justify-center">
                {userProfile &&
                <Image src={userProfile.avatar} width={40} height={40} alt="User profile picture" className="w-[40px] h-[40px] rounded-full" />
                }
                <form className="w-[90%] flex gap-2" action={async(formData:FormData)=>{
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
            </div>
            <CommentsList comments={comments} setComments={setComments} postId={post.id as number} setCommentsCount={setCommentsCount} />
        </div>
        </>
    )
}