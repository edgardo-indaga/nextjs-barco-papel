# 🔧 Configuración de Google Analytics API - Guía Completa

**Fecha de Creación**: 23 de Julio, 2025  
**Objetivo**: Configurar Google Analytics Data API v1 para el Dashboard de Analytics  
**Tiempo Estimado**: 30-45 minutos

---

## 📋 Resumen de Pasos

1. **Google Cloud Console** - Crear proyecto y habilitar APIs
2. **Service Account** - Crear credenciales de acceso
3. **Google Analytics** - Configurar permisos y obtener Property ID
4. **Next.js Project** - Configurar variables de entorno
5. **Verificación** - Probar la conexión

---

## 🏗️ PARTE 1: Google Cloud Console

### **Paso 1: Crear/Seleccionar Proyecto**

1. **Acceder a Google Cloud Console**:

    - URL: https://console.cloud.google.com
    - Iniciar sesión con cuenta de Google

2. **Crear nuevo proyecto**:

    - Clic en selector de proyecto (parte superior de la página)
    - Botón "Nuevo Proyecto"
    - **Nombre del proyecto**: `Analytics Dashboard` (o nombre descriptivo)
    - **Organización**: Seleccionar tu organización
    - Clic **"Crear"**
    - ⏱️ Esperar 1-2 minutos a que se cree

3. **Seleccionar el proyecto**:
    - Verificar que el proyecto aparece seleccionado en la barra superior

### **Paso 2: Habilitar APIs Requeridas**

1. **Navegar a APIs**:

    - Menú ≡ → "APIs y servicios" → "Biblioteca"

2. **Habilitar Google Analytics Data API v1**:

    - Buscar: `Google Analytics Data API`
    - Clic en **"Google Analytics Data API"**
    - Botón **"Habilitar"**
    - ✅ Esperar confirmación "API habilitada"

3. **Habilitar Google Analytics Reporting API v4** (backup):
    - Buscar: `Google Analytics Reporting API`
    - Clic en **"Google Analytics Reporting API"**
    - Botón **"Habilitar"**
    - ✅ Esperar confirmación "API habilitada"

### **Paso 3: Crear Service Account**

1. **Navegar a Credenciales**:

    - Menú ≡ → "APIs y servicios" → "Credenciales"

2. **Crear nueva cuenta de servicio**:

    - Botón **"Crear credenciales"**
    - Seleccionar **"Cuenta de servicio"**

3. **Configurar detalles**:

    - **Nombre**: `GA4 Analytics Service`
    - **ID de cuenta**: `ga4-analytics-service`
    - **Descripción**: `Service Account para Dashboard Analytics Next.js`
    - Clic **"Crear y continuar"**

4. **Permisos del proyecto** (opcional):

    - Dejar vacío (no se requieren permisos especiales a nivel de proyecto)
    - Clic **"Continuar"**

5. **Acceso de usuarios** (opcional):
    - Dejar vacío
    - Clic **"Listo"**

### **Paso 4: Generar Clave JSON**

1. **Localizar Service Account**:

    - En la página "Credenciales"
    - Sección "Cuentas de servicio"
    - Clic en **"ga4-analytics-service@[proyecto].iam.gserviceaccount.com"**

2. **Crear clave privada**:

    - Pestaña **"Claves"**
    - Botón **"Agregar clave"** → **"Crear nueva clave"**
    - Tipo: **JSON** (seleccionado por defecto)
    - Clic **"Crear"**

3. **Descargar y guardar**:

    - 💾 El archivo JSON se descarga automáticamente
    - **⚠️ IMPORTANTE**: Guardar en lugar seguro
    - **⚠️ NO subir a repositorio Git**

4. **Copiar email del Service Account**:
    - Formato: `ga4-analytics-service@[proyecto].iam.gserviceaccount.com`
    - 📋 Copiar para usar en el siguiente paso

---

## 📊 PARTE 2: Google Analytics

### **Paso 5: Acceder a Google Analytics**

1. **Ir a Google Analytics**:

    - URL: https://analytics.google.com
    - Iniciar sesión con la misma cuenta de Google

2. **Seleccionar propiedad correcta**:
    - Verificar que es una **propiedad GA4** (no Universal Analytics)
    - Si no tienes GA4, crear una nueva propiedad primero

### **Paso 6: Obtener Property ID**

1. **Ir a Configuración**:

    - Clic en **"Admin"** (⚙️ engrane en parte inferior izquierda)

2. **Obtener ID de propiedad**:
    - Columna central: **"Configuración de la propiedad"**
    - Clic en **"Configuración de la propiedad"**
    - 📋 **Copiar "ID de la propiedad"** (formato: números como `497602966`)

### **Paso 7: Dar Acceso al Service Account**

1. **Ir a administración de acceso**:

    - Todavía en **Admin**
    - Columna central: **"Administración del acceso"**

2. **Agregar usuario**:

    - Botón **"+"** (parte superior derecha)
    - **Dirección de email**: Pegar email del Service Account
    - **Funciones**: Seleccionar **"Viewer"** ✅
    - **Notificar por email**: Desmarcar (no es necesario)
    - Clic **"Agregar"**

3. **Verificar acceso**:
    - El Service Account debe aparecer en la lista con rol "Viewer"

---

## ⚙️ PARTE 3: Configuración en Next.js

### **Paso 8: Variables de Entorno**

1. **Abrir archivo `.env.local`** en tu proyecto Next.js

2. **Agregar variables de Analytics**:

