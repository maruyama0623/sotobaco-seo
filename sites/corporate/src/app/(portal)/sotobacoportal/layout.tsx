"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PortalHeader from "@/components/layout/PortalHeader";
import PortalFooter from "@/components/layout/PortalFooter";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const useCorporate = pathname.startsWith("/sotobacoportal/contact");

  return (
    <>
      {useCorporate ? <Header /> : <PortalHeader />}
      <main className="flex-1">{children}</main>
      {useCorporate ? <Footer /> : <PortalFooter />}
    </>
  );
}
