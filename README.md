# Sobres

App personal de presupuesto basada en el sistema de sobres del BCR. No se conecta a ningún banco ni cuenta real — es una guía visual de referencia para repartir los ingresos entre sobres según prioridades porcentuales definidas por vos.

La lógica completa (modelo de datos, reglas de reparto, redondeo, flujos y pantallas) está documentada en [`docs/sobres-especificacion-desde-cero.md`](docs/sobres-especificacion-desde-cero.md).

## Stack

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (tokens de color y tipografía en `src/index.css`, vía `@theme`)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) — instalable, funcional offline
- Persistencia local (localStorage) — sin backend, sin autenticación

## Estructura

```
src/
  assets/components/
    atoms/        # componentes base (botones, inputs, badges…)
    molecules/     # combinaciones de atoms (tarjeta de sobre, fila de movimiento…)
    organisms/     # secciones completas de pantalla
  pages/           # una por pantalla de la especificación
  lib/             # lógica de reparto, redondeo, validaciones
  types/           # modelos de datos (Sobre, Movimiento, Configuracion)
docs/
  sobres-especificacion-desde-cero.md
```

## Desarrollo

```bash
npm install
npm run dev
```

```bash
npm run build    # build de producción
npm run preview  # previsualizar el build
npm run lint      # oxlint
```
