# Pull Request to Develop Command

**IMPORTANTE: Todas las respuestas y comunicaciones deben ser SIEMPRE en español. Nunca uses inglés al ejecutar este comando.**

Crea un Pull Request desde el branch actual hacia `develop`:

## Pasos a seguir:

1. **Verificar el branch actual**
   - Ejecutar `git branch --show-current` para identificar el branch origen
   - Preguntar al usuario: "¿Deseas crear un PR desde `[branch-actual]` hacia `develop`? (s/n)"

2. **Verificar estado del repositorio**
   - Ejecutar `git status` para verificar que no hay cambios sin commitear
   - Si hay cambios sin commitear, informar al usuario y preguntar si desea commitearlos primero

3. **Revisar los commits que se incluirán**
   - Ejecutar `git log origin/develop..HEAD --oneline` para mostrar los commits
   - Mostrar al usuario los commits que se incluirán en el PR

4. **Hacer push del branch (si es necesario)**
   - Ejecutar `git push origin [branch-actual]`

5. **Crear el Pull Request**
   - Usar `gh pr create --base develop` con:
     - **Título**: `[BRANCH-NAME]: [Descripción clara de los cambios]`
     - **Body**: Incluir resumen, cambios incluidos, detalles técnicos y test plan

## Formato del PR:

**Título:**
```
[BRANCH-NAME]: Descripción concisa de los cambios
```

**Body:**
```markdown
## Resumen
- [Lista de cambios principales]

## Cambios incluidos
- [Detalle de archivos/componentes modificados]

## Detalles técnicos
- [Información técnica relevante]

## Test plan
- [ ] [Lista de verificaciones]
```

## Reglas importantes:

- **Branch destino**: Siempre es `develop`
- **Título claro**: Incluir el nombre del branch y descripción concisa
- **Body detallado**: Incluir resumen, cambios, detalles técnicos y test plan
- **Verificar commits**: Mostrar al usuario qué commits se incluirán
- **Confirmar con usuario**: Preguntar antes de crear el PR

## Verificación post-PR:

- Mostrar la URL del PR creado
- Confirmar que el PR está dirigido a `develop`
- Mostrar resumen de commits incluidos

# Uso: /pr-to-develop
