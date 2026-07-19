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
  await prisma.tour.deleteMany();

  const toursData = [
    {
      name: "Cusco y Machu Picchu Clásico",
      description: "Explora la ciudad imperial del Cusco y maravíllate con la ciudadela inca de Machu Picchu.",
      duration: "4 días / 3 noches",
      difficulty: "Moderada",
      price: 450,
      location: "Cusco",
      includes: "Alojamiento, desayunos, guía bilingüe, transporte, entradas a Machu Picchu",
      excludes: "Vuelos, comidas no especificadas, seguros",
    },
    {
      name: "Valle Sagrado de los Incas",
      description: "Recorre el corazón del imperio incaico visitando Pisac, Ollantaytambo, Moray y las Salineras de Maras.",
      duration: "2 días / 1 noche",
      difficulty: "Fácil",
      price: 220,
      location: "Valle Sagrado",
      includes: "Transporte, guía, entradas, almuerzo",
      excludes: "Alojamiento, cenas, seguros",
    },
    {
      name: "Arequipa y Cañón del Colca",
      description: "Descubre la Ciudad Blanca y el impresionante Cañón del Colca, hogar del cóndor andino.",
      duration: "3 días / 2 noches",
      difficulty: "Moderada",
      price: 350,
      location: "Arequipa",
      includes: "Alojamiento, desayunos, guía, transporte, entradas",
      excludes: "Vuelos, comidas no especificadas, seguros",
    },
    {
      name: "Lago Titicaca y Uros",
      description: "Navega el lago navegable más alto del mundo y visita las islas flotantes de los Uros y Taquile.",
      duration: "2 días / 1 noche",
      difficulty: "Fácil",
      price: 180,
      location: "Puno",
      includes: "Transporte, guía, entradas, alojamiento en casa familiar, comidas",
      excludes: "Bebidas, seguros, propinas",
    },
    {
      name: "Selva Amazónica - Puerto Maldonado",
      description: "Adéntrate en la selva peruana y descubre su increíble biodiversidad.",
      duration: "4 días / 3 noches",
      difficulty: "Moderada",
      price: 520,
      location: "Puerto Maldonado",
      includes: "Alojamiento, alimentación completa, guía especializado, excursiones",
      excludes: "Vuelos, seguros, equipo personal",
    },
    {
      name: "Lima Clásica y Gastronómica",
      description: "Conoce la capital peruana, su centro histórico y disfruta de la mejor gastronomía.",
      duration: "3 días / 2 noches",
      difficulty: "Fácil",
      price: 280,
      location: "Lima",
      includes: "Alojamiento, desayunos, guía, clase de cocina, transporte",
      excludes: "Vuelos, comidas no especificadas, seguros",
    },
  ];

  const tourIds: string[] = [];
  for (const tour of toursData) {
    const created = await prisma.tour.create({ data: tour });
    tourIds.push(created.id);
  }

  const [cusco, valle, arequipa, titicaca, selva, lima] = tourIds;

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
      tours: [cusco, valle],
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
      tours: [arequipa, titicaca],
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
      tours: [lima, cusco, selva],
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
      tours: [titicaca],
    },
  ];

  for (const pkg of packagesData) {
    const { tours, ...pkgData } = pkg;
    await prisma.package.create({
      data: {
        ...pkgData,
        tours: { connect: tours.map((id) => ({ id })) },
      },
    });
  }

  console.log(`Seed: ${toursData.length} tours + ${packagesData.length} paquetes creados`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
