import Chats from "@/components/chat/Chats";
import MobileChats from "@/components/chat/MobileChats";


export default function ChatPage(){
    
    
    return (
        <div className="w-full h-[calc(86dvh_+_2px)] bg-[#ffe5c4] overflow-hidden">
            <Chats />
            <MobileChats />
        </div>
    )
}