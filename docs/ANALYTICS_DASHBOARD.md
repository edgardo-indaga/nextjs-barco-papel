# 📊 Dashboard de Google Analytics - Plan de Integración

**Fecha de Creación**: 22 de Julio, 2025  
**Estado**: Pendiente de Implementación  
**Prioridad**: Alta

## 🎯 Resumen Ejecutivo

### Objetivo del Proyecto

Integrar un **Dashboard de Google Analytics completo** en la página principal del panel administrativo, proporcionando al cliente una **solución integral sin necesidad de salir de la aplicación**.

### Beneficios Clave

- **📈 Visión completa**: Métricas principales en un solo lugar
- **🚫 Sin redirecciones**: No necesidad de ir a Google Analytics
- **⚡ Tiempo real**: Datos actualizados automáticamente
- **📱 Responsive**: Funciona en todos los dispositivos
- **🔒 Seguro**: Integrado con el sistema de permisos existente

---

## 📋 Especificaciones del Componente

### ✅ **Características Principales**

#### **Métricas Esenciales**

- **👥 Sesiones**: Número total de sesiones de usuarios
- **📄 Páginas vistas**: Visualizaciones totales de páginas
- **🔄 Tasa de rebote**: Porcentaje de usuarios que abandonan rápidamente
- **⏱️ Tiempo promedio**: Duración media de las sesiones
- **📱 Dispositivos**: Desglose desktop/móvil/tablet

#### **Visualizaciones Interactivas**

- **📈 Gráficos de línea**: Tendencias temporales de tráfico
- **🍩 Gráficos de torta**: Distribución por fuente/dispositivo
- **📊 Gráficos de barras**: Comparación de páginas populares
- **🔢 Contadores**: Métricas destacadas en tiempo real

#### **Experiencia de Usuario**

- **💀 Loading states**: Skeleton loading profesional
- **⚠️ Error handling**: Manejo elegante de errores de API
- **🔄 Actualización**: Manual y automática cada 5 minutos
- **📱 Responsive**: Grid adaptativo (móvil → tablet → desktop)

---

## 🏗️ Análisis de Arquitectura Actual

### **Dashboard Existente**

**📍 Ubicación**: `/src/app/(admin)/admin/dashboard/page.tsx`

- **Estado actual**: Placeholders con `bg-muted/50`
- **Layout**: Grid responsivo preparado para widgets
- **Protección**: Sistema de permisos granular funcionando

### **Stack Tecnológico Disponible**

#### **UI Components (shadcn/ui)** ✅

```typescript
// Componentes disponibles
-Card,
    CardHeader,
    CardContent - // Contenedores
        Skeleton - // Estados de carga
        Button,
    Badge - // Controles
        Alert,
    AlertDescription - // Manejo errores
        Tabs,
    TabsContent; // Organización
```

#### **Gestión de Estado (Zustand)** ✅

```typescript
// Stores existentes
-authStore.ts - // Sesión y autenticación
    permissionsStore.ts - // Control de permisos
    sessionStore.ts; // Gestión de sesiones
```

#### **Server Actions Pattern** ✅

```typescript
// Patrón establecido
/src/actions/[Module]/
  ├── queries.ts      // Consultas de datos
  ├── mutations.ts    // Operaciones CRUD
  └── index.ts        // Exports centralizados
```

### **❌ Componentes Faltantes**

- **Librerías de gráficos**: Recharts, Chart.js no instaladas
- **Google Analytics API**: Cliente no configurado
- **Interfaces Analytics**: Tipos TypeScript específicos

---

## 🔧 Plan de Implementación Detallado

### **📦 Fase 1: Preparación de Infraestructura (3-4 horas)**

#### **Instalación de Dependencias**

```bash
# Librerías principales
bun add recharts @google-analytics/data
bun add -D @types/recharts

# Utilidades adicionales
bun add date-fns swr
```

#### **Configuración de Variables de Entorno**

