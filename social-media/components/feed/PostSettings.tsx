
import { MdModeEdit,MdDelete } from "react-icons/md";
import {motion} from "framer-motion"
import { PostType } from "@/utils/Types";
import { fetchWithAuth } from "@/utils/Helpers";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AppContext } from "@/contexts/AppContext";



export default function PostSettings({post,setShowSettings,setIsEditPost}:{post:PostType,setShowSettings:React.Dispatch<React.SetStateAction<Boolean>>,setIsEditPost:React.Dispatch<React.SetStateAction<Boolean>>}){



    const { setPostsList } = useContext(AppContext)

    const handleDeletePost = async(post:PostType)=>{
        try{
            const response = await fetchWithAuth('https://tornado008.pythonanywhere.com/api/posts/delete/',{
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
            setPostsList(data)

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
                    setIsEditPost(true)
                    }}><MdModeEdit className="w-6 h-6 text-[#7F265B]" /> Edit</span>
                
                <span className="flex gap-2 hover:bg-slate-200 px-2 py-1" onClick={(e)=>{
                    e.stopPropagation()
                    setShowSettings(false)
                    handleDeletePost(post)
                }}><MdDelete className="w-6 h-6 text-red-500" /> Delete</span>
            </motion.div>
        </>
    )
}