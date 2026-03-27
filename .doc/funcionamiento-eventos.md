# Funcionamiento de Eventos y Cartelera

Este documento explica las reglas de negocio y los filtros aplicados por el sistema (Base de Datos / Prisma) para mostrar los eventos en la sección **CARTELERA** de la página pública (Home).

## 1. Condición de Publicación (Estado)

Para que un evento subido desde el panel de administración sea visible en la cartelera, su propiedad `state` debe ser explícitamente **1** (Activo/Publicado). Si el estado es distinto (ej. 0 o 2), el evento se considerará oculto y no será retornado por la base de datos (incluso si la fecha del evento es en el futuro).

## 2. Condición de Fecha (El Filtro Estricto)

El componente principal de la decisión de renderizado de la Cartelera descansa sobre la premisa visual: *"Descubre los eventos programados para los próximos 30 días"*.

Para respetar esta regla de negocio, el Backend (específicamente la función `getEventMonthLimited` en `src/actions/Administration/EventCalendars/queries.ts`) aplica el siguiente filtro en la base de datos:

1. Calcula la medianoche de la fecha **actual del servidor** (ej: `27 de marzo de 2026, 00:00:00`).
2. Establece como límite máximo **+60 días en el futuro**.
3. Realiza la consulta pidiendo: `date: { gte: startOfToday, lte: next60Days }`.

### Consecuencias de esta Lógica:
- **Eventos Futuros (✔):** Cualquier evento agendado para el mismo día de visualización, o para mañana, y hasta los próximos 60 días, aparecerá correctamente.
- **Eventos Pasados (✘):** Si el servidor detecta que la fecha actual es 27 de Marzo, y un evento guardado en la Base de Datos tiene como fecha *19 de Marzo*, dicho evento queda inmediatamente **descartado** por el filtro, desapareciendo de la página pública. Esto evita que los visitantes vean en la Cartelera obras u ocasiones que ya expiraron.
  
> **Nota de QA:** Si la cartelera aparece completamente vacía a pesar de existir eventos "Publicados" en el panel administrativo, la causa más probable es que *todos* los eventos en la base de datos cuentan con una fecha del evento anterior al día de hoy.

## 3. Limitación Visual (Cargar Más)

Por defecto, la interfaz de inicio (`page.tsx`) llamará a la consulta `getEventMonthLimited(6)`, extrayendo únicamente los **6 eventos más próximos** (ordenados ascendentemente, es decir, del más inminente al más lejano dentro del marco de tiempo permitido).

Si la base de datos avala más de 6 eventos vigentes, el componente habilitará en la UI el botón *"Cargar Más"*. Al presionarse, se ejecutará el action `getEventMonth()` sin el límite de 6 items, trayendo a la interfaz la totalidad de los eventos del mes en curso que satisfagan las reglas de fecha y estado mencionadas.
