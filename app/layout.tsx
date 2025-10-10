import {
  Work_Sans,
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Poppins,
  Playfair_Display,
  Merriweather,
  Lora,
  Fira_Code,
  Source_Code_Pro,
  JetBrains_Mono,
  Pacifico,
  Dancing_Script,
} from "next/font/google";

import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata = {
  title: "NeoLive - Real-time Collaborative Design",
  description:
    "NeoLive: Real-time collaborative design platform with advanced editing tools, real-time collaboration, and professional design features",
};

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  weight: ["300", "400", "700"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  variable: "--font-pacifico",
  weight: ["400"],
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
});

const fontVariables = `${workSans.variable} ${inter.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${montserrat.variable} ${poppins.variable} ${playfairDisplay.variable} ${merriweather.variable} ${lora.variable} ${firaCode.variable} ${sourceCodePro.variable} ${jetbrainsMono.variable} ${pacifico.variable} ${dancingScript.variable}`;

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <body
      className={`${workSans.className} ${fontVariables} bg-primary-grey-200`}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </body>
  </html>
);

export default RootLayout;
