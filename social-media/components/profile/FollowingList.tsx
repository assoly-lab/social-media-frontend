import { AppContext } from "@/contexts/AppContext";
import { isTokenExpired } from "@/utils/Helpers";
import { Following } from "@/utils/Types";
import Image from "next/image";
import { useContext } from "react";



export default function FollowingList({following,setShowFollowing}:{following:Following[],setShowFollowing:React.Dispatch<React.SetStateAction<Boolean>>}){
    const { userProfile } = useContext(AppContext)

    const renderCta = (follower:Following)=>{
        const accessToken = localStorage.getItem('access')
        if(accessToken && isTokenExpired(accessToken)){
            console.log(userProfile.user.id,follower.following_id)
            if(userProfile && follower.following_id == userProfile.user.id){
                return (
                    <button className="text-white text-sm font-semibold bg-[#7F265B] px-2 py-1 rounded-md h-fit">You</button>
                )
            }else{
                if(follower.is_following){
                    return (
                        <button className="text-white text-sm font-semibold bg-[#7F265B] px-2 py-1 rounded-md h-fit">Following</button>
                    )
                }else{
                    return (
                        <button className="text-white text-sm font-semibold bg-[#7F265B] px-2 py-1 rounded-md h-fit">Follow</button>
                    )
                }
            }
        }else{
            return (
                <button className="text-white text-sm font-semibold bg-[#7F265B] px-2 py-1 rounded-md h-fit">Follow</button>
            )
        }
    }

    return (
        <div className="fixed w-full h-screen inset-0 overflow-hidden bg-black/30 z-[80] flex justify-center items-center" onClick={()=>setShowFollowing(false)}>
            <div className="w-[90%] md:w-[30%] min-h-[80dvh]  flex flex-col bg-white rounded-md items-center" onClick={(e)=>e.stopPropagation()}>
                <p className="text-2xl font-semibold text-[#7F265B] mt-8 mb-4">Following List</p>

            { following && following.length > 0 && following.map((follower:Following)=>{

                return (
                    <div key={follower.id} className="flex w-[80%] items-center justify-between ">
                        <div className="flex items-center gap-2">
                            <Image src={follower.avatar.startsWith('http') ? follower.avatar : `http://localhost:8000/media/${follower.avatar}` } width={40} height={40} alt="Follower's profile avatar" />
                            <p className="text-lg font-medium text-[#7F265B] ">{follower.username}</p>
                        </div>
                        {renderCta(follower)}
                    </div>
                )
                })

                }
            </div>
        </div>
    )
}