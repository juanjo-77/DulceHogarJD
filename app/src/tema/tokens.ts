/**
 * Sistema de diseño de Dulce Hogar JD.
 * Tonos de lencería: algodón blanco, lino beige y rosa palo, con un frambuesa
 * profundo para las acciones (contraste AA con texto blanco).
 */
export const color = {
  algodon: '#FFFBF9', // fondo de la app
  blanco: '#FFFFFF', // tarjetas
  lino: '#F4EAE3', // superficies secundarias
  linoOscuro: '#EADBD1',
  hilo: '#E8D8D0', // bordes finos
  rosaPalo: '#F8DDE4',
  rosaNube: '#FCEFF3',
  frambuesa: '#B03A62', // acción principal
  frambuesaHundida: '#8E2B4D',
  tinta: '#3A2730', // texto principal
  tintaSuave: '#7A6068', // texto secundario
  tintaTenue: '#A8949A',
  menta: '#2E7255',
  mentaFondo: '#E4F1EA',
  miel: '#8A5A0B',
  mielFondo: '#FBF0D9',
  coral: '#A8322D',
  coralFondo: '#FBE6E3',
  whatsapp: '#1C7C45',
  /** Meses con pérdida en la gráfica (validado contra frambuesa para daltonismo). */
  ocre: '#B5791F',
  sombra: '#5B2A3C',
} as const;

export const espacio = { xs: 4, s: 8, m: 12, l: 16, xl: 20, xxl: 24, xxxl: 32 } as const;

/** Radios por jerarquía: lo grande es más redondo, lo pequeño más preciso. */
export const radio = { campo: 14, boton: 16, tarjeta: 22, hoja: 28, pastilla: 999 } as const;

export const fuente = {
  normal: 'AtkinsonHyperlegible_400Regular',
  fuerte: 'AtkinsonHyperlegible_700Bold',
  marca: 'Fraunces_600SemiBold_Italic',
} as const;

/** Escala tipográfica grande a propósito: la usuaria lee mejor con letra generosa. */
export const tipo = {
  cifra: { fontFamily: fuente.fuerte, fontSize: 36, lineHeight: 42, letterSpacing: -0.5 },
  titulo: { fontFamily: fuente.fuerte, fontSize: 27, lineHeight: 33, letterSpacing: -0.3 },
  subtitulo: { fontFamily: fuente.fuerte, fontSize: 21, lineHeight: 27 },
  cuerpo: { fontFamily: fuente.normal, fontSize: 18, lineHeight: 26 },
  fuerte: { fontFamily: fuente.fuerte, fontSize: 18, lineHeight: 26 },
  pequeno: { fontFamily: fuente.normal, fontSize: 15.5, lineHeight: 21 },
  pequenoFuerte: { fontFamily: fuente.fuerte, fontSize: 15.5, lineHeight: 21 },
  marca: { fontFamily: fuente.marca, fontSize: 24, lineHeight: 30 },
} as const;

export type Tipo = keyof typeof tipo;

export const sombra = {
  suave: {
    shadowColor: color.sombra,
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  flotante: {
    shadowColor: color.sombra,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
} as const;

/** Tamaño mínimo de cualquier cosa que se toque. */
export const TOQUE_MINIMO = 56;
export const ANCHO_MAXIMO = 640;
