import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { Prisma, Difficulty, GroupType, ServiceType } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

const tourListSelect = {
  id: true,
  slug: true,
  title: true,
  subtitle: true,
  shortDescription: true,
  durationDays: true,
  durationHours: true,
  difficulty: true,
  groupType: true,
  featured: true,
  active: true,
  categoryId: true,
  createdAt: true,
} satisfies Prisma.TourSelect;

const tourDetailSelect = {
  id: true,
  slug: true,
  code: true,
  title: true,
  subtitle: true,
  shortDescription: true,
  description: true,
  durationHours: true,
  durationDays: true,
  difficulty: true,
  groupType: true,
  serviceType: true,
  featured: true,
  active: true,
  categoryId: true,
  providerId: true,
  createdAt: true,
  updatedAt: true,
  category: true,
  provider: true,
  schedules: true,
  itineraryDays: { include: { activities: { orderBy: { sortOrder: "asc" } } }, orderBy: { day: "asc" } },
  destinations: { include: { destination: true }, orderBy: { sortOrder: "asc" } },
  includes: true,
  excludes: true,
  faqs: { orderBy: { sortOrder: "asc" } },
  recommendations: true,
  requirements: true,
  prices: true,
  images: { orderBy: { sortOrder: "asc" } },
  seo: true,
  metadata: true,
  reviews: { orderBy: { createdAt: "desc" } },
  packages: true,
} satisfies Prisma.TourSelect;

@Injectable()
export class ToursService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublic(query: {
    take?: string;
    cursor?: string;
    difficulty?: string;
  }) {
    const take = Math.min(Math.max(1, Number(query.take) || 20), 100);

    const where: Prisma.TourWhereInput = {
      active: true,
    };

    if (query.difficulty) {
      where.difficulty = query.difficulty as Difficulty;
    }

    const items = await this.prisma.tour.findMany({
      take: take + 1,
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      select: tourListSelect,
    });

    const hasMore = items.length > take;
    if (hasMore) items.pop();

    return { items, nextCursor: hasMore ? items[items.length - 1]!.id : null };
  }

  async findAllAdmin() {
    return this.prisma.tour.findMany({
      orderBy: { createdAt: "desc" },
      select: tourDetailSelect,
    });
  }

  async findOne(id: string) {
    const tour = await this.prisma.tour.findFirst({
      where: { id, active: true },
      select: tourDetailSelect,
    });
    if (!tour) {
      throw new NotFoundException("Tour no encontrado");
    }
    return tour;
  }

  async findOneAdmin(id: string) {
    const tour = await this.prisma.tour.findUnique({
      where: { id },
      select: tourDetailSelect,
    });
    if (!tour) {
      throw new NotFoundException("Tour no encontrado");
    }
    return tour;
  }

  async findBySlug(slug: string) {
    const tour = await this.prisma.tour.findFirst({
      where: { slug, active: true },
      select: tourDetailSelect,
    });
    if (!tour) {
      throw new NotFoundException("Tour no encontrado");
    }
    return tour;
  }

  async create(payload: TourPayload) {
    let slug = payload.slug;
    let attempt = 0;
    // Retry on slug collision, suffixing with -2, -3, ...
    while (true) {
      try {
        return await this.prisma.tour.create({
          data: { ...payload, slug } as any,
          select: tourDetailSelect,
        });
      } catch (e: any) {
        if (e?.code === "P2002" && e?.meta?.target?.includes("slug") && attempt < 50) {
          attempt++;
          slug = `${payload.slug}-${attempt + 1}`;
          continue;
        }
        throw e;
      }
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9áéíóúñü\s-]/g, "")
      .replace(/[\s]+/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async bulkCreate(tours: any[]): Promise<any[]> {
    if (!Array.isArray(tours) || tours.length === 0) {
      throw new Error("Debe enviar un arreglo de tours no vacío.");
    }

    const created: any[] = [];
    await this.prisma.$transaction(async (tx) => {
      for (const raw of tours) {
        const t = { ...raw };
        let categoryId = t.categoryId;
        if (!categoryId && t.categoryName) {
          const slug = this.slugify(t.categoryName);
          const cat = await tx.category.upsert({
            where: { slug },
            update: {},
            create: { name: t.categoryName, slug },
          });
          categoryId = cat.id;
        }
        if (!categoryId) {
          throw new BadRequestException(
            `El tour "${t.title ?? "sin título"}" requiere categoryId o categoryName.`,
          );
        }
        delete t.categoryName;
        const record = await tx.tour.create({
          data: { ...t, categoryId } as any,
          select: tourListSelect,
        });
        created.push(record);
      }
    });
    return created;
  }

  async update(id: string, payload: Partial<TourPayload>) {
    await this.findOneAdmin(id);
    const subEntityKeys = ["itineraryDays", "destinations", "includes", "excludes", "recommendations", "requirements", "faqs", "images", "prices", "schedules", "reviews", "seo", "metadata"] as const;
    const oneToOneKeys = ["seo", "metadata"];
    const subEntities: Record<string, any> = {};
    const scalarPayload: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (subEntityKeys.includes(key as any)) {
        subEntities[key] = value;
      } else {
        scalarPayload[key] = value;
      }
    }
    const data: any = { ...scalarPayload };
    for (const key of Object.keys(subEntities)) {
      if (oneToOneKeys.includes(key)) {
        const nested = subEntities[key].create ?? subEntities[key].upsert;
        const nestedData = Array.isArray(nested) ? nested[0] : nested;
        data[key] = { upsert: { create: nestedData, update: nestedData } };
      } else {
        data[key] = { deleteMany: {}, create: subEntities[key].create };
      }
    }
    let attempt = 0;
    while (true) {
      try {
        return await this.prisma.tour.update({
          where: { id },
          data,
          select: tourDetailSelect,
        });
      } catch (e: any) {
        if (e?.code === "P2002" && e?.meta?.target?.includes("slug") && attempt < 50) {
          attempt++;
          data.slug = `${scalarPayload.slug}-${attempt + 1}`;
          continue;
        }
        throw e;
      }
    }
  }

  async remove(id: string) {
    await this.findOneAdmin(id);
    return this.prisma.tour.delete({ where: { id } });
  }
}

