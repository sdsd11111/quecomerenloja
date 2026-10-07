import Link from "next/link";
import { CATEGORIES } from "@/lib/site";
import { POPULAR_DISHES } from "@/lib/data";
import { listRestaurants } from "@/lib/repository";
import { RestaurantCard } from "@/components/RestaurantCard";
import { OpenChatButton } from "@/components/OpenChatButton";
import { DemoNote, Wrap } from "@/components/PageHero";
import { POSTS } from "@/lib/blog";

const STEPS = [
  { icon: "🔍", t: "Busca lo que se te antoja", d: "Por plato, zona o ingrediente. Un repe blanco, una buena cecina o ese café que te hace parar." },
  { icon: "📋", t: "El menú de hoy, a la vista", d: "Consulta el menú del día y sus precios. Sabes qué hay antes de llegar." },
  { icon: "💬", t: "Habla directo, come feliz", d: "Escribe al restaurante por WhatsApp para consultar, reservar o pedir. Sin apps ni comisiones." },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = (await listRestaurants()).slice(0, 3);
  return (
    <>
      <section className="andean relative overflow-hidden py-16 text-cream md:py-24">
        <Wrap className="relative grid items-center gap-8 md:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#a17651]/30 px-3 py-1.5 text-[10px] tracking-wider text-[#e6d7bc]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#deb15e]" /> LOJA, ECUADOR · SABORES CON IDENTIDAD
            </div>
            <h1 className="max-w-[650px] text-[clamp(43px,5.2vw,72px)] tracking-[-2.5px]">
              La Ruta Gastronómica de Loja, <em className="font-medium text-[#e1b45f]">en tu bolsillo.</em>
            </h1>
            <p className="mt-6 max-w-[470px] text-sm leading-[1.9] text-[#dac8b1]">
              Encuentra dónde comer hoy. Menús del día actualizados. Contacto directo con el restaurante. Sin comisiones.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href="/menu-del-dia" className="rounded-lg bg-cream px-5 py-3.5 text-[13px] font-bold text-clay transition hover:-translate-y-0.5">Descubre qué comer hoy →</Link>
              <Link href="/para-negocios" className="rounded-lg border border-[#b99871]/30 px-5 py-3.5 text-[13px] font-bold">¿Tienes un restaurante? Únete →</Link>
            </div>
            <p className="mt-8 text-[11px] text-[#cdbca7]">☕ 🌽 🍽 &nbsp; Sabores locales. Contacto directo. Cero apps.</p>
          </div>
          <div className="relative mx-auto grid h-[380px] w-full max-w-[460px] place-items-center md:h-[460px]" aria-hidden>
            <div className="absolute h-[380px] w-[380px] rounded-full border border-[#c7955d]/20 md:h-[450px] md:w-[450px]" />
            <div
              className="relative h-[290px] w-[290px] rotate-[-12deg] rounded-full shadow-[18px_26px_55px_#140a0977,inset_0_0_20px_#fff5d0] md:h-[345px] md:w-[345px]"
              style={{ background: "repeating-radial-gradient(circle,#f3e5c9 0 5px,#ddc9a4 6px 7px,#f1e3c8 8px 17px)" }}
            >
              <div className="absolute inset-9 rounded-full border-2 border-[#d5bc8c] bg-[#f2dfb9]" />
              <div className="absolute left-[14%] top-[19%] h-[36%] w-[36%] rotate-[23deg] rounded-full" style={{ background: "repeating-linear-gradient(24deg,#e9d09d 0 2px,#fff0c6 3px 6px,#e2c894 7px 8px)" }} />
              <div className="absolute right-[12%] top-[31%] h-[43%] w-[38%] rotate-[-24deg] rounded-[35%_45%_28%_40%]" style={{ background: "repeating-linear-gradient(35deg,transparent 0 14px,#45241899 15px 19px,transparent 20px 27px),radial-gradient(ellipse at 35% 30%,#c18047,#914223 65%,#51281d)" }} />
              <div className="absolute bottom-[16%] left-[20%] h-[24%] w-[30%] rounded-full" style={{ background: "radial-gradient(circle at 25% 45%,#c75a31 0 13px,transparent 14px),radial-gradient(circle at 70% 70%,#c74e27 0 15px,transparent 16px),repeating-conic-gradient(from 25deg,#527a3a 0 17deg,#79944c 18deg 33deg,#3e622e 34deg 50deg)" }} />
            </div>
            <div className="absolute bottom-10 left-0 rotate-[-5deg] rounded-xl bg-[#fff7e9] p-4 text-[11px] text-ink shadow-xl">
              <small className="text-muted">EL SABOR DE NUESTRA TIERRA</small>
              <strong className="block font-serif text-xl">Cecina lojana</strong>
              <small className="text-muted">Tradición que se comparte.</small>
            </div>
            <div className="absolute right-0 top-10 rotate-[5deg] rounded-xl bg-[#dbad59] p-4 text-[11px] text-[#3b2810] shadow-xl">
              <small>HECHO PARA DESCUBRIR</small>
              <strong className="block font-serif text-base">Sin apps. Sin comisiones.</strong>
            </div>
            <span className="absolute bottom-0 right-5 text-[9px] text-[#d4b897]">Bodegón ilustrado con CSS · No es una fotografía</span>
          </div>
        </Wrap>
      </section>

      <Wrap className="relative z-[4] -mt-12">
        <form action="/buscar" role="search" className="flex items-center gap-3.5 rounded-2xl border border-[#e7ddc9] bg-paper px-7 py-5 shadow-[0_14px_40px_#37200b0c]">
          <span aria-hidden className="text-2xl text-clay">⌕</span>
          <label htmlFor="home-q" className="sr-only">Busca un platillo, restaurante o zona</label>
          <input id="home-q" name="q" type="search" placeholder="¿Qué se te antoja hoy? (ej: cecina, repe, café)" className="min-w-0 flex-1 bg-transparent py-3 text-[13px] outline-none placeholder:text-[#8a7b69]" />
          <button className="rounded-lg bg-clay px-6 py-3 text-[13px] font-bold text-white">Buscar →</button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2 px-1">
          {POPULAR_DISHES.map((d) => (
            <Link key={d} href={`/buscar?q=${encodeURIComponent(d)}`} className="rounded-full border border-[#e9dfce] px-3.5 py-1.5 text-[11px] text-[#6d604d] hover:bg-clay hover:text-white">{d}</Link>
          ))}
        </div>
      </Wrap>

      <Wrap className="pb-16 pt-14">
        <div className="mb-6 flex items-center justify-between gap-5">
          <h2 className="text-[28px] tracking-tight">Cada antojo, una nueva historia.</h2>
          <p className="hidden text-[11px] text-muted md:block">Explora el sabor de Loja a tu manera.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {CATEGORIES.map((c) => (
            <Link key={c.key} href={c.href} className={`${c.bg} relative min-h-[148px] overflow-hidden rounded-[13px] p-5 text-[#fff4e2] transition hover:-translate-y-1 md:min-h-[165px] md:p-6`}>
              <span aria-hidden className="mb-4 block text-3xl">{c.icon}</span>
              <span className="block font-serif text-xl font-semibold">{c.name}</span>
              <span className="mt-1 block text-[10px] opacity-75">{c.sub}</span>
              <span aria-hidden className="absolute bottom-5 right-5 text-xl">↗</span>
            </Link>
          ))}
        </div>
      </Wrap>

      <section className="bg-[#f5eddc] py-14 md:pb-20">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-[650px]">
              <span className="mb-4 block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">FRESCO, LOCAL Y SIN INTERMEDIARIOS</span>
              <h2 className="text-[clamp(32px,4vw,50px)] tracking-[-1.4px]">Menús del Día — <em>Actualizados hoy</em></h2>
              <p className="mt-4 text-sm text-muted">Los restaurantes verificados actualizan su menú enviando una nota de voz por WhatsApp.</p>
            </div>
            <Link href="/menu-del-dia" className="text-sm font-bold text-clay underline">Ver todos los menús →</Link>
          </div>
          <DemoNote />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((r) => <RestaurantCard key={r.slug} r={r} />)}
          </div>
        </Wrap>
      </section>

      <Wrap className="py-16">
        <div className="mx-auto max-w-[650px] text-center">
          <span className="mb-4 block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">MENOS VUELTAS. MÁS SABOR.</span>
          <h2 className="text-[clamp(32px,4vw,50px)] tracking-[-1.4px]">Encuentra tu mesa en 30 segundos</h2>
          <p className="mt-4 text-sm text-muted">Sin descargar nada. Sin intermediarios. Así de sencillo.</p>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-14">
          {STEPS.map((s, i) => (
            <article key={s.t} className="text-center">
              <div className="relative mx-auto mb-5 grid h-[67px] w-[67px] place-items-center rounded-full bg-[#eee3cd] text-[26px]">
                {s.icon}
                <span className="absolute -right-1 -top-1 grid h-[23px] w-[23px] place-items-center rounded-full border-[3px] border-cream bg-clay text-[9px] text-white">0{i + 1}</span>
              </div>
              <h3 className="text-[21px]">{s.t}</h3>
              <p className="mx-auto mt-3 max-w-[280px] text-xs text-muted">{s.d}</p>
            </article>
          ))}
        </div>
      </Wrap>

      <Wrap className="pb-16">
        <div className="grid items-center gap-8 rounded-[22px] border border-[#d6ddc7] bg-[#e8ecdd] p-7 md:grid-cols-[1fr_1.2fr] md:gap-16 md:p-14">
          <div className="max-w-[380px] rotate-[-3deg] rounded-2xl border border-[#dfe1d2] bg-paper p-6 shadow-lg md:order-none">
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-green font-serif text-[22px] italic text-white">g</span>
              <div>Tu compañero de ruta<small className="block text-[9px] font-normal text-green">Asesor GuIAloja · Ejemplo</small></div>
            </div>
            <div className="ml-6 mt-5 rounded-xl bg-green p-3.5 text-xs text-white">Quiero probar algo bien lojano 🌽</div>
            <div className="mt-3 rounded-xl bg-[#f0f1e7] p-3.5 text-xs text-[#526247]">El repe blanco con cecina es un gran comienzo. En esta demo, El Arenal tiene un almuerzo completo por $3.50.</div>
          </div>
          <div>
            <span className="mb-4 block text-[10px] font-extrabold uppercase tracking-[2.8px] text-green">UN LOCAL EN TU BOLSILLO</span>
            <h2 className="text-4xl tracking-tight">No sabes qué elegir. <em>Nosotros te orientamos.</em></h2>
            <p className="my-5 text-[13px] text-muted">Pregúntale a nuestro Asesor IA. Te recomienda según lo que tienes ganas de comer y, cuando haya datos reales, según qué restaurante te queda más cerca.</p>
            <OpenChatButton className="rounded-lg bg-green px-5 py-3.5 text-[13px] font-bold text-white">Preguntarle al asesor ↗</OpenChatButton>
            <small className="mt-3 block text-[10px] text-[#637054]">Recomendador demo. La IA en vivo y las distancias requieren datos y conexión de producción.</small>
          </div>
        </div>
      </Wrap>

      <section className="border-t border-line bg-[#f2e9d6] py-14">
        <Wrap>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-[28px] tracking-tight">Del blog: guías para comer en Loja</h2>
            <Link href="/blog" className="text-sm font-bold text-clay underline">Ver todo →</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {POSTS.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-2xl border border-[#e7decc] bg-paper p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-widest text-clay">{p.tag}</span>
                <h3 className="mt-2 text-xl">{p.title}</h3>
                <p className="mt-2 text-xs text-muted">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </Wrap>
      </section>
    </>
  );
}
