import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  await prisma.role.upsert({
    where: { name: "CLIENTE" },
    update: {},
    create: { name: "CLIENTE" },
  });

  await prisma.user.upsert({
    where: { email: "admin@kusiqumir.com" },
    update: { roleId: adminRole.id },
    create: {
      email: "admin@kusiqumir.com",
      password: await bcrypt.hash("admin123", 10),
      roleId: adminRole.id,
    },
  });

  await prisma.booking.deleteMany();
  await prisma.package.deleteMany();
  await prisma.FAQItem.deleteMany();
  await prisma.WhatToBring.deleteMany();
  await prisma.Requirement.deleteMany();
  await prisma.Recommendation.deleteMany();
  await prisma.NotInclude.deleteMany();
  await prisma.Include.deleteMany();
  await prisma.DestinationImage.deleteMany();
  await prisma.Destination.deleteMany();
  await prisma.Itinerary.deleteMany();
  await prisma.Highlight.deleteMany();
  await prisma.TourLanguage.deleteMany();
  await prisma.Image.deleteMany();
  await prisma.Tour.deleteMany();
  await prisma.image.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.highlight.deleteMany();
  await prisma.tourLanguage.deleteMany();
  await prisma.image.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.highlight.deleteMany();
  await prisma.tourLanguage.deleteMany();
  await prisma.tour.deleteMany();

  // ===== TOUR 1: Cusco y Machu Picchu Clásico =====
  const cusco = await prisma.tour.create({
    data: {
      slug: "cusco-machu-picchu-clasico",
      name: "Cusco y Machu Picchu Clásico",
      subtitle: "La ciudad imperial y la maravilla del mundo",
      shortDescription: "Explora la capital inca, el Valle Sagrado y la ciudadela de Machu Picchu en 4 días.",
      description: "Este tour completo te lleva por lo mejor de Cusco: la Plaza de Armas, el Templo del Sol (Qorikancha), Sacsayhuamán, el Valle Sagrado de los Incas (Pisac, Ollantaytambo) y la gran joya: Machu Picchu. Incluye guías expertos, transporte cómodo y alojamiento seleccionado.",
      category: "Cultura e Historia",
      tourType: "Grupos pequeños",
      durationDays: 4,
      durationHours: 0,
      durationText: "4 días / 3 noches",
      country: "Perú",
      region: "Cusco",
      city: "Cusco",
      meetingPoint: "Hotel en Cusco (recogida incluida)",
      endingPoint: "Hotel en Cusco / Estación de tren Ollantaytambo",
      pickup: true,
      startTime: "08:00",
      endTime: "18:00",
      difficulty: "Moderada",
      altitudeMin: 2800,
      altitudeMax: 3400,
      groupType: "Grupos pequeños (máx 12)",
      featured: true,
      status: "published",
      coverImage: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&h=500&fit=crop",
      video: "",
      currency: "USD",
      adultPrice: 450,
      childPrice: 380,
      discount: 50,
      seoTitle: "Tour Cusco y Machu Picchu 4 días | Kusi Q'umir",
      seoDescription: "Tour completo a Cusco, Valle Sagrado y Machu Picchu en 4 días. Incluye alojamiento, guías, transporte y entradas. ¡Reserva ahora!",
      seoKeywords: ["Cusco", "Machu Picchu", "Valle Sagrado", "Perú tours"],
      languages: {
        create: [
          { language: "Español" },
          { language: "Inglés" },
        ],
      },
      highlights: {
        create: [
          { title: "Plaza de Armas y Qorikancha", description: "Centro histórico de Cusco y Templo del Sol", icon: "🏛️" },
          { title: "Sacsayhuamán", description: "Fortaleza inca con piedras megalíticas", icon: "🏰" },
          { title: "Valle Sagrado", description: "Pisac, Ollantaytambo y mercados tradicionales", icon: "🌄" },
          { title: "Machu Picchu", description: "Ciudadela inca, maravilla del mundo moderno", icon: "🗿" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "08:00", title: "Llegada a Cusco y City Tour", description: "Recogida en aeropuerto/hotel. Tour por Plaza de Armas, Catedral, Qorikancha y Sacsayhuamán. Tarde libre para aclimatación.", location: "Cusco", duration: 480,  },
          { day: 1, order: 2, time: "14:00", title: "Barrios tradicionales", description: "Visita a San Blas, San Pedro y mercado local.", location: "Cusco", duration: 120,  },
          { day: 2, order: 1, time: "07:00", title: "Valle Sagrado - Pisac", description: "Visita al complejo arqueológico y mercado artesanal de Pisac.", location: "Pisac", duration: 180,  },
          { day: 2, order: 2, time: "12:00", title: "Almuerzo en Urubamba", description: "Buffet andino en restaurante local.", location: "Urubamba", duration: 60,  },
          { day: 2, order: 3, time: "14:00", title: "Ollantaytambo", description: "Fortaleza inca y pueblo vivo. Tren a Aguas Calientes (19:00).", location: "Ollantaytambo", duration: 180,  },
          { day: 3, order: 1, time: "05:30", title: "Machu Picchu - Amanecer", description: "Bus a la ciudadela. Tour guiado 2.5 horas. Tiempo libre para fotos.", location: "Machu Picchu", duration: 360,  },
          { day: 3, order: 2, time: "13:00", title: "Regreso a Cusco", description: "Tren a Ollantaytambo + bus a Cusco. Llegada aprox 19:30.", location: "Cusco", duration: 360,  },
          { day: 4, order: 1, time: "09:00", title: "Día libre / Compras", description: "Mañana libre para compras o visita opcional a Maras-Moray. Traslado al aeropuerto.", location: "Cusco", duration: 240,  },
        ],
      },
      destinations: {
        create: [
          { name: "Cusco", type: "Ciudad", description: "Capital histórica del Imperio Inca", latitude: -13.5319, longitude: -71.9675, altitude: 3399, visitTime: 480 },
          { name: "Sacsayhuamán", type: "Sitio Arqueológico", description: "Fortaleza ceremonial con murallas megalíticas", latitude: -13.5072, longitude: -71.9782, altitude: 3700, visitTime: 120 },
          { name: "Pisac", type: "Sitio Arqueológico", description: "Terracias agrícolas y mercado artesanal", latitude: -13.4231, longitude: -71.8433, altitude: 2972, visitTime: 180 },
          { name: "Ollantaytambo", type: "Sitio Arqueológico", description: "Fortaleza y pueblo inca viviente", latitude: -13.2584, longitude: -72.2632, altitude: 2792, visitTime: 180 },
          { name: "Machu Picchu", type: "Santuario Histórico", description: "Ciudadela inca y Maravilla del Mundo", latitude: -13.1631, longitude: -72.5450, altitude: 2430, visitTime: 300 },
        ],
      },
      includes: {
        create: [
          { title: "Alojamiento 3 noches", description: "Hoteles 3* céntricos con desayuno" },
          { title: "Transporte completo", description: "Privado Cusco + bus Machu Picchu + trenes" },
          { title: "Guía bilingüe certificado", description: "Español/Inglés, experto en historia inca" },
          { title: "Entradas", description: "City Tour, Valle Sagrado, Machu Picchu" },
          { title: "Alimentación", description: "3 desayunos, 2 almuerzos" },
        ],
      },
      notIncludes: {
        create: [
          { title: "Vuelos internacionales/nacionales", description: "" },
          { title: "Cena día 3 y día 4", description: "" },
          { title: "Seguro de viaje", description: "" },
          { title: "Propinas", description: "" },
        ],
      },
      recommendations: {
        create: [
          { description: "Llegar a Cusco 1-2 días antes para aclimatar" },
          { description: "Llevar ropa en capas, bloqueador y repelente" },
          { description: "Zapatos de trekking cómodos" },
          { description: "Documento de identidad / pasaporte original" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Buena condición física para caminatas moderadas" },
          { requirement: "Mayores de 8 años (consultar menores)" },
        ],
      },
      whatToBring: {
        create: [
          { item: "Mochila pequeña (20-30L)" },
          { item: "Ropa abrigadora y cortavientos" },
          { item: "Zapatillas de trekking" },
          { item: "Protector solar SPF 50+" },
          { item: "Repelente de insectos" },
          { item: "Cámara / celular con batería extra" },
          { item: "Dinero en soles para souvenirs" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Necesito aclimatarme antes?", answer: "Sí, recomendamos llegar 1-2 días antes a Cusco (3,400m)." },
          { question: "¿Es apto para niños?", answer: "Sí, mayores de 8 años. Consultar para menores." },
          { question: "¿Qué pasa si llueve?", answer: "Los tours operan normalmente. Llevar impermeable." },
          { question: "¿Incluye entrada a Huayna Picchu?", answer: "No, se reserva aparte con 6 meses de anticipación." },
        ],
      },
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&h=500&fit=crop", alt: "Machu Picchu al amanecer", featured: true, order: 0 },
          { url: "https://images.unsplash.com/photo-1526393360628-154473d7e8c7?w=800&h=500&fit=crop", alt: "Plaza de Armas Cusco", featured: false, order: 1 },
          { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=500&fit=crop", alt: "Valle Sagrado", featured: false, order: 2 },
        ],
      },
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
  });

  // ===== TOUR 2: Valle Sagrado =====
  const valle = await prisma.tour.create({
    data: {
      slug: "valle-sagrado-incas",
      name: "Valle Sagrado de los Incas",
      subtitle: "Corazón del Imperio Inca",
      shortDescription: "Recorre Pisac, Ollantaytambo, Moray y Maras en 2 días.",
      description: "Descubre el corazón agrícola y espiritual del Imperio Inca. Visita las terrazas de Moray, las salineras de Maras, el mercado de Pisac y la fortaleza de Ollantaytambo.",
      category: "Cultura e Historia",
      tourType: "Grupos pequeños",
      durationDays: 2,
      durationHours: 0,
      durationText: "2 días / 1 noche",
      country: "Perú",
      region: "Cusco",
      city: "Urubamba",
      meetingPoint: "Hotel en Cusco",
      endingPoint: "Hotel en Cusco / Estación Ollantaytambo",
      pickup: true,
      startTime: "07:00",
      endTime: "18:00",
      difficulty: "Fácil",
      altitudeMin: 2800,
      altitudeMax: 3400,
      groupType: "Grupos pequeños (máx 14)",
      featured: false,
      status: "published",
      coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=500&fit=crop",
      currency: "USD",
      adultPrice: 220,
      childPrice: 180,
      discount: 20,
      seoTitle: "Tour Valle Sagrado 2 días | Kusi Q'umir",
      seoDescription: "Tour Valle Sagrado 2 días: Pisac, Ollantaytambo, Moray y Maras. Incluye alojamiento, guía, transporte y entradas.",
      seoKeywords: ["Valle Sagrado", "Moray", "Maras", "Ollantaytambo", "Pisac"],
      languages: { create: [{ language: "Español" }, { language: "Inglés" }] },
      highlights: {
        create: [
          { title: "Moray", description: "Laboratorio agrícola inca con terrazas circulares", icon: "🌾" },
          { title: "Maras", description: "Salineras ancestrales en funcionamiento", icon: "🧂" },
          { title: "Pisac", description: "Mercado artesanal y terraza agrícola", icon: "🏺" },
          { title: "Ollantaytambo", description: "Fortaleza y último pueblo inca vivo", icon: "🏰" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "07:00", title: "Salida a Moray", description: "Laboratorio agrícola con terrazas concéntricas.", location: "Moray", duration: 90,  },
          { day: 1, order: 2, time: "10:00", title: "Salineras de Maras", description: "Miles de pozas de sal en uso desde el Inca.", location: "Maras", duration: 60,  },
          { day: 1, order: 3, time: "12:30", title: "Almuerzo en Urubamba", description: "Buffet andino.", location: "Urubamba", duration: 60,  },
          { day: 1, order: 4, time: "14:00", title: "Pisac", description: "Complejo arqueológico y mercado artesanal.", location: "Pisac", duration: 150,  },
          { day: 2, order: 1, time: "07:30", title: "Ollantaytambo", description: "Fortaleza y templo del sol. Pueblo inca vivo.", location: "Ollantaytambo", duration: 180,  },
          { day: 2, order: 2, time: "12:00", title: "Regreso a Cusco", description: "Llegada aprox 14:30.", location: "Cusco", duration: 150,  },
        ],
      },
      destinations: {
        create: [
          { name: "Moray", type: "Sitio Arqueológico", description: "Laboratorio agrícola inca", latitude: -13.3292, longitude: -72.1903, altitude: 3500, visitTime: 90 },
          { name: "Maras", type: "Sitio Histórico", description: "Salineras preincaicas", latitude: -13.3194, longitude: -72.1503, altitude: 3380, visitTime: 60 },
          { name: "Pisac", type: "Sitio Arqueológico", description: "Terracias y mercado", latitude: -13.4231, longitude: -71.8433, altitude: 2972, visitTime: 150 },
          { name: "Ollantaytambo", type: "Sitio Arqueológico", description: "Fortaleza y pueblo inca", latitude: -13.2584, longitude: -72.2632, altitude: 2792, visitTime: 180 },
        ],
      },
      includes: {
        create: [
          { title: "Transporte privado", description: "Ida y retorno Cusco" },
          { title: "Guía profesional", description: "Bilingüe certificado" },
          { title: "Entradas", description: "Todos los sitios del itinerario" },
          { title: "1 almuerzo + 1 desayuno", description: "Buffet andino" },
          { title: "Alojamiento 1 noche", description: "Hotel en Urubamba/Ollantaytambo" },
        ],
      },
      notIncludes: {
        create: [
          { title: "Cenas y bebidas", description: "" },
          { title: "Seguro de viaje", description: "" },
          { title: "Propinas", description: "" },
        ],
      },
      recommendations: {
        create: [
          { description: "Calzado cómodo para caminar" },
          { description: "Protector solar y sombrero" },
          { description: "Dinero extra para souvenirs" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Apto para todas las edades" },
          { requirement: "Caminata ligera en sitios arqueológicos" },
        ],
      },
      whatToBring: {
        create: [
          { item: "Mochila día (15-20L)" },
          { item: "Ropa en capas" },
          { item: "Protector solar" },
          { item: "Agua y snacks" },
          { item: "Cámara" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Incluye boleto turístico?", answer: "Sí, entrada a todos los sitios está incluida." },
          { question: "¿Puedo quedarme en Ollantaytambo?", answer: "Sí, podemos coordinar el retorno en tren a Aguas Calientes." },
        ],
      },
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=500&fit=crop", alt: "Moray terrazas", featured: true, order: 0 },
          { url: "https://images.unsplash.com/photo-1526393360628-154473d7e8c7?w=800&h=500&fit=crop", alt: "Plaza de Armas Cusco", featured: false, order: 1 },
        ],
      },
    },
  });

  // ===== TOUR 3: Arequipa y Cañón del Colca =====
  const arequipa = await prisma.tour.create({
    data: {
      slug: "arequipa-canon-colca",
      name: "Arequipa y Cañón del Colca",
      subtitle: "La Ciudad Blanca y el reino del cóndor",
      shortDescription: "Arequipa, monasterios y el Cañón del Colca en 3 días.",
      description: "Descubre Arequipa, la Ciudad Blanca de sillar, el Monasterio de Santa Catalina y el impresionante Cañón del Colca, hogar del majestuoso cóndor andino.",
      category: "Naturaleza y Aventura",
      tourType: "Grupos pequeños",
      durationDays: 3,
      durationHours: 0,
      durationText: "3 días / 2 noches",
      country: "Perú",
      region: "Arequipa",
      city: "Arequipa",
      meetingPoint: "Hotel en Arequipa",
      endingPoint: "Hotel en Arequipa",
      pickup: true,
      startTime: "08:00",
      endTime: "17:00",
      difficulty: "Moderada",
      altitudeMin: 2335,
      altitudeMax: 4910,
      groupType: "Grupos pequeños (máx 12)",
      featured: false,
      status: "published",
      coverImage: "https://images.unsplash.com/photo-1580061419698-f2c4f5a8b5e8?w=800&h=500&fit=crop",
      currency: "USD",
      adultPrice: 350,
      childPrice: 300,
      discount: 30,
      seoTitle: "Tour Arequipa y Cañón del Colca 3 días | Kusi Q'umir",
      seoDescription: "Tour Arequipa y Cañón del Colca 3 días: ciudad blanca, Monasterio Santa Catalina, Cruz del Cóndor. Incluye alojamiento y guía.",
      seoKeywords: ["Arequipa", "Cañón del Colca", "Cóndor", "Monasterio Santa Catalina"],
      languages: { create: [{ language: "Español" }, { language: "Inglés" }] },
      highlights: {
        create: [
          { title: "Plaza de Armas y Catedral", description: "Centro histórico de sillar blanco", icon: "⛪" },
          { title: "Monasterio Santa Catalina", description: "Ciudadela religiosa del siglo XVI", icon: "🏛️" },
          { title: "Mirador Cruz del Cóndor", description: "Vuelo de cóndores andinos", icon: "🦅" },
          { title: "Cañón del Colca", description: "Uno de los más profundos del mundo", icon: "🏔️" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "09:00", title: "City Tour Arequipa", description: "Plaza de Armas, Catedral, Compañía, Monasterio Santa Catalina.", location: "Arequipa", duration: 240,  },
          { day: 1, order: 2, time: "14:00", title: "Almuerzo y tarde libre", description: "Gastronomía arequipeña.", location: "Arequipa", duration: 180,  },
          { day: 2, order: 1, time: "03:00", title: "Salida al Cañón del Colca", description: "Paso por Pampa Cañahuas (vicuñas), Mirador de los Volcanes.", location: "Colca", duration: 300,  },
          { day: 2, order: 2, time: "09:00", title: "Cruz del Cóndor", description: "Observación de cóndores. Caminata corta.", location: "Cruz del Cóndor", duration: 120,  },
          { day: 2, order: 3, time: "13:00", title: "Almuerzo en Chivay", description: "Baños termales opcionales.", location: "Chivay", duration: 120,  },
          { day: 3, order: 1, time: "08:00", title: "Retorno a Arequipa", description: "Parada en miradores. Llegada 13:00.", location: "Arequipa", duration: 300,  },
        ],
      },
      destinations: {
        create: [
          { name: "Plaza de Armas Arequipa", type: "Centro Histórico", description: "Catedral y portales de sillar", latitude: -16.4090, longitude: -71.5375, altitude: 2335, visitTime: 60 },
          { name: "Monasterio Santa Catalina", type: "Monasterio", description: "Ciudadela religiosa", latitude: -16.4008, longitude: -71.5367, altitude: 2335, visitTime: 120 },
          { name: "Cruz del Cóndor", type: "Mirador", description: "Avistamiento de cóndores", latitude: -15.5833, longitude: -71.8500, altitude: 3800, visitTime: 90 },
          { name: "Cañón del Colca", type: "Cañón", description: "Profundidad 3,400m", latitude: -15.5800, longitude: -71.8500, altitude: 3600, visitTime: 120 },
        ],
      },
      includes: {
        create: [
          { title: "Transporte privado", description: "Arequipa - Colca - Arequipa" },
          { title: "Guía bilingüe", description: "" },
          { title: "Entradas", description: "Monasterio, Colca, Cruz del Cóndor" },
          { title: "Alojamiento 2 noches", description: "Hotel en Arequipa (1) y Chivay (1)" },
          { title: "Alimentación", description: "2 desayunos, 2 almuerzos, 1 cena" },
        ],
      },
      notIncludes: {
        create: [
          { title: "Boleto Turístico Colca (S/ 70)", description: "" },
          { title: "Cenas día 1 y 3", description: "" },
          { title: "Seguro y propinas", description: "" },
        ],
      },
      recommendations: {
        create: [
          { description: "Ropa abrigadora para altitudes >4000m" },
          { description: "Protector solar y lentes de sol" },
          { description: "Hidratación constante" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Buena condición física para altitud" },
          { requirement: "No recomendado para problemas cardiorrespiratorios" },
        ],
      },
      whatToBring: {
        create: [
          { item: "Ropa térmica y cortavientos" },
          { item: "Lentes de sol UV" },
          { item: "Protector labial" },
          { item: "Medicación personal" },
          { item: "Dinero en soles" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Cuál es la altitud máxima?", answer: "Paso Patapampa 4,910m. Se aclimata en Arequipa (2,335m) el día anterior." },
          { question: "¿Garantizan ver cóndores?", answer: "Alta probabilidad (90%) en Cruz del Cóndor 8-10am. No garantizado." },
        ],
      },
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1580061419698-f2c4f5a8b5e8?w=800&h=500&fit=crop", alt: "Cañón del Colca", featured: true, order: 0 },
        ],
      },
    },
  });

  // ===== TOUR 4: Lago Titicaca =====
  const titicaca = await prisma.tour.create({
    data: {
      slug: "lago-titicaca-uros",
      name: "Lago Titicaca e Islas Uros",
      subtitle: "El lago navegable más alto del mundo",
      shortDescription: "Navega el Titicaca, visita Uros, Taquile y Amantaní en 2 días.",
      description: "Experiencia única en el lago navegable más alto del mundo. Visita las islas flotantes de los Uros, la isla Taquile con su tejido patrimonial y pernocta en casa de familia en Amantaní.",
      category: "Cultura Viva",
      tourType: "Experiencia cultural",
      durationDays: 2,
      durationHours: 0,
      durationText: "2 días / 1 noche",
      country: "Perú",
      region: "Puno",
      city: "Puno",
      meetingPoint: "Hotel en Puno / Puerto lacustre",
      endingPoint: "Hotel en Puno",
      pickup: true,
      startTime: "07:30",
      endTime: "16:00",
      difficulty: "Fácil",
      altitudeMin: 3812,
      altitudeMax: 4050,
      groupType: "Grupos pequeños (máx 16)",
      featured: false,
      status: "published",
      coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop",
      currency: "USD",
      adultPrice: 180,
      childPrice: 140,
      discount: 15,
      seoTitle: "Tour Lago Titicaca 2 días Uros Taquile | Kusi Q'umir",
      seoDescription: "Tour Lago Titicaca 2 días: Islas Uros, Taquile y Amantaní con pernocte en familia local. Cultura viva y paisajes únicos.",
      seoKeywords: ["Lago Titicaca", "Islas Uros", "Taquile", "Amantaní", "Puno"],
      languages: { create: [{ language: "Español" }, { language: "Inglés" }, { language: "Quechua" }] },
      highlights: {
        create: [
          { title: "Islas Flotantes Uros", description: "Viviendas de totora sobre el lago", icon: "🏝️" },
          { title: "Isla Taquile", description: "Tejido patrimonio UNESCO", icon: "🧵" },
          { title: "Amantaní", description: "Pernocte en familia local", icon: "🏠" },
          { title: "Ceremonial a Pachamama", description: "Ofrenda y ceremonia andina", icon: "🙏" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "07:30", title: "Salida a Uros", description: "Lancha a islas flotantes. Demostración de construcción.", location: "Islas Uros", duration: 90,  },
          { day: 1, order: 2, time: "10:00", title: "Isla Taquile", description: "Caminata, tejidos, almuerzo local.", location: "Isla Taquile", duration: 180,  },
          { day: 1, order: 3, time: "14:30", title: "Traslado a Amantaní", description: "Llegada, bienvenida por familias. Cena y ceremonia.", location: "Amantaní", duration: 240,  },
          { day: 2, order: 1, time: "05:30", title: "Amanecer en Amantaní", description: "Ceremonial al sol. Desayuno familiar.", location: "Amantaní", duration: 120,  },
          { day: 2, order: 2, time: "08:30", title: "Retorno a Puno", description: "Llegada 11:00. Fin de servicios.", location: "Puno", duration: 150,  },
        ],
      },
      destinations: {
        create: [
          { name: "Islas Uros", type: "Comunidad Flotante", description: "Islas artificiales de totora", latitude: -15.7833, longitude: -69.6833, altitude: 3812, visitTime: 90 },
          { name: "Isla Taquile", type: "Isla", description: "Patrimonio textil UNESCO", latitude: -15.7567, longitude: -69.6867, altitude: 3950, visitTime: 180 },
          { name: "Isla Amantaní", type: "Isla", description: "Vivienda familiar y ceremonial", latitude: -15.6667, longitude: -69.7000, altitude: 4150, visitTime: 240 },
        ],
      },
      includes: {
        create: [
          { title: "Transporte lancha privada", description: "Puno - Uros - Taquile - Amantaní - Puno" },
          { title: "Guía local quechua/español", description: "" },
          { title: "Entradas a islas", description: "" },
          { title: "Alojamiento familiar", description: "Habitación privada, baño compartido" },
          { title: "Alimentación completa", description: "1 desayuno, 2 almuerzos, 1 cena" },
        ],
      },
      notIncludes: {
        create: [
          { title: "Traslados hotel-puerto-hotel", description: "" },
          { title: "Bebidas y snacks extra", description: "" },
          { title: "Propinas", description: "" },
        ],
      },
      recommendations: {
        create: [
          { description: "Ropa muy abrigadora (noches a 5°C)" },
          { description: "Protector solar alto (radiación UV extrema)" },
          { description: "Respetar costumbres locales (pedir permiso para fotos)" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Altitud 3,800-4,150m - aclimatar 1 día en Puno" },
          { requirement: "Caminatas moderadas en islas" },
        ],
      },
      whatToBring: {
        create: [
          { item: "Ropa muy abrigadora (capas)" },
          { item: "Gorro, guantes, bufanda" },
          { item: "Protector solar SPF 50+" },
          { item: "Lentes de sol" },
          { item: "Cámara" },
          { item: "Dinero en soles para artesanía" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Cómo es el alojamiento en Amantaní?", answer: "Habitación privada en casa de familia, baño compartido, agua caliente limitada. Experiencia cultural auténtica." },
          { question: "¿Hay electricidad?", answer: "Limitada (paneles solares). Llevar power bank." },
        ],
      },
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop", alt: "Lago Titicaca", featured: true, order: 0 },
        ],
      },
    },
  });

  // ===== TOUR 5: Selva Amazónica =====
  const selva = await prisma.tour.create({
    data: {
      slug: "selva-amazonica-puerto-maldonado",
      name: "Selva Amazónica - Puerto Maldonado",
      subtitle: "Biodiversidad en el corazón del Amazonas",
      shortDescription: "4 días en la Amazonía: fauna, flora y comunidades nativas.",
      description: "Adéntrate en la Amazonía peruana desde Puerto Maldonado. Navega el río Madre de Dios, avista fauna en colpas de guacamayos, camina por la selva primaria y convive con comunidades nativas.",
      category: "Naturaleza y Vida Silvestre",
      tourType: "Ecoturismo",
      durationDays: 4,
      durationHours: 0,
      durationText: "4 días / 3 noches",
      country: "Perú",
      region: "Madre de Dios",
      city: "Puerto Maldonado",
      meetingPoint: "Aeropuerto Puerto Maldonado / Oficina local",
      endingPoint: "Aeropuerto Puerto Maldonado",
      pickup: true,
      startTime: "13:00",
      endTime: "11:00",
      difficulty: "Moderada",
      altitudeMin: 183,
      altitudeMax: 300,
      groupType: "Grupos pequeños (máx 10)",
      featured: true,
      status: "published",
      coverImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=500&fit=crop",
      currency: "USD",
      adultPrice: 520,
      childPrice: 420,
      discount: 50,
      seoTitle: "Tour Amazonía Peruana 4 días Puerto Maldonado | Kusi Q'umir",
      seoDescription: "Tour Selva Amazónica 4 días desde Puerto Maldonado: fauna, flora, comunidades nativas, colpa de guacamayos. Lodge ecológico incluido.",
      seoKeywords: ["Amazonía Peruana", "Puerto Maldonado", "Tambopata", "Guacamayos", "Ecoturismo"],
      languages: { create: [{ language: "Español" }, { language: "Inglés" }] },
      highlights: {
        create: [
          { title: "Colpa de Guacamayos", description: "Cientos de guacamayos al amanecer", icon: "🦜" },
          { title: "Caminata nocturna", description: "Fauna nocturna: tarántulas, ranas, insectos", icon: "🌙" },
          { title: "Lago Sandoval", description: "Otros gigantes, monos, caimanes", icon: "🐊" },
          { title: "Comunidad nativa", description: "Cultura Ese Eja, cerámica, caza", icon: "🏕️" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "13:00", title: "Llegada y traslado al lodge", description: "Recepción en aeropuerto. Lancha 1.5h río Madre de Dios. Bienvenida.", location: "Lodge Tambopata", duration: 180,  },
          { day: 1, order: 2, time: "16:30", title: "Caminata introductoria", description: "Reconocimiento de flora/fauna. Cena.", location: "Lodge", duration: 120,  },
          { day: 2, order: 1, time: "05:00", title: "Colpa de Guacamayos", description: "Amanecer en escondite. Cientos de guacamayos y loros.", location: "Colpa Chuncho", duration: 180,  },
          { day: 2, order: 2, time: "09:00", title: "Caminata selva primaria", description: "Árboles milenarios, monos, medicina natural.", location: "Reserva Tambopata", duration: 240,  },
          { day: 2, order: 3, time: "19:00", title: "Caminata nocturna", description: "Búsqueda de fauna nocturna.", location: "Lodge", duration: 90,  },
          { day: 3, order: 1, time: "06:00", title: "Lago Sandoval", description: "Lancha + caminata. Otorongos, monos, caimanes, hoatzin.", location: "Lago Sandoval", duration: 300,  },
          { day: 3, order: 2, time: "14:00", title: "Visita comunidad nativa", description: "Ese Eja: cerámica, arco y flecha, danzas.", location: "Comunidad Infierno", duration: 180,  },
          { day: 4, order: 1, time: "07:00", title: "Desayuno y retorno", description: "Lancha a Puerto Maldonado. Traslado aeropuerto.", location: "Puerto Maldonado", duration: 120,  },
        ],
      },
      destinations: {
        create: [
          { name: "Colpa de Guacamayos Chuncho", type: "Colpa", description: "Congregación masiva de guacamayos", latitude: -12.9500, longitude: -69.3000, altitude: 250, visitTime: 180 },
          { name: "Lago Sandoval", type: "Lago", description: "Ecosistema de palmeras y fauna", latitude: -12.8500, longitude: -69.2833, altitude: 200, visitTime: 300 },
          { name: "Comunidad Nativa Infierno", type: "Comunidad", description: "Pueblo Ese Eja", latitude: -12.9833, longitude: -69.2667, altitude: 210, visitTime: 180 },
        ],
      },
      includes: {
        create: [
          { title: "Traslados aeropuerto-lodge-aeropuerto", description: "Lancha rápida" },
          { title: "Alojamiento 3 noches", description: "Lodge ecológico, habitaciones privadas con baño" },
          { title: "Alimentación completa", description: "3 desayunos, 3 almuerzos, 3 cenas (buffet)" },
          { title: "Guía naturalista bilingüe", description: "Experto en fauna/flora" },
          { title: "Entradas y permisos", description: "Reserva Tambopata, Lago Sandoval" },
          { title: "Botiquín y botas de goma", description: "Préstamo incluido" },
        ],
      },
      notIncludes: {
        create: [
          { title: "Vuelos a/desde Puerto Maldonado", description: "" },
          { title: "Seguro de viaje", description: "" },
          { title: "Bebidas alcohólicas", description: "" },
          { title: "Propinas", description: "" },
        ],
      },
      recommendations: {
        create: [
          { description: "Vacuna fiebre amarilla recomendada (no obligatoria)" },
          { description: "Repelente DEET 30%+ y ropa manga larga" },
          { description: "Binoculares para avistamiento" },
          { description: "Cámara con zoom / celular buena cámara" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Caminatas 2-4 horas diarias en terreno irregular" },
          { requirement: "Clima cálido húmedo (25-32°C, 80-95% humedad)" },
        ],
      },
      whatToBring: {
        create: [
          { item: "Ropa ligera manga larga (varios cambios)" },
          { item: "Pantalones largos de secado rápido" },
          { item: "Botas de trekking / zapatillas cerradas" },
          { item: "Repelente DEET 30%+ y after-bite" },
          { item: "Protector solar SPF 50+" },
          { item: "Sombrero / gorra" },
          { item: "Linterna frontal + pilas" },
          { item: "Bolsa impermeable / dry bag" },
          { item: "Binoculares (opcional)" },
          { item: "Medicación personal + antihistamínico" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Hay riesgo de malaria/dengue?", answer: "Riesgo bajo en zona de lodge. Repelente y manga larga son clave. Consultar médico para profilaxis." },
          { question: "¿Necesito vacuna fiebre amarilla?", answer: "Recomendada (certificado internacional). No obligatoria para ingreso a Perú." },
          { question: "¿Hay electricidad/internet?", answer: "Electricidad limitada (generador/solar 6-10pm). Sin WiFi en lodge. Desconexión total." },
        ],
      },
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=500&fit=crop", alt: "Amazonía peruana", featured: true, order: 0 },
        ],
      },
    },
  });

  // ===== TOUR 6: Lima Clásica y Gastronómica =====
  const lima = await prisma.tour.create({
    data: {
      slug: "lima-clasica-gastronomica",
      name: "Lima Clásica y Gastronómica",
      subtitle: "Capital, historia y mejor cocina del mundo",
      shortDescription: "Centro histórico, museos y experiencia gastronómica top en 3 días.",
      description: "Descubre la capital peruana: su centro histórico colonial, museos de clase mundial, barrios bohemios y la mejor gastronomía de Latinoamérica. Incluye clase de cocina y cena en restaurante Top 50.",
      category: "Ciudad y Gastronomía",
      tourType: "Urbano y Cultural",
      durationDays: 3,
      durationHours: 0,
      durationText: "3 días / 2 noches",
      country: "Perú",
      region: "Lima",
      city: "Lima",
      meetingPoint: "Hotel en Lima / Aeropuerto",
      endingPoint: "Hotel en Lima / Aeropuerto",
      pickup: true,
      startTime: "09:00",
      endTime: "20:00",
      difficulty: "Fácil",
      altitudeMin: 0,
      altitudeMax: 150,
      groupType: "Grupos pequeños (máx 14)",
      featured: false,
      status: "published",
      coverImage: "https://images.unsplash.com/photo-1585078343220-5b1d7c5d7f8d?w=800&h=500&fit=crop",
      currency: "USD",
      adultPrice: 280,
      childPrice: 220,
      discount: 30,
      seoTitle: "Tour Lima Gastronómico 3 días | Kusi Q'umir",
      seoDescription: "Tour Lima 3 días: Centro histórico, Larco, Barranco, clase de ceviche y cena en Central/Maido. La mejor experiencia gastronómica.",
      seoKeywords: ["Lima", "Gastronomía Peruana", "Ceviche", "Barranco", "Museo Larco"],
      languages: { create: [{ language: "Español" }, { language: "Inglés" }] },
      highlights: {
        create: [
          { title: "Centro Histórico UNESCO", description: "Plaza Mayor, Catedral, Catacumbas", icon: "🏛️" },
          { title: "Museo Larco", description: "Mejor colección arte precolombino", icon: "🏺" },
          { title: "Barranco y Miraflores", description: "Barrios bohemios y acantilados", icon: "🎨" },
          { title: "Clase de Ceviche + Cena Top 50", description: "Cocina con chef + cena en Central/Maido", icon: "🍽️" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "09:00", title: "City Tour Histórico", description: "Plaza Mayor, Catedral, Palacio Gobierno, Catacumbas San Francisco.", location: "Centro Histórico", duration: 180,  },
          { day: 1, order: 2, time: "13:00", title: "Almuerzo en mercado local", description: "Mercado Surquillo: frutas, jugos, anticuchos.", location: "Surquillo", duration: 90,  },
          { day: 1, order: 3, time: "15:00", title: "Museo Larco", description: "Mejor colección arte precolombino. Eróticos Moche.", location: "Pueblo Libre", duration: 120,  },
          { day: 2, order: 1, time: "09:00", title: "Clase de Ceviche y Pisco Sour", description: "Mercado + cocina con chef. Almuerzo propio.", location: "Miraflores", duration: 180,  },
          { day: 2, order: 2, time: "14:00", title: "Barranco", description: "Puente de los Suspiros, arte urbano, galerías.", location: "Barranco", duration: 120,  },
          { day: 2, order: 3, time: "19:00", title: "Cena en Central / Maido / Astrid", description: "Restaurante Top 50 World's Best (según disponibilidad).", location: "Miraflores/Barranco", duration: 180,  },
          { day: 3, order: 1, time: "09:00", title: "Miraflores y Parque Kennedy", description: "Compras, acantilados, último almuerzo. Traslado aeropuerto.", location: "Miraflores", duration: 240,  },
        ],
      },
      destinations: {
        create: [
          { name: "Plaza Mayor Lima", type: "Plaza Histórica", description: "Corazón colonial", latitude: -12.0464, longitude: -77.0428, altitude: 154, visitTime: 60 },
          { name: "Museo Larco", type: "Museo", description: "Arte precolombino", latitude: -12.0735, longitude: -77.0754, altitude: 150, visitTime: 120 },
          { name: "Barranco", type: "Barrio Bohemio", description: "Arte, bares, acantilados", latitude: -12.1491, longitude: -77.0289, altitude: 50, visitTime: 120 },
        ],
      },
      includes: {
        create: [
          { title: "Alojamiento 2 noches", description: "Hotel 4* Miraflores/Barranco con desayuno" },
          { title: "Transporte privado", description: "Aeropuerto-hotel-aeropuerto + tours" },
          { title: "Guía experto", description: "Historiador + chef para clase" },
          { title: "Entradas", description: "Catedral, San Francisco, Larco" },
          { title: "Clase de ceviche + almuerzo", description: "Mercado + cocina hands-on" },
          { title: "Cena en restaurante Top 50", description: "Central, Maido o similar (según reserva)" },
          { title: "Desayunos + 2 almuerzos + 1 cena", description: "" },
        ],
      },
      notIncludes: {
        create: [
          { title: "Vuelos", description: "" },
          { title: "Cenas día 1 y 3 (excepto día 2)", description: "" },
          { title: "Seguro y propinas", description: "" },
        ],
      },
      recommendations: {
        create: [
          { description: "Reservar cena Top 50 con 2-3 meses anticipación" },
          { description: "Probar todo: ceviche, causa, lomo saltado, suspiro limeño" },
          { description: "Llevar efectivo para mercados y propinas" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Apto para todas las edades y condición física" },
          { requirement: "Avisar alergias/restricciones alimentarias al reservar" },
        ],
      },
      whatToBring: {
        create: [
          { item: "Ropa cómoda y zapatos para caminar" },
          { item: "Cámara / celular" },
          { item: "Protector solar" },
          { item: "Dinero en soles y tarjeta" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Puedo elegir el restaurante Top 50?", answer: "Central, Maido, Astrid o similar según disponibilidad al reservar (2-3 meses antes)." },
          { question: "¿Hay opción vegetariana/vegana?", answer: "Sí, avisar al reservar. La cocina peruana tiene excelentes opciones." },
          { question: "¿Incluye Pisco Sour?", answer: "Sí, en la clase de cocina aprendes a prepararlo y lo bebes." },
        ],
      },
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1585078343220-5b1d7c5d7f8d?w=800&h=500&fit=crop", alt: "Ceviche peruano", featured: true, order: 0 },
        ],
      },
    },
  });

  // ===== PACKAGES =====
  const [cuscoId, valleId, arequipaId, titicacaId, selvaId, limaId] = [cusco.id, valle.id, arequipa.id, titicaca.id, selva.id, lima.id];

  const packagesData = [
    {
      name: "Ruta Inca Clásica",
      description: "Cusco, Valle Sagrado y Machu Picchu en un solo viaje. Historia, cultura y paisajes inolvidables.",
      price: 1890,
      durationDays: 5,
      discount: 180,
      featured: true,
      included: "Hospedaje 4 estrellas, Transporte, Guía local, Entradas",
      excluded: "Vuelos internacionales, Comidas no especificadas",
      tours: { connect: [{ id: cuscoId }, { id: valleId }] },
    },
    {
      name: "Aventura Andina",
      description: "Explora Arequipa, el Cañón del Colca y el Lago Titicaca en una travesía por el sur del Perú.",
      price: 1680,
      durationDays: 6,
      discount: 120,
      featured: true,
      included: "Hospedaje, Transporte, Guía bilingüe, Entradas",
      excluded: "Vuelos, Seguros, Propinas",
      tours: { connect: [{ id: arequipaId }, { id: titicacaId }] },
    },
    {
      name: "Perú Esencial",
      description: "Una experiencia completa que combina selva, historia y gastronomía: Lima, Cusco y Amazonía.",
      price: 2200,
      durationDays: 8,
      discount: 250,
      featured: true,
      included: "Alojamiento, Alimentación, Guías, Transporte interno, Excursiones",
      excluded: "Vuelos internacionales, Seguros de viaje, Compras personales",
      tours: { connect: [{ id: limaId }, { id: cuscoId }, { id: selvaId }] },
    },
    {
      name: "Escapada al Lago Titicaca",
      description: "Conoce las islas flotantes de los Uros y la isla Taquile con su tejido tradicional.",
      price: 680,
      durationDays: 3,
      discount: 50,
      featured: false,
      included: "Transporte, Guía, Entradas, Alojamiento en casa familiar, Comidas",
      excluded: "Bebidas, Seguros, Propinas",
      tours: { connect: [{ id: titicacaId }] },
    },
  ];

  for (const pkg of packagesData) {
    const { tours, ...pkgData } = pkg;
    await prisma.package.create({
      data: {
        ...pkgData,
        tours: tours,
      },
    });
  }

  console.log(`Seed: 6 tours + 4 paquetes creados con esquema completo`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());