```bash
# .env.local
GOOGLE_ANALYTICS_PROPERTY_ID="GA4-PROPERTY-ID"
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
ANALYTICS_REFRESH_INTERVAL=300000  # 5 minutos
```

#### **Estructura de Archivos**

```
/src/actions/Analytics/
├── queries.ts          # Server actions para GA4
└── index.ts           # Exports

/src/components/Analytics/
├── AnalyticsCard.tsx      # Card contenedor
├── MetricCounter.tsx      # Números destacados
├── LineChart.tsx          # Gráfico de tendencias
├── BarChart.tsx           # Gráfico de barras
├── PieChart.tsx           # Gráfico circular
├── LoadingChart.tsx       # Estados de carga
└── ErrorChart.tsx         # Estados de error

/src/types/Analytics/
└── AnalyticsInterface.ts  # Interfaces TypeScript
```

### **🔌 Fase 2: Server Actions y API (4-5 horas)**

#### **Google Analytics Data API**

```typescript
// queries.ts - Ejemplo de estructura
export async function getPageViews(startDate: string, endDate: string) {
    try {
        const response = await analyticsDataClient.runReport({
            property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
            dimensions: [{ name: 'date' }],
            metrics: [{ name: 'screenPageViews' }],
            dateRanges: [{ startDate, endDate }],
        });
        return response.rows;
    } catch (error) {
        console.error('Error fetching page views:', error);
        throw error;
    }
}
```

#### **Server Actions Planeadas**

- **`getPageViews()`**: Vistas de página por día
- **`getUserSessions()`**: Sesiones de usuarios
- **`getBounceRate()`**: Tasa de rebote
- **`getTopPages()`**: Páginas más visitadas
- **`getDeviceBreakdown()`**: Distribución por dispositivos
- **`getRealTimeData()`**: Métricas en tiempo real

### **🎨 Fase 3: Componentes de Visualización (5-6 horas)**

#### **Componente Principal - AnalyticsDashboard**

```tsx
// Estructura del componente principal
export function AnalyticsDashboard() {
    const { data, isLoading, error } = useAnalytics();

    if (isLoading) return <LoadingDashboard />;
    if (error) return <ErrorDashboard error={error} />;

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <MetricCards data={data.metrics} />
            <TrendChart data={data.trends} />
            <TopPagesChart data={data.pages} />
            <DeviceChart data={data.devices} />
        </div>
    );
}
```

#### **Componentes Específicos**

**1. MetricCounter.tsx**

```tsx
// Contador animado para métricas principales
interface MetricCounterProps {
    title: string;
    value: number;
    change: number;
    format: 'number' | 'percentage' | 'time';
}
```

**2. LineChart.tsx**

```tsx
// Gráfico de líneas con Recharts
<ResponsiveContainer width="100%" height={300}>
    <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="pageViews" stroke="#8884d8" strokeWidth={2} />
    </LineChart>
</ResponsiveContainer>
```

### **🔄 Fase 4: Estados y Gestión de Datos (2-3 horas)**

#### **Hook Custom para Analytics**

```typescript
// useAnalytics.ts
export function useAnalytics() {
    const { data, error, isLoading, mutate } = useSWR(
        'analytics-dashboard',
        () => getAnalyticsData(),
        {
            refreshInterval: 5 * 60 * 1000, // 5 minutos
            revalidateOnFocus: false,
        },
    );

    return { data, error, isLoading, refresh: mutate };
}
```

#### **Estados de Carga y Error**

- **LoadingChart**: Skeleton con animación
- **ErrorChart**: Mensaje de error con retry
- **EmptyChart**: Estado cuando no hay datos

### **🔐 Fase 5: Seguridad y Permisos (1-2 horas)**

#### **Control de Acceso**

```typescript
// Verificación de permisos específicos
const hasAnalyticsAccess = useUserPermission('VIEW_ANALYTICS');

if (!hasAnalyticsAccess) {
  return <UnauthorizedAccess />;
}
```

#### **Audit Logging**

- Registrar consultas a Analytics API
- Log de errores y accesos
- Monitoreo de uso

---

## ⏱️ Estimación de Tiempo Total

