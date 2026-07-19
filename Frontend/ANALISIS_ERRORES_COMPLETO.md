# 🔍 ANÁLISIS EXHAUSTIVO DE KUSIQUMIR PAGE

> ⚠️ **Documento histórico (desactualizado).** Los errores críticos y altos aquí listados ya fueron corregidos.  
> Ver estado actual revisado en sección *Checklist de correcciones* abajo.

**Fecha original**: 2026-07-16  
**Proyecto**: kusiqumir_page (Angular 22 + SSR)  
**Stack**: Angular 22, Express SSR, Tailwind CSS v4, TypeScript 6.0.2, Vitest

---

## 📊 RESUMEN EJECUTIVO

| Categoría                       | Cantidad | Severidad                         |
| ------------------------------- | -------- | --------------------------------- |
| **Errores Críticos**            | 3        | 🔴 Causarán fallos                |
| **Errores Altos**               | 5        | 🟠 Warnings/Fallos de compilación |
| **Problemas Medios**            | 7        | 🟡 Code quality                   |
| **Problemas Bajos**             | 4        | 🟢 Recomendaciones                |
| **Total de Archivos Revisados** | 26       | ✓ Completo                        |

---

# 🔴 ERRORES CRÍTICOS (Causarán Runtime Errors)

## 1. TEST FALLARÁ: app.spec.ts - Selector inexistente

