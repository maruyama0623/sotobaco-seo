import BtoneHeader from "@/components/layout/BtoneHeader";
import Footer from "@/components/layout/Footer";

export default function BtoneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BtoneHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
