type Props = {
  label: string;
  title: string;
  description?: string;
};

export default function SectionHeader({ label, title, description }: Props) {
  return (
    <div className="text-center">
      <span className="text-sm font-bold text-brand">{label}</span>
      <h2 className="mt-2 text-2xl font-extrabold text-gray-900 md:text-3xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-brand" />
      {description && (
        <p className="mx-auto mt-6 max-w-[640px] text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
}
