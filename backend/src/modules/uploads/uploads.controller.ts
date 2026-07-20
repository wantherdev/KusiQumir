import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@ApiTags("uploads")
@Controller("uploads")
export class UploadsController {
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: join(process.cwd(), "uploads"),
        filename: (_req: any, file: Express.Multer.File, cb: (err: Error | null, filename: string) => void) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req: any, file: Express.Multer.File, cb: (err: Error | null, accept: boolean) => void) => {
        const allowedMimes = /^image\/(jpeg|jpg|pjpeg|png|webp|gif|svg\+xml|bmp|avif|heic|heif)$/i;
        const allowedExt = /\.(jpe?g|png|webp|gif|svg|bmp|avif|heic|heif)$/i;
        const ok = allowedMimes.test(file.mimetype) || allowedExt.test(file.originalname || "");
        if (!ok) {
          cb(new BadRequestException("Solo se permiten imágenes (JPEG, PNG, WebP, GIF, SVG, BMP, AVIF, HEIC)."), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: "Subir imagen" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: { file: { type: "string", format: "binary" } },
    },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("No se recibió ningún archivo");
    return { url: `/uploads/${file.filename}` };
  }
}
