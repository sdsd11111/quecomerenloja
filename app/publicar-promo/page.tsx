import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PublicarPromoForm } from './PublicarPromoForm';

export const metadata: Metadata = {
  title: 'Publicar Promoción o Evento | Qué Comer en Loja',
  description: 'Espacio exclusivo para restaurantes y cafeterías aliadas de Loja. Publica tus ofertas, eventos y novedades.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PublicarPromoPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] py-12 sm:py-16">
      <Suspense fallback={<div className="text-center py-20 text-muted">Cargando formulario...</div>}>
        <PublicarPromoForm />
      </Suspense>
    </main>
  );
}
