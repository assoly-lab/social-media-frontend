import LoginForm from "@/components/login/LoginForm";
import Image from "next/image";
import LoginSvg from "@/public/login.svg" 








export default async function LoginPage(){

    return (
        <div className="w-full md:h-screen flex justify-center items-center bg-[#ffe5c4]">
            <div className="w-[90%] h-screen md:w-[90%] md:h-[90%] flex flex-col md:flex-row justify-center items-center rounded-t-xl">
            <div className="hidden md:w-[60%] md:flex h-full justify-center items-center rounded-tl-xl  rounded-bl-xl bg-[#F7D6BA] bg-clip-padding backdrop-filter backdrop-blur-lg border-8 border-white">
                <Image src={LoginSvg} alt="Login background" width={600} height={600} />
            </div>
            <LoginForm />
            </div>
        </div>
    )
}