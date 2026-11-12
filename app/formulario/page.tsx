import type { Metadata } from 'next';
import FormularioAlta from '@/components/FormularioAlta';

export const metadata: Metadata = {
  title: 'Formulario de alta | Hazte aliado de Qué Comer en Loja',
  description:
    'Llena un solo formulario y nosotros creamos tu ficha, cargamos tu carta y publicamos tu menú del día en qué comer en Loja.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/formulario' },
};

export default function Page() {
  return <FormularioAlta />;
}
