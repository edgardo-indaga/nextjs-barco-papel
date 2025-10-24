# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma de Comunicación

**IMPORTANTE**: Claude Code DEBE responder SIEMPRE en idioma ESPAÑOL. Todas las comunicaciones, explicaciones, comentarios y respuestas deben ser en español, manteniendo únicamente los términos técnicos en inglés cuando sea necesario (nombres de funciones, variables, etc.).

## Development Commands

### Development Server

```bash
bun run dev              # Start development server with Turbopack
bun run bun:dev         # Start with Bun runtime
bun run bun:devop       # Clean build and start development
```

### Build and Production

```bash
bun run build           # Production build
bun run bun:build       # Production build with Bun
bun run start           # Start production server
bun run preview         # Build and start production server
```

### Database Operations

```bash
bunx prisma studio                                    # Open Prisma Studio
npx prisma migrate dev --name migration_name         # Create and apply migration
npx prisma migrate deploy                           # Apply migrations in production
bunx prisma db seed                                 # Run database seed
bunx prisma generate                                # Generate Prisma client
```

### Code Quality

```bash
bun run bun:format-prettier        # Format code with Prettier
npx tsc --noEmit                   # Verificar tipos TypeScript
npx biome check .                  # Lint con Biome
bun run verify-analytics           # Verificar configuración Google Analytics
bun run test-analytics             # Test básico conexión Analytics
```

**IMPORTANTE**: NO usar `rustywind` en este proyecto. El formateo de código usa:

1. **Prettier** para formateo general (`bun run bun:format-prettier`)
2. **next_best_practices.md** para corrección ortográfica bilingüe y patterns específicos
3. **Biome** para linting adicional
4. **TypeScript** para verificación de tipos

## Git y GitHub Workflow


### Comandos Git Básicos

```bash
# Ver estado del repositorio
git status

# Agregar archivos
git add .

# Hacer commit
git commit -m "Tu mensaje de commit"

# Push al repositorio
git push origin main
```


## Architecture Overview

### Technology Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT sessions and bcrypt
- **Email Service**: SendGrid para emails transaccionales
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: Zustand stores
- **Rich Text**: TipTap editor
- **Analytics**: Google Analytics 4 con Realtime API
- **Runtime**: Bun preferred, Node.js supported

### App Router Structure

- `(home)/` - Public website pages
- `(admin)/` - Protected admin panel with role-based access
- `(auth)/` - Authentication flows (login, recovery)
- `api/` - API routes including NextAuth and file uploads

### Server Actions Pattern

All CRUD operations use server actions organized in:

- `src/actions/Administration/` - Content management (Blogs, Events, Teams, etc.)
- `src/actions/Settings/` - User and role management
- Each module: `index.ts`, `queries.ts`, `mutations.ts`

### Component Architecture

- **UI Components**: shadcn/ui design system in `src/components/ui/`
- **Feature Components**: Domain-organized (Administration, Settings, Home)
- **Modal Pattern**: Consistent CRUD modals with edit/create variants
- **Table Components**: TanStack Table with pagination and sorting

### Database Schema

Core entities with role-based access control:

- **Users, Roles, Permissions** - Many-to-many relationships with granular control
- **Content**: Blogs, Categories, Teams, Events, Sponsors, PrintedMaterials
- **System**: Audit logs, ticketing, page-level permissions
- **Relations**: Blog-category many-to-many, event categorization

### State Management (Zustand)

- `authStore.ts` - Authentication state
- `permissionsStore.ts` - User permissions
- `sessionStore.ts` - Session management
- `useUserPermissionStore.ts` - Permission checking

### Authentication & Security

- NextAuth.js with custom credentials provider
- JWT sessions (30-day expiry, 24-hour refresh)
- Comprehensive audit logging
- Middleware-based route protection
- Page-level permission system

## Arquitectura del Sitio Público

### Estructura de Páginas Públicas

El sitio público está organizado bajo `src/app/(public)/` con las siguientes páginas:

- **Homepage (`/`)** - Página principal con múltiples secciones de contenido
- **Página Somos (`/somos`)** - Información institucional
- **Página Manifiesto (`/manifiesto`)** - Declaración de principios
- **Layout Público** - Estructura común con `DynamicHeader` y `Footer`

