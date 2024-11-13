'use client'


import { MessageType, Notification, UserDiscussion } from "@/utils/Types";
import React, { createContext, useRef, useState } from "react";




type SocketContextType = {
    notifications:Notification[],
    setNotifications:React.Dispatch<React.SetStateAction<Notification[]>>,
    notificationsCount:number,
    setNotificationsCount:React.Dispatch<React.SetStateAction<number>>,
    messages:MessageType,
    setMessages:React.Dispatch<React.SetStateAction<MessageType>>,
    unreadMessagesCounter:number,
    setUnreadMessagesCounter:React.Dispatch<React.SetStateAction<number>>,
    chatWsRef:React.MutableRefObject<WebSocket | null > | null,
    notificationsWsRef:React.MutableRefObject<WebSocket | null > | null,
    selectedUser: any|undefined ,
    setSelectedUser: React.Dispatch<React.SetStateAction<any|undefined>>,
    discussions:UserDiscussion[] | [],
    setDiscussions: React.Dispatch<React.SetStateAction<UserDiscussion[]>>,
    
}


export const SocketContext = createContext<SocketContextType | any>({})

export default function SocketContextProvider({children}: {children:React.ReactNode}){
    const [notifications,setNotifications] = useState<Notification[]>([])
    const [notificationsCount,setNotificationsCount] = useState<number>(0)
    const [messages,setMessages] = useState<MessageType>({})
    const chatWsRef = useRef<WebSocket | null>(null)
    const notificationsWsRef = useRef<WebSocket | null>(null)
    const [unreadMessagesCounter,setUnreadMessagesCounter] = useState<number>(0)
    const [selectedUser,setSelectedUser] = useState<UserDiscussion|undefined>()
    const [discussions,setDiscussions] = useState<UserDiscussion[]>([])



    const values:SocketContextType = {
        notifications,
        setNotifications,
        notificationsCount,
        setNotificationsCount,
        messages,
        setMessages,
        chatWsRef,
        notificationsWsRef,
        unreadMessagesCounter,
        setUnreadMessagesCounter,
        selectedUser,
        setSelectedUser,
        discussions,
        setDiscussions
        
    }
    return (
        <SocketContext.Provider value={values}>
            {children}
        </SocketContext.Provider>
        
    )
}


