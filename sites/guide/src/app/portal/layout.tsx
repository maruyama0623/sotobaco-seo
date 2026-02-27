import Sidebar from "@/components/layout/Sidebar";
import { portalNavigation } from "@/lib/navigation";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-[1200px] gap-8 px-4 py-8">
      <aside className="hidden w-[280px] shrink-0 lg:block">
        <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain">
          <Sidebar navigation={portalNavigation} />
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