### Componentes del Sitio Público

#### Sistema de Header

- **`DynamicHeader`** - Header principal que se adapta según la página
- **`AlterHeader`** - Variante alternativa del header
- **`Header`** - Componente base del header
- **`HeaderMenu`** - Configuración del menú de navegación
- **`HeaderRedes`** - Enlaces a redes sociales

#### Componentes de la Homepage

- **`NewsHome`** - Grid de noticias/blogs para la página principal
- **`Cartelera`** - Calendario de eventos próximos (30 días)
- **`CarouselSponsors`** - Carrusel de patrocinadores/alianzas
- **`Suscribite`** - Formulario de suscripción al newsletter

#### Componentes de Layout

- **`Footer`** - Pie de página con información de contacto y enlaces

### Integración con Server Actions

#### Conexiones Datos-Componentes

- **`NewsHome`** → `getPostFromHome(0, 6)` - Obtiene últimos 6 blogs de `Administration/Blogs/queries`
- **`Cartelera`** → `getEventMonth/getEventMonthLimited` - Obtiene eventos del mes de `Administration/EventCalendars/queries`
- **`CarouselSponsors`** → `getAllSponsorsForCarousel` - Obtiene patrocinadores activos de `Administration/Sponsors/queries`
- **`Suscribite`** → Newsletter actions - Gestiona suscripciones de `Administration/Newsletter/mutations`

#### Patrones de Data Fetching

- **Server Components**: `NewsHome` (fetch en servidor para SEO)
- **Client Components**: `Cartelera`, `CarouselSponsors` (interactividad y estado)
- **Hydration**: Componentes client se cargan después del HTML inicial

### Patrones de Arquitectura Pública

#### Responsive Design

- **Mobile-first approach**: Diseño base para móviles, expansión a desktop
- **Breakpoints**: Uso de clases Tailwind (`md:`, `lg:`) para adaptabilidad
- **Grid Systems**: CSS Grid para layouts de noticias y eventos

#### Optimización de Imágenes

- **Next.js Image**: Componente optimizado para todas las imágenes
- **Priority loading**: Hero images con `priority={true}`
- **Responsive images**: Uso de `fill` y `object-cover` para containers fluidos

#### Manejo de Estados

- **Loading states**: Estados de carga para componentes client
- **Error boundaries**: Manejo de errores en fetching de datos
- **Progressive enhancement**: Funcionalidad básica sin JavaScript, mejoras con hidratación

#### Tipografía y Branding

- **Custom fonts**: BasicSans con variantes (Regular, Bold, Light, etc.)
- **Color system**: Paleta personalizada (`text-azul`, `text-fucsia`, `bg-negro`)
- **Spacing system**: Sistema consistente de espaciado y padding

## Development Patterns

### File Naming Conventions

- Use plural for collections, singular for items
- TypeScript interfaces end with `Interface.ts`
- Server actions: `queries.ts` for reads, `mutations.ts` for writes

### Component Patterns

- Modal-based CRUD operations
- Consistent error handling with Sonner toasts
- Form validation with react-hook-form
- Server-side data fetching with Next.js server components

### Database Operations

- Always use Prisma transactions for multi-table operations
- Include audit logging for all mutations
- Use proper error handling and validation
- Follow the established query patterns in existing actions

### Testing

No formal testing setup exists - consider adding testing infrastructure for new features.

## Environment Setup

- Requires PostgreSQL database
- Uses Vercel Blob for file storage
- Environment variables for NextAuth, database, and email (SendGrid)
- Google Analytics 4 configuration with Realtime API access
- Spanish locale support (es-ES)

### SendGrid Email Configuration

**Sistema Unificado de Emails Transaccionales**

El proyecto usa SendGrid como servicio de email único, reemplazando completamente Brevo. Todos los emails transaccionales (recuperación de contraseñas, notificaciones de tickets, suscripciones a newsletter) se envían a través de SendGrid.

#### Variables de Entorno Requeridas