### **Programador Intermedio (15-20 horas)**

| Fase  | Descripción             | Tiempo |
| ----- | ----------------------- | ------ |
| **1** | Infraestructura y setup | 3-4h   |
| **2** | Server actions y API    | 4-5h   |
| **3** | Componentes visuales    | 5-6h   |
| **4** | Estados y gestión datos | 2-3h   |
| **5** | Seguridad y permisos    | 1-2h   |

**⏰ Total: 15-20 horas**

### **Distribución Semanal Sugerida**

- **Semana 1**: Fases 1-2 (setup y backend)
- **Semana 2**: Fases 3-4 (frontend y datos)
- **Semana 3**: Fase 5 + testing + deployment

---

## 💰 Análisis de Costos

### **Tarifas de Referencia (Desarrollador Intermedio)**

| Región                  | Tarifa/Hora | Costo Mínimo (15h) | Costo Máximo (20h) |
| ----------------------- | ----------- | ------------------ | ------------------ |
| 🟢 **Argentina/México** | $15-20 USD  | $225 - $300        | $300 - $400        |
| 🟡 **Chile/España**     | $20-25 USD  | $300 - $375        | $400 - $500        |
| 🔴 **Estados Unidos**   | $35-45 USD  | $525 - $675        | $700 - $900        |

### **Costos Adicionales**

- **Google Cloud Platform**: ~$10-20/mes (API calls)
- **Mantenimiento**: 2-3h/mes ($40-75/mes)

### **Costo Total Proyecto**

```
✅ Desarrollo: $300 - $500 USD
✅ Setup inicial: $50 USD
✅ Contingencias: $100 USD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 TOTAL INICIAL: $450 - $650 USD
🔄 MANTENIMIENTO: $40-75 USD/mes
```

---

## 🚀 Configuración de Google Analytics API

### **Paso 1: Google Cloud Console**

