import ServiceCard from "@/components/guide/ServiceCard";

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-12">
      <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
        操作ガイド
      </h1>
      <p className="mb-10 text-center text-sm text-gray-600">
        ご利用中のサービスを選択してください
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        <ServiceCard
          title="ソトバコポータル"
          description="kintoneのポータルをカスタマイズするサービスの操作ガイドです。"
          href="/portal/"
          imageSrc="/images/portal/smartphone_multi-device.png"
          imageAlt="ソトバコポータル"
        />
        <ServiceCard
          title="Btone"
          description="Bカートとkintoneを連携するサービスの操作ガイドです。"
          href="/btone/"
          imageSrc="/images/btone/about_data-flow.png"
          imageAlt="Btone"
        />
      </div>
    </div>
  );
}