```bash
# SendGrid API Configuration
# Documentación: https://www.twilio.com/docs/sendgrid/for-developers
SENDGRID_API_KEY="tu-sendgrid-api-key"
SENDGRID_FROM_EMAIL="noreply@barcodepapel.cl"
SENDGRID_FROM_NAME="Barco de Papel"

# Notificaciones de Tickets
ADMIN_NOTIFICATION_EMAIL="tu-email@ejemplo.com"

# Notificaciones de Newsletter
NEWSLETTER_ADMIN_EMAIL="tu-email@ejemplo.com"
```

#### Configuración de SendGrid

1. **Crear cuenta en SendGrid** (https://sendgrid.com)
2. **Obtener API Key**: Settings → API Keys → Create API Key
3. **Verificar dominio remitente**: Settings → Sender Authentication → Domain Authentication
4. **Configurar Single Sender** (alternativa): Settings → Sender Authentication → Single Sender Verification
5. **Agregar variables al `.env.local`**

#### Tipos de Emails Soportados

El servicio unificado (`src/lib/email/sendgridService.ts`) soporta:

- **Password Reset**: Emails de recuperación de contraseña con template profesional
  - Categorías: `password_reset`, `authentication`, `transactional`
  - Prioridad: Alta
  - Template: `ResetPasswordEmail.tsx`

- **Newsletter Subscription**: Confirmación de suscripción al boletín
  - Categorías: `newsletter`, `subscription`, `marketing`
  - Prioridad: Normal
  - Template: `NewsletterSubscriptionEmail.tsx`

- **Ticket Notifications**: Notificaciones al admin de nuevos tickets
  - Categorías: `ticket`, `notification`, `admin`, `transactional`
  - Prioridad: Alta
  - Template: `TicketNotificationEmail.tsx`

#### Arquitectura del Sistema de Emails

```
src/lib/email/
├── sendgridService.ts              # Servicio unificado SendGrid
└── templates/
    ├── ResetPasswordEmail.tsx      # Template recuperación contraseña
    ├── NewsletterSubscriptionEmail.tsx  # Template newsletter
    └── TicketNotificationEmail.tsx # Template notificaciones tickets
```

#### Mejores Prácticas Implementadas

- ✅ API Key authentication (no SMTP)
- ✅ Sender Identity verification
- ✅ TLS enforcement automático
- ✅ Error handling robusto con logs detallados
- ✅ Categorización para analytics de SendGrid
- ✅ Tracking de opens y clicks
- ✅ Message ID logging para debugging
- ✅ Templates con React Email para emails profesionales
- ✅ Fallback a texto plano para clientes sin HTML

#### Testing del Servicio

```bash
# El servicio incluye método de test
# Verificar configuración desde código:
const testResult = await sendGridService.testConfiguration();
console.log(testResult);
```

### Google Analytics 4 Configuration Variables

```bash
# Google Analytics 4 Data API
GOOGLE_ANALYTICS_PROPERTY_ID="tu-property-id-aqui"
GOOGLE_SERVICE_ACCOUNT_KEY='{
  "type": "service_account",
  "project_id": "tu-proyecto-ga4",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "analytics@tu-proyecto-ga4.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}'

# Configuración optimizada
ANALYTICS_REFRESH_INTERVAL=120000 # 2 minutos para datos más frescos
```

### Configuración Analytics Optimizada

#### Métricas Disponibles

**Datos Históricos (actualización cada 2 minutos):**

- `sessions`: Total sesiones últimos 30 días
- `pageViews`: Total páginas vistas últimos 30 días
- `engagementRate`: Tasa de compromiso promedio
- `userEngagementDuration`: Duración promedio de compromiso
- `topPages`: Páginas más visitadas con métricas detalladas
- `devices`: Distribución por tipo de dispositivo
- `trafficSources`: Fuentes de tráfico principales

#### Dashboard Optimizado

El dashboard analytics muestra datos históricos confiables:

- **Fila 1**: Métricas principales (sesiones, páginas vistas, tasa de compromiso)
- **Fila 2**: Gráfico de tendencias históricas (30 días)
- **Fila 3**: Top páginas más visitadas + distribución de dispositivos
- **Footer**: Timestamp de última actualización y frecuencia de refresh

#### Componentes Principales

- `MetricCard`: Cards optimizadas para métricas históricas
- `TrendChart`: Gráfico de evolución temporal
- `TopPagesTable`: Tabla de páginas más visitadas
- `DevicePieChart`: Distribución por dispositivos
- `useAnalytics`: Hook principal para gestión de datos

## Code Quality

- TypeScript strict mode enabled
- Biome for linting (configured in `biome.json`)
- Path aliases configured (`@/` points to `src/`)
- Tailwind CSS v4 con organización manual de clases

### Codificación de Archivos

**IMPORTANTE**: Todos los archivos deben crearse con codificación **ISO-8859-1** para soportar correctamente los caracteres especiales del español (tildes, eñes, etc.). NUNCA usar UTF-8 ya que causa errores de codificación.

## Corrección Ortográfica Bilingüe (Español/Inglés)

### Principios de Corrección

Este proyecto maneja "Spanglish" intencionalmente donde los clientes mezclan español e inglés. **RESPETAR** estas decisiones del cliente mientras se corrigen errores ortográficos genuinos.

### ✅ CORRECCIONES PERMITIDAS

- **Errores ortográficos en español**: "Línea" (no "Linea"), "Próximos" (no "Proximos"), "Descripción" (no "Descripcion")
- **Errores ortográficos en inglés**: "Description" (no "Descriptiom"), "Management" (no "Managment")
- **Concordancia verbal**: "Cargar más" (no "Cargas más")

### ❌ NO CORREGIR - Spanglish Intencional

- **Términos técnicos del cliente**: "Home" (no cambiar a "Inicio"), "Dashboard", "Admin", "Settings"
- **Rutas URL**: NUNCA cambiar (pueden romper funcionalidad) - `/noticas`, `/admin`, `/settings`
- **Nombres de componentes**: Si el cliente decidió "AdminHome", mantener

### Proceso de Corrección

1. **Identificar contexto**: ¿Es texto de UI, código, URL o comentario?
2. **Determinar tipo**: ¿Error ortográfico genuino o decisión del cliente?
3. **Aplicar corrección apropiada**: Solo errores ortográficos, NO cambios de idioma
4. **Verificar funcionalidad**: Que rutas e imports sigan funcionando

### Ejemplo Práctico

```typescript
// ✅ CORRECTO - Corregir errores ortográficos
<h1>Próximos Eventos</h1> // (no "Proximos")
<Link href="/noticas">Cargar más</Link> // Texto corregido, URL mantenida

// ❌ NO CAMBIAR - Decisiones del cliente
<nav>Home | Dashboard | Settings</nav> // Mantener Spanglish
```

Para más detalles, consultar `next_best_practices.md` sección 10.


## Sistema de Formateo Personalizado

### Herramientas de Formateo Configuradas

Este proyecto usa Tailwind CSS v4 con organización manual de clases. Las herramientas de formateo son:

1. **Prettier** (`bun run bun:format-prettier`) - Formateo general de código
2. **Biome** (`npx biome check .`) - Linting y verificación de estilo
3. **TypeScript** (`npx tsc --noEmit`) - Verificación de tipos
4. **next_best_practices.md** - Corrección ortográfica bilingüe y patterns específicos

### Comandos de Formateo Correctos

```bash
# Formateo completo del proyecto
bun run bun:format-prettier        # Prettier para todo el código
npx biome check .                  # Verificación de linting
npx tsc --noEmit                   # Verificación de tipos TypeScript

# Comandos disponibles para formateo:
bun run bun:format-prettier       # ✅ Prettier
npx biome check .                 # ✅ Biome linting
```

### Formateo de Clases Tailwind

Las clases de Tailwind se organizan **manualmente** por categorías según `next_best_practices.md`:

```typescript
// ✅ Orden correcto de clases Tailwind
className={cn(
  // Layout
  "flex flex-col",
  // Spacing
  "p-4 gap-3",
  // Appearance
  "bg-white rounded-lg shadow-sm",
  // Responsive
  "sm:p-6 md:gap-4",
  // State
  "hover:shadow-md transition-shadow",
  // Custom
  className
)}
```

### Integración con Dev Workflow

El sistema de desarrollo usa únicamente Prettier y Biome para formateo. Todas las opciones del menú de desarrollo funcionan correctamente con esta configuración.

### Corrección Ortográfica Bilingüe

El formateo incluye corrección automática de errores ortográficos respetando el Spanglish intencional del cliente, según las reglas definidas en `next_best_practices.md` sección 10.
