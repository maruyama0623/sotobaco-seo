export default function ArticleBody({ html }: { html: string }) {
  return (
    <div
      className="prose prose-gray lg:prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-brand hover:prose-a:text-brand-dark prose-img:rounded-lg"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