```bash
##-------------------------------------------------------------------------------------------##
## GOOGLE ANALYTICS DATA API v1 CONFIGURACIÓN
## Para configurar, seguir guía en docs/GOOGLE_ANALYTICS_API_SETUP.md
##-------------------------------------------------------------------------------------------##

# ID de la propiedad de Google Analytics 4 (formato: números sin prefijo)
GOOGLE_ANALYTICS_PROPERTY_ID="497602966"

# Credenciales del Service Account (JSON completo)
GOOGLE_SERVICE_ACCOUNT_KEY='{
  "type": "service_account",
  "project_id": "tu-proyecto-id",
  "private_key_id": "clave-privada-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n",
  "client_email": "ga4-analytics-service@tu-proyecto.iam.gserviceaccount.com",
  "client_id": "tu-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/ga4-analytics-service%40tu-proyecto.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}'

# Intervalo de actualización del dashboard (en milisegundos - 5 minutos por defecto)
ANALYTICS_REFRESH_INTERVAL=300000
```

3. **Reemplazar valores**:
    - **Property ID**: El número copiado de GA4
    - **JSON completo**: Contenido del archivo descargado (en una sola línea)

### **Paso 9: Formatear JSON Correctamente**

**⚠️ IMPORTANTE**: El JSON debe estar en una sola línea dentro de las comillas simples.

**Método recomendado**:

1. Abrir el archivo JSON descargado
2. Copiar todo el contenido
3. Usar herramienta online para minificar JSON (ej: jsonformatter.org)
4. Pegar el JSON minificado entre las comillas simples

**Ejemplo correcto**:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"mi-proyecto",...}'
```

---

## 🔧 PARTE 4: Verificación y Testing

### **Paso 10: Probar Conexión**

1. **Reiniciar servidor de desarrollo**:

```bash
# Detener servidor (Ctrl+C si está corriendo)
bun run dev
```

2. **Ejecutar test de conexión**:

```bash
node scripts/test-analytics.js
```

3. **Resultado esperado**:

```
✅ Configuración válida
✅ Conexión con Google Analytics exitosa
✅ Property ID: 497602966
✅ Service Account: ga4-analytics-service@proyecto.iam.gserviceaccount.com
```

### **Paso 11: Verificar Dashboard**

1. **Acceder al dashboard**:

    - URL: http://localhost:3000/admin/dashboard
    - Iniciar sesión si es necesario

2. **Verificar métricas**:
    - Debe mostrar datos reales de Analytics
    - Gráficos deben cargarse correctamente
    - No debe haber errores en consola

---

## 🚨 Troubleshooting

### **Errores Comunes**

#### **Error 403: Forbidden**

- **Causa**: Service Account no tiene acceso en GA4
- **Solución**: Verificar que el Service Account está agregado con rol "Viewer" en GA4

#### **Error 404: Not Found**

- **Causa**: Property ID incorrecto
- **Solución**: Verificar Property ID en Admin → Configuración de la propiedad

#### **Error 400: Invalid JSON**

- **Causa**: JSON malformado en variable de entorno
- **Solución**: Verificar que el JSON esté en una sola línea y bien formateado

#### **Error 401: Unauthorized**

- **Causa**: Credenciales inválidas
- **Solución**: Regenerar clave JSON del Service Account

#### **Dashboard muestra "Loading..." permanente**

- **Causa**: APIs no habilitadas en Google Cloud
- **Solución**: Verificar que Google Analytics Data API v1 está habilitada

### **Comandos de Debug**

```bash
# Ver logs detallados
DEBUG=true bun run dev

# Verificar variables de entorno
echo $GOOGLE_ANALYTICS_PROPERTY_ID

# Test de conexión con logs
node scripts/test-analytics.js --verbose

# Verificar build
bun run build
```

---

## 📚 Referencias y Enlaces

### **Documentación Oficial**

- [Google Analytics Data API v1](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [API Schema Reference](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)

### **Herramientas Útiles**

- [Google Cloud Console](https://console.cloud.google.com)
- [Google Analytics](https://analytics.google.com)
- [JSON Formatter](https://jsonformatter.org)
- [GA4 Query Explorer](https://developers.google.com/analytics/devguides/reporting/data/v1/query-explorer)

### **Información del Proyecto**

- **Proyecto Google Cloud**: `andeslodge`
- **Service Account**: `ga4-analytics-service@andeslodge.iam.gserviceaccount.com`
- **Property ID GA4**: `497602966`
- **APIs utilizadas**: Google Analytics Data API v1

---

## ✅ Checklist Final

### **Google Cloud Console**

- [ ] Proyecto creado/seleccionado
- [ ] Google Analytics Data API v1 habilitada
- [ ] Google Analytics Reporting API v4 habilitada
- [ ] Service Account creado
- [ ] Clave JSON descargada y guardada seguramente

### **Google Analytics**

- [ ] Propiedad GA4 identificada
- [ ] Property ID copiado
- [ ] Service Account agregado con rol "Viewer"

### **Next.js Project**

- [ ] Variables de entorno configuradas
- [ ] JSON formateado correctamente
- [ ] Servidor reiniciado
- [ ] Test de conexión exitoso
- [ ] Dashboard funcionando

### **Verificación Final**

- [ ] Métricas reales se muestran en dashboard
- [ ] Gráficos cargan correctamente
- [ ] No hay errores en consola del navegador
- [ ] Refresh automático funciona (esperar 5 minutos)

---

**🎯 Al completar todos estos pasos, tendrás un Dashboard de Analytics completamente funcional con datos reales de Google Analytics 4.**

**⚠️ Recordatorio de Seguridad**: Nunca subir las credenciales JSON a repositorios públicos. Usar variables de entorno en producción.
