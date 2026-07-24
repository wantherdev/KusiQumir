import { PrismaClient, Difficulty, GroupType, ServiceType } from "@prisma/client";
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

  await prisma.testimonial.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.package.deleteMany();
  await prisma.review.deleteMany();
  await prisma.tourDestination.deleteMany();
  await prisma.tourExclude.deleteMany();
  await prisma.tourInclude.deleteMany();
  await prisma.tourFaq.deleteMany();
  await prisma.tourRecommendation.deleteMany();
  await prisma.tourRequirement.deleteMany();
  await prisma.itineraryActivity.deleteMany();
  await prisma.itineraryDay.deleteMany();
  await prisma.tourPrice.deleteMany();
  await prisma.tourSchedule.deleteMany();
  await prisma.tourImage.deleteMany();
  await prisma.tourSeo.deleteMany();
  await prisma.tourMetadata.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.category.deleteMany();

  const testimonialData = [
    {
      name: "Ana Martínez",
      role: "Viajera frecuente",
      content: "Una experiencia inolvidable. El equipo de Kusi Q'umir hizo que nuestro viaje a Machu Picchu fuera perfecto. La atención personalizada y el conocimiento de los guías marcaron la diferencia.",
      rating: 5,
      tags: ["Agencia KusiQumir", "Guía", "Camino Inca"],
      featured: true,
      sortOrder: 1,
      tourId: null,
    },
    {
      name: "Roberto Silva",
      role: "Aventurero",
      content: "Hice el City Tour por Cusco y quedé maravillado. La guía conocía cada rincón y la historia detrás de cada piedra. Recomiendo esta agencia a todos mis amigos.",
      rating: 5,
      tags: ["City Tour", "Guía", "Agencia KusiQumir"],
      featured: true,
      sortOrder: 2,
      tourId: null,
    },
    {
      name: "Jennifer Thompson",
      role: "Viajera en familia",
      content: "Viajamos en familia con niños y todo estuvo perfectamente organizado. El transporte, el alojamiento y las actividades. Kusi Q'umir superó todas nuestras expectativas.",
      rating: 5,
      tags: ["Agencia KusiQumir", "Transporte", "Alojamiento", "Experiencia General"],
      featured: true,
      sortOrder: 3,
      tourId: null,
    },
    {
      name: "Carlos Mendoza",
      role: "Fotógrafo",
      content: "La Montaña de 7 Colores fue una experiencia que cambió mi vida. El guía fue muy paciente y conocía los mejores puntos para fotografiar. Totalmente recomendado.",
      rating: 5,
      tags: ["Guía", "Transporte"],
      featured: true,
      sortOrder: 4,
      tourId: null,
    },
  ];

  for (const t of testimonialData) {
    await prisma.testimonial.create({ data: t });
  }

  console.log(`Seed: ${testimonialData.length} testimonios creados`);

  const cultura = await prisma.category.create({ data: { slug: "cultural", name: "Cultural", description: "Tours culturales por la ciudad y sitios arqueológicos" } });
  const naturaleza = await prisma.category.create({ data: { slug: "naturaleza", name: "Naturaleza", description: "Tours de naturaleza, montaña y lagunas" } });
  const aventura = await prisma.category.create({ data: { slug: "aventura", name: "Aventura", description: "Tours de trekking y aventura" } });
  const historia = await prisma.category.create({ data: { slug: "historia", name: "Historia", description: "Tours históricos y tradicionales" } });

  const cusco = await prisma.destination.create({ data: { slug: "cusco", name: "Cusco", description: "Capital histórica del Imperio Inca" } });
  const valleSagrado = await prisma.destination.create({ data: { slug: "valle-sagrado", name: "Valle Sagrado", description: "Valle Sagrado de los Incas" } });
  const maras = await prisma.destination.create({ data: { slug: "maras", name: "Maras", description: "Salineras de Maras" } });
  const moray = await prisma.destination.create({ data: { slug: "moray", name: "Moray", description: "Andenes circulares de Moray" } });
  const machuPicchu = await prisma.destination.create({ data: { slug: "machu-picchu", name: "Machu Picchu", description: "Santuario histórico de Machu Picchu" } });
  const humantay = await prisma.destination.create({ data: { slug: "laguna-humantay", name: "Laguna Humantay", description: "Laguna turquesa de Humantay" } });
  const montanaColores = await prisma.destination.create({ data: { slug: "montana-7-colores", name: "Montaña de 7 Colores", description: "Vinicunca, la montaña de los siete colores" } });
  const tipon = await prisma.destination.create({ data: { slug: "tipon", name: "Tipón", description: "Complejo arqueológico de Tipón" } });
  const piquillacta = await prisma.destination.create({ data: { slug: "piquillacta", name: "Pikillaqta", description: "Centro arqueológico de Pikillaqta" } });
  const andahuaylillas = await prisma.destination.create({ data: { slug: "andahuaylillas", name: "Andahuaylillas", description: "Capilla Sixtina de América" } });
  const waqrapukara = await prisma.destination.create({ data: { slug: "waqrapukara", name: "Waqrapukara", description: "Fortaleza de Waqrapukara" } });
  const qeswachaka = await prisma.destination.create({ data: { slug: "qeswachaka", name: "Puente Q'eswachaka", description: "Puente inca de Q'eswachaka" } });
  const palcoyo = await prisma.destination.create({ data: { slug: "palcoyo", name: "Montaña Palcoyo", description: "Montaña de colores Palcoyo" } });

  const categoryMap: Record<string, string> = {
    cultural: cultura.id,
    naturaleza: naturaleza.id,
    aventura: aventura.id,
    historia: historia.id,
  };

  const destMap: Record<string, string> = {
    cusco: cusco.id,
    valleSagrado: valleSagrado.id,
    maras: maras.id,
    moray: moray.id,
    machuPicchu: machuPicchu.id,
    humantay: humantay.id,
    montanaColores: montanaColores.id,
    tipon: tipon.id,
    piquillacta: piquillacta.id,
    andahuaylillas: andahuaylillas.id,
    waqrapukara: waqrapukara.id,
    qeswachaka: qeswachaka.id,
    palcoyo: palcoyo.id,
  };

  const toursData = [
    {
      slug: "city-tour-cusco",
      code: "CTC-001",
      title: "City Tour Cusco",
      subtitle: "Descubre la capital del Imperio Inca",
      shortDescription: "Recorre los principales atractivos de la ciudad de Cusco con guía profesional. Perfecto para tu primer día en la ciudad.",
      description: "Acompañanos en un recorrido por la ciudad imperial del Cusco, capital del Tahuantinsuyo y Patrimonio de la Humanidad. Caminarás por calles incas originales donde la piedra tallada convive con balcones coloniales, visitarás la majestuosa Catedral y el Templo del Sol o Qoricancha, donde los muros incas más finos del imperio sostienen un convento español. Luego ascenderás a Sacsayhuamán, la fortaleza ceremonial de piedras megalíticas que desafían toda explicación, y continuarás por los enigmáticos sitios de Qenqo, Puka Pukara y Tambomachay, cada uno con su propio misterio y propósito dentro de la cosmovisión andina. Una introducción perfecta a la historia viva de la capital inca.",
      durationHours: 5,
      durationDays: 1,
      difficulty: "Easy" as Difficulty,
      groupType: "Shared" as GroupType,
      serviceType: "HalfDay" as ServiceType,
      featured: true,
      active: true,
      recommendedFor: ["Primera vez en Cusco o tour de aclimatación"],
      categoryId: categoryMap["cultural"],
      prices: [{ name: "General", currency: "USD", adult: 35, child: 25 }],
      itineraryDays: [
        {
          day: 1,
          title: "City Tour Cusco",
          activities: [
            { sortOrder: 1, time: "08:00", title: "Recojo del hotel", description: "Inicio del tour con recojo desde tu hotel en el centro histórico", duration: 30 },
            { sortOrder: 2, time: "08:30", title: "Catedral del Cusco", description: "Visita guiada a la majestuosa Catedral Basílica de la ciudad", duration: 45 },
            { sortOrder: 3, time: "09:30", title: "Coricancha", description: "Templo del Sol, el centro religioso más importante del Imperio Inca", duration: 45 },
            { sortOrder: 4, time: "10:30", title: "Sacsayhuamán", description: "Fortaleza ceremonial de piedra con vistas panorámicas de Cusco", duration: 60 },
            { sortOrder: 5, time: "11:45", title: "Qenqo", description: "Santuario ceremonial inca con galerías subterráneas", duration: 30 },
            { sortOrder: 6, time: "12:30", title: "Pukapukara", description: "Fortaleza militar inca con impresionante vista del valle", duration: 20 },
            { sortOrder: 7, time: "13:00", title: "Tambomachay", description: "Recinto ceremonial dedicado al culto del agua", duration: 20 },
            { sortOrder: 8, time: "13:30", title: "Retorno al hotel", description: "Traslado de regreso al centro de Cusco", duration: 30 },
          ],
        },
      ],
      includes: [
        { title: "Transporte turístico", description: "Recojo y retorno desde hotel céntrico" },
        { title: "Guía profesional", description: "Guía bilingüe español-inglés" },
        { title: "Asistencia personalizada", description: "Atención durante todo el tour" },
      ],
      excludes: [
        { title: "Entradas a sitios turísticos", description: "Boleto Turístico del Cusco (BTC) no incluido" },
        { title: "Alimentación", description: "Comidas y bebidas no incluidas" },
      ],
      faqs: [
        { question: "¿Incluye recojo desde mi hotel?", answer: "Sí, realizamos recojo desde hoteles ubicados en el centro histórico de Cusco.", sortOrder: 1 },
        { question: "¿Qué debo llevar?", answer: "Bloqueador solar, gorra, cámara fotográfica, ropa cómoda y agua.", sortOrder: 2 },
        { question: "¿El tour es en inglés?", answer: "Ofrecemos guía bilingüe español-inglés sin costo adicional.", sortOrder: 3 },
      ],
      recommendations: [
        { title: "Aclimatación previa", description: "Recomendamos llegar a Cusco al menos un día antes para aclimatarte a la altura" },
        { title: "Ropa cómoda", description: "Usa zapatos cómodos para caminar y ropa ligera pero abrigadora" },
      ],
      requirements: [
        { requirement: "Boleto Turístico del Cusco (BTC) adquirido previamente" },
        { requirement: "Buena condición física básica para caminatas ligeras" },
      ],
      images: [
        { url: "/images/tours/city-tour-cusco.webp", alt: "City Tour Cusco", featured: true, sortOrder: 1 },
      ],
      seo: { title: "City Tour Cusco | Kusi Q'umir", description: "Reserva el City Tour Cusco y descubre la capital del Imperio Inca con guía profesional. Catedral, Coricancha, Sacsayhuamán y más.", keywords: ["City Tour Cusco", "Cusco", "tour Cusco", "visita Cusco"] },
      destinations: [{ key: "cusco", sortOrder: 1 }],
    },
    {
      slug: "valle-sagrado",
      code: "VS-001",
      title: "Valle Sagrado de los Incas",
      subtitle: "El corazón del Imperio Inca",
      shortDescription: "Recorre el majestuoso Valle Sagrado visitando Pisac, Urubamba, Ollantaytambo y Chinchero.",
      description: "El Valle Sagrado fue el corazón agrícola, espiritual y político del Imperio Inca, bendecido por el río Urubamba y una geografía de microclimas únicos. Iniciarás el viaje en Pisac, cuya ciudadela en la cima del cerro regala vistas panorámicas del valle y cuyo mercado artesanal es uno de los más vibrantes de la región. Tras un almuerzo buffet en Urubamba, llegarás a Ollantaytambo, la única ciudad inca viva del Perú, donde enormes terrazas de piedra y templos se alzan sobre calles empedradas aún habitadas. La última parada es Chinchero, con su palacio real de Túpac Inca Yupanqui y sus talleres textiles donde tejedoras quechuas preservan técnicas ancestrales de teñido natural.",
      durationHours: 10,
      durationDays: 1,
      difficulty: "Easy" as Difficulty,
      groupType: "Shared" as GroupType,
      serviceType: "FullDay" as ServiceType,
      featured: true,
      active: true,
      recommendedFor: ["Primera vez en Cusco o tour de aclimatación", "Amantes de la cultura e historia"],
      categoryId: categoryMap["cultural"],
      prices: [{ name: "General", currency: "USD", adult: 45, child: 30 }],
      itineraryDays: [
        {
          day: 1,
          title: "Valle Sagrado",
          activities: [
            { sortOrder: 1, time: "06:00", title: "Recojo del hotel", description: "Inicio del tour con recojo desde tu hotel", duration: 30 },
            { sortOrder: 2, time: "07:15", title: "Mirador de Taray", description: "Primera parada panorámica del valle sagrado", duration: 15 },
            { sortOrder: 3, time: "08:00", title: "Pisac", description: "Visita al mercado artesanal y la ciudadela inca de Pisac", duration: 90 },
            { sortOrder: 4, time: "10:00", title: "Urubamba", description: "Almuerzo buffet en un restaurante turístico del valle", duration: 60 },
            { sortOrder: 5, time: "11:30", title: "Ollantaytambo", description: "Fortaleza y ciudad inca viva con impresionantes terrazas", duration: 90 },
            { sortOrder: 6, time: "14:00", title: "Chinchero", description: "Mercado artesanal y sitio arqueológico inca", duration: 60 },
            { sortOrder: 7, time: "16:00", title: "Retorno a Cusco", description: "Viaje de regreso al centro de Cusco", duration: 60 },
          ],
        },
      ],
      includes: [
        { title: "Transporte turístico", description: "Recojo y retorno desde hotel céntrico" },
        { title: "Guía profesional", description: "Guía bilingüe español-inglés" },
        { title: "Almuerzo buffet", description: "Almuerzo tipo buffet en restaurante turístico en Urubamba" },
      ],
      excludes: [
        { title: "Entradas a sitios arqueológicos", description: "Boleto Turístico del Cusco (BTC) no incluido" },
        { title: "Bebidas", description: "Bebidas durante el almuerzo no incluidas" },
      ],
      faqs: [
        { question: "¿El almuerzo está incluido?", answer: "Sí, incluimos almuerzo buffet en un restaurante turístico en Urubamba.", sortOrder: 1 },
        { question: "¿Pasamos por todos los pueblos del valle?", answer: "Visitamos Pisac, Urubamba, Ollantaytambo y Chinchero. Cada uno tiene su encanto particular.", sortOrder: 2 },
      ],
      recommendations: [
        { title: "Llegar temprano", description: "El tour empieza a las 6:00 am, recomendamos descansar bien la noche anterior" },
        { title: "Llevar efectivo", description: "Los mercados artesanales aceptan efectivo, ideal para comprar recuerdos" },
      ],
      requirements: [
        { requirement: "Boleto Turístico del Cusco (BTC) adquirido previamente" },
      ],
      images: [
        { url: "/images/tours/valle-sagrado.webp", alt: "Valle Sagrado de los Incas", featured: true, sortOrder: 1 },
      ],
      seo: { title: "Valle Sagrado | Kusi Q'umir", description: "Reserva el tour al Valle Sagrado de los Incas. Visita Pisac, Ollantaytambo, Urubamba y Chinchero con guía profesional.", keywords: ["Valle Sagrado", "Cusco", "Pisac", "Ollantaytambo", "Chinchero"] },
      destinations: [{ key: "valleSagrado", sortOrder: 1 }, { key: "cusco", sortOrder: 2 }],
    },
    {
      slug: "maras-moray",
      code: "MM-001",
      title: "Maras y Moray",
      subtitle: "Salineras milenarias y andenes circulares",
      shortDescription: "Conoce las impresionantes salineras de Maras y los misteriosos andenes circulares de Moray.",
      description: "Este tour te sumerge en el ingenio agrícola y la explotación de recursos naturales de los incas. En Moray descubrirás un laboratorio agrícola circular de andenes concéntricos que alcanzan los 30 metros de profundidad, donde cada nivel genera su propio microclima, permitiendo a los incas experimentar con cultivos de diferentes regiones. Luego visitarás las Salineras de Maras, un espectáculo visual de miles de pozas de sal blanca talladas en la ladera de la montaña que han sido operadas por familias locales desde tiempos preincaicos. El contraste del blanco intenso de la sal contra el verde de los Andes y el azul del cielo crea una de las postales más fotogénicas de Cusco.",
      durationHours: 5,
      durationDays: 1,
      difficulty: "Easy" as Difficulty,
      groupType: "Shared" as GroupType,
      serviceType: "HalfDay" as ServiceType,
      featured: false,
      active: true,
      recommendedFor: ["Amantes de la fotografía", "Amantes de la cultura e historia"],
      categoryId: categoryMap["cultural"],
      prices: [{ name: "General", currency: "USD", adult: 30, child: 20 }],
      itineraryDays: [
        {
          day: 1,
          title: "Maras y Moray",
          activities: [
            { sortOrder: 1, time: "08:30", title: "Recojo del hotel", description: "Inicio del tour con recojo desde tu hotel", duration: 30 },
            { sortOrder: 2, time: "09:30", title: "Moray", description: "Visita a los andenes circulares y explicación del laboratorio agrícola inca", duration: 60 },
            { sortOrder: 3, time: "11:00", title: "Salineras de Maras", description: "Recorrido por las miles de pozas de sal y explicación del proceso de extracción", duration: 60 },
            { sortOrder: 4, time: "12:30", title: "Retorno a Cusco", description: "Viaje de regreso al centro de Cusco", duration: 45 },
          ],
        },
      ],
      includes: [
        { title: "Transporte turístico", description: "Recojo y retorno desde hotel céntrico" },
        { title: "Guía profesional", description: "Guía bilingüe español-inglés" },
      ],
      excludes: [
        { title: "Entradas", description: "Entrada a Moray (S/ 10) y Maras (S/ 10) no incluidas" },
        { title: "Alimentación", description: "Comidas y bebidas no incluidas" },
      ],
      faqs: [
        { question: "¿Se puede comprar sal en Maras?", answer: "Sí, puedes comprar sal artesanal directamente de los productores locales.", sortOrder: 1 },
        { question: "¿Es un tour muy exigente físicamente?", answer: "No, es un tour tranquilo con caminatas cortas. Ideal para cualquier persona.", sortOrder: 2 },
      ],
      recommendations: [
        { title: "Llevar cámara", description: "Las salineras y Moray ofrecen paisajes espectaculares para fotografiar" },
      ],
      requirements: [
        { requirement: "Entradas a Moray (S/ 10) y Maras (S/ 10) adquiridas en el lugar" },
      ],
      images: [
        { url: "/images/tours/maras-moray.webp", alt: "Salineras de Maras", featured: true, sortOrder: 1 },
      ],
      seo: { title: "Maras y Moray | Kusi Q'umir", description: "Reserva el tour a Maras y Moray. Conoce las salineras milenarias y los andenes circulares incas.", keywords: ["Maras", "Moray", "salineras", "Cusco"] },
      destinations: [{ key: "maras", sortOrder: 1 }, { key: "moray", sortOrder: 2 }],
    },
    {
      slug: "machu-picchu-full-day",
      code: "MP-001",
      title: "Machu Picchu Full Day",
      subtitle: "La maravilla del mundo en un día",
      shortDescription: "Vive la experiencia de visitar Machu Picchu en un día completo desde Cusco. Tren, montaña y la ciudadela inca.",
      description: "El tour más emblemático del Perú te lleva en un solo día a una de las Siete Maravillas del Mundo Moderno. La aventura comienza antes del amanecer con un viaje en tren que serpentea el Valle Sagrado junto al río Urubamba, ascendiendo gradualmente hacia la ceja de selva. Desde el pintoresco pueblo de Aguas Calientes, un bus ecológico asciende en zigzag hasta la entrada de la ciudadela. Allí, entre la niebla mañanera que se disipa lentamente, aparece Machu Picchu en todo su esplendor. Un guía profesional te conducirá por los sectores principales: el Templo del Sol, el Intihuatana, el Templo de las Tres Ventanas y la Plaza Principal, revelando la historia y el misterio de esta obra maestra de la arquitectura inca.",
      durationHours: 16,
      durationDays: 1,
      difficulty: "Moderate" as Difficulty,
      groupType: "Shared" as GroupType,
      serviceType: "MultiDay" as ServiceType,
      featured: true,
      active: true,
      recommendedFor: ["Primera vez en Cusco o tour de aclimatación", "Imperdible en tu visita a Perú"],
      categoryId: categoryMap["cultural"],
      prices: [
        { name: "General", currency: "USD", adult: 220, child: 190 },
        { name: "VIP", currency: "USD", adult: 320, child: 280 },
      ],
      itineraryDays: [
        {
          day: 1,
          title: "Machu Picchu",
          activities: [
            { sortOrder: 1, time: "04:00", title: "Recojo del hotel", description: "Traslado a la estación de tren en Ollantaytambo", duration: 30 },
            { sortOrder: 2, time: "06:10", title: "Tren a Aguas Calientes", description: "Viaje en tren Expedition con vistas panorámicas del valle", duration: 120 },
            { sortOrder: 3, time: "08:15", title: "Bus a Machu Picchu", description: "Ascenso en bus desde Aguas Calientes hasta la entrada de la ciudadela", duration: 30 },
            { sortOrder: 4, time: "09:00", title: "Visita guiada a Machu Picchu", description: "Recorrido completo por la ciudadela con guía profesional", duration: 180 },
            { sortOrder: 5, time: "12:00", title: "Tiempo libre", description: "Explora por tu cuenta o sube a Huayna Picchu / Montaña (con permiso previo)", duration: 120 },
            { sortOrder: 6, time: "14:00", title: "Descenso a Aguas Calientes", description: "Bus de retorno al pueblo de Aguas Calientes", duration: 30 },
            { sortOrder: 7, time: "16:30", title: "Tren de retorno", description: "Viaje de regreso a Ollantaytambo", duration: 120 },
            { sortOrder: 8, time: "19:30", title: "Retorno a Cusco", description: "Traslado de Ollantaytambo a tu hotel en Cusco", duration: 90 },
          ],
        },
      ],
      includes: [
        { title: "Transporte turístico", description: "Recojo y retorno desde hotel céntrico en Cusco" },
        { title: "Tren Expedition", description: "Tren ida y vuelta Ollantaytambo - Aguas Calientes" },
        { title: "Bus", description: "Bus de subida y bajada Aguas Calientes - Machu Picchu" },
        { title: "Guía profesional", description: "Guía bilingüe durante la visita a la ciudadela" },
        { title: "Entrada a Machu Picchu", description: "Ticket de ingreso a la ciudadela incluido" },
      ],
      excludes: [
        { title: "Huayna Picchu / Montaña", description: "Ingreso adicional a Huayna Picchu o Montaña Machu Picchu (sujeto a disponibilidad)" },
        { title: "Alimentación", description: "Comidas y bebidas durante el tour" },
      ],
      faqs: [
        { question: "¿El tour incluye la entrada a Machu Picchu?", answer: "Sí, la entrada general a la ciudadela está incluida.", sortOrder: 1 },
        { question: "¿Puedo subir a Huayna Picchu?", answer: "Sí, con reserva previa. Tiene un costo adicional y está sujeto a disponibilidad.", sortOrder: 2 },
        { question: "¿Qué tipo de tren se utiliza?", answer: "Incluimos tren Expedition. Se puede mejorar a Vistadome por un costo adicional.", sortOrder: 3 },
      ],
      recommendations: [
        { title: "Reserva con anticipación", description: "Las entradas a Machu Picchu se agotan rápido. Reserva con semanas de anticipación" },
        { title: "Pasaporte obligatorio", description: "Lleva tu pasaporte original para ingresar a la ciudadela" },
      ],
      requirements: [
        { requirement: "Pasaporte original para ingreso a Machu Picchu" },
        { requirement: "Reserva anticipada (mínimo 2 semanas antes)" },
      ],
      images: [
        { url: "/images/tours/machu-picchu.webp", alt: "Machu Picchu", featured: true, sortOrder: 1 },
      ],
      seo: { title: "Machu Picchu Full Day | Kusi Q'umir", description: "Reserva el tour a Machu Picchu en un día desde Cusco. Incluye tren, bus, guía y entrada a la ciudadela.", keywords: ["Machu Picchu", "tour Machu Picchu", "Cusco", "maravilla del mundo"] },
      destinations: [{ key: "machuPicchu", sortOrder: 1 }],
    },
    {
      slug: "laguna-humantay",
      code: "LH-001",
      title: "Laguna Humantay",
      subtitle: "La joya turquesa de los Andes",
      shortDescription: "Camina hasta la impresionante laguna turquesa de Humantay, rodeada de nevados y paisajes de alta montaña.",
      description: "Una experiencia de trekking que te lleva a una de las lagunas más hermosas del Perú, enclavada en la cordillera de Vilcabamba a los pies del imponente nevado Humantay. La caminata asciende a través de paisajes altoandinos de ensueño, con vistas al nevado Salkantay que se alza majestuoso al fondo. Al llegar, la laguna revela un color turquesa intenso y casi irreal, producto de la harina glaciar —partículas minerales finamente molidas por el hielo que reflejan la luz solar. El silencio andino solo interrumpido por el viento y el ocasional vuelo de un cóndor hacen de este lugar una experiencia casi mística. Ideal para amantes de la naturaleza y la fotografía de montaña.",
      durationHours: 12,
      durationDays: 1,
      difficulty: "Moderate" as Difficulty,
      groupType: "Shared" as GroupType,
      serviceType: "FullDay" as ServiceType,
      featured: false,
      active: true,
      recommendedFor: ["Amantes de las caminatas", "Para quienes les gusta el trekking ligero"],
      categoryId: categoryMap["naturaleza"],
      prices: [{ name: "General", currency: "USD", adult: 45, child: 35 }],
      itineraryDays: [
        {
          day: 1,
          title: "Laguna Humantay",
          activities: [
            { sortOrder: 1, time: "04:30", title: "Recojo del hotel", description: "Inicio del tour con recojo desde tu hotel", duration: 30 },
            { sortOrder: 2, time: "07:00", title: "Desayuno en Mollepata", description: "Desayuno andino en el pueblo de Mollepata", duration: 45 },
            { sortOrder: 3, time: "08:30", title: "Inicio de caminata", description: "Inicio del trekking desde Soraypampa hacia la laguna", duration: 15 },
            { sortOrder: 4, time: "10:00", title: "Llegada a Laguna Humantay", description: "Llegada a la laguna turquesa. Tiempo para fotos y contemplación", duration: 60 },
            { sortOrder: 5, time: "11:00", title: "Retorno", description: "Caminata de regreso a Soraypampa", duration: 60 },
            { sortOrder: 6, time: "13:00", title: "Almuerzo", description: "Almuerzo en Mollepata", duration: 60 },
            { sortOrder: 7, time: "14:30", title: "Retorno a Cusco", description: "Viaje de regreso al centro de Cusco", duration: 180 },
          ],
        },
      ],
      includes: [
        { title: "Transporte turístico", description: "Recojo y retorno desde hotel céntrico" },
        { title: "Guía profesional", description: "Guía bilingüe español-inglés" },
        { title: "Desayuno andino", description: "Desayuno ligero en Mollepata" },
        { title: "Almuerzo", description: "Almuerzo en restaurante local en Mollepata" },
      ],
      excludes: [
        { title: "Entrada a la laguna", description: "Ticket de ingreso (S/ 20) no incluido" },
        { title: "Caballo de alquiler", description: "Servicio opcional de caballo para subir (S/ 80)" },
      ],
      faqs: [
        { question: "¿Es difícil la caminata?", answer: "Es de dificultad moderada. La caminata dura aproximadamente 1.5 horas de subida.", sortOrder: 1 },
        { question: "¿Se puede alquilar caballo?", answer: "Sí, hay caballos disponibles para alquilar en Soraypampa.", sortOrder: 2 },
        { question: "¿Cuál es la altitud?", answer: "La laguna está a 4,200 msnm. Recomendamos aclimatación previa en Cusco.", sortOrder: 3 },
      ],
      recommendations: [
        { title: "Aclimatación previa", description: "Recomendamos estar al menos 2 días en Cusco antes de hacer este tour" },
        { title: "Ropa de abrigo", description: "Las temperaturas en la mañana son muy frías. Lleva varias capas de ropa" },
      ],
      requirements: [
        { requirement: "Buena condición física para caminata de 1.5 horas de subida" },
        { requirement: "Aclimatación previa a la altura (mínimo 2 días en Cusco)" },
      ],
      images: [
        { url: "/images/tours/laguna-humantay.webp", alt: "Laguna Humantay", featured: true, sortOrder: 1 },
      ],
      seo: { title: "Laguna Humantay | Kusi Q'umir", description: "Reserva el tour a la Laguna Humantay. Camina hasta la laguna turquesa de los Andes con guía profesional.", keywords: ["Laguna Humantay", "Humantay", "trekking", "Cusco"] },
      destinations: [{ key: "humantay", sortOrder: 1 }],
    },
    {
      slug: "montana-colores",
      code: "MC-001",
      title: "Montaña de 7 Colores",
      subtitle: "Vinicunca, el arcoíris de los Andes",
      shortDescription: "Camina hasta la impresionante Montaña de 7 Colores (Vinicunca), uno de los paisajes más sorprendentes del Perú.",
      description: "La Montaña Vinicunca, también conocida como la Montaña Arcoíris, es el segundo destino más visitado de Cusco y una de las maravillas naturales más impresionantes de Sudamérica. Sus laderas exhiben franjas de rojo, amarillo, verde, lavanda, rosa y terracota, formadas por la sedimentación de minerales durante millones de años y reveladas por el retroceso glaciar. La caminata atraviesa paisajes altoandinos salpicados de llamas y alpacas, con el nevado Ausangate como testigo silencioso. Al alcanzar la cumbre a 5,200 msnm, la vista panorámica de la cordillera de Vilcanota y el Valle Rojo es una recompensa que pocos lugares en el mundo pueden ofrecer.",
      durationHours: 14,
      durationDays: 1,
      difficulty: "Challenging" as Difficulty,
      groupType: "Shared" as GroupType,
      serviceType: "FullDay" as ServiceType,
      featured: true,
      active: true,
      recommendedFor: ["Amantes de las caminatas", "Para quienes les gusta el trekking", "Amantes de la fotografía"],
      categoryId: categoryMap["naturaleza"],
      prices: [{ name: "General", currency: "USD", adult: 50, child: 40 }],
      itineraryDays: [
        {
          day: 1,
          title: "Montaña de 7 Colores",
          activities: [
            { sortOrder: 1, time: "04:00", title: "Recojo del hotel", description: "Inicio del tour con recojo desde tu hotel", duration: 30 },
            { sortOrder: 2, time: "06:30", title: "Desayuno en Pitumarca", description: "Desayuno andino en el pueblo de Pitumarca", duration: 45 },
            { sortOrder: 3, time: "07:30", title: "Inicio de caminata", description: "Inicio del trekking desde el punto de control", duration: 15 },
            { sortOrder: 4, time: "10:00", title: "Llegada a la Montaña de 7 Colores", description: "Llegada al mirador principal. Tiempo para fotos y disfrutar del paisaje", duration: 60 },
            { sortOrder: 5, time: "11:00", title: "Inicio de retorno", description: "Caminata de regreso al punto de partida", duration: 90 },
            { sortOrder: 6, time: "13:00", title: "Almuerzo", description: "Almuerzo buffet en Pitumarca", duration: 60 },
            { sortOrder: 7, time: "14:30", title: "Retorno a Cusco", description: "Viaje de regreso al centro de Cusco", duration: 180 },
          ],
        },
      ],
      includes: [
        { title: "Transporte turístico", description: "Recojo y retorno desde hotel céntrico" },
        { title: "Guía profesional", description: "Guía bilingüe español-inglés" },
        { title: "Desayuno andino", description: "Desayuno ligero en Pitumarca" },
        { title: "Almuerzo buffet", description: "Almuerzo buffet en restaurante local" },
      ],
      excludes: [
        { title: "Entrada", description: "Ticket de ingreso (S/ 30) no incluido" },
        { title: "Caballo de alquiler", description: "Servicio opcional de caballo (S/ 100)" },
      ],
      faqs: [
        { question: "¿Es muy difícil la caminata?", answer: "Es de dificultad alta por la altitud (5,200 msnm). La caminata dura aprox. 2 horas de subida.", sortOrder: 1 },
        { question: "¿Necesito aclimatación?", answer: "Sí, recomendamos mínimo 3 días en Cusco antes de realizar este tour.", sortOrder: 2 },
        { question: "¿Hay baños en el camino?", answer: "Sí, hay baños públicos en el punto de inicio y en la cima (S/ 2).", sortOrder: 3 },
      ],
      recommendations: [
        { title: "Aclimatación larga", description: "Esta es una caminata de altura. Recomendamos 3 días de aclimatación en Cusco" },
        { title: "Hoja de coca", description: "Lleva hojas de coca o caramelos de coca para ayudar con el soroche" },
      ],
      requirements: [
        { requirement: "Buena condición física para caminata en altura" },
        { requirement: "Aclimatación previa de mínimo 3 días en Cusco" },
        { requirement: "Ropa de abrigo impermeable para lluvia y viento" },
      ],
      images: [
        { url: "/images/tours/montana-7-colores.webp", alt: "Montaña de 7 Colores Vinicunca", featured: true, sortOrder: 1 },
      ],
      seo: { title: "Montaña de 7 Colores | Kusi Q'umir", description: "Reserva el tour a la Montaña de 7 Colores Vinicunca. Trekking inolvidable a 5,200 msnm con guía profesional.", keywords: ["Montaña de 7 Colores", "Vinicunca", "Montaña Arcoíris", "Cusco"] },
      destinations: [{ key: "montanaColores", sortOrder: 1 }],
    },
    {
      slug: "valle-sur",
      code: "VS-002",
      title: "Valle Sur del Cusco",
      subtitle: "Tipón, Pikillaqta y Andahuaylillas",
      shortDescription: "Explora el Valle Sur del Cusco visitando Tipón, Pikillaqta y la Capilla Sixtina de América.",
      description: "Una ruta menos transitada pero igualmente fascinante que recorre tres hitos históricos del sur cusqueño. Comienzas en Tipón, el Templo del Agua, donde canales, acueductos y fuentes ceremoniales de piedra tallada aún conducen agua con una precisión hidráulica asombrosa, demostrando el dominio inca de la ingeniería. Continúas en Pikillaqta, la ciudad mejor conservada de la cultura Wari (preincaica), con sus 50 hectáreas de recintos rectangulares, plazas y calles que albergaron a miles de habitantes. Finalizas en Andahuaylillas, cuya modesta fachada de adobe esconde la llamada Capilla Sixtina de América, un tesoro de murales barrocos, pan de oro y arte colonial que cubre cada centímetro de sus muros y techos.",
      durationHours: 5,
      durationDays: 1,
      difficulty: "Easy" as Difficulty,
      groupType: "Shared" as GroupType,
      serviceType: "HalfDay" as ServiceType,
      featured: false,
      active: true,
      recommendedFor: ["Primera vez en Cusco o tour de aclimatación", "Amantes de la cultura e historia"],
      categoryId: categoryMap["historia"],
      prices: [{ name: "General", currency: "USD", adult: 35, child: 25 }],
      itineraryDays: [
        {
          day: 1,
          title: "Valle Sur",
          activities: [
            { sortOrder: 1, time: "08:00", title: "Recojo del hotel", description: "Inicio del tour con recojo desde tu hotel", duration: 30 },
            { sortOrder: 2, time: "09:00", title: "Andahuaylillas", description: "Visita a la Capilla Sixtina de América con sus murales y retablos", duration: 60 },
            { sortOrder: 3, time: "10:30", title: "Tipón", description: "Recorrido por el impresionante sistema hidráulico inca", duration: 60 },
            { sortOrder: 4, time: "12:00", title: "Pikillaqta", description: "Visita al centro administrativo de la cultura Wari", duration: 45 },
            { sortOrder: 5, time: "13:00", title: "Retorno a Cusco", description: "Viaje de regreso al centro de Cusco", duration: 45 },
          ],
        },
      ],
      includes: [
        { title: "Transporte turístico", description: "Recojo y retorno desde hotel céntrico" },
        { title: "Guía profesional", description: "Guía bilingüe español-inglés" },
      ],
      excludes: [
        { title: "Entradas", description: "Boleto Turístico del Cusco (BTC) no incluido para Tipón y Pikillaqta" },
        { title: "Alimentación", description: "Comidas y bebidas no incluidas" },
      ],
      faqs: [
        { question: "¿Qué es la Capilla Sixtina de América?", answer: "Es la iglesia de Andahuaylillas, famosa por sus murales y retablos barrocos del siglo XVII.", sortOrder: 1 },
      ],
      recommendations: [
        { title: "Tour complementario", description: "Ideal para combinar con el City Tour Cusco si te gusta la historia" },
      ],
      requirements: [
        { requirement: "Boleto Turístico del Cusco (BTC) para ingresar a Tipón y Pikillaqta" },
      ],
      images: [
        { url: "/images/tours/valle-sur.webp", alt: "Valle Sur del Cusco", featured: true, sortOrder: 1 },
      ],
      seo: { title: "Valle Sur del Cusco | Kusi Q'umir", description: "Reserva el tour al Valle Sur del Cusco. Visita Tipón, Pikillaqta y Andahuaylillas con guía profesional.", keywords: ["Valle Sur", "Tipón", "Pikillaqta", "Andahuaylillas", "Cusco"] },
      destinations: [{ key: "tipon", sortOrder: 1 }, { key: "piquillacta", sortOrder: 2 }, { key: "andahuaylillas", sortOrder: 3 }],
    },
    {
      slug: "waqrapukara",
      code: "WQ-001",
      title: "Waqrapukara",
      subtitle: "La fortaleza secreta de los Andes",
      shortDescription: "Descubre la imponente fortaleza de Waqrapukara, un tesoro escondido fuera de las rutas turísticas tradicionales.",
      description: "Una aventura fuera de las rutas turísticas convencionales hacia una fortaleza ceremonial inca enclavada en lo alto de un acantilado, con vistas al imponente cañón del río Apurímac. El nombre quechua significa fortaleza con cuernos, por las formaciones rocosas que enmarcan el sitio. El trekking de día completo atraviesa comunidades altoandinas remotas, paisajes abiertos de puna y rebaños de llamas, culminando en un sitio arqueológico de una espectacularidad difícil de igualar: plazas, terrazas, nichos trapezoidales y recintos ceremoniales integrados con la roca natural, suspendidos sobre un abismo de vértigo. La ausencia de multitudes y la energía del lugar hacen de esta caminata una experiencia inolvidable para quienes buscan algo más allá de los destinos masificados.",
      durationHours: 12,
      durationDays: 1,
      difficulty: "Challenging" as Difficulty,
      groupType: "Shared" as GroupType,
      serviceType: "FullDay" as ServiceType,
      featured: false,
      active: true,
      recommendedFor: ["Para quienes les gusta el trekking", "Aventureros fuera de la ruta turística"],
      categoryId: categoryMap["aventura"],
      prices: [{ name: "General", currency: "USD", adult: 55, child: 40 }],
      itineraryDays: [
        {
          day: 1,
          title: "Waqrapukara",
          activities: [
            { sortOrder: 1, time: "05:00", title: "Recojo del hotel", description: "Inicio del tour con recojo desde tu hotel", duration: 30 },
            { sortOrder: 2, time: "08:00", title: "Llegada a Acomayo", description: "Desayuno en el pueblo de Acomayo", duration: 45 },
            { sortOrder: 3, time: "09:00", title: "Inicio de caminata", description: "Inicio del trekking hacia la fortaleza", duration: 15 },
            { sortOrder: 4, time: "11:00", title: "Waqrapukara", description: "Llegada a la fortaleza. Visita guiada y tiempo para fotos", duration: 90 },
            { sortOrder: 5, time: "12:30", title: "Retorno", description: "Caminata de regreso a Acomayo", duration: 90 },
            { sortOrder: 6, time: "14:30", title: "Almuerzo", description: "Almuerzo en Acomayo", duration: 60 },
            { sortOrder: 7, time: "15:30", title: "Retorno a Cusco", description: "Viaje de regreso al centro de Cusco", duration: 180 },
          ],
        },
      ],
      includes: [
        { title: "Transporte turístico", description: "Recojo y retorno desde hotel céntrico" },
        { title: "Guía profesional", description: "Guía bilingüe español-inglés" },
        { title: "Desayuno andino", description: "Desayuno ligero en Acomayo" },
        { title: "Almuerzo", description: "Almuerzo en restaurante local" },
      ],
      excludes: [
        { title: "Entrada", description: "Ticket de ingreso (S/ 15) no incluido" },
      ],
      faqs: [
        { question: "¿Es seguro el tour?", answer: "Sí, vamos con guías experimentados que conocen la ruta perfectamente.", sortOrder: 1 },
        { question: "¿Hay mucha gente?", answer: "No, Waqrapukara recibe pocos visitantes. Es ideal para quienes buscan tranquilidad.", sortOrder: 2 },
      ],
      recommendations: [
        { title: "Para aventureros", description: "Este tour es ideal si ya hiciste los clásicos y buscas algo diferente" },
        { title: "Llevar snacks", description: "La caminata es larga, lleva snacks energéticos adicionales" },
      ],
      requirements: [
        { requirement: "Buena condición física para caminata de 4 horas total (ida y vuelta)" },
        { requirement: "Aclimatación previa de mínimo 2 días en Cusco" },
      ],
      images: [
        { url: "/images/tours/waqrapukara.webp", alt: "Fortaleza de Waqrapukara", featured: true, sortOrder: 1 },
      ],
      seo: { title: "Waqrapukara | Kusi Q'umir", description: "Reserva el tour a Waqrapukara, la fortaleza secreta de los Andes. Trekking fuera de la ruta turística.", keywords: ["Waqrapukara", "fortaleza", "trekking", "Cusco", "fuera de ruta"] },
      destinations: [{ key: "waqrapukara", sortOrder: 1 }],
    },
    {
      slug: "puente-qeswachaka",
      code: "PQ-001",
      title: "Puente Q'eswachaka",
      subtitle: "El último puente inca tejido a mano",
      shortDescription: "Conoce el puente Q'eswachaka, la última muestra viva de la ingeniería inca reconstruida cada año por las comunidades locales.",
      description: "Un viaje al último puente colgante inca construido íntegramente con fibra vegetal de ichu, declarado Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO. Suspendido a 30 metros sobre el río Apurímac, este puente de 28 metros de longitud es reconstruido cada mes de junio por cuatro comunidades locales en una ceremonia ancestral que se ha transmitido de generación en generación durante más de 500 años. Durante la visita podrás cruzar esta maravilla de la ingeniería precolombina y sentir la conexión con una tradición viva que resiste al tiempo. El tour también incluye el circuito de las Cuatro Lagunas —Pomacanchi, Acopia, Asnaqocha y Pampamarca—, un paisaje de alta montaña de una belleza serena y espectacular.",
      durationHours: 12,
      durationDays: 1,
      difficulty: "Easy" as Difficulty,
      groupType: "Shared" as GroupType,
      serviceType: "FullDay" as ServiceType,
      featured: false,
      active: true,
      recommendedFor: ["Amantes de la cultura e historia", "Para conocer tradiciones vivas"],
      categoryId: categoryMap["historia"],
      prices: [{ name: "General", currency: "USD", adult: 50, child: 35 }],
      itineraryDays: [
        {
          day: 1,
          title: "Puente Q'eswachaka",
          activities: [
            { sortOrder: 1, time: "05:00", title: "Recojo del hotel", description: "Inicio del tour con recojo desde tu hotel", duration: 30 },
            { sortOrder: 2, time: "08:00", title: "Desayuno en Yanaoca", description: "Desayuno andino en el pueblo de Yanaoca", duration: 45 },
            { sortOrder: 3, time: "09:00", title: "Puente Q'eswachaka", description: "Visita guiada al puente inca, historia y proceso de reconstrucción", duration: 90 },
            { sortOrder: 4, time: "11:00", title: "Mirador", description: "Vistas panorámicas del cañón y el río Apurímac", duration: 30 },
            { sortOrder: 5, time: "12:00", title: "Almuerzo", description: "Almuerzo en restaurante local en Yanaoca", duration: 60 },
            { sortOrder: 6, time: "13:30", title: "Retorno a Cusco", description: "Viaje de regreso al centro de Cusco", duration: 240 },
          ],
        },
      ],
      includes: [
        { title: "Transporte turístico", description: "Recojo y retorno desde hotel céntrico" },
        { title: "Guía profesional", description: "Guía bilingüe español-inglés" },
        { title: "Desayuno andino", description: "Desayuno ligero en Yanaoca" },
        { title: "Almuerzo", description: "Almuerzo en restaurante local" },
      ],
      excludes: [
        { title: "Entrada", description: "Aporte voluntario a la comunidad (S/ 10)" },
      ],
      faqs: [
        { question: "¿Se puede cruzar el puente?", answer: "Sí, puedes cruzar el puente durante la visita guiada.", sortOrder: 1 },
        { question: "¿Cuándo reconstruyen el puente?", answer: "La reconstrucción anual se realiza en junio. Es un evento ceremonial imperdible.", sortOrder: 2 },
      ],
      recommendations: [
        { title: "Visitar en junio", description: "Si puedes, programa tu visita en junio para ver la reconstrucción ceremonial del puente" },
      ],
      requirements: [
        { requirement: "No apto para personas con vértigo severo (el puente está a 20 metros de altura)" },
      ],
      images: [
        { url: "/images/tours/puente-qeswachaka.webp", alt: "Puente Q'eswachaka", featured: true, sortOrder: 1 },
      ],
      seo: { title: "Puente Q'eswachaka | Kusi Q'umir", description: "Reserva el tour al Puente Q'eswachaka, el último puente inca tejido a mano. Patrimonio Cultural de la Humanidad.", keywords: ["Q'eswachaka", "puente inca", "Cusco", "tradición", "cultura viva"] },
      destinations: [{ key: "qeswachaka", sortOrder: 1 }],
    },
    {
      slug: "palcoyo",
      code: "PL-001",
      title: "Montaña Palcoyo",
      subtitle: "La montaña de colores alternativa",
      shortDescription: "Descubre la Montaña Palcoyo, una alternativa menos exigente a la Montaña de 7 Colores con paisajes igualmente espectaculares.",
      description: "La alternativa ideal para quienes desean maravillarse con los colores del arcoíris andino sin someterse a la exigente caminata de Vinicunca. Palcoyo ofrece un sendero corto y de pendiente suave de apenas 30 a 45 minutos, accesible para la mayoría de viajeros. El paisaje es surrealista: tres montañas de colores se despliegan ante tus ojos, acompañadas de un bosque de piedras de formaciones rocosas esculpidas por el viento y la erosión. Todo ello con el imponente nevado Ausangate como telón de fondo. La baja afluencia de visitantes permite una experiencia tranquila y auténtica, perfecta para fotografiar sin multitudes.",
      durationHours: 10,
      durationDays: 1,
      difficulty: "Easy" as Difficulty,
      groupType: "Shared" as GroupType,
      serviceType: "FullDay" as ServiceType,
      featured: false,
      active: true,
      recommendedFor: ["Amantes de las caminatas", "Alternativa a la Montaña de 7 Colores"],
      categoryId: categoryMap["naturaleza"],
      prices: [{ name: "General", currency: "USD", adult: 45, child: 35 }],
      itineraryDays: [
        {
          day: 1,
          title: "Montaña Palcoyo",
          activities: [
            { sortOrder: 1, time: "05:00", title: "Recojo del hotel", description: "Inicio del tour con recojo desde tu hotel", duration: 30 },
            { sortOrder: 2, time: "07:30", title: "Desayuno en Checacupe", description: "Desayuno andino en el pueblo de Checacupe", duration: 45 },
            { sortOrder: 3, time: "08:30", title: "Inicio de caminata", description: "Inicio del trekking hacia la montaña de colores", duration: 15 },
            { sortOrder: 4, time: "09:30", title: "Llegada a Palcoyo", description: "Llegada al mirador de las tres montañas de colores", duration: 90 },
            { sortOrder: 5, time: "11:00", title: "Retorno", description: "Caminata de regreso al punto de partida", duration: 45 },
            { sortOrder: 6, time: "12:00", title: "Almuerzo", description: "Almuerzo en Checacupe", duration: 60 },
            { sortOrder: 7, time: "13:30", title: "Retorno a Cusco", description: "Viaje de regreso al centro de Cusco", duration: 180 },
          ],
        },
      ],
      includes: [
        { title: "Transporte turístico", description: "Recojo y retorno desde hotel céntrico" },
        { title: "Guía profesional", description: "Guía bilingüe español-inglés" },
        { title: "Desayuno andino", description: "Desayuno ligero en Checacupe" },
        { title: "Almuerzo", description: "Almuerzo en restaurante local" },
      ],
      excludes: [
        { title: "Entrada", description: "Ticket de ingreso (S/ 20) no incluido" },
      ],
      faqs: [
        { question: "¿Es más fácil que la Montaña de 7 Colores?", answer: "Sí, la caminata es mucho más corta (30-40 minutos) y a menor altitud.", sortOrder: 1 },
        { question: "¿Se ven los colores igual?", answer: "Sí, los colores son igual de impresionantes. Además, ves tres montañas de colores desde un solo punto.", sortOrder: 2 },
      ],
      recommendations: [
        { title: "Para toda la familia", description: "Es una caminata corta y fácil, ideal para familias con niños o personas con poca experiencia en altura" },
      ],
      requirements: [
        { requirement: "Condición física básica para caminata corta de 30-40 minutos" },
        { requirement: "Aclimatación previa recomendada de 1-2 días en Cusco" },
      ],
      images: [
        { url: "/images/tours/palcoyo.webp", alt: "Montaña Palcoyo", featured: true, sortOrder: 1 },
      ],
      seo: { title: "Montaña Palcoyo | Kusi Q'umir", description: "Reserva el tour a la Montaña Palcoyo. La alternativa más accesible a la Montaña de 7 Colores.", keywords: ["Palcoyo", "Montaña de Colores", "Cusco", "alternativa Vinicunca"] },
      destinations: [{ key: "palcoyo", sortOrder: 1 }],
    },
  ];

  for (const tourData of toursData) {
    const { prices, itineraryDays, includes, excludes, faqs, recommendations, requirements, images, seo, destinations, ...tour } = tourData;

    const createdTour = await prisma.tour.create({
      data: {
        ...tour,
        prices: { create: prices },
        itineraryDays: {
          create: itineraryDays.map((day) => ({
            day: day.day,
            title: day.title,
            activities: { create: day.activities },
          })),
        },
        includes: { create: includes },
        excludes: { create: excludes },
        faqs: { create: faqs },
        recommendations: { create: recommendations },
        requirements: { create: requirements },
        images: { create: images },
        seo: seo ? { create: seo } : undefined,
        destinations: {
          create: destinations.map((d: { key: string; sortOrder: number }) => ({
            destinationId: destMap[d.key],
            sortOrder: d.sortOrder,
          })),
        },
      },
    });

    console.log(`Seed: Tour "${tourData.title}" creado (${createdTour.slug})`);
  }

  const allTours = await prisma.tour.findMany();
  const tourMap = Object.fromEntries(allTours.map((t) => [t.slug, t.id]));

