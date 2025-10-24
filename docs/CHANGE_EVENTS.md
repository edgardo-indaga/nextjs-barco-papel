# 📋 Plan de Reestructuración: Modelo EventeCalendar

**Fecha de Creación**: 22 de Julio, 2025  
**Estado**: Pendiente de Implementación  
**Prioridad**: Media

## 🎯 Resumen Ejecutivo

### Cambios Propuestos

Este documento describe la reestructuración del modelo `EventeCalendar` para mejorar la flexibilidad y usabilidad del sistema de eventos.

**Cambios principales:**

1. **Agregar campo `eventDays`**: Nuevo campo string para describir días del evento
2. **Modificar `showTime`**: Cambiar de `VarChar(5)` limitado a string libre
3. **Modificar `price`**: Cambiar de `Decimal(10,2)` a string para mayor flexibilidad

### Costo Total Estimado

**$300 - $500 USD** (incluyendo contingencias)

---

## 📊 Cambios Técnicos Detallados

### Base de Datos (Prisma Schema)

```prisma
// ANTES
model EventeCalendar {
    showTime        String?         @db.VarChar(5)
    price           Decimal?        @db.Decimal(10, 2)
    // otros campos...
}

// DESPUÉS
model EventeCalendar {
    eventDays       String?         // NUEVO CAMPO
    showTime        String?         // SIN RESTRICCIÓN VarChar(5)
    price           String?         // CAMBIO: Decimal → String
    // otros campos...
}
```

### Razones del Cambio

- **`eventDays`**: Permitir describir múltiples días ("Lunes a Viernes", "Fines de semana")
- **`showTime`**: Flexibilidad para horarios complejos ("14:30 - 16:00", "Horario a confirmar")
- **`price`**: Manejar precios complejos ("Gratis", "$10.000 - $15.000", "Precio a consultar")

---

## 📁 Archivos Afectados

### 🔴 **CRÍTICOS - Requieren Cambios Obligatorios**

#### 1. **Schema y Migraciones**

- `prisma/schema.prisma` - Modelo principal
- Nueva migración de base de datos

#### 2. **Interfaces TypeScript**

- `src/types/Administration/EventCalendars/EventeCalendarInterface.ts`
    - Agregar `eventDays?: string;`
    - Confirmar `price: string;`

#### 3. **Server Actions**

- `src/actions/Administration/EventCalendars/queries.ts`
    - Eliminar `PRICE_FORMATTER` con lógica Decimal
    - Agregar `eventDays` en todos los selects
    - Modificar formateo de price
- `src/actions/Administration/EventCalendars/mutations.ts`
    - Agregar manejo de `eventDays` en create/update
    - Cambiar lógica de `price` de number a string
    - Eliminar conversiones de Decimal

### 🟡 **MODERADOS - Formularios y UI Admin**

#### 4. **Modales de Administración**

- `src/components/Modal/Administration/EventCalendars/NewEventCalendarModal.tsx`

    - Agregar campo `eventDays`
    - Cambiar input `price` de `type="number"` a `type="text"`
    - Actualizar validaciones

- `src/components/Modal/Administration/EventCalendars/EditEventCalendarModal.tsx`
    - Cambios similares al modal de creación
    - Manejar valores por defecto

#### 5. **Tablas de Administración**

- `src/components/Tables/Administration/EventCalendars/EventCalendarsColumns.tsx`
    - Actualizar formateo del precio
    - Considerar agregar columna `eventDays`

### 🟢 **MENORES - Frontend Público**

#### 6. **Componente Público**

- `src/components/Home/Cartelera/Cartelera.tsx`
    - Ya maneja price como string ✅
    - Considerar mostrar `eventDays` en UI

---

## ⏱️ Estimación de Tiempo

### **Programador Junior (14-20 horas total)**

#### **Fase 1: Backend y Base de Datos (6-8 horas)**

- ⏰ **Modificar schema Prisma**: 1 hora
- ⏰ **Crear y probar migración**: 2 horas
- ⏰ **Actualizar server actions**: 2-3 horas
- ⏰ **Actualizar interfaces TypeScript**: 1 hora
- ⏰ **Pruebas backend**: 1-2 horas

#### **Fase 2: Frontend Admin (4-6 horas)**

