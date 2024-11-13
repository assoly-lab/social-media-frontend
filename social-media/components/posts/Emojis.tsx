'use client'

import EmojiPicker from 'emoji-picker-react';
import {EmojiStyle} from 'emoji-picker-react'

import { MutableRefObject, useState } from 'react';


export default function Emojis({inputRef,access}:{inputRef:MutableRefObject<HTMLTextAreaElement | null>,access:string | null}){
    const [isOpen,setIsOpen] = useState<boolean>(false)
    return (
        <>
            <p className='relative cursor-pointer hidden md:block' style={{pointerEvents:access ? 'auto' : 'none'}} onClick={()=>setIsOpen(!isOpen)} >😄
            <span style={{position:'absolute',top:0,left:'25px'}} onClick={(e)=>e.stopPropagation()}>
            <EmojiPicker  open={isOpen} emojiStyle={EmojiStyle.NATIVE} onEmojiClick={(emoji)=>{
                console.log(emoji)
                if(inputRef.current){
                    inputRef.current.value += emoji.emoji
                }
            }}  />
            </span>
            </p>
        </>
    )
}