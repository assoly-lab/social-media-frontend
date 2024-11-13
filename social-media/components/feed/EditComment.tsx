import { fetchWithAuth } from "@/utils/Helpers"
import { CommentType } from "@/utils/Types"
import React, { useEffect,useRef, useState } from "react"
import toast from "react-hot-toast"
import Emojis from "../posts/Emojis"




export default function EditComment({comment,postId,setComments,setIsEditComment}:{comment:CommentType,postId:number,setComments:React.Dispatch<React.SetStateAction<CommentType[]>>,setIsEditComment:React.Dispatch<React.SetStateAction<Boolean>>}){
    const [accessToken,setAccessToken] = useState<string>('')
    const ref = useRef<HTMLTextAreaElement>(null)

    useEffect(()=>{
        const access = localStorage.getItem('access')
        if(access){
            setAccessToken(access)
        }
    },[])

    return (
        <div className="fixed w-full h-screen top-0 left-0 bg-black/30 flex justify-center items-center z-50" onClick={()=>setIsEditComment(false)}>
            <div className="relative w-[80%] md:w-[40%] min-h-[40vh] bg-white flex items-center justify-center" onClick={(e)=>e.stopPropagation()} >

            <div className="flex flex-col gap-2 w-full items-center">
            <p className="text-2xl font-semibold">Update your comment</p>
            <form 
                className="flex gap-2 items-end w-[90%]"
                action={async(formData:FormData)=>{
                    formData.append('comment_id',comment.id.toString())
                    formData.append('post_id',postId.toString())
                    try{
                        const response = await fetchWithAuth('https://tornado008.pythonanywhere.com/api/comments/update/',{
                            method:'PUT',
                            body:formData
                        })

                        if(!response.ok){
                            const error = await response.json()
                            toast.error(JSON.stringify(error))
                        }
                        const data = await response.json()
                        console.log('data: ',data)
                        setComments((prev:CommentType[] | [])=>[...data])
                        setIsEditComment(false)
                    }catch(e){
                        const error = e as Error
                        toast.error(error.message)
                    }
                }}
                >
                    <textarea name="content" ref={ref} defaultValue={comment.content} id="reply" placeholder="Write a reply" className="w-full h-[70px] pt-2 pl-4 bg-slate-100 focus:outline-none focus:border focus:border-[#7F265B] rounded-md" />
                    <div className="flex flex-col justify-end gap-2">
                        <Emojis inputRef={ref} access={accessToken} />
                        <input type="submit" value="Update"  className="text-white h-fit bg-[#7F265B] py-2 px-3 rounded-md font-medium disabled:bg-slate-100 disabled:text-gray-300 cursor-pointer"  />
                    </div>
                </form>
            </div>
            </div>

        </div>
    )
}