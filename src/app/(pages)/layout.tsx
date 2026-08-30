import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { SheetMotion } from "@/components/SheetMotion";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <SheetMotion />
      {children}
      <Footer />
    </>
  );
}
