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

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Tour" CASCADE`);
  } catch {
    // old seed data skipped — schema updated
  }

  // ===== TESTIMONIALS =====
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
  return;

  // ===== TOUR 1: City Tour Cusco =====
  const tour1 = await prisma.tour.create({
    data: {
      slug: "city-tour-cusco",
      name: "City Tour Cusco",
      subtitle: "",
      shortDescription: "Excursión a City Tour Cusco.",
      description: "Tour turístico por City Tour Cusco con guía profesional y transporte.",
      category: "Tour",
      tourType: "Grupal",
      durationDays: 1,
      durationHours: 12,
      durationText: "Full Day",
      country: "Perú",
      region: "Cusco",
      city: "Cusco",
      meetingPoint: "Hotel",
      endingPoint: "Cusco",
      pickup: true,
      startTime: "04:30",
      endTime: "18:30",
      difficulty: "Moderado",
      altitudeMin: 3300,
      altitudeMax: 5000,
      groupType: "Compartido",
      featured: false,
      status: "published",
      coverImage: "",
      video: "",
      currency: "USD",
      adultPrice: 35,
      childPrice: 25,
      discount: 0,
      seoTitle: "City Tour Cusco",
      seoDescription: "Reserva el tour City Tour Cusco en Cusco.",
      seoKeywords: ["City Tour Cusco", "Cusco"],
      languages: {
        create: [
          { language: "Español" },
          { language: "Inglés" },
        ],
      },
      highlights: {
        create: [
          { title: "Guía profesional", description: "Servicio bilingüe.", icon: "👨‍🏫" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "04:30", title: "Recojo", description: "Recojo desde el hotel.", location: "Cusco", duration: 30 },
        ],
      },
      destinations: {
        create: [
          { name: "Cusco", type: "Destino", description: "Principal atractivo.", latitude: null, longitude: null, altitude: null, visitTime: 120 },
        ],
      },
      includes: {
        create: [
          { title: "Transporte", description: "Servicio turístico." },
          { title: "Guía", description: "Guía profesional." },
        ],
      },
      notIncludes: {
        create: [
          { title: "Entradas", description: "Según el circuito." },
        ],
      },
      recommendations: {
        create: [
          { title: "Llevar abrigo", description: "Por cambios climáticos." },
        ],
      },
      whatToBring: {
        create: [
          { item: "Pasaporte" },
          { item: "Bloqueador solar" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Buen estado de salud" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Incluye recojo?", answer: "Sí, desde hoteles céntricos." },
        ],
      },
      images: {
        create: [
          { url: "", alt: "City Tour Cusco", featured: true, order: 1 },
        ],
      },
    },
  });

  // ===== TOUR 2: Valle Sagrado =====
  const tour2 = await prisma.tour.create({
    data: {
      slug: "valle-sagrado",
      name: "Valle Sagrado",
      subtitle: "",
      shortDescription: "Excursión a Valle Sagrado.",
      description: "Tour turístico por Valle Sagrado con guía profesional y transporte.",
      category: "Tour",
      tourType: "Grupal",
      durationDays: 1,
      durationHours: 12,
      durationText: "Full Day",
      country: "Perú",
      region: "Cusco",
      city: "Urubamba",
      meetingPoint: "Hotel",
      endingPoint: "Cusco",
      pickup: true,
      startTime: "04:30",
      endTime: "18:30",
      difficulty: "Moderado",
      altitudeMin: 3300,
      altitudeMax: 5000,
      groupType: "Compartido",
      featured: false,
      status: "published",
      coverImage: "",
      video: "",
      currency: "USD",
      adultPrice: 35,
      childPrice: 25,
      discount: 0,
      seoTitle: "Valle Sagrado",
      seoDescription: "Reserva el tour Valle Sagrado en Cusco.",
      seoKeywords: ["Valle Sagrado", "Cusco"],
      languages: {
        create: [
          { language: "Español" },
          { language: "Inglés" },
        ],
      },
      highlights: {
        create: [
          { title: "Guía profesional", description: "Servicio bilingüe.", icon: "👨‍🏫" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "04:30", title: "Recojo", description: "Recojo desde el hotel.", location: "Cusco", duration: 30 },
        ],
      },
      destinations: {
        create: [
          { name: "Urubamba", type: "Destino", description: "Principal atractivo.", latitude: null, longitude: null, altitude: null, visitTime: 120 },
        ],
      },
      includes: {
        create: [
          { title: "Transporte", description: "Servicio turístico." },
          { title: "Guía", description: "Guía profesional." },
        ],
      },
      notIncludes: {
        create: [
          { title: "Entradas", description: "Según el circuito." },
        ],
      },
      recommendations: {
        create: [
          { title: "Llevar abrigo", description: "Por cambios climáticos." },
        ],
      },
      whatToBring: {
        create: [
          { item: "Pasaporte" },
          { item: "Bloqueador solar" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Buen estado de salud" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Incluye recojo?", answer: "Sí, desde hoteles céntricos." },
        ],
      },
      images: {
        create: [
          { url: "", alt: "Valle Sagrado", featured: true, order: 1 },
        ],
      },
    },
  });

  // ===== TOUR 3: Maras y Moray =====
  const tour3 = await prisma.tour.create({
    data: {
      slug: "maras-moray",
      name: "Maras y Moray",
      subtitle: "",
      shortDescription: "Excursión a Maras y Moray.",
      description: "Tour turístico por Maras y Moray con guía profesional y transporte.",
      category: "Tour",
      tourType: "Grupal",
      durationDays: 1,
      durationHours: 12,
      durationText: "Full Day",
      country: "Perú",
      region: "Cusco",
      city: "Maras",
      meetingPoint: "Hotel",
      endingPoint: "Cusco",
      pickup: true,
      startTime: "04:30",
      endTime: "18:30",
      difficulty: "Moderado",
      altitudeMin: 3300,
      altitudeMax: 5000,
      groupType: "Compartido",
      featured: false,
      status: "published",
      coverImage: "",
      video: "",
      currency: "USD",
      adultPrice: 35,
      childPrice: 25,
      discount: 0,
      seoTitle: "Maras y Moray",
      seoDescription: "Reserva el tour Maras y Moray en Cusco.",
      seoKeywords: ["Maras y Moray", "Cusco"],
      languages: {
        create: [
          { language: "Español" },
          { language: "Inglés" },
        ],
      },
      highlights: {
        create: [
          { title: "Guía profesional", description: "Servicio bilingüe.", icon: "👨‍🏫" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "04:30", title: "Recojo", description: "Recojo desde el hotel.", location: "Cusco", duration: 30 },
        ],
      },
      destinations: {
        create: [
          { name: "Maras", type: "Destino", description: "Principal atractivo.", latitude: null, longitude: null, altitude: null, visitTime: 120 },
        ],
      },
      includes: {
        create: [
          { title: "Transporte", description: "Servicio turístico." },
          { title: "Guía", description: "Guía profesional." },
        ],
      },
      notIncludes: {
        create: [
          { title: "Entradas", description: "Según el circuito." },
        ],
      },
      recommendations: {
        create: [
          { title: "Llevar abrigo", description: "Por cambios climáticos." },
        ],
      },
      whatToBring: {
        create: [
          { item: "Pasaporte" },
          { item: "Bloqueador solar" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Buen estado de salud" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Incluye recojo?", answer: "Sí, desde hoteles céntricos." },
        ],
      },
      images: {
        create: [
          { url: "", alt: "Maras y Moray", featured: true, order: 1 },
        ],
      },
    },
  });

  // ===== TOUR 4: Machu Picchu Full Day =====
  const tour4 = await prisma.tour.create({
    data: {
      slug: "machu-picchu-full-day",
      name: "Machu Picchu Full Day",
      subtitle: "",
      shortDescription: "Excursión a Machu Picchu Full Day.",
      description: "Tour turístico por Machu Picchu Full Day con guía profesional y transporte.",
      category: "Tour",
      tourType: "Grupal",
      durationDays: 1,
      durationHours: 12,
      durationText: "Full Day",
      country: "Perú",
      region: "Cusco",
      city: "Machu Picchu",
      meetingPoint: "Hotel",
      endingPoint: "Cusco",
      pickup: true,
      startTime: "04:30",
      endTime: "18:30",
      difficulty: "Moderado",
      altitudeMin: 3300,
      altitudeMax: 5000,
      groupType: "Compartido",
      featured: false,
      status: "published",
      coverImage: "",
      video: "",
      currency: "USD",
      adultPrice: 35,
      childPrice: 25,
      discount: 0,
      seoTitle: "Machu Picchu Full Day",
      seoDescription: "Reserva el tour Machu Picchu Full Day en Cusco.",
      seoKeywords: ["Machu Picchu Full Day", "Cusco"],
      languages: {
        create: [
          { language: "Español" },
          { language: "Inglés" },
        ],
      },
      highlights: {
        create: [
          { title: "Guía profesional", description: "Servicio bilingüe.", icon: "👨‍🏫" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "04:30", title: "Recojo", description: "Recojo desde el hotel.", location: "Cusco", duration: 30 },
        ],
      },
      destinations: {
        create: [
          { name: "Machu Picchu", type: "Destino", description: "Principal atractivo.", latitude: null, longitude: null, altitude: null, visitTime: 120 },
        ],
      },
      includes: {
        create: [
          { title: "Transporte", description: "Servicio turístico." },
          { title: "Guía", description: "Guía profesional." },
        ],
      },
      notIncludes: {
        create: [
          { title: "Entradas", description: "Según el circuito." },
        ],
      },
      recommendations: {
        create: [
          { title: "Llevar abrigo", description: "Por cambios climáticos." },
        ],
      },
      whatToBring: {
        create: [
          { item: "Pasaporte" },
          { item: "Bloqueador solar" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Buen estado de salud" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Incluye recojo?", answer: "Sí, desde hoteles céntricos." },
        ],
      },
      images: {
        create: [
          { url: "", alt: "Machu Picchu Full Day", featured: true, order: 1 },
        ],
      },
    },
  });

  // ===== TOUR 5: Laguna Humantay =====
  const tour5 = await prisma.tour.create({
    data: {
      slug: "laguna-humantay",
      name: "Laguna Humantay",
      subtitle: "",
      shortDescription: "Excursión a Laguna Humantay.",
      description: "Tour turístico por Laguna Humantay con guía profesional y transporte.",
      category: "Tour",
      tourType: "Grupal",
      durationDays: 1,
      durationHours: 12,
      durationText: "Full Day",
      country: "Perú",
      region: "Cusco",
      city: "Mollepata",
      meetingPoint: "Hotel",
      endingPoint: "Cusco",
      pickup: true,
      startTime: "04:30",
      endTime: "18:30",
      difficulty: "Moderado",
      altitudeMin: 3300,
      altitudeMax: 5000,
      groupType: "Compartido",
      featured: false,
      status: "published",
      coverImage: "",
      video: "",
      currency: "USD",
      adultPrice: 35,
      childPrice: 25,
      discount: 0,
      seoTitle: "Laguna Humantay",
      seoDescription: "Reserva el tour Laguna Humantay en Cusco.",
      seoKeywords: ["Laguna Humantay", "Cusco"],
      languages: {
        create: [
          { language: "Español" },
          { language: "Inglés" },
        ],
      },
      highlights: {
        create: [
          { title: "Guía profesional", description: "Servicio bilingüe.", icon: "👨‍🏫" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "04:30", title: "Recojo", description: "Recojo desde el hotel.", location: "Cusco", duration: 30 },
        ],
      },
      destinations: {
        create: [
          { name: "Mollepata", type: "Destino", description: "Principal atractivo.", latitude: null, longitude: null, altitude: null, visitTime: 120 },
        ],
      },
      includes: {
        create: [
          { title: "Transporte", description: "Servicio turístico." },
          { title: "Guía", description: "Guía profesional." },
        ],
      },
      notIncludes: {
        create: [
          { title: "Entradas", description: "Según el circuito." },
        ],
      },
      recommendations: {
        create: [
          { title: "Llevar abrigo", description: "Por cambios climáticos." },
        ],
      },
      whatToBring: {
        create: [
          { item: "Pasaporte" },
          { item: "Bloqueador solar" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Buen estado de salud" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Incluye recojo?", answer: "Sí, desde hoteles céntricos." },
        ],
      },
      images: {
        create: [
          { url: "", alt: "Laguna Humantay", featured: true, order: 1 },
        ],
      },
    },
  });

  // ===== TOUR 6: Montaña de Colores =====
  const tour6 = await prisma.tour.create({
    data: {
      slug: "montana-colores",
      name: "Montaña de Colores",
      subtitle: "",
      shortDescription: "Excursión a Montaña de Colores.",
      description: "Tour turístico por Montaña de Colores con guía profesional y transporte.",
      category: "Tour",
      tourType: "Grupal",
      durationDays: 1,
      durationHours: 12,
      durationText: "Full Day",
      country: "Perú",
      region: "Cusco",
      city: "Pitumarca",
      meetingPoint: "Hotel",
      endingPoint: "Cusco",
      pickup: true,
      startTime: "04:30",
      endTime: "18:30",
      difficulty: "Moderado",
      altitudeMin: 3300,
      altitudeMax: 5000,
      groupType: "Compartido",
      featured: false,
      status: "published",
      coverImage: "",
      video: "",
      currency: "USD",
      adultPrice: 35,
      childPrice: 25,
      discount: 0,
      seoTitle: "Montaña de Colores",
      seoDescription: "Reserva el tour Montaña de Colores en Cusco.",
      seoKeywords: ["Montaña de Colores", "Cusco"],
      languages: {
        create: [
          { language: "Español" },
          { language: "Inglés" },
        ],
      },
      highlights: {
        create: [
          { title: "Guía profesional", description: "Servicio bilingüe.", icon: "👨‍🏫" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "04:30", title: "Recojo", description: "Recojo desde el hotel.", location: "Cusco", duration: 30 },
        ],
      },
      destinations: {
        create: [
          { name: "Pitumarca", type: "Destino", description: "Principal atractivo.", latitude: null, longitude: null, altitude: null, visitTime: 120 },
        ],
      },
      includes: {
        create: [
          { title: "Transporte", description: "Servicio turístico." },
          { title: "Guía", description: "Guía profesional." },
        ],
      },
      notIncludes: {
        create: [
          { title: "Entradas", description: "Según el circuito." },
        ],
      },
      recommendations: {
        create: [
          { title: "Llevar abrigo", description: "Por cambios climáticos." },
        ],
      },
      whatToBring: {
        create: [
          { item: "Pasaporte" },
          { item: "Bloqueador solar" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Buen estado de salud" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Incluye recojo?", answer: "Sí, desde hoteles céntricos." },
        ],
      },
      images: {
        create: [
          { url: "", alt: "Montaña de Colores", featured: true, order: 1 },
        ],
      },
    },
  });

  // ===== TOUR 7: Valle Sur =====
  const tour7 = await prisma.tour.create({
    data: {
      slug: "valle-sur",
      name: "Valle Sur",
      subtitle: "",
      shortDescription: "Excursión a Valle Sur.",
      description: "Tour turístico por Valle Sur con guía profesional y transporte.",
      category: "Tour",
      tourType: "Grupal",
      durationDays: 1,
      durationHours: 12,
      durationText: "Full Day",
      country: "Perú",
      region: "Cusco",
      city: "Tipón",
      meetingPoint: "Hotel",
      endingPoint: "Cusco",
      pickup: true,
      startTime: "04:30",
      endTime: "18:30",
      difficulty: "Moderado",
      altitudeMin: 3300,
      altitudeMax: 5000,
      groupType: "Compartido",
      featured: false,
      status: "published",
      coverImage: "",
      video: "",
      currency: "USD",
      adultPrice: 35,
      childPrice: 25,
      discount: 0,
      seoTitle: "Valle Sur",
      seoDescription: "Reserva el tour Valle Sur en Cusco.",
      seoKeywords: ["Valle Sur", "Cusco"],
      languages: {
        create: [
          { language: "Español" },
          { language: "Inglés" },
        ],
      },
      highlights: {
        create: [
          { title: "Guía profesional", description: "Servicio bilingüe.", icon: "👨‍🏫" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "04:30", title: "Recojo", description: "Recojo desde el hotel.", location: "Cusco", duration: 30 },
        ],
      },
      destinations: {
        create: [
          { name: "Tipón", type: "Destino", description: "Principal atractivo.", latitude: null, longitude: null, altitude: null, visitTime: 120 },
        ],
      },
      includes: {
        create: [
          { title: "Transporte", description: "Servicio turístico." },
          { title: "Guía", description: "Guía profesional." },
        ],
      },
      notIncludes: {
        create: [
          { title: "Entradas", description: "Según el circuito." },
        ],
      },
      recommendations: {
        create: [
          { title: "Llevar abrigo", description: "Por cambios climáticos." },
        ],
      },
      whatToBring: {
        create: [
          { item: "Pasaporte" },
          { item: "Bloqueador solar" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Buen estado de salud" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Incluye recojo?", answer: "Sí, desde hoteles céntricos." },
        ],
      },
      images: {
        create: [
          { url: "", alt: "Valle Sur", featured: true, order: 1 },
        ],
      },
    },
  });

  // ===== TOUR 8: Waqrapukara =====
  const tour8 = await prisma.tour.create({
    data: {
      slug: "waqrapukara",
      name: "Waqrapukara",
      subtitle: "",
      shortDescription: "Excursión a Waqrapukara.",
      description: "Tour turístico por Waqrapukara con guía profesional y transporte.",
      category: "Tour",
      tourType: "Grupal",
      durationDays: 1,
      durationHours: 12,
      durationText: "Full Day",
      country: "Perú",
      region: "Cusco",
      city: "Acomayo",
      meetingPoint: "Hotel",
      endingPoint: "Cusco",
      pickup: true,
      startTime: "04:30",
      endTime: "18:30",
      difficulty: "Moderado",
      altitudeMin: 3300,
      altitudeMax: 5000,
      groupType: "Compartido",
      featured: false,
      status: "published",
      coverImage: "",
      video: "",
      currency: "USD",
      adultPrice: 35,
      childPrice: 25,
      discount: 0,
      seoTitle: "Waqrapukara",
      seoDescription: "Reserva el tour Waqrapukara en Cusco.",
      seoKeywords: ["Waqrapukara", "Cusco"],
      languages: {
        create: [
          { language: "Español" },
          { language: "Inglés" },
        ],
      },
      highlights: {
        create: [
          { title: "Guía profesional", description: "Servicio bilingüe.", icon: "👨‍🏫" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "04:30", title: "Recojo", description: "Recojo desde el hotel.", location: "Cusco", duration: 30 },
        ],
      },
      destinations: {
        create: [
          { name: "Acomayo", type: "Destino", description: "Principal atractivo.", latitude: null, longitude: null, altitude: null, visitTime: 120 },
        ],
      },
      includes: {
        create: [
          { title: "Transporte", description: "Servicio turístico." },
          { title: "Guía", description: "Guía profesional." },
        ],
      },
      notIncludes: {
        create: [
          { title: "Entradas", description: "Según el circuito." },
        ],
      },
      recommendations: {
        create: [
          { title: "Llevar abrigo", description: "Por cambios climáticos." },
        ],
      },
      whatToBring: {
        create: [
          { item: "Pasaporte" },
          { item: "Bloqueador solar" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Buen estado de salud" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Incluye recojo?", answer: "Sí, desde hoteles céntricos." },
        ],
      },
      images: {
        create: [
          { url: "", alt: "Waqrapukara", featured: true, order: 1 },
        ],
      },
    },
  });

  // ===== TOUR 9: Puente Q'eswachaka =====
  const tour9 = await prisma.tour.create({
    data: {
      slug: "puente-qeswachaka",
      name: "Puente Q'eswachaka",
      subtitle: "",
      shortDescription: "Excursión a Puente Q'eswachaka.",
      description: "Tour turístico por Puente Q'eswachaka con guía profesional y transporte.",
      category: "Tour",
      tourType: "Grupal",
      durationDays: 1,
      durationHours: 12,
      durationText: "Full Day",
      country: "Perú",
      region: "Cusco",
      city: "Canas",
      meetingPoint: "Hotel",
      endingPoint: "Cusco",
      pickup: true,
      startTime: "04:30",
      endTime: "18:30",
      difficulty: "Moderado",
      altitudeMin: 3300,
      altitudeMax: 5000,
      groupType: "Compartido",
      featured: false,
      status: "published",
      coverImage: "",
      video: "",
      currency: "USD",
      adultPrice: 35,
      childPrice: 25,
      discount: 0,
      seoTitle: "Puente Q'eswachaka",
      seoDescription: "Reserva el tour Puente Q'eswachaka en Cusco.",
      seoKeywords: ["Puente Q'eswachaka", "Cusco"],
      languages: {
        create: [
          { language: "Español" },
          { language: "Inglés" },
        ],
      },
      highlights: {
        create: [
          { title: "Guía profesional", description: "Servicio bilingüe.", icon: "👨‍🏫" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "04:30", title: "Recojo", description: "Recojo desde el hotel.", location: "Cusco", duration: 30 },
        ],
      },
      destinations: {
        create: [
          { name: "Canas", type: "Destino", description: "Principal atractivo.", latitude: null, longitude: null, altitude: null, visitTime: 120 },
        ],
      },
      includes: {
        create: [
          { title: "Transporte", description: "Servicio turístico." },
          { title: "Guía", description: "Guía profesional." },
        ],
      },
      notIncludes: {
        create: [
          { title: "Entradas", description: "Según el circuito." },
        ],
      },
      recommendations: {
        create: [
          { title: "Llevar abrigo", description: "Por cambios climáticos." },
        ],
      },
      whatToBring: {
        create: [
          { item: "Pasaporte" },
          { item: "Bloqueador solar" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Buen estado de salud" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Incluye recojo?", answer: "Sí, desde hoteles céntricos." },
        ],
      },
      images: {
        create: [
          { url: "", alt: "Puente Q'eswachaka", featured: true, order: 1 },
        ],
      },
    },
  });

  // ===== TOUR 10: Montaña Palcoyo =====
  const tour10 = await prisma.tour.create({
    data: {
      slug: "palcoyo",
      name: "Montaña Palcoyo",
      subtitle: "",
      shortDescription: "Excursión a Montaña Palcoyo.",
      description: "Tour turístico por Montaña Palcoyo con guía profesional y transporte.",
      category: "Tour",
      tourType: "Grupal",
      durationDays: 1,
      durationHours: 12,
      durationText: "Full Day",
      country: "Perú",
      region: "Cusco",
      city: "Checacupe",
      meetingPoint: "Hotel",
      endingPoint: "Cusco",
      pickup: true,
      startTime: "04:30",
      endTime: "18:30",
      difficulty: "Moderado",
      altitudeMin: 3300,
      altitudeMax: 5000,
      groupType: "Compartido",
      featured: false,
      status: "published",
      coverImage: "",
      video: "",
      currency: "USD",
      adultPrice: 35,
      childPrice: 25,
      discount: 0,
      seoTitle: "Montaña Palcoyo",
      seoDescription: "Reserva el tour Montaña Palcoyo en Cusco.",
      seoKeywords: ["Montaña Palcoyo", "Cusco"],
      languages: {
        create: [
          { language: "Español" },
          { language: "Inglés" },
        ],
      },
      highlights: {
        create: [
          { title: "Guía profesional", description: "Servicio bilingüe.", icon: "👨‍🏫" },
        ],
      },
      itinerary: {
        create: [
          { day: 1, order: 1, time: "04:30", title: "Recojo", description: "Recojo desde el hotel.", location: "Cusco", duration: 30 },
        ],
      },
      destinations: {
        create: [
          { name: "Checacupe", type: "Destino", description: "Principal atractivo.", latitude: null, longitude: null, altitude: null, visitTime: 120 },
        ],
      },
      includes: {
        create: [
          { title: "Transporte", description: "Servicio turístico." },
          { title: "Guía", description: "Guía profesional." },
        ],
      },
      notIncludes: {
        create: [
          { title: "Entradas", description: "Según el circuito." },
        ],
      },
      recommendations: {
        create: [
          { title: "Llevar abrigo", description: "Por cambios climáticos." },
        ],
      },
      whatToBring: {
        create: [
          { item: "Pasaporte" },
          { item: "Bloqueador solar" },
        ],
      },
      requirements: {
        create: [
          { requirement: "Buen estado de salud" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Incluye recojo?", answer: "Sí, desde hoteles céntricos." },
        ],
      },
      images: {
        create: [
          { url: "", alt: "Montaña Palcoyo", featured: true, order: 1 },
        ],
      },
    },
  });

  console.log(`Seed: 10 tours creados exitosamente con esquema completo`);

  // ===== PACKAGES =====
  const tours = await prisma.tour.findMany({
    where: {
      slug: {
        in: [
          "city-tour-cusco",
          "valle-sagrado",
          "maras-moray",
          "machu-picchu-full-day",
          "laguna-humantay",
          "montana-colores",
          "valle-sur",
          "waqrapukara",
          "puente-qeswachaka",
          "palcoyo",
        ],
      },
    },
  });

  const tourMap = Object.fromEntries(tours.map(t => [t.slug, t.id]));

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
      tourIds: [tourMap["city-tour-cusco"], tourMap["valle-sagrado"]].filter(Boolean),
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
      tourIds: [tourMap["laguna-humantay"], tourMap["valle-sur"]].filter(Boolean),
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
      tourIds: [tourMap["machu-picchu-full-day"], tourMap["city-tour-cusco"], tourMap["montana-colores"]].filter(Boolean),
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
      tourIds: [tourMap["valle-sur"]].filter(Boolean),
    },
  ];

  for (const pkg of packagesData) {
    const { tourIds, ...pkgData } = pkg;
    await prisma.package.create({
      data: {
        ...pkgData,
        tours: { connect: tourIds.map((id) => ({ id })) },
      },
    });
  }

  console.log(`Seed: 4 paquetes creados`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());