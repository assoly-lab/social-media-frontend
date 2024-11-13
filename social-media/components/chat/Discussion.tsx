import { AppContext } from "@/contexts/AppContext";
import { SocketContext } from "@/contexts/SocketContext";
import { fetchWithAuth } from "@/utils/Helpers";
import type { MessagePayload, MessageType } from "@/utils/Types";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Message from "@/components/chat/Message"
import { MoonLoader } from "react-spinners";



export default function Discussion({user}:{user:any}){
    const {userProfile} = useContext(AppContext)
    const {messages,setMessages,chatWsRef} = useContext(SocketContext)
    const messageInputRef = useRef<HTMLTextAreaElement>(null)
    const messagesDivRef = useRef<HTMLDivElement>(null)
    const topSentinelRef = useRef<HTMLDivElement>(null)
    const [lastMessageHeight,setLastMessageHeight] = useState<number | undefined>(0)
    const [hasMounted,setHasMounted] = useState<Boolean>(false)
    const [oldMessages,setOldMessages] = useState<string|null>(null)
    const [isLoading,setIsLoading] = useState<Boolean>(false)
    const observer = new IntersectionObserver((entries)=>{
        const [entry] = entries
        if(entry.isIntersecting){
            handleLoadOldMessages()
        }
    },
    {root:messagesDivRef?.current}
    )

    const handleLoadOldMessages = async()=>{
        if(oldMessages){
            try{
                setIsLoading(true)
                const response = await fetchWithAuth(oldMessages)
                if(!response.ok){
                    const error = await response.json()
                    setIsLoading(false)
                    throw new Error(error)
                }
                const data = await response.json()
                setIsLoading(false)
                setMessages((prev:MessageType)=>{
                       return { ...prev,
                        [user.id]:[...data.results,...prev[user.id]]
                    }
                    })
                if(messagesDivRef.current) setLastMessageHeight(messagesDivRef.current.scrollHeight)
                if(data.next){
                    setOldMessages(data.next)
                   
                }else{
                    setOldMessages(null)
                    observer.disconnect()
                }      
                

            }catch(e){
                const error = e as Error
                toast.error(error.message)
            }
        }
    }


    useEffect(()=>{
        const getDiscussion = async()=>{
            if(user){
                try{
                    const response = await fetchWithAuth(`https://tornado008.pythonanywhere.com/api/discussions/${user.id}/`)
                    if(!response.ok){
                        const error = await response.json()
                        throw new Error(error)
                    }

                    const data = await response.json()
                    setMessages((prev:MessageType)=>{
                       return { ...prev,
                        [user.id]:[...data.results]
                    }
                    })
                    setOldMessages(data.next)
                    if(messagesDivRef.current) {
                        setLastMessageHeight(
                        messagesDivRef.current.scrollHeight
                    )
                }

                }catch(e){
                    const error = e as Error
                    toast.error(error.message)
                }
            }
        }
        getDiscussion()
    },[user])





    const sendMessage = async(formData:FormData)=>{
        const content = formData.get('message')
        if(content && chatWsRef.current?.readyState === WebSocket.OPEN){
            const payload = {
                'recipient_id':user.id,
                'content':content,
            }
            chatWsRef.current?.send(JSON.stringify(payload))
            const messageData = {
                "id": `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                "content":content,
                "sender": userProfile,
                "is_read":true,
                "created_at":new Date().toISOString()

            }
            setMessages((prev:MessageType)=>{
                const prevMessages = prev[user.id]
                if(prevMessages?.length > 0){
                    return {
                        ...prev,
                        [user.id]:[ ...prevMessages,messageData]
                    }
                }else{
                    return {
                        ...prev,
                        [user.id]:[messageData]
                    }
                }
                
            })

            messageInputRef.current && 
            (messageInputRef.current.value = '')
        }
        }


    useEffect(()=>{
        if(!hasMounted && messages[user.id]?.length > 0 ){
        if(messagesDivRef?.current){
            messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
            setHasMounted(true)
        }
    }
    },[messages])



    useEffect(()=>{
        if(!hasMounted){
            return
        }

        if(topSentinelRef.current){
            observer.observe(topSentinelRef.current)
        }

        return ()=>{
            if(topSentinelRef.current){
                observer.unobserve(topSentinelRef.current)
            }
        }
        
    },[hasMounted,oldMessages])




    useEffect(()=>{
        if(!isLoading){

        if(messagesDivRef.current){ 
            if(lastMessageHeight) messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight - lastMessageHeight
        }
    }

    },[isLoading])




    return (
        <div className="w-full flex flex-col gap-2">
            <div className="w-full bg-[#7F265B] py-4 pl-4 flex items-center gap-4">
                <Image className="rounded-full" src={user.avatar.startsWith('http') ? user.avatar : `https://tornado008.pythonanywhere.com/media/${user.avatar}`} width={50} height={50} alt="user's profile avatar" />
                <p className="text-white text-xl font-medium ">{user.username}</p>
            </div>
            <div ref={messagesDivRef} className="bg-white w-full h-full overflow-auto gap-2 py-2">
                {isLoading &&
                <div className="loader w-full h-12 flex justify-center">
                    <MoonLoader size={25} />
                </div>
                }
                <div ref={topSentinelRef} className="h-[1px]"></div> 
                {messages[user.id] && messages[user.id].length > 0 && messages[user.id].map((message:MessagePayload)=>{
                    return (
                        <Message key={message.id} message={message} />
                    )
                })}
            </div>
            <form className="w-[90%] flex gap-4 mx-auto " action={async(formData:FormData)=>sendMessage(formData)}>
                <textarea ref={messageInputRef} name="message" id="message" placeholder="Write a message" className="focus:outline-none focus:border focus:border-[#7F265B] flex-1 p-2 rounded-md bg-slate-100" />
                <input type="submit" value="Send" className="text-white bg-[#7F265B] py-2 px-3 h-fit rounded-md self-end" />
            </form>
        </div>
    )
}