# Migracion de Vercel Blob Storage a Cloudinary

## Fecha: 2026-03-26

## Resumen

Migracion completa del servicio de almacenamiento de imagenes desde Vercel Blob Storage hacia Cloudinary, siguiendo las recomendaciones oficiales de `next-cloudinary` (https://next.cloudinary.dev/installation).

Adicionalmente, se cambia la estrategia de almacenamiento en base de datos: en lugar de guardar la URL completa, se guarda unicamente la **ruta relativa** del archivo (carpeta + nombre + extension). La URL completa se resuelve en codigo mediante una funcion utilitaria centralizada. Esto permite migrar a cualquier otro servicio de almacenamiento en el futuro cambiando una sola constante.

---

## Paquetes

| Accion | Paquete | Version |
|--------|---------|---------|
| Instalar | `next-cloudinary` | ^6.17.5 |
| Instalar | `cloudinary` | (SDK Node.js para server-side) |
| Remover | `@vercel/blob` | ^0.27.3 |

> `next-cloudinary` se usa para el ecosistema Next.js (widget de upload, firma). `cloudinary` SDK se usa en server actions para upload/delete programatico.

---

## Variables de Entorno

### Antes (Vercel Blob)

```
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

### Despues (Cloudinary - nombres oficiales)

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dzmnf8yoi"
NEXT_PUBLIC_CLOUDINARY_API_KEY="761681927535662"
CLOUDINARY_API_SECRET="yFE0A9sXZqF2l5cgq7M50WJAhw4"
```

> `NEXT_PUBLIC_` hace las variables accesibles en cliente. `CLOUDINARY_API_SECRET` es solo server-side.

---

## Estrategia de Almacenamiento en Base de Datos

### Antes

La base de datos guarda la URL completa:

```
https://0arxzmsatgjyrvc1.public.blob.vercel-storage.com/blog/post-BwkFnJfa-1763468597618-v79BsC79fztYUVSRgtldN2Ib3nv5i5.jpg
```

### Despues

La base de datos guarda solo la ruta relativa:

```
blog/post-BwkFnJfa-1763468597618.webp
```

La URL completa se resuelve en codigo con una funcion utilitaria:

```typescript
// src/lib/image/getImageUrl.ts
export function getImageUrl(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http')) return path; // compatibilidad legacy
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${path}`;
}
```

### Ventajas

- Migrar a otro servicio (S3, R2, etc.) requiere cambiar solo `getImageUrl()`
- La base de datos es agnostica al proveedor de almacenamiento
- Los nombres de archivo y carpetas se mantienen

---

## Tablas Afectadas en Base de Datos

| Tabla | Columna | Registros con URL Vercel Blob | Estructura de ruta |
|-------|---------|-------------------------------|-------------------|
| Blog | image | 64 | `blog/post-{id}-{timestamp}.webp` |
| EventeCalendar | image | 18 | `events/event-{id}-{timestamp}.webp` |
| Sponsors | image | 2 | `sponsors/sponsor-{id}-{timestamp}.png` |
| PrintedMaterial | image | 1 | `material/material-{id}-{timestamp}.webp` |
| User | image | 2 | `profile/{email}-{timestamp}.jpg` |
| Teams | image | 0 | - |
| Ticket | image | 0 | - |

**Total: 87 imagenes a migrar.**

---

## Archivos a Modificar

### 1. Utilidad centralizada (CREAR)

| Archivo | Descripcion |
|---------|-------------|
| `src/lib/image/getImageUrl.ts` | Funcion `getImageUrl()` que resuelve ruta relativa a URL completa |

### 2. Funciones de Upload (YA MODIFICADOS)

| Archivo | Cambio |
|---------|--------|
| `src/lib/blob/uploadFile.tsx` | Usa `cloudinary.uploader.upload_stream()`. Retorna ruta relativa en vez de URL completa |
| `src/app/api/upload-image/route.ts` | Migrado a Cloudinary SDK. Retorna ruta relativa |
| `src/app/api/sign-cloudinary-params/route.ts` | **NUEVO** - Endpoint de firma para uploads seguros con CldUploadWidget |

### 3. Mutations - Guardar ruta relativa (YA MODIFICADOS parcialmente)

| Archivo | Cambio |
|---------|--------|
| `src/actions/Settings/Users/mutations.ts` | Usa `uploadRawFile()` en vez de `put()` directo |
| `src/actions/Settings/Tickets/mutations.ts` | Usa `uploadRawFile()` en vez de `put()` directo |
| `src/actions/Administration/Blogs/mutations.ts` | Ya usa `uploadFile()` - solo verificar que retorne ruta relativa |
| `src/actions/Administration/EventCalendars/mutations.ts` | Ya usa `uploadFile()` |
| `src/actions/Administration/Sponsors/mutations.ts` | Ya usa `uploadFile()` |
| `src/actions/Administration/Teams/mutations.ts` | Ya usa `uploadFile()` |
| `src/actions/Administration/PrintedMaterials/mutations.ts` | Ya usa `uploadFile()` |

### 4. Componentes de Display - Agregar `getImageUrl()` (PENDIENTES)

| Archivo | Uso |
|---------|-----|
| `src/components/Home/NewsHome/NewsHome.tsx` | Blog images en home |
| `src/components/Public/BlogsClient/BlogsClient.tsx` | Listado de blogs |
| `src/app/(public)/blogs/[slug]/page.tsx` | Imagen principal del articulo |
| `src/components/Home/Cartelera/Cartelera.tsx` | Imagenes de eventos |
| `src/components/Home/Teams/Teams.tsx` | Imagenes del equipo |
| `src/components/Home/Carousel/Carousel.tsx` | Logos de sponsors |
| `src/components/Home/Impresos/Impresos.tsx` | Imagenes de materiales impresos |
| `src/components/Dashboard/NavUser.tsx` | Avatar del usuario (2 instancias) |
| `src/app/api/debug-meta/route.ts` | OpenGraph/Twitter meta tags |

### 5. Modales de Edicion - Agregar `getImageUrl()` para previews (PENDIENTES)

| Archivo | Uso |
|---------|-----|
| `src/components/Modal/Administration/Blogs/EditBlogModal.tsx` | Preview imagen blog |
| `src/components/Modal/Administration/EventCalendars/EditEventCalendarModal.tsx` | Preview imagen evento |
| `src/components/Modal/Administration/Sponsors/EditSponsorModal.tsx` | Preview logo sponsor |
| `src/components/Modal/Administration/Teams/EditTeamModal.tsx` | Preview imagen equipo |
| `src/components/Modal/Administration/PrintedMaterials/EditPrintedMaterialModal.tsx` | Preview imagen material |
| `src/components/Modal/Setting/Users/EditUserModal.tsx` | Preview avatar usuario |
| `src/components/Modal/Setting/Users/ViewUserModal.tsx` | Vista avatar usuario |
| `src/components/Modal/Setting/Tickets/EditTicketsModal.tsx` | Preview imagen ticket |

### 6. Tablas Admin - Imagen en columnas (PENDIENTES)

| Archivo | Uso |
|---------|-----|
| `src/components/Tables/Administration/PrintedMaterials/PrintedMaterialsTable.tsx` | Columna imagen en tabla |

### 7. Autenticacion - Imagen en sesion (PENDIENTE)

| Archivo | Uso |
|---------|-----|
| `src/lib/auth/authOptions.ts` | Imagen del usuario en JWT token y session callbacks |

### 8. Configuracion Next.js (YA MODIFICADO)

| Archivo | Cambio |
|---------|--------|
| `next.config.ts` | `remotePatterns` cambiado de `**.public.blob.vercel-storage.com` a `res.cloudinary.com` |

---

## Migracion de Imagenes Existentes

Las imagenes se suben **manualmente** a Cloudinary manteniendo la misma estructura de carpetas:

```
blog/
  post-BwkFnJfa-1763468597618.webp
  post-sJwxgH4w-1751665896219.webp
  ...
