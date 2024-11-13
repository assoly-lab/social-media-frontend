'use client'

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose, IoMdNotificationsOutline } from "react-icons/io";
import { FiHome } from "react-icons/fi";
import { FiLogIn } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { AppContext } from "@/contexts/AppContext";
import toast from "react-hot-toast";
import { fetchWithAuth, isTokenExpired } from "@/utils/Helpers";
import MobileNotificationsPanel from "./MobileNotificationsPanel";
import { SocketContext } from "@/contexts/SocketContext";
import { BiSolidMessageRounded } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { MessagePayload, MessageType, UserDiscussion,Notification } from "@/utils/Types";




export default function MobileNav(){
    const [isOpen,setIsOpen] = useState<Boolean>(false)
    const { userProfile,setUserProfile,showMobileNotificationsPanel,setShowMobileNotificationsPanel } = useContext(AppContext)
    const {notifications,setNotifications,notificationsCount,setNotificationsCount,unreadMessagesCounter,setUnreadMessagesCounter,chatWsRef,notificationsWsRef,setMessages,setDiscussions,setSelectedUser,messagesDivRef} = useContext(SocketContext)
    const [accessToken,setAccessToken] = useState<string>('')
    const router = useRouter()





    useEffect(()=>{
        const access = localStorage.getItem('access')
        if(access){
            setAccessToken(access)
        }
    },[userProfile])


    const handleSeenMessages = async (user:UserDiscussion)=>{
        try{
            const response = await fetchWithAuth(`https://tornado008.pythonanywhere.com/api/discussions/seen/${user.id}/`)
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


    // },[userProfile])

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


    // },[userProfile])





    
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
        getUserProfile()
    },[])


    const handleLogout = async()=>{
        try{
            const response = await fetchWithAuth('https://tornado008.pythonanywhere.com/api/auth/jwt/logout/',{
                method: 'POST',
            })
            if(!response.ok){
                const error= await response.json()
                throw new Error(error)
            }
            const data = await response.json()
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

    useEffect(()=>{
        const getUserNotifications = async ()=>{
        if(userProfile){
            try{
                const response = await fetchWithAuth(`https://tornado008.pythonanywhere.com/api/notifications/get/${userProfile.user.id}/`)
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


    const handleSeenNotifications = async ()=>{
        try{
            const response = await fetchWithAuth(`https://tornado008.pythonanywhere.com/api/notifications/seen/`)
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

    return (
        <div className="flex md:hidden items-center gap-3" onClick={()=>setShowMobileNotificationsPanel(false)} >
            {userProfile && 
            <span className="relative text-xs bg-[#7F265B] text-white rounded-md p-1 cursor-pointer" onClick={(e)=>{
                e.stopPropagation()
                handleSeenNotifications()
                setShowMobileNotificationsPanel((prev:Boolean)=>!prev)
                }}>
                {notificationsCount > 0 && 
                <span className="absolute -top-3 -right-2 bg-red-500 p-1 rounded-full" >{notificationsCount}</span>}
                <IoMdNotificationsOutline className="w-6 h-6 " />
                {showMobileNotificationsPanel &&
                <MobileNotificationsPanel notifications={notifications} />
                }
            </span>
            }
            {userProfile &&
            <Link href={'/chat'} className="bg-[#7F265B] p-1 rounded-md cursor-pointer" >
                <BiSolidMessageRounded className="w-7 h-7 text-white" />
                {unreadMessagesCounter > 0 && 
                    <span className="absolute -top-3 -right-2 bg-red-500 text-white py-1 px-2 rounded-full text-xs font-normal">{unreadMessagesCounter}</span>
                    }
            </Link>}

        {isOpen ? <IoMdClose className="w-8 h-8 text-[#7F265B] cursor-pointer z-[70]" onClick={(e)=>{
            e.stopPropagation()
            setIsOpen(false)}} /> : <GiHamburgerMenu className="w-8 h-8 text-[#7F265B] cursor-pointer z-[60]" onClick={()=>setIsOpen(true)}/>
            }
        {isOpen &&
        <div className="fixed flex flex-col gap-4 justify-center items-center w-full h-screen overflow-hidden top-0 left-0 z-[60] bg-white" >
            <Link href="/" onClick={()=>setIsOpen(false)} className="flex items-center justify-center gap-2 text-lg font-semibold"><FiHome className="w-5 h-5 mb-2" /> Feed</Link>
            {accessToken && <Link href="/profile" onClick={()=>setIsOpen(false)} className="flex items-center justify-center gap-2 text-lg font-semibold" ><FaRegUser className="w-5 h-5 mb-2"  /> Profile</Link> }
            {accessToken ? <button onClick={()=>{
                handleLogout()
                setIsOpen(false)
                }} className="cursor-pointer flex gap-2"><FiLogOut/> Logout</button> : <Link href={'/login'} className="flex gap-2" onClick={()=>setIsOpen(false)} ><FiLogIn className="w-6 h-6 mt-2" />  Login/Register</Link> } 
        </div>
        }
        </div>
    )
}