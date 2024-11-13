'use client'

import Link from "next/link"
import { FiHome } from "react-icons/fi";
import { FiLogIn } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { IoMdNotificationsOutline, IoMdSearch } from "react-icons/io";
import React, { useContext, useEffect, useState } from "react";
import DesktopNotificationsPanel from "./DesktopNotificationsPanel";
import { fetchWithAuth, isTokenExpired } from "@/utils/Helpers";
import { AppContext } from "@/contexts/AppContext";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { SocketContext } from "@/contexts/SocketContext";
import { BiSolidMessageRounded } from "react-icons/bi";
import { MessagePayload, MessageType, Notification, UserDiscussion } from "@/utils/Types";





export default function DesktopNav(){
    const { userProfile,setUserProfile,showNotificationsPanel,setShowNotificationsPanel } = useContext(AppContext)
    const {notifications,setNotifications,notificationsCount,setNotificationsCount,discussions,setDiscussions,unreadMessagesCounter,setUnreadMessagesCounter,messages,chatWsRef,notificationsWsRef,setMessages,setSelectedUser,messagesDivRef} = useContext(SocketContext)
    const [accessToken,setAccessToken] = useState<string | null>(null)
    const router = useRouter()

    



    useEffect(()=>{
        const access = localStorage.getItem('access')
        setAccessToken(access)
    },[userProfile])
    
    useEffect(()=>{
        if(discussions && discussions.length > 0){
        const counter = discussions.reduce((acc:number,discussion:UserDiscussion)=>{
             return acc + discussion.unread_count
        },0)
        setUnreadMessagesCounter(counter)
    }
    },[discussions,messages])

    useEffect(()=>{
        const getUserProfile = async ()=>{
            const access = localStorage.getItem('access')
            if(access){
                try{
                    const response = await fetchWithAuth('http://localhost:8000/api/get/profile/',{
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
        getUserProfile()
    },[])



    const handleSeenMessages = async (user:UserDiscussion)=>{
        try{
            const response = await fetchWithAuth(`http://localhost:8000/api/discussions/seen/${user.id}/`)
            if(!response.ok){
                const error = await response.json()
                throw new Error(error)
            }
            // const data = await response.json()

            setDiscussions((prev:UserDiscussion[])=>{
                const updatedDiscussions = prev.map((discussion:UserDiscussion)=>{
                    if(discussion.id == user.id){
                        const updatedDiscussion:UserDiscussion = {
                            ...discussion,
                            unread_count:0,
                        }
                        return updatedDiscussion
                    }
                    return discussion
                })
                return updatedDiscussions
            })

        }catch(e){
            const error = e as Error
            toast.error(error.message)
        }
    }



    const handleUnreadMessages = (message:MessagePayload)=>{
        setSelectedUser((prev:UserDiscussion)=>{
            if(prev == undefined){
                setDiscussions((prev:UserDiscussion[])=>{
                    const updatedDiscussions = prev.map((discussion:UserDiscussion)=>{
                       if(discussion.id == message.sender.user.id){
                           console.log('discussion exists and user undefined!!')
                           const updatedDiscussion:UserDiscussion = {
                               ...discussion,
                               unread_count:discussion.unread_count + 1,
                           }
                           return updatedDiscussion
                       }
                       return discussion
                   })
                   return updatedDiscussions
               })
            }
            if( prev && prev.id != message.sender.user.id){
                setDiscussions((prev:UserDiscussion[])=>{
                    const updatedDiscussions = prev.map((discussion:UserDiscussion)=>{
                       if(discussion.id == message.sender.user.id){
                           console.log('discussion exists and user exists!!')
                           const updatedDiscussion:UserDiscussion = {
                               ...discussion,
                               unread_count:discussion.unread_count + 1,
                           }
                           return updatedDiscussion
                       }
                       return discussion
                   })
                   return updatedDiscussions
               })
            } 
            if(prev && prev.id == message.sender.user.id){
                handleSeenMessages(prev)
            }
            return prev
        })
 

    }

    // useEffect(()=>{
    //     if( notificationsWsRef.current &&   notificationsWsRef.current?.readyState === WebSocket.OPEN){
    //         return 
    //     }
    //     const accessToken = localStorage.getItem('access')
    //     if(accessToken && !isTokenExpired(accessToken)){
    //         notificationsWsRef.current = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${accessToken}`)
    //         }

    //     if(notificationsWsRef.current){
    //         notificationsWsRef.current.onmessage = (e:any)=>{
    //             const data = JSON.parse(e.data)
    //             toast.success(data.payload.results.message)
    //             setNotificationsCount(data.payload.notifications_count)
    //             setNotifications((prev:Notification[])=>[data.payload.results,...prev])
    
    //         }
    //     }
    //     return ()=>{
    //         notificationsWsRef.current?.close()
    //     }


    // },[accessToken])

    // useEffect(()=>{
    //     if( chatWsRef.current &&  chatWsRef.current.readyState === WebSocket.OPEN){
    //         return 
    //     }
    //     const accessToken = localStorage.getItem('access')
    //     if(accessToken && !isTokenExpired(accessToken)){
    //         chatWsRef.current = new WebSocket(`ws://localhost:8000/ws/chat/?token=${accessToken}`)
    //         }

    //         if(chatWsRef.current){  
    //             chatWsRef.current.onmessage = (e:any)=>{
    //             const data = JSON.parse(e.data)
    //             handleUnreadMessages(data.message)
    //             setMessages((prev:MessageType)=>{
    //                 const prevMessages = prev[data.message.sender.user.id]
    //                 if(prevMessages?.length > 0){
    //                     return {
    //                         ...prev,
    //                         [data.message.sender.user.id]:[ ...prevMessages,data.message]
    //                     }
    //                 }else{
    //                     return {
    //                         ...prev,
    //                         [data.message.sender.user.id]:[data.message]
    //                     }
    //                 }
                    
    //             })
    //             if(messagesDivRef.current) messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;

    //         }
    //     }



    //     return ()=>{
    //         chatWsRef.current?.close()
    //     }


    // },[accessToken])







    useEffect(()=>{
        const getUserNotifications = async ()=>{
        if(userProfile){
            try{
                const response = await fetchWithAuth(`http://localhost:8000/api/notifications/get/${userProfile.user.id}/`)
                if(!response.ok){
                    const error = await response.json()
                    throw new Error(error)
                }
                const data = await response.json()
                setNotifications(data.results)
                setNotificationsCount(data.notifications_count)
            }catch(e){
                const error = e as Error 
                toast.error(error.message)
            }
        }else{
            setNotifications([])
            setNotificationsCount(0)
        }
    } 
    getUserNotifications()
    },[accessToken,userProfile])

    const handleLogout = async()=>{
        try{
            const response = await fetchWithAuth('http://localhost:8000/api/auth/jwt/logout/',{
                method: 'POST',
            })
            if(!response.ok){
                const error= await response.json()
                throw new Error(error)
            }
            localStorage.removeItem('access')
            setUserProfile(undefined)
            setNotifications([])
            setNotificationsCount(0)
            setUnreadMessagesCounter(0)
            setUserProfile(undefined)
            chatWsRef.current?.close()
            notificationsWsRef.current?.close()
            router.push('/login')
        }catch(e){
            const error = e as Error
            toast.error(error.message)
        }
    }

    const getUserDiscussions = async()=>{
        if(userProfile){
        try{
            const response = await fetchWithAuth(`http://localhost:8000/api/discussions/list/`)
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
    
    const handleSeenNotifications = async ()=>{
        try{
            const response = await fetchWithAuth(`http://localhost:8000/api/notifications/seen/`)
            if(!response.ok){
                const error = await response.json()
                throw new Error(error)
            }
            // const data = await response.json()
            if(notifications.length > 0){

                setNotifications((prev:Notification[])=>{
                    const updatedNotifications = prev.map((notification:Notification)=>{
                        const updatedNotification:Notification = {
                            ...notification,
                            is_read:true
                        }
                        return updatedNotification
                    })
                    setNotificationsCount(0)
                    return updatedNotifications
                })
            }

        }catch(e){
            const error = e as Error
            toast.error(error.message)
        }
    }
    
    
    
    
    useEffect(()=>{
        if(userProfile){
            getUserDiscussions()
        }
    },[userProfile])




    return (
        <>
            <div className="hidden md:flex items-center gap-4" onClick={()=>setShowNotificationsPanel(false)}>
                <Link href={'/'} className="flex gap-2"><FiHome className="w-5 h-5" /> Feed</Link>
                {accessToken  && <Link href={'/profile'} className="flex gap-2"><FaRegUser className="w-5 h-5" /> Profile</Link>}
                <div className="relative w-8 rounded-full focus-within:w-40">
                    <input type="text" placeholder="search..." className="h-10 w-full pl-7 placeholder:font-normal rounded-full focus:outline-none focus:border-2 focus:border-[#7F265B]" />
                    <IoMdSearch className="w-6 h-6 absolute top-1/2 left-0 -translate-y-1/2 pl-1" />
                </div>
            </div>
            <div className="hidden md:flex items-center gap-4" onClick={()=>setShowNotificationsPanel(false)}>
                {accessToken && 
                <span className="relative cursor-pointer flex gap-2 text-white bg-[#7F265B] p-1 rounded-md" onClick={(e)=>{
                    handleSeenNotifications()
                    e.stopPropagation()
                    setShowNotificationsPanel((prev:Boolean)=>!prev)}}>
                    <IoMdNotificationsOutline className="w-7 h-7 " />{notificationsCount > 0 && <span className="absolute -top-3 -right-2 bg-red-500 text-white py-1 px-2 rounded-full text-xs font-normal">{notificationsCount}</span>}
                <AnimatePresence>
                    {showNotificationsPanel &&
                        <DesktopNotificationsPanel notifications={notifications} />
                    }
                </AnimatePresence>
                </span> 
                } 
                {accessToken && 
                <Link href={'/chat'} className="relative bg-[#7F265B] p-1 rounded-md cursor-pointer" >
                    <BiSolidMessageRounded className="w-7 h-7 text-white" />
                    {unreadMessagesCounter > 0 && 
                    <span className="absolute -top-3 -right-2 bg-red-500 text-white py-1 px-2 rounded-full text-xs font-normal">{unreadMessagesCounter}</span>
                    }
                </Link>}
                {accessToken ? <button className="cursor-pointer flex gap-2 text-white bg-[#7F265B] p-1 rounded-md" onClick={()=>handleLogout()}><FiLogOut className="w-7 h-7"/></button> : <Link href={'/login'} className="flex gap-2 text-white bg-[#7F265B] p-1 rounded-md"><FiLogIn className="w-7 h-7 " /></Link> } 
            </div>
        </>
    )
}