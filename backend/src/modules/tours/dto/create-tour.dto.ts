import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateTourDto {
  @ApiProperty({ description: "Slug único del tour", required: true })
  @IsNotEmpty() @IsString() slug!: string;
  @ApiProperty({ description: "Código único del tour", required: true })
  @IsNotEmpty() @IsString() code!: string;
  @ApiProperty({ description: "Título del tour", required: true })
  @IsNotEmpty() @IsString() title!: string;
  @ApiProperty({ description: "Subtítulo del tour", required: false })
  @IsOptional() @IsString() subtitle?: string;
  @ApiProperty({ description: "Descripción corta", required: true })
  @IsNotEmpty() @IsString() shortDescription!: string;
  @ApiProperty({ description: "Descripción completa", required: true })
  @IsNotEmpty() @IsString() description!: string;
  @ApiProperty({ description: "Horas de duración", required: true })
  @IsNumber() @Min(0) durationHours!: number;
  @ApiProperty({ description: "Días de duración (0 = medio día)", required: true })
  @IsNumber() @Min(0) durationDays!: number;
  @ApiProperty({ description: "Dificultad: Easy, Moderate, Challenging", required: true })
  @IsNotEmpty() @IsString() difficulty!: string;
  @ApiProperty({ description: "Tipo de grupo: Shared, Private", required: true })
  @IsNotEmpty() @IsString() groupType!: string;
  @ApiProperty({ description: "Tipo de servicio: HalfDay, FullDay, MultiDay", required: true })
  @IsNotEmpty() @IsString() serviceType!: string;
  @ApiProperty({ description: "Destacado", required: false })
  @IsOptional() @IsBoolean() featured?: boolean;
  @ApiProperty({ description: "Activo", required: false })
  @IsOptional() @IsBoolean() active?: boolean;
  @ApiProperty({ description: "ID de categoría", required: true })
  @IsNotEmpty() @IsString() categoryId!: string;
  @ApiProperty({ description: "Provider ID", required: false })
  @IsOptional() @IsString() providerId?: string;
  @ApiProperty({ description: "Horarios", required: false, type: [Object] })
  @IsOptional() schedules?: { create: { departure: string; pickupStart: string; arrival: string; language?: string; available?: boolean }[] };
  @ApiProperty({ description: "Días de itinerario", required: false, type: [Object] })
  @IsOptional() itineraryDays?: { create: { day: number; title: string; activities?: { create: { sortOrder: number; time?: string; title: string; description: string; duration: number }[] } }[] };
  @ApiProperty({ description: "Destinos (TourDestination)", required: false, type: [Object] })
  @IsOptional() destinations?: { create: { destinationId: string; sortOrder: number }[] };
  @ApiProperty({ description: "Incluye", required: false, type: [Object] })
  @IsOptional() includes?: { create: { title: string; description?: string }[] };
  @ApiProperty({ description: "Excluye", required: false, type: [Object] })
  @IsOptional() excludes?: { create: { title: string; description?: string }[] };
  @ApiProperty({ description: "Recomendaciones", required: false, type: [Object] })
  @IsOptional() recommendations?: { create: { title: string; description: string }[] };
  @ApiProperty({ description: "Requisitos", required: false, type: [Object] })
  @IsOptional() requirements?: { create: { requirement: string }[] };
  @ApiProperty({ description: "FAQs", required: false, type: [Object] })
  @IsOptional() faqs?: { create: { question: string; answer: string; sortOrder: number }[] };
  @ApiProperty({ description: "Precios", required: false, type: [Object] })
  @IsOptional() prices?: { create: { name: string; currency: string; adult: number; child?: number; private?: number }[] };
  @ApiProperty({ description: "Imágenes", required: false, type: [Object] })
  @IsOptional() images?: { create: { url: string; alt: string; featured?: boolean; sortOrder: number; source?: string }[] };
  @ApiProperty({ description: "SEO", required: false, type: Object })
  @IsOptional() seo?: { create: { title: string; description: string; keywords?: string[]; canonical?: string } };
  @ApiProperty({ description: "Metadata", required: false, type: Object })
  @IsOptional() metadata?: { create: { provider?: string; sourceUrl?: string; lastUpdated?: string } };
  @ApiProperty({ description: "Reseñas", required: false, type: [Object] })
  @IsOptional() reviews?: { create: { rating: number; comment: string; name?: string; country?: string }[] };
}
