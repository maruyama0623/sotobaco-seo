import PortalHeader from "@/components/layout/PortalHeader";
import PortalFooter from "@/components/layout/PortalFooter";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PortalHeader />
      <main className="flex-1">{children}</main>
      <PortalFooter />
    </>
  );
}
