import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/blog";
import { PageHero, Wrap } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Blog: guías para comer en Loja",
  description: "Guías sobre qué comer en Loja, café de Loja, comida tradicional y cómo publicar tu menú del día.",
  alternates: { canonical: "/blog" },
};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="BLOG" title={<>Crónicas de la <em className="text-[#e1b45f]">Ruta Gastronómica</em></>}>
        Guías cortas para comer bien en Loja.
      </PageHero>
      <Wrap className="grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-2xl border border-[#e7decc] bg-paper p-7 transition hover:-translate-y-1 hover:shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-clay">{p.tag}</span>
            <h2 className="mt-2 text-2xl">{p.title}</h2>
            <p className="mt-3 text-sm text-muted">{p.excerpt}</p>
            <p className="mt-4 text-[11px] text-muted">{p.date} · {p.readMinutes} min de lectura</p>
          </Link>
        ))}
      </Wrap>
    </>
  );
}
