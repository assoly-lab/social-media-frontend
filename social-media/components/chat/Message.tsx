import { AppContext } from "@/contexts/AppContext";
import { MessagePayload } from "@/utils/Types";
import { format,parseISO } from "date-fns";
import Image from "next/image";
import { useContext } from "react";



export default function Message({message}:{message:MessagePayload}){
    const { userProfile } = useContext(AppContext)
    return (
        <>
        {userProfile && userProfile?.user?.id == message.sender.user.id ?
            <div className="message flex flex-col gap-3 w-full text-black  pr-4 items-start overflow-hidden my-2">
                <div className="flex flex-row-reverse self-end gap-2">
                    <Image src={message.sender.avatar.startsWith('http') ? message.sender.avatar : `http://localhost:8000${message.sender.avatar}`} width={25} height={25} alt="user's profile avatar" className="object-contain rounded-full mb-4" />
                    <p className="relative bg-gray-200 py-2 px-2 z-20" >{message.content}
                    <span className="absolute w-7 h-7 -top-1 -right-1 rotate-45 bg-gray-200 -z-10"></span>
                    </p>
                </div>
                <span className="text-xs text-gray-400 self-end">{format(parseISO(message.created_at),'PPpp')}</span>
            </div>
            :
            <div className="message flex flex-col gap-3 max-w-[70%] text-white pl-4 items-start overflow-hidden my-2">
                <div className="flex gap-2">
                    <Image src={message.sender.avatar.startsWith('http') ? message.sender.avatar : `http://localhost:8000${message.sender.avatar}`} width={25} height={25} alt="user's profile avatar" className="object-contain rounded-full mb-4" />
                    <p className="relative bg-[#7F265B] py-2 px-2 z-20" >{message.content}
                    <span className="absolute w-7 h-7 -top-1 -left-1 rotate-45 bg-[#7F265B] -z-10"></span>
                    </p>
                </div>
                <span className="text-xs text-gray-400">{format(parseISO(message.created_at),'PPpp')}</span>
            </div>

        }
        </>
    )

}