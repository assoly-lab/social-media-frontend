import { fetchWithAuth } from "@/utils/Helpers"
import toast from "react-hot-toast"
import {motion} from "framer-motion"
import { MdDelete, MdModeEdit } from "react-icons/md"
import { CommentType } from "@/utils/Types"



export default function CommentSettings({comment,setShowSettings,setIsEditComment,postId,setComments,setCommentsCount}:{comment:CommentType,setShowSettings:React.Dispatch<React.SetStateAction<boolean>>,setIsEditComment:React.Dispatch<React.SetStateAction<boolean>>,postId:number,setComments:React.Dispatch<React.SetStateAction<CommentType[]>>,setCommentsCount:React.Dispatch<React.SetStateAction<number>>}){

    const handleDeleteComment = async()=>{
        try{
            const response = await fetchWithAuth('https://tornado008.pythonanywhere.com/api/comments/delete/',{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({'comment_id':comment.id,
                'post_id':postId
            })
            })
            if(!response.ok){
                const error = await response.json()
                toast.error(JSON.stringify(error))
            }
            const data = await response.json()
            setComments(data)
            setCommentsCount(data.length)
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
                        setIsEditComment(true)
                        }}><MdModeEdit className="w-6 h-6 text-[#7F265B]" /> Edit</span>
                    
                    <span className="flex gap-2 hover:bg-slate-200 px-2 py-1" onClick={(e)=>{
                        e.stopPropagation()
                        setShowSettings(false)
                        handleDeleteComment()
                    }}><MdDelete className="w-6 h-6 text-red-500" /> Delete</span>
                </motion.div>
            </>

        )
    }