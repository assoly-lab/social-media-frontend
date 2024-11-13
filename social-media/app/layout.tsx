import NavBar from "@/components/navigation/NavBar";
import AppContextProvider from "@/contexts/AppContext";
import SocketContextProvider from "@/contexts/SocketContext";
import {montserrat} from "@/utils/Fonts"
import { Toaster } from "react-hot-toast";
import "./globals.css";





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SocketContextProvider>
        <AppContextProvider>
          <body
            className={montserrat.className}
          >
            <NavBar />
            <Toaster
                position="top-center"
                reverseOrder={false}
              />
            {children}
          </body>
        </AppContextProvider>
      </SocketContextProvider>
    </html>
  );
}