events/
  event-9SkATP6j-1752801730359.webp
  ...
sponsors/
  sponsor-PeKPbwQG-1751668029416.png
  ...
material/
  material-t5qvFlin-1773856169485.webp
profile/
  julieta-at-indaga.me-1751488009824.jpg
  jorge-at-indaga.me-1751487756190.jpg
```

Despues de subir las imagenes, se ejecuta un UPDATE en la base de datos para extraer solo la ruta relativa de cada URL existente.

---

## Orden de Ejecucion

1. **Crear** `src/lib/image/getImageUrl.ts`
2. **Modificar** `uploadFile.tsx` y `uploadRawFile()` para retornar ruta relativa
3. **Modificar** `route.ts` (upload API) para retornar ruta relativa
4. **Modificar** los 9 componentes de display con `getImageUrl()`
5. **Modificar** los 8 modales de edicion con `getImageUrl()`
6. **Modificar** `PrintedMaterialsTable.tsx` con `getImageUrl()`
7. **Modificar** `authOptions.ts` para resolver imagen en session
8. **Subir imagenes** manualmente a Cloudinary
9. **Ejecutar UPDATE** en base de datos para extraer rutas relativas
10. **Verificar** que todo funcione correctamente
11. **Eliminar** `scripts/backup-vercel-blob.mjs` y carpeta `vercel-blob-backup/` (opcional)
