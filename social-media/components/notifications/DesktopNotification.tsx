import { Notification, PostType } from "@/utils/Types";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PostPopup from "../navigation/PostPopup";
import Link from "next/link"





export default function DesktopNotification({notification}:{notification:Notification}){
    const [showPostPopup,setShowPostPopup] = useState<Boolean>(false)
    const bgClass = notification.is_read ? 'bg-gray-100' : 'bg-white'
    const router = useRouter()
    const timeAgo = formatDistanceToNowStrict(new Date(notification?.timestamp),{
        addSuffix:true})

    return (
        <>
        {showPostPopup && 
        <PostPopup post={notification.post as PostType} setShowPostPopup={setShowPostPopup} />
        }
        
            <div className={`relative w-full flex items-center gap-4 ${bgClass} py-2 px-2 hover:bg-slate-50 cursor-pointer`} onClick={(e)=>{
                e.stopPropagation()
                if(notification.post != null){
                    setShowPostPopup(true)
                }
                }
                }
                >
            {!notification.post && <Link href={`/profile/${notification.user.id}`} className="absolute w-full inset-0 h-full"></Link>}
                <Image className="rounded-full" src={notification.avatar.startsWith('http') ? notification.avatar : `https://tornado008.pythonanywhere.com/media/${notification.avatar}`} width={50} height={50} alt="user's profile avatar" />
                <p className="text-[#7F265B]">{notification.message}</p>
                <p className="text-gray-400 text-xs">{timeAgo}</p>
            </div>
        </>
    )
}