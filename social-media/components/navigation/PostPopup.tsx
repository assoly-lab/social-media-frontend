import { AppContext } from "@/contexts/AppContext";
import { fetchWithAuth } from "@/utils/Helpers";
import { CommentType, PostType } from "@/utils/Types";
import { formatDistanceToNowStrict } from "date-fns";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCommentDots } from "react-icons/fa";
import { LuHeart } from "react-icons/lu";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { PiShareFatFill } from "react-icons/pi";
import CommentsList from "../feed/CommentsList";
import EditPost from "../feed/EditPost";
import PostSettings from "../feed/PostSettings";



export default function PostPopup({post,setShowPostPopup}:{post:PostType,setShowPostPopup:React.Dispatch<React.SetStateAction<Boolean>>}){
    const {userProfile} = useContext(AppContext)
    const [showSettings,setShowSettings] = useState<Boolean>(false)
    const [isEditPost,setIsEditPost] = useState<Boolean>(false)
    const [mediaIndex,setMediaIndex] = useState<number>(0)
    const [shownMedia,setShownMedia] = useState<string>(post.media.length > 0 ? post.media[mediaIndex].file : '')
    const [likesCount,setLikesCount] = useState<number>(post.likes as number)
    const [accessToken,setAccessToken] = useState<string>('')
    const [isLiked,setIsLiked] = useState<Boolean>(post.is_liked as Boolean)
    const [comments,setComments] = useState<CommentType[]>(post.comments)
    const [commentsCount,setCommentsCount] = useState<number>(post.comments_count as number)
    const timeAgo = formatDistanceToNowStrict(new Date(post.created_at == post.updated_at ? post.created_at! : post.updated_at!),{
        addSuffix:true,
    })
    console.log(post)
    useEffect(()=>{
        const access = localStorage.getItem('access')
        if(access){
            setAccessToken(access)
        }
    },[])



    const handlePrevious = ()=>{
        if(mediaIndex!=0){
            setShownMedia(post.media[mediaIndex - 1].file)
            setMediaIndex((prev:number)=> prev - 1)
        }
    }

    const handleNext = ()=>{
        if(mediaIndex < post.media.length - 1){
            setShownMedia(post.media[mediaIndex + 1].file)
            setMediaIndex((prev:number)=> prev + 1)
        }
    }



    const handlePostLike = async(post:PostType)=>{
        if(accessToken){
            if(isLiked){
                try{
                    const response = await fetchWithAuth('http://localhost:8000/api/post/unlike/',{
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
                    const response = await fetchWithAuth('http://localhost:8000/api/post/like/',{
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

    return (
        <div className="fixed inset-0 w-full h-screen bg-black/30 flex justify-center items-center z-[80]" onClick={()=>setShowPostPopup(false)} >
            <div className="bg-white md:w-[40%] w-[90%] min-h-[20dvh] max-h-[80dvh] overflow-y-auto text-[#7F265B]" onClick={(e)=>e.stopPropagation()}>
            {isEditPost &&
            <EditPost post={post} setIsEditPost={setIsEditPost} />
            }
           
        {post && 
            <div className="w-[90%] pt-4 pl-4 mx-auto flex flex-col gap-2" onClick={()=>setShowSettings((prev:Boolean)=> prev==true && false)} >
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col ">
                <div className="relative flex items-center justify-center gap-4" >
                    <Image src={post.author?.userprofile?.avatar!.startsWith('http') ? post.author?.userprofile?.avatar! : `http://localhost:8000${post.author?.userprofile?.avatar!}`} width={40} height={40} alt="user profile picture" className="w-[40px] h-[40px] rounded-full"  />
                    <Link href={userProfile ? userProfile.user.id === post.author?.id ?'/profile' : `/profile/${post?.author?.id}` : `/profile/${post?.author?.id}`}><p className="text-lg font-semibold text-[#7F265B]">{post.author?.username}</p></Link>
                    <p className="absolute text-xs font-normal text-gray-400 top-8 left-14">{timeAgo}</p>
                </div>
                </div>
                {userProfile && userProfile.user.id == post.author?.id && 
                <div>
                    <span className="relative hover:bg-slate-100 rounded-full cursor-pointer" onClick={(e)=>{
                        e.stopPropagation()
                        setShowSettings((prev:Boolean)=>!prev)}} > {showSettings ? <MdOutlineKeyboardArrowUp className="w-6 h-6 text-[#7F265B] mb-4" /> : <MdOutlineKeyboardArrowDown className="w-6 h-6 text-[#7F265B] mb-4" />}
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
            {post.media.length > 0 &&
            <div className="relative w-full flex justify-center">
                {post.media.length > 1 && 
                        <button className="absolute top-1/2 right-4 text-[#7F265B] text-lg font-medium" onClick={()=>handleNext()}>Next</button>
                    }
                    {post.media.length > 1 && 
                        <button className="absolute top-1/2 left-4 text-[#7F265B] text-lg font-medium" onClick={()=>handlePrevious()}>Previous</button>
                    }
                <Image src={shownMedia} width={400} height={400} alt="Post Media picture" />
            </div>}
        </div>}

        <div className="w-full mt-4 flex flex-col items-center justify-center gap-4 overflow-y-auto">
            <div className=" ml-2 md:ml-0 w-[90%] flex gap-4" >
                <div className="flex cursor-pointer gap-1 items-center bg-gray-50 p-2 group" onClick={()=>handlePostLike(post)}>
                    <LuHeart fill={post.is_liked ? '#7F265B' : 'transparent'} className="cursor-pointer w-5 h-5  text-[#7F265B] group-hover:fill-[#7F265B] mr-2" />
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
            <CommentsList comments={comments} setComments={setComments} postId={post.id as number} setCommentsCount={setCommentsCount} />
        </div>
            </div>
        </div>
    )
}