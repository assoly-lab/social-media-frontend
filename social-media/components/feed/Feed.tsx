

import SideBar from "../navigation/SideBar";
import CreatePostForm from "./CreatePostForm";
import PostsList from "./PostsList";





export default function Feed(){


    return (
        <div className="flex w-[95%] md:w-[80vw]  gap-4 justify-center pt-12" >
            <SideBar />
            <div className="w-[95%] md:w-[50%]  flex flex-col gap-2">
                <div className="w-full bg-white">
                <div className="w-[98%]  mt-4 flex gap-2  pb-4" >
                    <CreatePostForm />
                </div>
                </div>
                <div className="w-full bg-white">
                    <PostsList />
                </div>
            </div>
            <div className="hidden md:block w-[25%] h-[32vh] bg-white">

            </div>
        </div>
    )

}