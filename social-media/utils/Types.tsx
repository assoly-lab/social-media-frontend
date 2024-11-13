

export type LoginErrorsType = {
    general?:string,
    username?:string,
    password?:string,

}


export type RegisterErrorsType = {
    general?:string,
    first_name?:string,
    last_name?:string,
    email?:string,
    username?:string,
    password?:string,
    re_password?:string
}


type User = {
    email:string,
    first_name?:string,
    id:number,
    last_name?:string,
    username:string
}


export type CommentType ={
    id:number,
    content:string,
    post:number,
    author:UserData,
    likes:number,
    parent: number | null; 
    replies:CommentType[] | [],
    is_liked:Boolean,
    created_at:string,
}



export type UserData = {
    id:number,
    avatar:string,
    bio?:string,
    user:User,
    following_count?:number,
    followers_count?:number
}




export type UpdateProfileErrorsType = {
        general?:string,
        avatar?: File,
        first_name?:string,
        last_name?:string,
        email?:string,
        username?:string,
        password?:string,
        re_password?:string
    
    }


export type Media = {
    id:number,
    media_type:'image' | 'video',
    file:string
}

export type PostType = {
    author?:Author,
    id?:number,
    content?:string,
    media:Media[] | [],
    is_public:Boolean,
    is_liked?:Boolean,
    likes?:number,
    comments:CommentType[] | [],
    comments_count?:number,
    created_at?:string,
    updated_at?:string,
}


type Author = {
    email?:string,
    username?:string,
    first_name ?:string,
    last_name?:string,
    followers_count?:number,
    following_count?:number,
    id:number,
    userprofile?:{
        bio?:string,
        avatar:string,
    },


}

type PublicUser = {
    first_name: string,
    id: number,
    last_name: string,
    username: string,
}


export type PublicProfile = {
    id:number,
    avatar:string,
    bio?:string,
    user:PublicUser,
    following_count?:number,
    followers_count?:number,
    is_following:Boolean,
}


export type Follower = {
    id:number,
    follower_id:number,
    avatar:string,
    username:string,
    is_following:Boolean,
    created_at:string,
}



export type Following = {
    id:number,
    following_id:number,
    avatar:string,
    username:string,
    is_following:Boolean,
    created_at:string,
}



export type Notification = {
    id:number,
    user:User,
    avatar:string,
    post?:PostType,
    message:string,
    is_read:Boolean,
    timestamp:string,
}

export type MessagePayload = {
        id:number,
        content:string,
        sender:UserData,
        is_read:Boolean,
        created_at:string,
    }



export type MessageType = {
    [user_id:number]: MessagePayload[] 
   
}




export type UnreadMessagescounterType = {
    [userId:number]:number,
}



export type UserDiscussion = {
    id:number,
    username:string,
    avatar:string,
    unread_count:number,
}