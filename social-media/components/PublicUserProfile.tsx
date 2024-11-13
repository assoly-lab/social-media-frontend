'use client'

import { useParams, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { Follower, Following, PostType, PublicProfile } from "@/utils/Types"
import Image from "next/image"
import { HashLoader } from "react-spinners"
import { fetchWithAuth } from "@/utils/Helpers"
import toast from "react-hot-toast"
import Post from "./feed/Post"
import { AppContext } from "@/contexts/AppContext"
import { SlUserFollow, SlUserFollowing } from "react-icons/sl"
import { BiMessageRoundedDetail } from "react-icons/bi"
import FollowersList from "./profile/FollowersList"
import FollowingList from "./profile/FollowingList"
import { SocketContext } from "@/contexts/SocketContext"






export default function PublicUserProfile(){

    const params = useParams<{id:string}>()
    const {userProfile} = useContext(AppContext)
    const router = useRouter()
    const [publicUserProfile,setPublicUserProfile] = useState<PublicProfile>()
    const [loadingPosts, setLoadingPosts] = useState<Boolean>(true)
    const [postsList,setPostsList] = useState<PostType[]>()
    const [showFollowers,setShowFollowers] = useState<Boolean>(false)
    const [showFollowing,setShowFollowing] = useState<Boolean>(false)
    const [followers,setFollowers] = useState<Follower[]>([])
    const [following,setFollowing] = useState<Following[]>([])
    const {setSelectedUser} = useContext(SocketContext)






    useEffect(()=>{
        const handleProfileRedirect = ()=>{
            if(userProfile){
                if(userProfile.user.id == params.id){
                    router.push('/profile')}
            }
        }
        handleProfileRedirect()

    },[userProfile])

    useEffect(()=>{
        const getFollowersList = async()=>{
            try{
                const response = await fetch(`http://localhost:8000/api/followers/${params.id}`,{
                    headers:{
                        'Content-Type':'application/json',
                    }
                })
                if(!response.ok){
                    const error = await response.json()
                    throw new Error(error)
                }
                const data = await response.json()
                setFollowers(data.results)


            }catch(e){
                const error = e as Error
                toast.error(error.message) 
            }
        }
        getFollowersList()

    },[])


    useEffect(()=>{
        const getFollowingList = async()=>{
            try{
                const response = await fetch(`http://localhost:8000/api/following/${params.id}`,{
                    headers:{
                        'Content-Type':'application/json',
                    }
                })
                if(!response.ok){
                    const error = await response.json()
                    throw new Error(error)
                }
                const data = await response.json()
                setFollowing(data.results)


            }catch(e){
                const error = e as Error
                toast.error(error.message) 
            }
        }
        getFollowingList()

    },[])

    useEffect(()=>{
        const acccessToken = localStorage.getItem('access')
        const getUserProfile = async (userId:string)=>{
            if(acccessToken){
            try{
                const response = await fetchWithAuth(`http://localhost:8000/api/get/public_profile/${userId}/`)
                if(!response.ok){
                    throw new Error('Something went wrong')
                }
                const data = await response.json()
                setPublicUserProfile(data)
            }catch(e){
                const error = e as Error
                return error.message
            }
        }else{
            try{
                const response = await fetch(`http://localhost:8000/api/get/public_profile/${userId}/`,{
                headers: {
                    'Content-Type':'application/json',
                }
                })
                if(!response.ok){
                    throw new Error('Something went wrong')
                }
                const data = await response.json()
                setPublicUserProfile(data)
            }catch(e){
                const error = e as Error
                return error.message
            }
        }
            
        }
        getUserProfile(params.id)
    },[])


    useEffect(()=>{
        const getPostsList = async ()=>{
            const accessToken = localStorage.getItem('access')
            if (accessToken){
                try {
                    const response = await fetchWithAuth(`http://localhost:8000/api/posts/get/${params.id}/`)
                    if(!response.ok){
                        const data = await response.json()
                        setLoadingPosts(false)
                        toast.error(JSON.stringify(data))
                    }
                    const data = await response.json()
                    setLoadingPosts(false)
                    setPostsList(data.results)
    
                }catch(e){
                    const error = e as Error
                    setLoadingPosts(false)
                    toast.error(error.message)
                }
            }else{
                try {
                    const response = await fetch(`http://localhost:8000/api/posts/get/${params.id}/`)
                    if(!response.ok){
                        const data = await response.json()
                        setLoadingPosts(false)
                        toast.error(JSON.stringify(data))
                    }
                    const data = await response.json()
                    setLoadingPosts(false)
                    setPostsList(data.results)
    
                }catch(e){
                    const error = e as Error
                    setLoadingPosts(false)
                    toast.error(error.message)
                }
            }
        }

        getPostsList()
    },[])

    const handleFollow = async()=>{
        const accessToken = localStorage.getItem('access')
        if(accessToken){
        if(publicUserProfile && publicUserProfile.is_following){
            try{
                const response = await fetchWithAuth('http://localhost:8000/api/unfollow/',{
                    method: 'DELETE',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({'user_id':publicUserProfile?.user.id})
                })
                if(!response.ok){
                    const error = await response.json()
                    throw new Error(error)
                }

                const data = await response.json()
                setPublicUserProfile(data)

            }catch(e){
                const error = e as Error
                toast.error(error.message)
            }
        }else if(publicUserProfile && !publicUserProfile.is_following){
            try{
                    const response = await fetchWithAuth('http://localhost:8000/api/follow/',{
                        method: 'POST',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify({'user_id':publicUserProfile?.user.id})
                    })
                    if(!response.ok){
                        const error = await response.json()
                        throw new Error(error)
                    }

                    const data = await response.json()
                    setPublicUserProfile(data)

                }catch(e){
                    const error = e as Error
                    toast.error(error.message)
                }
            }
        }else{
            toast.error('You need to login to be able to follow someone!')
        }
    }

    const handleMessage = ()=>{
        setSelectedUser({
            'id':publicUserProfile?.user.id,
            'username':publicUserProfile?.user.username,
            'avatar':publicUserProfile?.avatar
        })
        router.push('/chat')
    }


    return (
        <>
        {showFollowing && 
        <FollowingList following={following} setShowFollowing={setShowFollowing} />
        }
        {showFollowers && 
            <FollowersList followers={followers} setShowFollowers={setShowFollowers} />
        }
            <div className="relative w-[90%] md:w-[40%] min-h-[80vh] bg-white rounded-lg mt-20">
                {publicUserProfile &&
                <>
                    <Image 
                        className="rounded-full absolute left-[50%] translate-x-[-50%] translate-y-[-45%] border-2 border-[#7F265B] cursor-pointer w-[150px] h-[150px] object-cover" 
                        src={publicUserProfile.avatar.startsWith('http') ? publicUserProfile.avatar : `http://localhost:8000${publicUserProfile.avatar}`} width={150} height={150} alt="user profile image" 
                        priority
                        />
                    <p className="text-2xl text-black font-semibold text-center mt-20 capitalize  ">{publicUserProfile.user.first_name} {publicUserProfile.user.last_name}</p>
                    <p className="text-base text-gray-400 text-center ">@{publicUserProfile.user.username} </p>
                    <p className="text-center">Bio:</p>
                    <p className="mx-auto text-sm text-gray-400 w-[200px]">{publicUserProfile.bio ? publicUserProfile.bio : 'Empty bio'}</p>
                    <div className="w-full flex justify-center gap-4 mt-4">
                        <div className="rounded-md hover:bg-slate-100 p-2 cursor-pointer" onClick={()=>setShowFollowers(true)}>
                            <p className="font-semibold">Followers</p>
                            <p className="text-center font-semibold">{publicUserProfile.followers_count}</p>
                        </div>
                        <div className="w-[3px] bg-black "></div>
                        <div className="rounded-md hover:bg-slate-100 p-2 cursor-pointer" onClick={()=>setShowFollowing(true)}>
                            <p className="font-semibold">Following</p>
                            <p className="text-center font-semibold">{publicUserProfile.following_count}</p>
                        </div>
                    </div>
                    {userProfile &&
                    <div className="w-full flex justify-center gap-4 mt-4">
                        {publicUserProfile.is_following ?
                        
                        <button onClick={()=>handleFollow()} className="p-2 text-white bg-[#7F265B] flex gap-1 font-medium rounded-md" >
                            <SlUserFollowing className="w-5 h-5 " /> Following
                        </button>
                        :
                        <button onClick={()=>handleFollow()} className="p-2 text-white bg-[#7F265B] flex gap-1 font-medium rounded-md" >
                            <SlUserFollow className="w-5 h-5 " /> Follow
                        </button>
                        }
                        <button  className="relative p-2 text-white bg-[#7F265B] flex gap-1 font-medium rounded-md" onClick={()=>{
                            if(!publicUserProfile.is_following) {
                                return toast.error('You can only message people that follows you!')
                            }else{
                                handleMessage()
                            }


                            }} >
                            <BiMessageRoundedDetail className="w-5 h-5 mt-1" /> Message
                        </button>
                    </div>}
                    <div className="w-full flex justify-center mt-6">
            {loadingPosts &&
                <div className="w-full py-16 flex flex-col items-center justify-center gap-4">
                    <HashLoader color="#7F265B" className="w-[50%]"  />
                    <p className="text-lg text-[#7F265B] font-medium">Loading posts...</p>
                </div>
                    }
                {!loadingPosts && 
                <div className="w-[98%] md:w-full pb-12 mt-12">
                    {postsList && postsList.length > 0 &&
                        postsList.map((post:PostType)=>{
                            return(
                                <div key={post.id} className="w-full flex flex-col items-center gap-2 mb-12">
                                    <Post  post={post} />
                                </div>
                            )
                        })
                        
                    }
                </div>}
                    </div>
                </>
                }
            </div>
        </>
    )
}











