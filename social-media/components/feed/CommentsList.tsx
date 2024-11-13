import  { CommentType } from "@/utils/Types";
import Comment from "@/components/feed/Comment"
import React, { useState } from "react";



export default function CommentsList({comments,setComments,postId,setCommentsCount}:{comments:CommentType[],setComments:React.Dispatch<React.SetStateAction<CommentType[]>>,postId:number,setCommentsCount:React.Dispatch<React.SetStateAction<number>>}){ 
    return (
        <div className="w-[90%] flex flex-col gap-4">
            {comments.length > 0 && 
            comments.map((comment:CommentType)=>{
                return (
                    <Comment key={comment.id} comment={comment} postId={postId} setComments={setComments} setCommentsCount={setCommentsCount} />
                )
            })
            }

        </div>
    )
}