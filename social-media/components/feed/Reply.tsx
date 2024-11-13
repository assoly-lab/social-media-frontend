import { AppContext } from "@/contexts/AppContext"
import { CommentType } from "@/utils/Types"
import { AnimatePresence } from "framer-motion"
import Image from "next/image"
import React, { useContext, useState } from "react"
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md"
import EditReply from "./EditReply"
import ReplySettings from "./ReplySettings"



export default function Reply({reply,setReplies,postId}:{reply:CommentType,setReplies:React.Dispatch<React.SetStateAction<CommentType[]>>,postId:number}){
    const {userProfile} = useContext(AppContext)
    const [showSettings,setShowSettings] = useState<Boolean>(false)
    const [isEditReply,setIsEditReply] = useState<Boolean>(false)
    return (
        <>{
            isEditReply && 
            <EditReply setReplies={setReplies} postId={postId} reply={reply} setIsEditReply={setIsEditReply} />
        }
            <div className="ml-5 my-2">
                <div className="flex justify-between w-[90%]">
                    <div className="flex gap-2 items-center">
                        <Image src={`https://tornado008.pythonanywhere.com${reply.author.avatar}`} width={20} height={20} alt="reply author profile picture" />
                        <span className="text-sm text-[#7F265B]">{reply.author.user.username}</span>
                    </div>
                    {userProfile && userProfile.user.username === reply.author.user.username && 
                    <div className="mt-2">
                        <span className="relative hover:bg-slate-100 rounded-full cursor-pointer" onClick={(e)=>{
                            e.stopPropagation()
                            setShowSettings((prev:Boolean)=>!prev)}} > {showSettings ? <MdOutlineKeyboardArrowUp className="w-6 h-6 text-[#7F265B] " /> : <MdOutlineKeyboardArrowDown className="w-6 h-6 text-[#7F265B] " />}
                        <AnimatePresence >
                            {showSettings &&
                            <ReplySettings reply={reply} setShowSettings={setShowSettings} setIsEditReply={setIsEditReply} postId={postId} setReplies={setReplies}  />
                            }
                        </AnimatePresence>
                        </span>
                    </div>}
                </div>
                <p className="text-sm text-[#7F265B]">{reply.content}</p>
            </div>
        </>
    )
}