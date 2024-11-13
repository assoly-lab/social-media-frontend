'use client'


import { PostType, UserData } from "@/utils/Types";
import React, { createContext, useState } from "react";



type AppState = {
    userProfile:UserData | undefined,
    setUserProfile:React.Dispatch<React.SetStateAction<UserData|undefined>>,
    postsList:PostType[],
    setPostsList: React.Dispatch<React.SetStateAction<PostType[]>>,
    showNotificationsPanel:boolean,
    setShowNotificationsPanel:React.Dispatch<React.SetStateAction<boolean>>,
    showMobileNotificationsPanel:boolean,
    setShowMobileNotificationsPanel:React.Dispatch<React.SetStateAction<boolean>>,
}


export const AppContext = createContext<AppState | any>({})

export default function AppContextProvider({children}: {children:React.ReactNode}){
    const [userProfile,setUserProfile] = useState<UserData | undefined>()
    const [postsList,setPostsList] = useState<PostType[]>([])
    const [showNotificationsPanel,setShowNotificationsPanel] = useState<boolean>(false)
    const [showMobileNotificationsPanel,setShowMobileNotificationsPanel] = useState<boolean>(false)



    const values:AppState = {
        userProfile,
        setUserProfile,
        postsList,
        setPostsList,
        showNotificationsPanel,
        setShowNotificationsPanel,
        showMobileNotificationsPanel,
        setShowMobileNotificationsPanel,
    }
    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
        
    )
}


