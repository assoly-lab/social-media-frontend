import { SocketContext } from "@/contexts/SocketContext";
import { fetchWithAuth } from "@/utils/Helpers";
import { UserDiscussion } from "@/utils/Types";
import Image from "next/image";
import { useContext } from "react";
import toast from "react-hot-toast";



export default function MobileUser({user,setIsList}:{user:UserDiscussion,setIsList:React.Dispatch<React.SetStateAction<boolean>>}){

    const {selectedUser,setSelectedUser,discussions,setDiscussions } = useContext(SocketContext)
    const handleSeenMessages = async (user:UserDiscussion)=>{
        try{
            const response = await fetchWithAuth(`https://tornado008.pythonanywhere.com/api/discussions/seen/${user.id}/`)
            if(!response.ok){
                const error = await response.json()
                throw new Error(error)
            }
            // const data = await response.json()
            const updatedDiscussions = discussions.map((discussion:UserDiscussion)=>{
                if(discussion.id == user.id){
                    console.log('discussion exists!!')
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
        <>
            <div
            onClick={()=>{
                setIsList(false)
                setSelectedUser(user)
                if(selectedUser && selectedUser.id == user.id) return
                handleSeenMessages(user)
            }}
            style={{
                backgroundColor:  user.id == selectedUser?.id ? '#e5e7eb' : 'white'
                 
            }}
            className="relative flex flex-col w-fit h-20 items-center pt-2 px-2 rounded-md cursor-pointer ">
                <Image className="rounded-full" src={user.avatar.startsWith('http') ? user.avatar : `https://tornado008.pythonanywhere.com/media/${user.avatar}`} height={40} width={40} alt="user's profile avatar" />
                <p className="text-xs font-semibold text-[#7F265B]">{user.username}</p>
                {user.unread_count && user.unread_count > 0 &&
                <p className="absolute top-0 right-0 bg-red-400 text-white px-2 rounded-full">{user.unread_count}</p>
                }
            </div>
            
        </>
    )
}