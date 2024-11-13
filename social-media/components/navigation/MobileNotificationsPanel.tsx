import { Notification } from "@/utils/Types";
import { motion } from "framer-motion"
import MobileNotification from "../notifications/MobileNotification";



export default function MobileNotificationsPanel({notifications}:{notifications:Notification[]}){
    return (

            <motion.div 
            initial={{height:0}}
            animate={{height:'70dvh'}}
            exit={{height:0}}
            className="absolute right-0 top-9 w-[60dvw] h-[70dvh] overflow-y-auto bg-white z-[80]" onClick={(e)=>e.stopPropagation()} >
                {notifications.length > 0 && notifications.map((notification:Notification)=>{
                    return (
                        <MobileNotification key={notification.id} notification={notification} />
                )
                })


                }
            </motion.div>
    )
}