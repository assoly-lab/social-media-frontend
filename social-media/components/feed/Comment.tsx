import { CommentType } from "@/utils/Types";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import {AnimatePresence,motion} from "framer-motion"
import { fetchWithAuth } from "@/utils/Helpers";
import toast from "react-hot-toast";
import CommentSettings from "./CommentSettings";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { AppContext } from "@/contexts/AppContext";
import Reply from "./Reply";
import EditComment from "./EditComment";


export default function Comment({comment,postId,setComments,setCommentsCount}:{comment:CommentType,postId:number,setComments:React.Dispatch<React.SetStateAction<CommentType[]>>,setCommentsCount:React.Dispatch<React.SetStateAction<number>>}){
    const [accessToken,setAccessToken] = useState<string>('')
    const [commentLikes,setCommentLikes] = useState<number>(comment.likes)
    const [isCommentLiked,setIsCommentLiked] = useState<boolean>(comment.is_liked)
    const [replies,setReplies] = useState<CommentType[] | []>(comment.replies)
    const [isEditComment,setIsEditComment] = useState<boolean>(false)
    const [showSettings,setShowSettings] = useState<boolean>(false)
    const {userProfile} = useContext(AppContext)
    const ref = useRef<HTMLTextAreaElement>(null)
    const [isReply,setIsReply] = useState<boolean>(false)
    useEffect(()=>{
        const access = localStorage.getItem('access')
        if(access){
            setAccessToken(access)
        }
    },[])

    const handleLike = async(comment:CommentType)=>{
        if(accessToken){
            if(isCommentLiked){
                try{
                    const response= await fetchWithAuth('https://tornado008.pythonanywhere.com/api/comment/unlike/',{
                        method:'DELETE',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body: JSON.stringify({'comment_id':comment.id})

                    })

                    if(!response.ok){
                        const error = await response.json()
                        toast.error(JSON.stringify(error))
                    }
                    // const data = await response.json()
                    setCommentLikes((prev:number)=>prev - 1)
                    setIsCommentLiked(false)

                }catch(e){
                    const error = e as Error
                    toast.error(error.message)
                }
            }else{
                try{
                    const response= await fetchWithAuth('https://tornado008.pythonanywhere.com/api/comment/like/',{
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body: JSON.stringify({'comment_id':comment.id})

                    })

                    if(!response.ok){
                        const error = await response.json()
                        toast.error(JSON.stringify(error))
                    }
                    // const data = await response.json()
                    setCommentLikes((prev:number)=>prev + 1)
                    setIsCommentLiked(true)

                }catch(e){
                    const error = e as Error
                    toast.error(error.message)
                }
            }

        }else{
            toast.error("You need to login to like a comment!")
        }
    }



    return (
        <>
        {isEditComment &&
        <EditComment comment={comment} postId={postId} setComments={setComments} setIsEditComment={setIsEditComment} />
        }
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                        <Image src={`https://tornado008.pythonanywhere.com${comment.author.avatar}`} width={30} height={30} alt="comment author profile picture" />
                        <span className="text-sm text-[#7F265B]">{comment.author.user.username}</span>
                    </div>

                    {userProfile && userProfile.user.username === comment.author.user.username && 
                    <div className="mt-2">
                        <span className="relative hover:bg-slate-100 rounded-full cursor-pointer" onClick={(e)=>{
                            e.stopPropagation()
                            setShowSettings((prev:boolean)=>!prev)}} > {showSettings ? <MdOutlineKeyboardArrowUp className="w-6 h-6 text-[#7F265B] " /> : <MdOutlineKeyboardArrowDown className="w-6 h-6 text-[#7F265B] " />}
                        <AnimatePresence >
                            {showSettings &&
                            <CommentSettings comment={comment} setShowSettings={setShowSettings} setIsEditComment={setIsEditComment} postId={postId} setComments={setComments} setCommentsCount={setCommentsCount} />
                            }
                        </AnimatePresence>
                        </span>
                    </div>}
                </div>
                <p className="text-lg text-[#7F265B]">{comment.content}</p>
                <div className="flex gap-4" >
                    <span className="text-[#7F265B] text-sm">{commentLikes} likes</span>
                    <button className="text-[#7F265B] text-sm underline underline-offset-1" onClick={()=>handleLike(comment)}>{isCommentLiked ? 'Unlike' : 'Like'}</button>
                    <button className="text-[#7F265B] text-sm underline underline-offset-1" onClick={()=>{
                        if(accessToken){
                        setIsReply(!isReply)
                    }else{
                        toast.error("You need to login to reply to a comment!")
                    }
                        }}>{isReply ? 'Cancel' : 'Reply'}</button>
                </div>
                <AnimatePresence>
                {isReply && 
                <motion.form 
                initial={{opacity:0,height:0}}
                animate={{opacity:1,height:'auto'}}
                exit={{opacity:0,height:0}}
                className="flex gap-2 items-end"
                action={async(formData:FormData)=>{
                    formData.append('parent_id',comment.id.toString())
                    formData.append('post_id',postId.toString())
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
                        console.log('data: ',data)
                        setReplies((prev:CommentType[] | [])=>[data,...prev])
                        ref.current!.value = ''
                        setIsReply(false)
                    }catch(e){
                        const error = e as Error
                        toast.error(error.message)
                    }
                }}
                >
                    <textarea name="content" ref={ref} id="reply" disabled={accessToken ? false : true} placeholder="Write a reply" className="w-full h-[40px] pt-2 pl-4 bg-slate-100 focus:outline-none focus:border focus:border-[#7F265B] rounded-md" />
                    <input type="submit" value="Reply" disabled={accessToken ? false : true} className="bg-[#7F265B] h-fit text-white text-sm font-medium rounded-md py-2 px-4 cursor-pointer" />
                </motion.form>
                }
                </AnimatePresence>
                <div>
                    {replies.length > 0 && replies.map((reply:CommentType)=>{
                        return (
                            <Reply reply={reply} setReplies={setReplies} key={reply.id} postId={postId} />
                        )
                    })
                }
                </div>
            </div>
        </>
    )
}