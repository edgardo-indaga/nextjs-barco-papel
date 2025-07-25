# Backup de Producción - 24/07/2025

## Información del Backup

- **Archivo**: `backup_20250724_195100.sql`
- **Fecha**: 24 de Julio 2025, 19:51:00
- **Tamaño**: 362KB
- **Base de datos**: Neon PostgreSQL 17.5
- **Tablas**: 20 tablas respaldadas
- **Registros**: Datos completos con formato COPY FROM stdin

## Contenido Respaldado

✅ Todas las tablas del sistema:
- Users, Roles, Permissions
- Blogs, BlogCategories
- EventeCalendar, EventCategories  
- Teams, Sponsors, PrintedMaterials
- Tickets, Newsletter
- Audit logs y configuraciones

## Comando de Restore

Para restaurar este backup en caso de emergencia:

```bash
# Configurar PostgreSQL 17
export PATH="/usr/local/opt/postgresql@17/bin:$PATH"

# Opción 1: Restore completo (DROP y CREATE database)
psql "postgres://neondb_owner:npg_epqA7SuPBYC1@ep-tight-thunder-ad1ywsl7-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" < backup_20250724_195100.sql

# Opción 2: Restore selectivo por tabla
psql "DATABASE_URL" -c "\\i backup_20250724_195100.sql"
```

## Validación Post-Restore

```sql
-- Verificar conteo de registros principales
SELECT 'Users' as tabla, COUNT(*) FROM "User";
SELECT 'Blogs' as tabla, COUNT(*) FROM "Blog";  
SELECT 'Events' as tabla, COUNT(*) FROM "EventeCalendar";
SELECT 'Teams' as tabla, COUNT(*) FROM "Team";
```

## Notas Importantes

⚠️ **ANTES DE APLICAR MIGRACIONES**: Este backup fue creado ANTES de aplicar las migraciones de eventDays/state
✅ **Compatible con**: Prisma migrate deploy
🔒 **Seguridad**: Contiene datos reales de producción - mantener seguro

## Próximos Pasos

1. ✅ Backup completado exitosamente
2. 🔄 Aplicar migraciones: `npx prisma migrate deploy`
3. 🔍 Verificar funcionamiento post-migración
4. 📊 Opcional: Crear nuevo backup post-migración