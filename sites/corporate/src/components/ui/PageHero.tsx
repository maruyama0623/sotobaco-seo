type Props = {
  title: string;
  description: React.ReactNode;
};

export default function PageHero({ title, description }: Props) {
  return (
    <section className="bg-gradient-to-b from-brand-light to-white py-16 md:py-20">
      <div className="mx-auto max-w-[800px] px-4 text-center">
        <h1 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl md:leading-tight">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      </div>
    </section>
  );
}
