# Commit Command

**IMPORTANTE: Todas las respuestas y comunicaciones deben ser SIEMPRE en español. Nunca uses inglés al ejecutar este comando.**

Crea un commit siguiendo el formato estándar del proyecto:

1. Revisa el estado actual con `git status` y `git diff --staged`
2. Si hay archivos sin stagear que deban incluirse, agrégalos con `git add`
3. Crea un commit con el siguiente formato:

```
Task: [Descripción clara de los cambios realizados]. 
Version: [incrementar versión apropiadamente. 
Date: [fecha actual YYYY-MM-DD]
```

**Formato de ejemplo:**
- `Task: Add "ModelName" model, implement related services, controllers, module, Prisma schema updates, and migration. Version: 1.3.4. Date: 2025-10-09`

**Reglas importantes:**
- NO incluir `Co-Authored-By` ni menciones a Claude Code
- NO incluir emojis en el mensaje de commit
- Incrementar la versión apropiadamente (patch para cambios pequeños, minor para features)
- Usar la fecha actual en formato YYYY-MM-DD
- Describir claramente qué componentes fueron agregados/modificados
- Asegurarse de que todos los archivos relevantes estén staged antes del commit

**Verificación post-commit:**
- Ejecutar `git status` para confirmar que el commit fue exitoso
- Mostrar resumen de archivos incluidos en el commit

# Uso: /commit