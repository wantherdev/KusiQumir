import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

const articleListSelect = {
  id: true, slug: true, title: true, excerpt: true,
  coverImage: true, imageAlt: true, category: true, tags: true,
  status: true, publishedAt: true, createdAt: true, updatedAt: true,
} satisfies Prisma.ArticleSelect;

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublic(query: { take?: string; cursor?: string; category?: string }) {
    const take = Math.min(Math.max(1, Number(query.take) || 12), 50);
    const where: Prisma.ArticleWhereInput = {
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
    };
    if (query.category) where.category = query.category;

    const items = await this.prisma.article.findMany({
      take: take + 1,
      where,
      orderBy: { publishedAt: "desc" },
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      select: articleListSelect,
    });

    const hasMore = items.length > take;
    if (hasMore) items.pop();
    return { items, nextCursor: hasMore ? items[items.length - 1]!.id : null };
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findFirst({
      where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
    });
    if (!article) throw new NotFoundException("Artículo no encontrado");
    return article;
  }

  async findAllAdmin() {
    return this.prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findOneAdmin(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException("Artículo no encontrado");
    return article;
  }

  create(data: Prisma.ArticleCreateInput) {
    return this.prisma.article.create({ data });
  }

  async update(id: string, data: Prisma.ArticleUpdateInput) {
    await this.findOneAdmin(id);
    return this.prisma.article.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOneAdmin(id);
    return this.prisma.article.delete({ where: { id } });
  }
}
