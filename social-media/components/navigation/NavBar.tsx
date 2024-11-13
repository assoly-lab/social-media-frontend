'use client'

import { AppContext } from "@/contexts/AppContext";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";


export default function NavBar(){
    const [accessToken,setAccessToken] = useState<string>('')
    const { setShowNotificationsPanel,setShowMobileNotificationsPanel } = useContext(AppContext)

    useEffect(()=>{
        const access = localStorage.getItem('access')
        if(access){
            setAccessToken(access)
        }
    },[accessToken])
    

    return (
        <div className="w-full h-24 bg-white flex justify-center items-center" onClick={()=>{
            setShowMobileNotificationsPanel(false)
            setShowNotificationsPanel(false)
            }}>
            {/* container */}
            <div className="w-[80%] h-full flex justify-between text-medium font-semibold text-[#7F265B]">
                <div className="logo flex items-center">
                    <Link href={'/'} className="text-[#7F265B] text-3xl font-semibold">I-Social</Link>
                </div>
                {/* <MobileNav  /> */}
                <DesktopNav   />
                
            </div>
        </div>
    )
}