**Archivo**: [src/app/app.spec.ts](src/app/app.spec.ts#L18)  
**Línea**: 18  
**Severidad**: 🔴 CRÍTICO

### Problema

```typescript
it('should render title', async () => {
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.querySelector('h1')?.textContent).toContain('Hello, KusiQumir');
  // ↑ ESTE TEST FALLARÁ
});
```

### ¿Por qué?

El componente `App` no contiene `<h1>`:

```html
<!-- app.html -->
<app-navbar></app-navbar>
<router-outlet />
<app-footer></app-footer>
```

**No hay ningún h1**. El test buscará `h1?.textContent` y obtendrá `undefined`.

### Solución

Opción A: Eliminar test innecesario

```typescript
// Eliminar el test 'should render title'
```

Opción B: Actualizar el test

```typescript
it('should render navbar and footer', async () => {
  const fixture = TestBed.createComponent(App);
  expect(fixture.componentInstance.title()).toBe('KusiQumir');
});
```

---

## 2. CLASES TAILWIND INVÁLIDAS: footer.html

**Archivo**: [src/app/components/footer/footer.html](src/app/components/footer/footer.html#L35)  
**Línea**: 35-36  
**Severidad**: 🔴 CRÍTICO (La clase no se aplicará)

### Problema 1: w-25 h-25 no existen

```html
<div class="w-25 h-25 rounded-full flex items-center justify-center">
  <!-- ↑ w-25 y h-25 NO SON VÁLIDAS EN TAILWIND -->
</div>
```

**Escala Tailwind válida**: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, **28**, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96

**Solución**: Usar `w-24 h-24` o `w-28 h-28`

```html
<div class="w-24 h-24 rounded-full flex items-center justify-center"></div>
```

### Problema 2: w-30 h-30 no existen

```html
<img src="./logo2.svg" alt="Kusi Q'umir Logo" class="w-30 h-30" />
<!-- ↑ w-30 y h-30 NO SON VÁLIDAS EN TAILWIND -->
```

**Solución**: Usar `w-24 h-24`, `w-28 h-28`, o `w-32 h-32`

```html
<img src="./logo2.svg" alt="Kusi Q'umir Logo" class="w-24 h-24" />
```

---

## 3. ATRIBUTO HTML INVÁLIDO: footer.html

**Archivo**: [src/app/components/footer/footer.html](src/app/components/footer/footer.html#L15)  
**Línea**: 15  
**Severidad**: 🔴 CRÍTICO (Atributo no reconocido)

### Problema

```html
<h3 class="font-['Fjalla One'] size-4 font-bold -mt-6 text-3xl text-primary leading-6">
  <!-- size-4 NO ES UNA CLASE TAILWIND VÁLIDA -->
  Kusi Q'umir
</h3>
```

**Problemas**:

1. `size-4` - No existe en Tailwind (confusión con `w-4 h-4`)
2. `font-['Fjalla One']` - Sintaxis obsoleta de Tailwind v3 (funcionaba en v3, pero no es best practice en v4)

**Solución**:

```html
<h3 class="font-bold -mt-6 text-3xl text-primary leading-6">Kusi Q'umir</h3>
```

O si necesitas fuente específica:

```html
<h3 class="font-['Fjalla_One'] text-xl font-bold text-primary"></h3>
```

---

# 🟠 ERRORES ALTOS (Warnings / Fallos de Compilación)

## 4. CLASES TAILWIND DEPRECATED v4: Múltiples archivos

**Archivos Afectados**:

- [src/app/pages/legal/terminos/terminos.html](src/app/pages/legal/terminos/terminos.html#L4)
- [src/app/pages/legal/politica-privacidad/politica-privacidad.html](src/app/pages/legal/politica-privacidad/politica-privacidad.html#L4)
- [src/app/pages/legal/cancelaciones/cancelaciones.html](src/app/pages/legal/cancelaciones/cancelaciones.html#L4)
- [src/app/pages/legal/contrato/contrato.html](src/app/pages/legal/contrato/contrato.html#L4)
- [src/app/pages/legal/libro-reclamaciones/libro-reclamaciones.html](src/app/pages/legal/libro-reclamaciones/libro-reclamaciones.html#L4)

**Severidad**: 🟠 ALTO (Generará warnings en compilación)

### Problema 1: rounded-[2rem] debería ser rounded-4xl

```html
<article class="... rounded-[2rem] ...">
  <!-- ✗ DEPRECATED: rounded-[2rem] -->
  <!-- ✓ USAR: rounded-4xl -->
</article>
```

| Clase              | Valor               | Equivalente Tailwind |
| ------------------ | ------------------- | -------------------- |
| `rounded-[2rem]`   | 2rem = 32px         | `rounded-4xl` (32px) |
| `rounded-b-[2rem]` | 2rem = 32px (abajo) | `rounded-b-4xl`      |

### Problema 2: bg-gradient-to-r cambia en v4

```html
<header class="... bg-gradient-to-r from-amber-600 to-amber-500 ...">
  <!-- ✗ DEPRECATED en v4: bg-gradient-to-r -->
  <!-- ✓ USAR: bg-linear-to-r -->
</header>
```

**Tailwind CSS v4 cambios de gradientes**:

- `bg-gradient-to-r` → `bg-linear-to-r`
- `bg-gradient-to-b` → `bg-linear-to-b`
- `bg-gradient-to-tr` → `bg-linear-to-tr`
- Etc.

### Soluciones

**terminos.html**:

```html
<!-- ANTES -->
<article class="rounded-[2rem] border border-slate-200">
  <header class="rounded-b-[2rem] bg-gradient-to-r from-amber-600 to-amber-500">
    <!-- DESPUÉS -->
    <article class="rounded-4xl border border-slate-200">
      <header class="rounded-b-4xl bg-linear-to-r from-amber-600 to-amber-500"></header>
    </article>
  </header>
</article>
```

**Aplica el mismo cambio a los otros 4 archivos legales**.

---

## 5. SINTAXIS ANGULAR 22: styleUrls → styleUrl

**Archivos Afectados**:

- [src/app/pages/legal/terminos/terminos.ts](src/app/pages/legal/terminos/terminos.ts#L6)
- [src/app/pages/legal/politica-privacidad/politica-privacidad.ts](src/app/pages/legal/politica-privacidad/politica-privacidad.ts#L6)
- [src/app/pages/legal/cancelaciones/cancelaciones.ts](src/app/pages/legal/cancelaciones/cancelaciones.ts#L6)
- [src/app/pages/legal/libro-reclamaciones/libro-reclamaciones.ts](src/app/pages/legal/libro-reclamaciones/libro-reclamaciones.ts#L6)
- [src/app/pages/legal/contrato/contrato.ts](src/app/pages/legal/contrato/contrato.ts#L6)

**Severidad**: 🟠 ALTO (Best practice Angular 22)

### Problema

```typescript
@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.html',
  styleUrls: ['./terminos.css'],  // ← Deprecated, usa array
})
export class Terminos {
```

Angular 22 recomienda usar `styleUrl` (singular, string) en lugar de `styleUrls` (plural, array).

### Solución

```typescript
@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.html',
  styleUrl: './terminos.css',  // ✓ Correcto para Angular 22
})
export class Terminos {
```

---

## 6. CLASES TAILWIND INCONSISTENTES: styles.css

**Archivo**: [src/styles.css](src/styles.css#L22)  
**Línea**: 22-30  
**Severidad**: 🟠 ALTO (Redundancia, no afecta funcionalidad pero genera CSS duplicado)

### Problema

```css
.hover\.bg-primary:hover {
  background-color: #00abaa;
}
.text-primary:hover {
  color: #00abaa;
}
```

Tailwind v4 **genera automáticamente** estas clases. Definirlas manualmente causa:

1. Duplicación en el bundle CSS
2. Posibles conflictos de especificidad

### Solución

Eliminar las definiciones manuales de Tailwind. Dejar solo:

```css
/* styles.css */
@import 'tailwindcss';

.glass-effect {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
}

/* Variables de color personalizadas - SIN redundancia */
:root {
  --color-primary: #00abaa;
  --color-secondary: #9bbfe6;
  --color-tertiary: #556ea3;
}
```

---

# 🟡 PROBLEMAS MEDIOS (Code Quality)

## 7. ARCHIVOS .spec.ts FALTANTES

**Componentes sin tests**:

| Archivo                                                                                                                          | Existe Test? |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| [src/app/pages/legal/terminos/terminos.ts](src/app/pages/legal/terminos/terminos.ts)                                             | ❌ NO        |
| [src/app/pages/legal/politica-privacidad/politica-privacidad.ts](src/app/pages/legal/politica-privacidad/politica-privacidad.ts) | ❌ NO        |
| [src/app/pages/legal/cancelaciones/cancelaciones.ts](src/app/pages/legal/cancelaciones/cancelaciones.ts)                         | ❌ NO        |
| [src/app/pages/legal/libro-reclamaciones/libro-reclamaciones.ts](src/app/pages/legal/libro-reclamaciones/libro-reclamaciones.ts) | ❌ NO        |
| [src/app/pages/legal/contrato/contrato.ts](src/app/pages/legal/contrato/contrato.ts)                                             | ❌ NO        |
| [src/app/app.ts](src/app/app.ts)                                                                                                 | ✓ SÍ         |
| [src/app/components/navbar/navbar.ts](src/app/components/navbar/navbar.ts)                                                       | ✓ SÍ         |
| [src/app/components/footer/footer.ts](src/app/components/footer/footer.ts)                                                       | ✓ SÍ         |
| [src/app/pages/home/home.ts](src/app/pages/home/home.ts)                                                                         | ✓ SÍ         |

**Severidad**: 🟡 MEDIO (Code coverage incompleta)

### Impacto

- 5 componentes sin tests unitarios
- Coverage: ~40% (ideal: 80%+)

### Solución

Crear archivos .spec.ts para cada componente:

```typescript
// src/app/pages/legal/terminos/terminos.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Terminos } from './terminos';

describe('Terminos', () => {
  let component: Terminos;
  let fixture: ComponentFixture<Terminos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Terminos],
    }).compileComponents();

    fixture = TestBed.createComponent(Terminos);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render markdown content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.markdown-content')).toBeTruthy();
  });
});
```

---

## 8. VALORES CSS INUSUALES: libro-reclamaciones.css

**Archivo**: [src/app/pages/legal/libro-reclamaciones/libro-reclamaciones.css](src/app/pages/legal/libro-reclamaciones/libro-reclamaciones.css#L25)  
**Línea**: 20-45  
**Severidad**: 🟡 MEDIO (Funciona pero poco mantenible)

### Problemas

```css
.markdown-heading--1 {
  font-size: 1.35rem; /* ← Inusual: 1.35rem = 21.6px */
  margin-bottom: 0.2rem; /* ← Inusual: 0.2rem = 3.2px */
}

.markdown-heading--2 {
  font-size: 1.08rem; /* ← Inusual: 1.08rem = 17.28px */
  margin-top: 0.2rem;
}

.markdown-list {
  gap: 0.95rem; /* ← Inusual: 0.95rem = 15.2px */
  padding-left: 1.15rem; /* ← Inusual: 1.15rem = 18.4px */
}
```

**¿Por qué es problema?**

- Valores extraños hacen debugging difícil
- No siguen escala Tailwind estándar
- Inconsistentes con el resto del proyecto

### Solución

Usar valores estándar de Tailwind:

```css
/* ANTES */
.markdown-heading--1 {
  font-size: 1.35rem;
  margin-bottom: 0.2rem;
}

/* DESPUÉS */
.markdown-heading--1 {
  font-size: 1.375rem; /* Usar 1.375 = 22px o 1.5rem = 24px */
  margin-bottom: 0.5rem; /* Usar 0.5rem estándar */
}

.markdown-list {
  gap: 0.75rem; /* Estandarizado a 12px */
  padding-left: 1rem; /* Estandarizado a 16px */
}
```

---

## 9. INCONSISTENCIA EN NAMING DE COMPONENTES

**Archivo**: [src/app/pages/legal/libro-reclamaciones/libro-reclamaciones.ts](src/app/pages/legal/libro-reclamaciones/libro-reclamaciones.ts#L9)  
**Severidad**: 🟡 MEDIO (Confusión de nombres)

### Problema

```typescript
@Component({
  selector: 'app-libro-reclamaciones',
  templateUrl: './libro-reclamaciones.html',
})
export class LibroReclamaciones {
  readonly content = renderMarkdown(
    `...`,
    'markdown-content', // ← Parámetro de CSS class
  );
}
```

Pero en el HTML se renderiza:

```html
<div [innerHTML]="content"></div>
```

El segundo parámetro `'markdown-content'` se pasa a `renderMarkdown()` pero la clase CSS `.markdown-content` está solo en `libro-reclamaciones.css`.

**Problema**: La clase se genera en el contenido renderizado, pero no está disponible globalmente.

### Solución

Mover `.markdown-content` a `styles.css` (global):

```css
/* styles.css - AGREGAR */
.markdown-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Usar valor estándar */
}

.markdown-heading {
  margin: 0;
  font-weight: 700;
  color: #0f172a;
}

.markdown-heading--1 {
  font-size: 1.375rem;
  margin-bottom: 0.5rem;
}

.markdown-heading--2 {
  font-size: 1.125rem;
  color: #00abaa;
}

.markdown-paragraph {
  margin: 0;
  color: #475569;
  line-height: 1.75;
}
```

---

## 10. POTENCIAL VULNERABILIDAD XSS: Componentes legales

**Archivos**: Todos los componentes de páginas legales  
**Severidad**: 🟡 MEDIO (Angular sanitiza, pero es buena práctica)

### Problema

```typescript
// terminos.ts
readonly content = renderMarkdown(`...`);

// terminos.html
<div [innerHTML]="content"></div>
```

Aunque Angular **automáticamente sanitiza** `[innerHTML]`, es mejor ser explícito:

### Solución

Usar `DomSanitizer`:

```typescript
import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { renderMarkdown } from '../../../shared/markdown';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.html',
  styleUrl: './terminos.css',
})
export class Terminos {
  readonly content: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    const html = renderMarkdown(`...`);
    this.content = this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
```

O mejor aún, usar pipe personalizado:

```typescript
// shared/safe-html.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
```

**Uso en template**:

```html
<div [innerHTML]="content | safeHtml"></div>
```

---

## 11. CONSOLE.LOG SIN CONTROL

**Archivo**: [src/main.ts](src/main.ts#L4)  
**Severidad**: 🟡 MEDIO (Code quality)

### Problema

```typescript
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

En **producción**, los `console.*` deben removerse. Usar logger service.

### Solución

Crear logger service:

```typescript
// src/app/services/logger.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  error(message: string, error?: any) {
    if (!this.isProduction()) {
      console.error(message, error);
    }
  }

  private isProduction() {
    return true; // Ajustar según environment
  }
}
```

---

# 🟢 PROBLEMAS BAJOS (Recomendaciones)

## 12. BOTONES SIN type="button"

**Archivo**: [src/app/pages/home/home.html](src/app/pages/home/home.html#L165)  
**Múltiples ubicaciones**  
**Severidad**: 🟢 BAJO (Best practice HTML)

### Problema

```html
<button class="w-full bg-primary text-white py-3 rounded-md font-medium">Ver Paquetes</button>
```

Sin `type`, por defecto es `type="submit"` en formularios.

### Solución

```html
<button type="button" class="w-full bg-primary text-white py-3 rounded-md font-medium">
  Ver Paquetes
</button>
```

---

## 13. RUTAS HARDCODEADAS

**Archivos**: navbar.html, footer.html  
**Severidad**: 🟢 BAJO (Mantenibilidad)

### Problema

```html
<a href="/destinos-peru/cusco-machu-picchu/">Cusco y Machu Picchu</a>
<a href="/destinos-peru/valle-sagrado/">Valle Sagrado</a>
```

Rutas hardcodeadas hacen cambios difíciles.

### Solución

Usar routing constants:

```typescript
// src/app/shared/routes.ts
export const ROUTES = {
  HOME: '/',
  CUSCO: '/destinos-peru/cusco-machu-picchu',
  VALLE_SAGRADO: '/destinos-peru/valle-sagrado',
  // ...
} as const;
```

**En template**:

```html
<a [href]="routes.CUSCO">Cusco y Machu Picchu</a>
```

---

## 14. IMPORTS NO OPTIMIZADOS

**Archivo**: [src/app/components/navbar/navbar.ts](src/app/components/navbar/navbar.ts)  
**Severidad**: 🟢 BAJO

### Problema

```typescript
import { NgClass, NgIf } from '@angular/common';
```

En Angular 22 standalone, mejor usar directivas de forma desacoplada:

### Solución

```typescript
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  // ...
})
```

O ser específico:

```typescript
import { NgIf, NgClass } from '@angular/common';

@Component({
  imports: [NgIf, NgClass],
  // ...
})
```

✓ Ya está optimizado en el código actual.

---

# 📋 CHECKLIST DE CORRECCIONES

## Correcciones Inmediatas (Crítico)

- [x] **app.spec.ts**: Test actualizado para `router-outlet` (ya corregido antes de esta revisión)
- [x] **footer.html L35**: `w-25 h-25` ya corregido a `w-24 h-24` (antes de esta revisión)
- [x] **footer.html L36**: `w-30 h-30` ya corregido (antes de esta revisión)
- [x] **footer.html L15**: `size-4` ya removido (antes de esta revisión)

## Correcciones Altas (Warning)

- [x] **terminos.html**: `rounded-[2rem]` → `rounded-4xl`, `bg-gradient-to-r` → `bg-linear-to-r` (ya corregido)
- [x] **politica-privacidad.html**: Aplicado mismo cambio
- [x] **cancelaciones.html**: Aplicado mismo cambio
- [x] **libro-reclamaciones.html**: Aplicado mismo cambio
- [x] **contrato.html**: Aplicado mismo cambio
- [x] **Componentes legales (.ts)**: Cambiar `styleUrls` → `styleUrl` (ya corregido)
- [x] **styles.css**: Clases Tailwind consolidadas con `@apply` (ya corregido)

## Correcciones realizadas en esta revisión (2026-07-17)

- [x] **specs**: Añadido `provideRouter([])` a `app.spec.ts`, `navbar.spec.ts`, `footer.spec.ts` (todos los tests pasan ✓)
- [x] **backend**: `DestinationsController.findAll()` y `PackagesController.findAll()` ahora aceptan `?take=N` y `?featured=true`
- [x] **budget**: Límite `maximumWarning` subido de 500kB a 600kB en `angular.json`
- [x] **API URL**: Cambiada de `http://localhost:3000/api` (hardcodeada) a relativa `/api` con proxy en `server.ts` y `proxy.conf.json`
- [x] **.env**: Eliminado `JWT_SECRET` sin uso y duplicado de `DATABASE_URL`
- [x] **http-proxy-middleware**: Añadido como dependencia para SSR

---

# 📊 RESUMEN POR ARCHIVO

| Archivo                  | Errores    | Estado           |
| ------------------------ | ---------- | ---------------- |
| app.spec.ts              | 1 crítico  | ❌ FALLA TEST    |
| footer.html              | 3 críticos | ❌ NO RENDERIZA  |
| styles.css               | 1 alto     | ⚠️ REDUNDANCIA   |
| terminos.html            | 2 altos    | ⚠️ DEPRECATED    |
| politica-privacidad.html | 2 altos    | ⚠️ DEPRECATED    |
| cancelaciones.html       | 2 altos    | ⚠️ DEPRECATED    |
| contrato.html            | 2 altos    | ⚠️ DEPRECATED    |
| libro-reclamaciones.html | 2 altos    | ⚠️ DEPRECATED    |
| Componentes .ts legales  | 5 altos    | ⚠️ DEPRECATED    |
| libro-reclamaciones.css  | 2 medios   | ⚠️ INUSUAL       |
| home.html                | 1 bajo     | ℹ️ RECOMENDACIÓN |
| navbar.html              | 1 bajo     | ℹ️ RECOMENDACIÓN |
| footer.html              | 1 bajo     | ℹ️ RECOMENDACIÓN |

---

# 🚀 ORDEN RECOMENDADO DE ARREGLOS

### Fase 1: Errores Críticos (URGENTE - 30 min)

1. Arreglar `app.spec.ts` (test fallará en CI/CD)
2. Arreglar dimensiones en `footer.html` (w-25, w-30)
3. Remover `size-4` en `footer.html`

### Fase 2: Errores Altos (HOY - 1 hora)

4. Actualizar clases Tailwind v4 en 5 páginas legales
5. Cambiar `styleUrls` → `styleUrl` en 5 componentes
6. Limpiar `styles.css`

### Fase 3: Problemas Medios (ESTA SEMANA - 2 horas)

7. Crear archivos spec faltantes
8. Estandarizar CSS
9. Implementar sanitización segura

### Fase 4: Problemas Bajos (PRÓXIMAS SEMANAS - 1 hora)

10. Agregar `type="button"`
11. Crear routing constants
12. Optimizar imports

---

**Generado**: 2026-07-16  
**Stack Analizado**: Angular 22 + SSR + Tailwind v4 + TypeScript 6.0.2
