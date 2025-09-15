# Frontend Línea de Bus

Este proyecto es el frontend para la gestión de líneas de buses, desarrollado con React + Vite + Mapbox GL JS. Permite crear líneas, direcciones, cargar rutas en formato .geojson, previsualizarlas en el mapa y consultar métricas.

## Requisitos previos
- Node.js y npm instalados
- Acceso a un backend compatible ([milinea-backend](https://github.com/SudoCode76/milinea-backend))
- Token de Mapbox ([obtenlo aquí](https://account.mapbox.com/access-tokens/))

## Instalación
<<<<<<< HEAD

=======
>>>>>>> e4216bb (Actualiza README con nuevas funcionalidades y visualización de rutas)
1. Instala las dependencias:
   ```pwsh
   npm install
   ```
2. Configura tu token de Mapbox en `src/components/StepGeojson.jsx`:
   ```js
   mapboxgl.accessToken = 'TU_MAPBOX_TOKEN_AQUI';
   ```
3. Asegúrate de que el backend esté corriendo y accesible en `http://localhost:3000`.

## Uso
1. Inicia el servidor de desarrollo:
   ```pwsh
   npm run dev
   ```
2. Abre el navegador en `http://localhost:5173`
3. Crea una línea, agrega direcciones y carga rutas .geojson (puedes usar los ejemplos precargados).

## Funcionalidades principales
- Crear y listar líneas de buses (código, nombre, color, estado)
- Crear direcciones (ida/vuelta) para cada línea
- Cargar rutas en formato .geojson por dirección (drag & drop, selector de archivos, ejemplos)
- Previsualizar rutas en el mapa (Mapbox)
- Editar segmentos (eliminar, invertir sentido)
- Consultar métricas básicas (segmentos, puntos)
- **Visualizar métricas reales y geometría guardada desde el backend**
- **Distinguir visualmente entre la ruta guardada (azul claro) y la edición local (color de línea)**

## Estructura del proyecto
- `src/components/StepLinea.jsx`: Formulario y listado de líneas
- `src/components/StepDirecciones.jsx`: Formulario y listado de direcciones
- `src/components/StepGeojson.jsx`: Carga, edición y previsualización de rutas
- `src/App.jsx`: Flujo principal de la aplicación

<<<<<<< HEAD

=======
>>>>>>> e4216bb (Actualiza README con nuevas funcionalidades y visualización de rutas)
## Notas de integración
- El frontend está listo para conectarse al backend. Solo asegúrate de que los endpoints estén activos y la base de datos configurada.
- Si necesitas cambiar la URL del backend, actualiza las llamadas fetch en los componentes.
- Para producción, puedes construir el proyecto con:
   ```pwsh
   npm run build
   ```

## Licencia
MIT
