import Image from "next/image"
import RegisterSvg from "@/public/register.svg"
import RegisterForm from "@/components/register/RegisterForm"




export default async function RegisterPage(){


    return (
        <div className="w-full h-auto md:h-screen py-28 md:py-12 flex justify-center items-center bg-[#ffe5c4]">
            <div className="w-[90%] h-screen md:w-[90%] md:h-[90%] flex flex-col md:flex-row justify-center items-center rounded-t-xl">
            <div className="hidden md:w-[40%] md:flex h-full justify-center items-center rounded-tl-xl  rounded-bl-xl bg-[#F7D6BA] bg-clip-padding backdrop-filter backdrop-blur-lg border-8 border-white">
                <Image src={RegisterSvg} alt="Login background" width={600} height={600} />
            </div>
                <RegisterForm />
            </div>
        </div>
    )
}