const packagesData = [
    {
      name: "Ruta Inca Clásica",
      slug: "ruta-inca-clasica",
      description: "Cusco, Valle Sagrado y Machu Picchu en un solo viaje. Historia, cultura y paisajes inolvidables.",
      price: 1890,
      durationDays: 5,
      discount: 180,
      featured: true,
      included: "Hospedaje 4 estrellas, Transporte, Guía local, Entradas",
      excluded: "Vuelos internacionales, Comidas no especificadas",
      tourSlugs: ["city-tour-cusco", "valle-sagrado", "machu-picchu-full-day"],
    },
    {
      name: "Aventura Andina",
      slug: "aventura-andina",
      description: "Explora la laguna Humantay y el Valle Sur en una travesía por los Andes del Cusco.",
      price: 1680,
      durationDays: 6,
      discount: 120,
      featured: true,
      included: "Hospedaje, Transporte, Guía bilingüe, Entradas",
      excluded: "Vuelos, Seguros, Propinas",
      tourSlugs: ["laguna-humantay", "valle-sur", "maras-moray"],
    },
    {
      name: "Perú Esencial",
      slug: "peru-esencial",
      description: "Una experiencia completa que combina historia, naturaleza y aventura en el Cusco profundo.",
      price: 2200,
      durationDays: 8,
      discount: 250,
      featured: true,
      included: "Alojamiento, Alimentación, Guías, Transporte interno, Excursiones",
      excluded: "Vuelos internacionales, Seguros de viaje, Compras personales",
      tourSlugs: ["machu-picchu-full-day", "city-tour-cusco", "montana-colores", "valle-sagrado"],
    },
    {
      name: "Escapada Andina",
      slug: "escapada-andina",
      description: "Conoce el Valle Sur y Maras Moray en una escapada corta pero completa.",
      price: 680,
      durationDays: 3,
      discount: 50,
      featured: false,
      included: "Transporte, Guía, Entradas, Alojamiento, Comidas",
      excluded: "Bebidas, Seguros, Propinas",
      tourSlugs: ["valle-sur", "maras-moray"],
    },
  ];

  for (const pkg of packagesData) {
    const { tourSlugs, ...pkgData } = pkg;
    const tourIds = tourSlugs.map((slug) => tourMap[slug]).filter(Boolean);
    await prisma.package.create({
      data: {
        ...pkgData,
        tours: { connect: tourIds.map((id) => ({ id })) },
      },
    });
  }

  console.log(`Seed: ${packagesData.length} paquetes creados`);
  console.log(`Seed: ${allTours.length} tours creados exitosamente`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
