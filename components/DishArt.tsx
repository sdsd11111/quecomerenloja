import type { DishStyle } from "@/lib/types";

const BG: Record<DishStyle, string> = {
  plate: "radial-gradient(ellipse at 45% 60%,#dcb674 0,transparent 55%),linear-gradient(145deg,#ad5938,#593323)",
  coffee: "radial-gradient(ellipse at 30% 30%,#d8b97d,transparent 60%),linear-gradient(125deg,#967145,#573b24)",
  traditional: "radial-gradient(ellipse at 20% 20%,#b38f54,transparent 60%),linear-gradient(135deg,#6c764e,#6c402a)",
  night: "radial-gradient(ellipse at 70% 30%,#4a6b78,transparent 60%),linear-gradient(135deg,#263a42,#14202a)",
  fine: "radial-gradient(ellipse at 30% 30%,#c9a35a,transparent 60%),linear-gradient(135deg,#6a2e22,#2c150f)",
};

const PLATE: Record<DishStyle, string> = {
  plate: "radial-gradient(circle,#94522d 0 32%,#c5924b 33% 44%,#efdfba 45% 56%,#cfb790 57% 59%,#f5e8cc 60%)",
  coffee: "radial-gradient(circle,#58301a 0 29%,#ae7c44 30% 32%,#f2dfb8 33% 40%,#d1b995 41% 43%,#f4e6c7 44% 59%,#ccb186 60% 61%,#ead7b1 62%)",
  traditional: "radial-gradient(circle,#b8783d 0 43%,#f5e7c8 44% 55%,#d7c398 56% 58%,#eee0bc 59%)",
  night: "radial-gradient(circle,#2f4a57 0 40%,#d9c28f 41% 50%,#f1e6cb 51% 60%)",
  fine: "radial-gradient(circle,#7a3a22 0 24%,#f5e8cc 25% 50%,#d7c398 51% 53%,#f1e3c8 54%)",
};

/** Ilustración generada con CSS (no es fotografía). Sustituir por fotos reales vía CDN. */
export function DishArt({ style, label, children }: { style: DishStyle; label: string; children?: React.ReactNode }) {
  return (
    <div role="img" aria-label={`Ilustración de ${label}`} className="relative h-[215px] overflow-hidden md:h-[215px]" style={{ background: BG[style] }}>
      <div
        aria-hidden
        className="absolute right-6 top-8 h-[175px] w-[175px] rotate-[-20deg] rounded-full shadow-[8px_15px_22px_#301e2055]"
        style={{ background: PLATE[style] }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#241711]/70 to-transparent" />
      {children}
    </div>
  );
}