interface TourPayload {
  slug: string;
  code: string;
  title: string;
  subtitle?: string;
  shortDescription: string;
  description: string;
  durationHours: number;
  durationDays: number;
  difficulty: Difficulty;
  groupType: GroupType;
  serviceType: ServiceType;
  featured?: boolean;
  active?: boolean;
  categoryId: string;
  providerId?: string;
  schedules?: Prisma.TourScheduleCreateNestedManyWithoutTourInput;
  itineraryDays?: Prisma.ItineraryDayCreateNestedManyWithoutTourInput;
  destinations?: Prisma.TourDestinationCreateNestedManyWithoutTourInput;
  includes?: Prisma.TourIncludeCreateNestedManyWithoutTourInput;
  excludes?: Prisma.TourExcludeCreateNestedManyWithoutTourInput;
  faqs?: Prisma.TourFaqCreateNestedManyWithoutTourInput;
  recommendations?: Prisma.TourRecommendationCreateNestedManyWithoutTourInput;
  requirements?: Prisma.TourRequirementCreateNestedManyWithoutTourInput;
  prices?: Prisma.TourPriceCreateNestedManyWithoutTourInput;
  images?: Prisma.TourImageCreateNestedManyWithoutTourInput;
  seo?: Prisma.TourSeoCreateNestedOneWithoutTourInput;
  metadata?: Prisma.TourMetadataCreateNestedOneWithoutTourInput;
  reviews?: Prisma.ReviewCreateNestedManyWithoutTourInput;
}
