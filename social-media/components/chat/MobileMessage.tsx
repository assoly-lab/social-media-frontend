import { AppContext } from "@/contexts/AppContext"
import { MessagePayload } from "@/utils/Types"
import Image from "next/image"
import { useContext } from "react"



export default function MobileMessage({message}:{message:MessagePayload}){
    const { userProfile } = useContext(AppContext)
    return (
        <>
        {userProfile && userProfile?.user?.id == message.sender.user.id ?
            <div className="message flex flex-row-reverse gap-3 w-full text-black self-end pr-4 items-start overflow-hidden my-2">
                <Image src={message.sender.avatar.startsWith('http') ? message.sender.avatar : `https://tornado008.pythonanywhere.com${message.sender.avatar}`} width={25} height={25} alt="user's profile avatar" className="object-contain" />
                <p className="relative bg-white py-2 px-2 z-20 max-w-[80%]" >{message.content}
                <span className="absolute w-7 h-7 -top-1 -right-1 rotate-45 bg-white -z-10"></span>
                </p>
            </div>
            :
            <div className="message flex gap-3 w-full text-white items-start overflow-hidden my-2">
                <Image src={message.sender.avatar.startsWith('http') ? message.sender.avatar : `https://tornado008.pythonanywhere.com${message.sender.avatar}`} width={25} height={25} alt="user's profile avatar" className="object-contain rounded-full" />
                <p className="relative bg-[#7F265B] py-2 px-2 z-20 max-w-[80%]" >{message.content}
                <span className="absolute w-7 h-7 -top-1 -left-1 rotate-45 bg-[#7F265B] -z-10"></span>
                </p>
            </div>

        }
        </>
    )
}