1. **Crear proyecto** en [Google Cloud Console](https://console.cloud.google.com)
2. **Habilitar APIs**:
    - Google Analytics Data API v1
    - Google Analytics Reporting API v4
3. **Crear Service Account**:
    - Generar clave JSON
    - Asignar roles: "Viewer" en Analytics

### **Paso 2: Google Analytics**

1. **Acceder a GA4**: [analytics.google.com](https://analytics.google.com)
2. **Admin → Property Settings**:
    - Copiar Property ID
    - Agregar Service Account email como usuario (Viewer)

### **Paso 3: Configuración Local**

```bash
# Variables requeridas
GOOGLE_ANALYTICS_PROPERTY_ID="123456789"
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

---

## 📊 Métricas y Visualizaciones Planeadas

### **📈 Dashboard Principal (Grid 3x2)**

#### **Fila 1: Métricas Principales**

```
┌─────────────┬─────────────┬─────────────┐
│  👥 SESIONES │ 📄 PÁGINAS  │ 🔄 REBOTE   │
│    12,453   │   45,231    │    24.5%    │
│   +12% ↗    │   +8% ↗     │   -3% ↙     │
└─────────────┴─────────────┴─────────────┘
```

#### **Fila 2: Gráficos Interactivos**

```
┌─────────────────────────────────────────┐
│         📈 TENDENCIA (30 DÍAS)          │
│    Gráfico de líneas con vistas/día     │
└─────────────────────────────────────────┘

┌───────────────────┬─────────────────────┐
│   🍩 DISPOSITIVOS  │   📊 PÁGINAS TOP    │
│  Mobile: 60%      │  /home: 2,341       │
│  Desktop: 35%     │  /blog: 1,892       │
│  Tablet: 5%       │  /contact: 743      │
└───────────────────┴─────────────────────┘
```

### **🎨 Paleta de Colores (Consistente con Brand)**

```css
--analytics-primary: #2563eb /* Azul principal */ --analytics-success: #10b981
    /* Verde (positivo) */ --analytics-warning: #f59e0b /* Amarillo (neutro) */
    --analytics-danger: #ef4444 /* Rojo (negativo) */ --analytics-muted: #6b7280
    /* Gris (secundario) */;
```

---

## ⚠️ Consideraciones Técnicas

### **🔒 Seguridad**

- **Service Account**: Credenciales protegidas en variables de entorno
- **Rate Limiting**: Control de llamadas API (quota diaria)
- **CORS**: Configurado para dominios autorizados
- **Permissions**: Solo usuarios autorizados acceden al dashboard

### **⚡ Performance**

- **Cache**: SWR para cache de datos (5 minutos)
- **Lazy Loading**: Componentes se cargan bajo demanda
- **Code Splitting**: Bundle separation para charts
- **Error Boundaries**: Evitar crashes por errores de API

### **📱 Responsive Design**

```css
/* Breakpoints planeados */
mobile:    1 columna  (< 768px)
tablet:    2 columnas (768px - 1024px)
desktop:   3 columnas (> 1024px)
```

### **🔄 Manejo de Errores**

- **API Limits**: Fallback cuando se supera quota
- **Network Errors**: Retry automático (3 intentos)
- **Invalid Data**: Validación de respuestas GA4
- **Timeout**: 30 segundos máximo por request

---

## 🎯 Funcionalidades Futuras (Roadmap)

### **📅 Versión 1.0 (Inicial)**

- ✅ Métricas básicas (sesiones, páginas, rebote)
- ✅ Gráficos principales (línea, torta, barras)
- ✅ Estados de carga y error
- ✅ Responsive design

### **📊 Versión 1.1 (Filtros)**

- 🔄 Selector de rango de fechas personalizable
- 🔄 Filtros por página/sección específica
- 🔄 Comparación entre períodos
- 🔄 Filtros por fuente de tráfico

### **📈 Versión 1.2 (Avanzado)**

- 🔄 Métricas de conversión y eventos
- 🔄 Segmentación de usuarios
- 🔄 Análisis de cohortes
- 🔄 Mapas de calor de páginas

### **📄 Versión 1.3 (Reportes)**

- 🔄 Exportar reportes en PDF
- 🔄 Exportar datos en Excel
- 🔄 Reportes programados por email
- 🔄 Dashboard público (solo métricas básicas)

### **🔔 Versión 1.4 (Alerts)**

- 🔄 Alertas por caídas de tráfico
- 🔄 Notificaciones de picos inusuales
- 🔄 Alertas de objetivos de conversión
- 🔄 Reportes automáticos semanales

---

## 📋 Checklist de Implementación

### **🔧 Preparación**

- [ ] Crear proyecto en Google Cloud Console
- [ ] Habilitar Google Analytics Data API
- [ ] Generar Service Account y clave JSON
- [ ] Configurar permisos en Google Analytics
- [ ] Instalar dependencias del proyecto

### **💻 Desarrollo**

- [ ] Crear estructura de archivos (/Analytics/)
- [ ] Implementar server actions para GA4 API
- [ ] Desarrollar componentes de visualización
- [ ] Integrar con sistema de permisos existente
- [ ] Implementar estados de carga y error

### **🧪 Testing**

- [ ] Probar conexión con GA4 API
- [ ] Verificar visualizaciones con datos reales
- [ ] Testear responsive design
- [ ] Validar manejo de errores
- [ ] Comprobar performance y cache

### **🚀 Deployment**

- [ ] Configurar variables de entorno en producción
- [ ] Verificar quotas de Google Cloud
- [ ] Monitorear logs de errores
- [ ] Documentar uso para el cliente
- [ ] Capacitar usuarios finales

---

## 📞 Contactos y Referencias

### **Documentación Técnica**

- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Recharts Documentation](https://recharts.org/en-US/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)

### **Herramientas de Testing**

- [GA4 Query Explorer](https://developers.google.com/analytics/devguides/reporting/data/v1/query-explorer)
- [Google Cloud Console](https://console.cloud.google.com)

---

**⚡ Estado**: Documentación completa, lista para inicio de implementación cuando se apruebe el presupuesto y timeline.