- ⏰ **Modificar modales**: 2-3 horas
- ⏰ **Actualizar tabla admin**: 1-2 horas
- ⏰ **Pruebas formularios**: 1 hora

#### **Fase 3: Frontend Público (1-2 horas)**

- ⏰ **Ajustar componente Cartelera**: 30 minutos
- ⏰ **Pruebas visuales**: 30 minutos - 1 hora

#### **Fase 4: Testing y Deployment (3-4 horas)**

- ⏰ **Pruebas integrales**: 2 horas
- ⏰ **Preparación producción**: 1 hora
- ⏰ **Deployment y verificación**: 1 hora

---

## 💰 Análisis de Costos

### **Tarifas de Referencia (Programador Junior)**

| Región                  | Tarifa/Hora | Costo Mínimo (14h) | Costo Máximo (20h) |
| ----------------------- | ----------- | ------------------ | ------------------ |
| 🟢 **Argentina/México** | $10-15 USD  | $140 - $210        | $200 - $300        |
| 🟡 **Chile/España**     | $15-20 USD  | $210 - $280        | $300 - $400        |
| 🔴 **Estados Unidos**   | $25-35 USD  | $350 - $490        | $500 - $700        |

### **Costo Recomendado Final**

```
✅ Desarrollo: $200 - $400 USD
✅ Contingencias: $100 USD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 TOTAL FINAL: $300 - $500 USD
```

---

## ⚠️ Riesgos y Consideraciones

### **Riesgos Técnicos**

- **🔥 Pérdida de precisión**: String no permite cálculos matemáticos automáticos
- **🔥 Migración de datos**: Conversión Decimal → String puede fallar
- **🔥 Validaciones**: Se requiere validación manual de formato

### **Mitigación de Riesgos**

- **✅ Backup completo** antes de migración
- **✅ Migración en staging** primero
- **✅ Rollback plan** preparado
- **✅ Validaciones robustas** en frontend

### **Datos Existentes**

```sql
-- Ejemplo de conversión en migración
UPDATE EventeCalendar
SET price = CAST(price AS VARCHAR)
WHERE price IS NOT NULL;
```

---

## 🚀 Plan de Implementación

### **Checklist Pre-Implementación**

- [ ] Backup completo de base de datos
- [ ] Crear rama de desarrollo `feature/events-restructure`
- [ ] Configurar entorno de testing

### **Secuencia de Implementación**

#### **Paso 1: Preparación**

```bash
git checkout -b feature/events-restructure
npm run db:backup
```

#### **Paso 2: Backend**

1. [ ] Modificar `prisma/schema.prisma`
2. [ ] Crear migración: `npx prisma migrate dev --name restructure_events`
3. [ ] Actualizar interfaces TypeScript
4. [ ] Modificar server actions (queries.ts, mutations.ts)
5. [ ] Probar en Prisma Studio

#### **Paso 3: Frontend Admin**

1. [ ] Actualizar modales New/Edit
2. [ ] Modificar tabla de administración
3. [ ] Probar CRUD completo

#### **Paso 4: Frontend Público**

1. [ ] Verificar componente Cartelera
2. [ ] Ajustar si es necesario
3. [ ] Probar visualización

#### **Paso 5: Testing**

1. [ ] Pruebas unitarias
2. [ ] Pruebas de integración
3. [ ] Pruebas de UI
4. [ ] Verificar migración de datos

#### **Paso 6: Deployment**

```bash
git merge feature/events-restructure
npm run build
npm run db:migrate:deploy
```

### **Verificación Post-Deployment**

- [ ] Todos los eventos se muestran correctamente
- [ ] CRUD funciona sin errores
- [ ] Datos migrados correctamente
- [ ] Performance sin degradación

---

## 📝 Notas Adicionales

### **Consideraciones de UX**

- **Campo `eventDays`**: Considerar dropdown con opciones comunes
- **Campo `price`**: Agregar ejemplos de formato en placeholder
- **Validaciones**: Mensajes de error claros y útiles

### **Mejoras Futuras**

- Implementar sistema de plantillas para `eventDays`
- Agregar validación de formato de precio con regex
- Considerar campo separado para precio numérico (opcional)

### **Contactos Técnicos**

- **Desarrollador Principal**: [Nombre]
- **DBA**: [Nombre]
- **QA**: [Nombre]

---

**⚡ Estado**: Documento preparado, listo para implementación cuando se apruebe.
