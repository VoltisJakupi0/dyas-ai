import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SafariChrome } from "@/components/SafariChrome";
import { site } from "@/lib/site";
import { graphJsonLd, serializeJsonLd } from "@/lib/seo";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const mono = Geist_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#eeece7",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  appleWebApp: {
    statusBarStyle: "default",
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/**
 * Reloading the home page starts it from the top, so its scroll sequences
 * (which only play once, forward) replay from the start. Inline so it runs
 * before the browser restores the old scroll position; some browsers restore
 * it anyway, so until the first user input (or 2s after load) any such scroll
 * is sent back to the top. Restoration is then handed back for Back / Forward.
 */
const RELOAD_FROM_TOP = `try{(function(){var n=performance.getEntriesByType("navigation")[0];if(!n||n.type!=="reload"||location.pathname!=="/")return;history.scrollRestoration="manual";var inputs=["wheel","touchstart","pointerdown","keydown"];function top(){if(window.scrollY>0)window.scrollTo({top:0,left:0,behavior:"instant"})}function done(){removeEventListener("scroll",top,true);inputs.forEach(function(e){removeEventListener(e,done,true)});history.scrollRestoration="auto"}addEventListener("scroll",top,true);inputs.forEach(function(e){addEventListener(e,done,true)});addEventListener("load",function(){setTimeout(done,2000)})})()}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${mono.variable} bg-day text-black antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-day font-body text-black" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(graphJsonLd) }}
        />
        <script dangerouslySetInnerHTML={{ __html: RELOAD_FROM_TOP }} />
        <SafariChrome />
        {children}
      </body>
    </html>
  );
}
