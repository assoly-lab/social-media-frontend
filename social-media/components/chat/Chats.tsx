'use client'
import { AppContext } from "@/contexts/AppContext"
import { SocketContext } from "@/contexts/SocketContext"
import { fetchWithAuth } from "@/utils/Helpers"
import { motion} from "framer-motion"
import { useContext, useEffect } from "react"
import toast from "react-hot-toast"
import Discussion from "./Discussion"
import UsersList from "./UsersList"


export default function Chats(){
    const { userProfile,setUserProfile } = useContext(AppContext)
    const { selectedUser,setSelectedUser,discussions,setDiscussions } = useContext(SocketContext)


    useEffect(()=>{

        return ()=>{
            setSelectedUser(undefined)
        }
    },[])


    useEffect(()=>{
        const getUserProfile = async ()=>{
            const access = localStorage.getItem('access')
            if(access){
                try{
                    const response = await fetchWithAuth('https://tornado008.pythonanywhere.com/api/get/profile/',{
                        headers:{
                            'Content-Type':'application/json',
                        }
                    })
                    if(!response.ok){
                        throw new Error('Something went wrong')
                    }
                    const data = await response.json()
                    setUserProfile(data)
                }catch(e){
                    const error = e as Error
                    return error.message
                }
            }
        }
        if(!userProfile){
        getUserProfile()
        }
    },[])





    const getUserDiscussions = async()=>{
        if(userProfile){
        try{
            const response = await fetchWithAuth(`https://tornado008.pythonanywhere.com/api/discussions/list/`)
            if(!response.ok){
                const error = await response.json()
                throw new Error(error)
            }
            const data = await response.json()
            setDiscussions(data.results)
        }catch(e){
            const error = e as Error
            toast.error(error.message)
            }
        }
    }






    useEffect(()=>{
        if(userProfile){
            getUserDiscussions()
        }
    },[userProfile])





    const variants = {
        'hidden':{
            x:'100%',
        },
        'visible':{
            x:0,
        }
    }
    return (
        <motion.div 
        initial='hidden'
        animate='visible'
        exit='hidden'
        variants={variants}
        transition={{type:'spring',stiffness:200,damping:20}}
        className="hidden w-full h-[80dvh] bg-[#ffe5c4] z-[90] md:flex gap-5 justify-center " >
            {/* Messaging Component */}
            <div className="w-[65dvw] h-full bg-white mt-8 flex pb-4">
                {selectedUser && <Discussion user={selectedUser} />}
            </div>

            {/* Messaging List */}
            <div className="w-[30dvw] h-full bg-white mt-8">
                <div className="w-full flex justify-center mt-4">
                    <p className="text-[#7F265B] text-2xl font-semibold">Discussions</p>
                </div>
                <div className="w-[90%] mx-auto">
                    <UsersList users={discussions}  />
                </div>
            </div>
        </motion.div>
    )
}