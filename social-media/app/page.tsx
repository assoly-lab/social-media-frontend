'use client'
import Feed from "@/components/feed/Feed";
import { AppContext } from "@/contexts/AppContext";
import { useContext } from "react";


export default function Home() {
  const {setShowNotificationsPanel,setShowMobileNotificationsPanel} =  useContext(AppContext)
  return (
    <div className="w-full min-h-screen flex justify-center bg-[#ffe5c4]" onClick={()=>{
      setShowNotificationsPanel(false)
      setShowMobileNotificationsPanel(false)
    }}>
      <Feed />
    </div>
  );
}
