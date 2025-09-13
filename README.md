# Frontend Línea de Bus

Este proyecto es el frontend para la gestión de líneas de buses, desarrollado con React + Vite + Mapbox GL JS. Permite crear líneas, direcciones, cargar rutas en formato .geojson, previsualizarlas en el mapa y consultar métricas.

## Requisitos previos
- Node.js y npm instalados
- Acceso a un backend compatible (ejemplo: https://github.com/SudoCode76/milinea-backend)
- Token de Mapbox (https://account.mapbox.com/access-tokens/)

## Instalación
1. Clona el repositorio:
   ```pwsh
   git clone https://github.com/Andrew3014/frontend-linea-bus.git
   cd frontend-linea-bus
   ```
2. Instala las dependencias:
   ```pwsh
   npm install
   ```
3. Configura tu token de Mapbox en `src/components/StepGeojson.jsx`:
   ```js
   mapboxgl.accessToken = 'TU_MAPBOX_TOKEN_AQUI';
   ```
4. Asegúrate de que el backend esté corriendo y accesible en `http://localhost:3000`.

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

## Estructura del proyecto
- `src/components/StepLinea.jsx`: Formulario y listado de líneas
- `src/components/StepDirecciones.jsx`: Formulario y listado de direcciones
- `src/components/StepGeojson.jsx`: Carga, edición y previsualización de rutas
- `src/App.jsx`: Flujo principal de la aplicación

## Comandos para subir a GitHub
1. Inicializa el repositorio (si no está inicializado):
   ```pwsh
   git init
   ```
2. Agrega los archivos:
   ```pwsh
   git add .
   ```
3. Haz el primer commit:
   ```pwsh
   git commit -m "Frontend inicial para gestión de líneas de buses"
   ```
4. Agrega el repositorio remoto:
   ```pwsh
   git remote add origin https://github.com/Andrew3014/frontend-linea-bus.git
   ```
5. Sube los cambios:
   ```pwsh
   git branch -M main
   git push -u origin main
   ```

## Notas de integración
- El frontend está listo para conectarse al backend. Solo asegúrate de que los endpoints estén activos y la base de datos configurada.
- Si necesitas cambiar la URL del backend, actualiza las llamadas fetch en los componentes.
- Para producción, puedes construir el proyecto con:
   ```pwsh
   npm run build
   ```

## Licencia
MIT
