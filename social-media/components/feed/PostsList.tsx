'use client'

import { AppContext } from "@/contexts/AppContext"
import { fetchWithAuth } from "@/utils/Helpers"
import { PostType } from "@/utils/Types"
import { useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"
import Post from "./Post"
import {HashLoader} from "react-spinners"










export default function PostsList(){
    const { postsList,setPostsList } = useContext(AppContext)
    const [loadingPosts, setLoadingPosts] = useState<Boolean>(true)


    useEffect(()=>{
        const getPostsList = async ()=>{
            const access = localStorage.getItem('access')
            if (access){
                try {
                    const response = await fetchWithAuth('http://localhost:8000/api/feed/')
                    if(!response.ok){
                        const data = await response.json()
                        setLoadingPosts(false)
                        toast.error(JSON.stringify(data))
                    }
                    const data = await response.json()
                    setLoadingPosts(false)
                    setPostsList(data)
    
                }catch(e){
                    const error = e as Error
                    setLoadingPosts(false)
                    toast.error(error.message)
                }
            }else{
                try {
                    const response = await fetch('http://localhost:8000/api/feed/')
                    if(!response.ok){
                        const data = await response.json()
                        setLoadingPosts(false)
                        toast.error(JSON.stringify(data))
                    }
                    const data = await response.json()
                    setLoadingPosts(false)
                    setPostsList(data)
    
                }catch(e){
                    const error = e as Error
                    setLoadingPosts(false)
                    toast.error(error.message)
                }
            }
        }

        getPostsList()
    },[])






    return (
        <>
        {loadingPosts &&
            <div className="w-full py-16 flex flex-col items-center gap-4">
                <HashLoader color="#7F265B" className="w-[50%]"  />
                <p className="text-lg text-[#7F265B] font-medium">Loading posts...</p>
            </div>
                }
            <div className="w-[98%] md:w-full pb-12">
                {postsList.length > 0 &&
                    postsList.map((post:PostType)=>{
                        return(
                            <div key={post.id} className="w-full flex flex-col items-center gap-2 mb-12">
                                <Post  post={post} />
                            </div>
                        )
                    })
                    
                }
            </div>
        </>
    )
}