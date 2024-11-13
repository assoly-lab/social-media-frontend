import { AppContext } from "@/contexts/AppContext";
import { fetchWithAuth } from "@/utils/Helpers";
import { Notification } from "@/utils/Types";
import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import DesktopNotification from "../notifications/DesktopNotification";
import {motion} from "framer-motion"



export default function DesktopNotificationsPanel({notifications}:{notifications:Notification[]}){
    const { userProfile,setShowNotificationsPanel } = useContext(AppContext)

    

    return (
        <motion.div 
        initial={{height:0}}
        animate={{height:'70dvh'}}
        exit={{height:0}}
        className="absolute right-0 top-9 w-[25dvw] h-[70dvh] overflow-y-auto bg-white z-[80]" onClick={(e)=>{
            e.stopPropagation()
            setShowNotificationsPanel(false)
            }} >
            {notifications.length > 0 && notifications.map((notification:Notification)=>{
                return (
                    <DesktopNotification key={notification.id} notification={notification} />
                )
            })


            }
        </motion.div>
    )
}