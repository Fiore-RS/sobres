# Especificación — App de Sobres (nombre de trabajo)

> Nota: "Sobres" es un nombre de trabajo para referirnos al proyecto durante esta especificación. Podés cambiarlo cuando definas la identidad visual, sin que afecte nada de esta lógica.

## 1. Resumen y objetivo

App personal de planificación financiera basada en el sistema de sobres del BCR. No se conecta a ningún banco ni cuenta real — es una herramienta visual de referencia para decidir y llevar registro de cómo repartir el dinero que entra entre distintos sobres (necesidades u objetivos), según una prioridad porcentual definida por la usuaria.

El problema que resuelve: calcular manualmente cuánto meter a cada sobre según su prioridad es tedioso y propenso a error, especialmente cuando no todos los sobres participan de cada ingreso.

## 2. Alcance y filosofía

- Sin conexión bancaria, sin backend compartido, sin autenticación multiusuario. Es una app de un solo usuario, para uso personal.
- Local-first: los datos viven en el dispositivo (localStorage), con exportar/importar como respaldo manual — mismo patrón que el Generador de Facturas Wisteria.
- Instalable como PWA para uso rápido día a día desde el celular, funcional offline.
- La app es una calculadora y un registro de referencia, no un reemplazo de la cuenta bancaria real. Los saldos que muestra son los que la propia usuaria construye repartiendo ingresos y anotando gastos — no se sincronizan solos con nada.

## 3. Glosario

- **Sobre**: una categoría de necesidad u objetivo (ej. Universidad, Viajes, Ahorro). Tiene un nombre, color, prioridad y saldo acumulado.
- **Prioridad**: porcentaje asignado a un sobre. La suma de las prioridades de **todos** los sobres existentes siempre debe ser 100%.
- **Ingreso**: un monto de dinero que entra y se reparte entre los sobres seleccionados.
- **Reparto**: el cálculo que distribuye un ingreso entre los sobres seleccionados, según sus prioridades recalculadas (ver sección 5.2).
- **Movimiento**: un registro en el historial — puede ser un reparto de ingreso o un ajuste manual (retiro/gasto/corrección).

## 4. Modelo de datos

### 4.1 Sobre

```
Sobre {
  id: string
  nombre: string
  color: string          // para identificación visual
  icono?: string          // opcional
  prioridad: number       // porcentaje, 0-100, con hasta 1 decimal
  saldoActual: number     // en colones
  meta?: number           // monto objetivo opcional (para sobres tipo "ahorro")
  orden: number           // posición de despliegue, editable por la usuaria
  archivado: boolean      // para "retirar" un sobre sin perder su historial
  creadoEn: timestamp
}
```

### 4.2 Movimiento (historial)

```
Movimiento {
  id: string
  tipo: "ingreso_repartido" | "ajuste_manual"
  fecha: timestamp
  montoTotal: number           // solo para tipo "ingreso_repartido"
  sobresParticipantes: [       // detalle de qué recibió cada sobre en este movimiento
    {
      sobreId: string
      porcentajeAplicado: number   // el % ya recalculado, no la prioridad base
      monto: number                // positivo (ingreso) o negativo (retiro/gasto)
    }
  ]
  nota?: string                 // texto libre, ej. "pago de matrícula"
}
```

### 4.3 Configuración / respaldo

```
Configuracion {
  moneda: "CRC"
  ultimoRespaldo?: timestamp
}
```

## 5. Reglas de negocio

### 5.1 Validación de prioridades

La suma de las prioridades de todos los sobres activos (no archivados) debe ser exactamente 100%. La pantalla de gestión de sobres muestra en todo momento cuánto suma el total configurado, con una indicación clara si falta o sobra, y no permite guardar cambios que dejen el total distinto de 100%.

Si archivás un sobre, su prioridad **no** se redistribuye automáticamente entre los demás — quedás vos a cargo de reajustar manualmente los sobres restantes hasta volver a sumar 100%. Mientras eso no pase, la validación de la sección 5.1 va a mostrar el total por debajo de 100% y no va a dejar guardar otros cambios de prioridad hasta que cuadre.

### 5.2 Selección de sobres y recálculo de prioridades

Al registrar un ingreso, seleccionás un subconjunto de sobres. Sus prioridades base se recalculan proporcionalmente entre sí para sumar 100% de ese ingreso específico.

Fórmula: para cada sobre seleccionado *i*, con prioridad base `p_i`, el porcentaje aplicado a este ingreso es:

```
porcentajeAplicado_i = p_i / (suma de p_i de los sobres seleccionados)
```

**Ejemplo:** seleccionás Universidad (17%) y Ahorro (22%), suman 39%. Con un ingreso de ₡100,000:
- Universidad: 17/39 = 43.59% → ₡43,590
- Ahorro: 22/39 = 56.41% → ₡56,410

### 5.3 Redondeo (método del residuo mayor)

Como los porcentajes casi nunca dividen el monto en colones exactos, se usa el método de "mayor residuo" para garantizar que la suma de lo repartido sea siempre exactamente igual al ingreso:

1. Calcular el monto exacto (con decimales) para cada sobre.
2. Redondear cada uno hacia abajo (truncar) a colones enteros.
3. Sumar los montos truncados; la diferencia contra el ingreso total es el "residuo" de colones que faltan repartir.
4. Repartir esos colones sobrantes uno por uno, en orden de mayor a menor parte decimal descartada, hasta agotar el residuo.

**Ejemplo:** ingreso de ₡100,000 entre tres sobres con montos exactos de ₡33,333.33 cada uno.
- Truncado: ₡33,333 × 3 = ₡99,999 → falta repartir ₡1.
- Los tres tienen el mismo residuo decimal (0.33), se le asigna el colón sobrante al primero según el orden de despliegue.
- Resultado: ₡33,334 + ₡33,333 + ₡33,333 = ₡100,000 exacto.

