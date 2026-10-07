export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="andean relative overflow-hidden py-14 text-cream md:py-20">
      <div className="relative mx-auto w-[min(1180px,calc(100%-40px))]">
        <span className="mb-4 block text-[10px] font-extrabold uppercase tracking-[2.8px] text-[#e4b768]">{eyebrow}</span>
        <h1 className="max-w-3xl text-4xl tracking-tight md:text-6xl">{title}</h1>
        {children && <div className="mt-5 max-w-xl text-sm leading-relaxed text-[#dac8b1]">{children}</div>}
      </div>
    </section>
  );
}

export function Wrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-[min(1180px,calc(100%-40px))] ${className}`}>{children}</div>;
}

export function DemoNote() {
  return (
    <p className="my-5 text-[11px] text-[#786746]">
      ⓘ Vista de demostración: restaurantes, precios y sellos de ejemplo. No se ha verificado disponibilidad real.
    </p>
  );
}
