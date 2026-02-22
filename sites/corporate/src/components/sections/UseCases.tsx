"use client";

import Image from "next/image";
import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

const patterns = [
  {
    label: "パターン 01",
    title: "業務別にタブを整理",
    description:
      "仕入・在庫、受注・出荷、顧客対応など、業務の流れごとにタブを分けて整理。部署に関係なく、今やる業務のタブを開くだけで必要なアプリがすぐ見つかります。",
    image: "/images/portal/usecase_task-based.png",
    imageAlt: "業務別にタブを整理したソトバコポータルの画面例",
  },
  {
    label: "パターン 02",
    title: "部署別にタブを見せ分け",
    description:
      "営業部・総務部・経理部など、部署ごとに閲覧権限を設定。自分の部署に関係のあるタブだけが表示されるので、アプリを探す手間がなくなります。",
    image: "/images/portal/usecase_department.png",
    imageAlt:
      "部署別に閲覧権限を設定したソトバコポータルの画面例。営業部と総務部で表示が異なる",
  },
  {
    label: "パターン 03",
    title: "取引先別にタブを管理",
    description:
      "取引先やクライアントごとにタブを作成。関連するアプリ・資料・外部リンクをひとつのタブに集約でき、担当する取引先の情報にすぐアクセスできます。",
    image: "/images/portal/usecase_client-based.png",
    imageAlt: "取引先別にタブを管理しているソトバコポータルの画面例",
  },
  {
    label: "パターン 04",
    title: "全社共有 + 部署ポータル",
    description:
      "メインポータルには全社アナウンスやスペースリンクなど共通情報だけを配置。部署ごとの業務アプリはスペース単位ポータルで管理し、情報を分離できます。",
    image: "/images/portal/usecase_space-portal.png",
    imageAlt:
      "全社共有ポータルとスペース単位の部署ポータルを組み合わせた活用例",
  },
];

export default function UseCases() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <SectionWrapper bg="gray">
      <SectionHeader
        label="活用パターン"
        title="さまざまなポータル構成に対応"
        description="タブの分け方や閲覧権限の組み合わせで、自社に合ったポータル構成を実現できます。"
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {patterns.map((pattern) => (
          <div
            key={pattern.label}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <button
              type="button"
              className="relative aspect-square w-full cursor-zoom-in bg-gray-50"
              onClick={() => setLightbox(pattern.image)}
            >
              <Image
                src={pattern.image}
                alt={pattern.imageAlt}
                fill
                className="rounded-t-2xl object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </button>
            <div className="p-6">
              <span className="text-xs font-bold tracking-wider text-brand">
                {pattern.label}
              </span>
              <h3 className="mt-2 text-lg font-extrabold text-gray-900">
                {pattern.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {pattern.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-3xl text-white hover:text-gray-300"
            onClick={() => setLightbox(null)}
          >
            &times;
          </button>
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <img
              src={lightbox}
              alt=""
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
