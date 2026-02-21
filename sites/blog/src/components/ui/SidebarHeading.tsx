export default function SidebarHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mb-3 text-sm font-bold text-gray-700">{children}</p>
  );
}
