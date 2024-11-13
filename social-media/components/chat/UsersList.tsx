import Image from "next/image";
import {motion} from "framer-motion"
import React, { useContext } from "react";
import { SocketContext } from "@/contexts/SocketContext";
import { UserDiscussion } from "@/utils/Types";
import { fetchWithAuth } from "@/utils/Helpers";
import toast from "react-hot-toast";


export default function UsersList({users}:{users:UserDiscussion[]}){
    const {selectedUser,setSelectedUser,setDiscussions } = useContext(SocketContext)
    const handleSeenMessages = async (user:UserDiscussion)=>{
        try{
            const response = await fetchWithAuth(`https://tornado008.pythonanywhere.com/api/discussions/seen/${user.id}/`)
            if(!response.ok){
                const error = await response.json()
                throw new Error(error)
            }
            // const data = await response.json()
            const updatedDiscussions = users.map((discussion:UserDiscussion)=>{
                if(discussion.id == user.id){
                    const updatedDiscussion:UserDiscussion = {
                        ...discussion,
                        unread_count:0,
                    }
                    return updatedDiscussion
                }
                return discussion
            })
            setDiscussions(updatedDiscussions)

        }catch(e){
            const error = e as Error
            toast.error(error.message)
        }
    }
    return (
        <motion.div 
        initial={{height:0}}
        animate={{height:'100%'}}
        className="mt-4">
            {users && users.map((user:UserDiscussion)=>{
        
                return ( 
                <div style={
                    {
                        backgroundColor: selectedUser && selectedUser.id == user.id ? '#f1f5f9' : 'white'
                    }

                } 
                
                key={user.id} className="w-full py-2 hover:bg-slate-100 flex items-center gap-6 cursor-pointer" onClick={()=>{
                    setSelectedUser(user)
                    if(selectedUser && selectedUser.id == user.id) return
                    handleSeenMessages(user)

                }
                    } >
                    <Image className="rounded-full" src={user.avatar.startsWith('http') ? user.avatar : `https://tornado008.pythonanywhere.com/media/${user.avatar}`} width={40} height={40} alt="user's profile avatar" />
                    <p className="text-[#7F265B] font-semibold">{user.username}</p>
                    { user.unread_count > 0 &&
                    <p className="text-white font-semibold bg-red-400 px-2 py-0.5 rounded-full">{user.unread_count}</p>
                    }
                </div>
                )
            })
            
            }
        </motion.div>
    )
}