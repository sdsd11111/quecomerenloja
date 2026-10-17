import { NextResponse } from 'next/server';
import { getAliadosActivos, getAliadosByMomento, getAliadosByPlato } from '@/lib/aliados-db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipoParam = searchParams.get('tipo');
    const momentoParam = searchParams.get('momento') as 'desayuno' | 'almuerzo' | 'cena' | null;
    const platoParam = searchParams.get('plato');
    const platoNombre = searchParams.get('platoNombre') || undefined;

    let aliados;
    if (platoParam) {
      aliados = await getAliadosByPlato(platoParam, platoNombre);
    } else if (momentoParam && ['desayuno', 'almuerzo', 'cena'].includes(momentoParam)) {
      aliados = await getAliadosByMomento(momentoParam);
    } else {
      const tipo = tipoParam === 'GASTRONOMIA' || tipoParam === 'CAFETERIA' ? tipoParam : undefined;
      aliados = await getAliadosActivos(tipo);
    }

    return NextResponse.json({ success: true, aliados });
  } catch (err: any) {
    console.error('Error al obtener aliados públicos:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
