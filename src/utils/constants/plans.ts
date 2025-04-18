export const plans = [
  {
    name: "Plan Básico Fibra",
    speed: "100 Mbps",
    description:
      "Ideal para navegación básica, redes sociales y correo electrónico.",
    price: 15,
    features: [
      "Velocidad simétrica",
      "Instalación estándar incluida",
      "Soporte 24/7",
    ],
    ctaLink: "/contact?plan=basico",
    ctaText: "Contratar Ahora",
  },
  {
    name: "Plan Avanzado Fibra",
    speed: "500 Mbps",
    description:
      "Perfecto para streaming HD, juegos en línea y múltiples dispositivos.",
    price: 20,
    features: [
      "Velocidad simétrica",
      "Instalación prioritaria",
      "Soporte 24/7",
      "IP Pública (opcional)",
    ],
    ctaLink: "/contact?plan=avanzado",
    ctaText: "Contratar Ahora",
    highlight: true, // Para destacar este plan
  },
  {
    name: "Plan Premium Fibra",
    speed: "1000 Mbps",
    description:
      "Máxima velocidad para hogares conectados, teletrabajo y streaming 4K.",
    price: 25,
    features: [
      "Velocidad simétrica",
      "Instalación prioritaria VIP",
      "Soporte Premium 24/7",
      "IP Pública fija incluida",
    ],
    ctaLink: "/contact?plan=premium",
    ctaText: "Contratar Ahora",
  },
];
