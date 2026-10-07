import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost } from "@/lib/blog";
import { PageHero, Wrap } from "@/components/PageHero";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, alternates: { canonical: `/blog/${p.slug}` } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  return (
    <>
      <PageHero eyebrow={p.tag.toUpperCase()} title={p.title}>
        {p.date} · {p.readMinutes} min de lectura
      </PageHero>
      <Wrap className="max-w-[720px] py-12">
        <article className="space-y-5">
          {p.body.map((b, i) => (
            <div key={i}>
              {b.h && <h2 className="mb-2 mt-6 text-2xl">{b.h}</h2>}
              <p className="text-[15px] text-ink/80">{b.p}</p>
            </div>
          ))}
        </article>
        <div className="mt-10 flex flex-wrap gap-4 border-t border-line pt-6 text-sm">
          <Link href="/blog" className="font-semibold text-clay underline">← Volver al blog</Link>
          <Link href="/buscar" className="font-semibold text-clay underline">Buscar un plato →</Link>
        </div>
      </Wrap>
    </>
  );
}
