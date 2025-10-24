# Gemini Project Context: nextjs-barcodepapel

Este archivo sirve como la memoria a largo plazo y la hoja de referencia para el agente Gemini en este proyecto. Contiene un resumen de la arquitectura, las convenciones y los comandos clave.

## Resumen del Proyecto

- **Framework:** Next.js 15 (con Turbopack)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS con shadcn/ui
- **Base de Datos:** PostgreSQL con Prisma ORM
- **Autenticación:** NextAuth.js
- **Gestión de Estado:** Zustand

## Puntos Clave de la Arquitectura

- **Server Actions:** La lógica de backend se maneja principalmente a través de Server Actions ubicadas en `src/actions/`.
- **Estructura de Rutas:** El enrutamiento se organiza en grupos lógicos dentro de `src/app/`: `(admin)`, `(auth)`, y `(home)`.
- **Componentes de UI:** Los componentes reutilizables se encuentran en `src/components/`. Las tablas complejas usan TanStack Table y los modales son un patrón común para las operaciones CRUD.

## Convenciones del Proyecto

### 1. Nomenclatura de Carpetas y Archivos

- **Carpetas de Módulo:** Las carpetas que agrupan funcionalidades de un recurso se nombran en **plural**.

    - _Ejemplo:_ `src/components/Modal/Administration/Teams/`
    - _Ejemplo:_ `src/actions/Administration/Sponsors/`

- **Archivos de Componentes (Colecciones):** Los componentes que renderizan o gestionan una **colección** de ítems se nombran en **plural**.

    - _Ejemplo:_ `TeamsTable.tsx`
    - _Ejemplo:_ `SponsorsList.tsx`

- **Archivos de Componentes (Ítem Único):** Los componentes que operan sobre **un solo ítem** se nombran en **singular**.
    - _Ejemplo:_ `EditTeamModal.tsx`
    - _Ejemplo:_ `NewSponsorModal.tsx`

### 2. Manejo de Estado en Modales

- La lógica de limpieza del estado de un modal (resetear formularios, imágenes, errores) debe estar centralizada y dispararse cuando el modal se cierra (observando la prop `open` o en la función `onOpenChange`), garantizando la limpieza sin importar cómo se cerró.

## Comandos Comunes

- **Desarrollo (bun):** `bun run bun:dev`
- **Desarrollo (npm):** `npm run dev`
- **Build (bun):** `bun run bun:build`
- **Build (npm):** `npm run build`
- **Iniciar (bun):** `bun run bun:start`
- **Iniciar (npm):** `npm run start`
