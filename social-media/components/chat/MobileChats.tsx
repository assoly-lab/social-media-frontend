'use client'

import { AppContext } from "@/contexts/AppContext"
import { fetchWithAuth } from "@/utils/Helpers"
import { MessagePayload, MessageType, UnreadMessagescounterType, UserDiscussion } from "@/utils/Types"
import { useContext, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import MobileUser from "./MobileUser"
import {AnimatePresence, motion} from "framer-motion"
import Image from "next/image"
import { SocketContext } from "@/contexts/SocketContext"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import MobileMessage from "./MobileMessage"
import { MoonLoader } from "react-spinners"




export default function MobileChats(){

    const { userProfile,setUserProfile } = useContext(AppContext)
    const [isList,setIsList] = useState<Boolean>(false)
    const { messages,setMessages,setUnreadMessagesCounter,wsRef,selectedUser,discussions,setDiscussions } = useContext(SocketContext)
    const messageInputRef = useRef<HTMLTextAreaElement>(null)
    const messagesDivRef = useRef<HTMLDivElement>(null)
    const topSentinelRef = useRef<HTMLDivElement>(null)
    const bottomSentinelRef = useRef<HTMLDivElement>(null)
    const [oldMessages,setOldMessages] = useState<string|null>()
    const [lastMessageHeight,setLastMessageHeight] = useState<any | undefined>(undefined)
    const [hasMounted,setHasMounted] = useState<Boolean>(false)
    const [isLoading,setIsLoading] = useState<Boolean>(false)
    const [isScrollButton,setIsScrollButton] = useState<Boolean>(true)
    const observer = new IntersectionObserver((entries)=>{
        const [entry] = entries
        if(entry.isIntersecting){
            handleLoadOldMessages()
        }
    },
    {root:messagesDivRef?.current}
    )




    const handleScrollButton = ()=>{
        if(messagesDivRef.current){
            const isAtbottom = messagesDivRef.current.scrollHeight - messagesDivRef.current.scrollTop - messagesDivRef.current.clientHeight <= 10 ;
            setIsScrollButton(!isAtbottom)
        }
    }




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
                     [selectedUser?.id]:[...data.results,...prev[selectedUser?.id]]
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


    const sendMessage = async(formData:FormData)=>{
        const content = formData.get('message')
        if(content && wsRef.current?.readyState === WebSocket.OPEN){
            const payload = {
                'recipient_id':selectedUser.id,
                'content':content,
            }
            wsRef.current?.send(JSON.stringify(payload))
            const messageData = {
                "id": `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                "content":content,
                "sender": userProfile,
                "is_read":true,
                "created_at":new Date().toISOString()

            }
            setMessages((prev:MessageType)=>{
                return { ...prev,
                 [selectedUser?.id]:[...prev[selectedUser?.id],messageData]
             }
             })
            messageInputRef.current && 
            (messageInputRef.current.value = '')
        }
        }


    useEffect(()=>{
        const getDiscussion = async()=>{
            if(selectedUser){
                try{
                    const response = await fetchWithAuth(`https://tornado008.pythonanywhere.com/api/discussions/${selectedUser.id}/`)
                    if(!response.ok){
                        const error = await response.json()
                        throw new Error(error)
                    }

                    const data = await response.json()
                    setUnreadMessagesCounter((prev:UnreadMessagescounterType)=>({
                        ...prev,
                        [selectedUser.id]: data.messages_count,
                    }))
                    setMessages((prev:MessageType)=>{
                        return { ...prev,
                         [selectedUser.id]:[...data.results]
                     }
                     })
                     setOldMessages(data.next)
                    if(messagesDivRef.current) {
                        setLastMessageHeight(messagesDivRef.current.scrollHeight)
                }

                }catch(e){
                    const error = e as Error
                    toast.error(error.message)
                }
            }
        }
        getDiscussion()
    },[selectedUser])



    useEffect(()=>{
        if(!hasMounted && messages[selectedUser?.id]?.length > 0 ){
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





    useEffect(()=>{
        if(messagesDivRef.current){
            messagesDivRef.current.addEventListener('scroll',handleScrollButton)
        }
        return ()=>{
            if(messagesDivRef.current){
                messagesDivRef.current.removeEventListener('scroll',handleScrollButton)

            }
        }
    },[messagesDivRef.current])




    return (
        <div className="bg-[#ffe5c4] w-full h-[86vh] flex justify-center md:hidden">
            <div className="relative bg-white w-[93%] h-[80vh] max-h-[80vh] flex flex-col mt-8">
            {isList ? <IoIosArrowUp className="absolute w-9 h-9 -top-5 left-1/2 bg-gray-100 rounded-full -translate-x-1/2 cursor-pointer" onClick={()=>setIsList(false)}  /> : <IoIosArrowDown className="absolute w-9 h-9 -top-3 left-1/2 bg-gray-100 rounded-full -translate-x-1/2 cursor-pointer" onClick={()=>setIsList(true)} />}
            <AnimatePresence>
                {isList &&
                <motion.div 
                initial={{height:0}}
                animate={{height:'auto'}}
                exit={{height:0}}
                className="w-[90%] mx-auto flex justify-center gap-4 font-semibold text-base mt-4">
                    <p className="px-2 py-1 rounded-md cursor-pointer transition-all duration-300 ease-in-out bg-[#7F265B] text-white"
                    >Discussions</p>
                </motion.div>
                }
                </AnimatePresence>
                <AnimatePresence>
                    { isList &&
                        <motion.div 
                            initial={{height:0}}
                            animate={{height:'6rem'}}
                            exit={{height:0}}
                            className="w-[95%] h-20 mx-auto mt-4 flex gap-4 overflow-x-auto overflow-y-hidden">
                            {discussions.length > 0 && discussions.map((user:UserDiscussion)=>{
                                return (
                                    <MobileUser key={user.id}  user={user} setIsList={setIsList}  />
                                )
                            })}
                        </motion.div> 
                    }
                </AnimatePresence>
                {selectedUser && 
                <div 
                style={{marginTop: isList ? '1rem' : 0}}
                className="w-full  flex-1 flex flex-col overflow-y-auto">
                    <div className="pl-4 h-16 bg-[#7F265B] flex gap-4 items-center py-2">
                        <Image className="rounded-full object-contain" src={selectedUser?.avatar.startsWith('http') ? selectedUser?.avatar : `https://tornado008.pythonanywhere.com/media/${selectedUser.avatar}`} width={50} height={50} alt="user's profile avatar" />
                        <p className="text-white font-semibold">{selectedUser.username}</p>
                    </div>
                    <div ref={messagesDivRef} className="relative mb-2 bg-[#ffe5c4] w-full overflow-y-auto gap-2 py-2">
                        {isLoading &&
                        <div className="loader w-full h-12 flex justify-center">
                            <MoonLoader size={20} />
                        </div>
                        }
                        <div ref={topSentinelRef} className="h-[1px]"></div> 
                        {messages[selectedUser.id] && messages[selectedUser.id].length > 0 && messages[selectedUser.id].map((message:MessagePayload)=>{
                            return (
                                <MobileMessage key={message.id} message={message} />
                            )
                        })
                        }
                        <AnimatePresence>
                        {isScrollButton &&
                        <motion.button 
                        onClick={()=>{
                            if(bottomSentinelRef.current){
                                bottomSentinelRef.current.scrollIntoView({
                                    behavior:'smooth',
                                    block:'nearest'
                                })
                            }
                        }}
                        initial={{y:'100%',opacity:0}}
                        animate={{y:0,opacity:1}}
                        exit={{y:'100%',opacity:0}}
                        transition={{type:'spring',duration:200,stiffness:200,damping:20}}
                        className="fixed bottom-[6.5rem] left-1/2 bg-[#7F265B] rounded-full z-20">
                            <IoIosArrowDown className="w-7 h-7 text-white" />
                        </motion.button>
                        }
                        </AnimatePresence>
                        <div ref={bottomSentinelRef} className="h-[1px]"></div> 
                    </div>
                    <form className="h-14 w-[98%] my-2 flex gap-4" action={async(formData:FormData)=>sendMessage(formData)}>
                        <textarea ref={messageInputRef} className="flex-1 p-2 ml-2 focus:outline-none focus:border focus:border-[#7F265B]" name="message" id="message" placeholder="write a message" />
                        <input className="bg-[#7F265B] text-white text-xl px-2 py-1 h-fit self-end cursor-pointer" type="submit" value="Send" />
                    </form>
                </div>
                }
                
            </div>
        </div>
    )
}