### 5.4 Ajuste manual antes de confirmar

En la vista previa del reparto, cada monto calculado se puede editar a mano antes de confirmar (por ejemplo, para desviarse de la fórmula un mes puntual). Si se edita un monto, el resto de los montos **no** se recalculan automáticamente entre sí — la usuaria ajusta cualquier otro manualmente si quiere que la suma siga cuadrando. La app muestra si el total editado coincide o no con el ingreso original, pero permite confirmar aunque no coincida (por ejemplo, si parte del ingreso se queda fuera de los sobres a propósito).

### 5.5 Retiros y gastos manuales

Se puede registrar un movimiento manual negativo contra un sobre específico (un gasto o retiro), que resta de su saldo acumulado.

Sí se permite que un sobre quede en saldo negativo tras un retiro. La app no bloquea la operación — un sobre en negativo se destaca visualmente (por ejemplo en rojo), porque puede reflejar una situación real (gastaste de más de ese sobre) que conviene ver, no ocultar.

### 5.6 Edición de prioridades no afecta saldos existentes

Cambiar la prioridad de un sobre solo afecta los repartos futuros. El saldo acumulado hasta ese momento no se recalcula ni se toca.

### 5.7 Eliminar o archivar un sobre con saldo

Un sobre con saldo distinto de cero no se puede eliminar directamente — se archiva en su lugar. Un sobre archivado desaparece de la lista de selección para nuevos repartos, pero conserva su saldo, su historial, y puede reactivarse más adelante. Solo se permite eliminar (borrado real) un sobre con saldo en cero y sin necesidad de conservar su historial.

## 6. Flujos de usuario

### 6.1 Registrar un nuevo ingreso

1. Ingresás el monto total.
2. Seleccionás los sobres activos que participan (todos por defecto, deseleccionables).
3. La app muestra la vista previa: porcentaje recalculado y monto por sobre, ya redondeado correctamente.
4. Opcionalmente ajustás algún monto a mano.
5. Agregás una nota opcional.
6. Confirmás → se actualiza el saldo de cada sobre y se crea un Movimiento tipo `ingreso_repartido`.

### 6.2 Gestionar sobres

Crear, editar (nombre, color, ícono, prioridad, meta, orden) y archivar/reactivar sobres. Validación en tiempo real de que el total de prioridades sea 100%.

### 6.3 Registrar un retiro o gasto

Elegís un sobre, ingresás un monto y una nota opcional (ej. "matrícula del semestre") → se resta del saldo y se crea un Movimiento tipo `ajuste_manual`.

### 6.4 Ver historial

Lista cronológica de movimientos, filtrable por sobre. Cada entrada muestra fecha, tipo, monto y nota. Permite editar o eliminar un movimiento por error (recalculando el saldo del sobre afectado).

### 6.5 Exportar / importar respaldo

Exporta todos los sobres, movimientos y configuración como un archivo JSON descargable. Importar un respaldo **reemplaza por completo** los datos actuales (sobres, movimientos y configuración) — no los fusiona. Conviene que la app muestre una confirmación explícita antes de importar, ya que la operación no es reversible salvo que tengas otro respaldo de los datos que se van a sobrescribir.

## 7. Pantallas necesarias (para la fase de diseño)

1. **Inicio / Dashboard** — resumen visual de todos los sobres activos con su saldo actual y, si tiene meta, su progreso.
2. **Detalle de sobre** — saldo, meta, prioridad, historial filtrado de ese sobre.
3. **Nuevo ingreso** — selección de sobres + vista previa del reparto.
4. **Nuevo retiro/gasto** — selección de sobre + monto + nota.
5. **Gestión de sobres** — crear/editar/archivar, con validación de 100%.
6. **Historial general** — todos los movimientos, filtrable.
7. **Configuración / respaldo** — exportar/importar, información de la app.

## 8. Alcance

### MVP (fase 1)
- Gestión de sobres con validación de prioridades = 100%
- Registrar ingreso con selección de sobres, recálculo proporcional y redondeo correcto
- Saldo visible por sobre
- Registrar retiros/gastos manuales
- Historial de movimientos con edición/eliminación
- Exportar/importar respaldo en JSON
- Instalable como PWA, funcional offline

### Fase 2 (después)
- Metas de ahorro con barra de progreso visual
- Gráfico de distribución total del dinero entre sobres
- Perfiles de prioridades distintos (ej. para ingresos regulares vs. irregulares)
- Modo claro/oscuro

## 9. Consideraciones técnicas

- **Stack:** React + Vite + TypeScript + Tailwind, mismo patrón que Teleo y Wisteria.
- **Persistencia:** localStorage, sin backend. Exportar/importar JSON para respaldo manual (igual que Wisteria).
- **PWA:** `vite-plugin-pwa` para manifest, ícono instalable y caché offline.
- **Precisión numérica:** trabajar montos en colones enteros (o centavos como enteros) para evitar errores de punto flotante en los cálculos de reparto y redondeo.
- **Despliegue:** GitHub Pages, siguiendo el mismo patrón de HashRouter usado en Teleo si se necesita ruteo.

## 10. Decisiones resueltas

Las tres piezas de lógica que quedaban abiertas ya están definidas y reflejadas en las secciones correspondientes:

1. Archivar un sobre no redistribuye su prioridad automáticamente — reajuste manual (sección 5.1).
2. Se permite saldo negativo en un sobre, con aviso visual (sección 5.5).
3. Importar un respaldo reemplaza por completo los datos actuales, con confirmación previa (sección 6.5).

Con esto la lógica queda completa y lista para pasar a la fase de diseño.
