import { fetchWithAuth } from "@/utils/Helpers";
import { CommentType } from "@/utils/Types";
import React from "react";
import toast from "react-hot-toast";
import {motion} from "framer-motion"
import { MdDelete, MdModeEdit } from "react-icons/md";


export default function ReplySettings({reply,setShowSettings,setIsEditReply,postId,setReplies}:{reply:CommentType,setShowSettings:React.Dispatch<React.SetStateAction<boolean>>,setIsEditReply:React.Dispatch<React.SetStateAction<boolean>>,postId:number,setReplies:React.Dispatch<React.SetStateAction<CommentType[]>>}){
    
    const handleDeleteReply = async()=>{
        try{
            const response = await fetchWithAuth('https://tornado008.pythonanywhere.com/api/reply/delete/',{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({'reply_id':reply.id,
                'post_id':postId,
                'parent_id':reply.parent
            })
            })
            if(!response.ok){
                const error = await response.json()
                toast.error(JSON.stringify(error))
            }
            const data = await response.json()
            setReplies(data)
        }catch(e){
            const error = e as Error
            toast.error(error.message)
        }
    }

    return (
        <>
            <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration:0.2}}
            className="absolute top-6 right-0 flex flex-col gap-4 bg-slate-100 p-4 font-medium z-50">
                <span className="flex gap-2 hover:bg-slate-200 px-2 py-1" onClick={(e)=>{
                    e.stopPropagation()
                    setShowSettings(false)
                    setIsEditReply(true)
                    }}><MdModeEdit className="w-6 h-6 text-[#7F265B]" /> Edit</span>
                
                <span className="flex gap-2 hover:bg-slate-200 px-2 py-1" onClick={(e)=>{
                    e.stopPropagation()
                    setShowSettings(false)
                    handleDeleteReply()
                }}><MdDelete className="w-6 h-6 text-red-500" /> Delete</span>
            </motion.div>
            </>
    )
}