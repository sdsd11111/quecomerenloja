import Link from "next/link";
import { Wrap } from "@/components/PageHero";

export default function NotFound() {
  return (
    <Wrap className="py-24 text-center">
      <h1 className="text-5xl">Ese plato no está en el menú.</h1>
      <p className="mt-4 text-muted">La página que buscas no existe o cambió de lugar.</p>
      <Link href="/" className="mt-8 inline-block rounded-lg bg-clay px-6 py-3 text-sm font-bold text-white">Volver al inicio →</Link>
    </Wrap>
  );
}
