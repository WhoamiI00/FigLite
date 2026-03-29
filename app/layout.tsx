import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata = {
  title: "NeoLive - Real-time Collaborative Design",
  description:
    "NeoLive: Real-time collaborative design platform with advanced editing tools, real-time collaboration, and professional design features",
};

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?" +
  "family=Work+Sans:wght@400;600;700" +
  "&family=Inter:wght@300;400;500;600;700" +
  "&family=Roboto:wght@300;400;500;700" +
  "&family=Open+Sans:wght@300;400;500;600;700" +
  "&family=Lato:wght@300;400;700" +
  "&family=Montserrat:wght@300;400;500;600;700" +
  "&family=Poppins:wght@300;400;500;600;700" +
  "&family=Playfair+Display:wght@400;500;600;700" +
  "&family=Merriweather:wght@300;400;700" +
  "&family=Lora:wght@400;500;600;700" +
  "&family=Fira+Code:wght@400;500;600;700" +
  "&family=Source+Code+Pro:wght@400;500;600;700" +
  "&family=JetBrains+Mono:wght@400;500;600;700" +
  "&family=Pacifico" +
  "&family=Dancing+Script:wght@400;500;600;700" +
  "&display=swap";

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <head>
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link
        rel='preconnect'
        href='https://fonts.gstatic.com'
        crossOrigin='anonymous'
      />
      <link href={GOOGLE_FONTS_URL} rel='stylesheet' />
    </head>
    <body className='bg-primary-grey-200'>
      <TooltipProvider>{children}</TooltipProvider>
    </body>
  </html>
);

export default RootLayout;
