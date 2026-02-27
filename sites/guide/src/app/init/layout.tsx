export default function InitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-8">
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
