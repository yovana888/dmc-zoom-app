# DMC Zoom App

Aplicación para **Zoom Apps** (se muestra en el panel lateral de una reunión de Zoom) que actúa como asistente de clase con IA. Está construida con Angular 20 y consume un microservicio de IA (RAG) para apoyar a estudiantes y docentes durante y después de una sesión.

## ¿Qué hace?

La app detecta el contexto de la reunión mediante el [Zoom Apps SDK](https://developers.zoom.us/docs/zoom-apps/) (usuario, reunión, UUID, participantes) y, con esa información, se comunica con el backend de IA.

Pestañas disponibles según el rol:

| Pestaña            | Estudiante | Docente | Descripción                                                                 |
| ------------------ | :--------: | :-----: | --------------------------------------------------------------------------- |
| **Asistente DMC**  |     ✅     |   ✅    | Chat con el asistente (RAG) sobre el contenido de la clase.                 |
| **Resumen visual** |     ✅     |   ❌    | Genera el kit final de la clase: mapa mental y flashcards (y cuestionario). |
| **Notas**          |     ✅     |   ✅    | Notas de la sesión.                                                         |

Otras funcionalidades: resumen exprés, cuestionarios en vivo, ruleta y lectura de los archivos compartidos en el chat de la reunión.

### Endpoints del backend que consume

Todos cuelgan de `apiMicroserviceIA` (por defecto `/api/v1`):

- `POST /session/details`
- `POST /session/chat-files`
- `POST /rag/ask`
- `POST /summary/express`
- `POST /quiz/generate-live`
- `POST /content/generate-final-kit`

Las peticiones llevan las cabeceras `X-API-Key` (si `apiKey` está configurada) y `X-User-Email` (si el cuerpo incluye `email`), añadidas por `api-headers.interceptor.ts`.

## Stack

- Angular 20 (componentes standalone, signals) + SCSS
- Bootstrap 5, Mulish (fuente), Phosphor Icons
- Syncfusion `ej2-angular-diagrams` (mapa mental)
- `@zoom/appssdk`
- Jest (tests), ESLint + Prettier, Husky + lint-staged + commitlint

## Requisitos previos

- **Node.js** `^20.19`, `^22.12` o `^24` (requerido por Angular 20) y **npm**
- Microservicio de IA corriendo (por defecto en `http://127.0.0.1:8080`)
- Para probar dentro de Zoom: una app de Zoom (tipo _Zoom App_) y un túnel HTTPS hacia `localhost:4200` (por ejemplo Cloudflare Tunnel o ngrok)

## Cómo levantar el proyecto

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Configurar el entorno en `src/environments/environment.local.ts`:

   ```ts
   export const environment: AppEnvironment = {
     production: false,
     apiMicroserviceIA: '/api/v1', // se redirige al backend vía proxy.conf.json
     apiKey: '<tu-api-key>', // opcional
     zoom: {
       clientId: '<zoom-client-id>',
       redirectUri: '<zoom-redirect-uri>',
     },
   };
   ```

3. Levantar el backend de IA en `http://127.0.0.1:8080`. El archivo `proxy.conf.json` redirige `/api/v1` hacia esa dirección; si tu backend usa otro host o puerto, edita el `target`:

   ```json
   {
     "/api/v1": {
       "target": "http://127.0.0.1:8080",
       "secure": false,
       "changeOrigin": true
     }
   }
   ```

4. Iniciar el servidor de desarrollo:

   ```bash
   npm start
   ```

   Abre `http://localhost:4200/`. El servidor escucha en `0.0.0.0:4200` y recarga automáticamente al guardar cambios.

### Probar dentro de Zoom

Zoom Apps solo carga URLs HTTPS públicas, por lo que debes exponer el puerto 4200 con un túnel:

```bash
cloudflared tunnel --url http://localhost:4200
```

Luego:

1. Agrega el dominio generado a `allowedHosts` en `angular.json` (`architect.serve.options`); si no, el dev server rechazará la petición.
2. Configura esa URL como _Home URL_ / _Domain Allow List_ y como _Redirect URL_ de OAuth en tu app de Zoom Marketplace (y usa la misma en `redirectUri`).
3. Abre la app desde una reunión de Zoom (Apps → tu app).

> Fuera de Zoom el SDK no se inicializa (`runningContext` no estará disponible) y la app mostrará diagnósticos de error en consola.

## Entornos y scripts

Cada entorno reemplaza `src/environments/environment.ts` por su archivo correspondiente.

| Script               | Comando                               | Entorno                  |
| -------------------- | ------------------------------------- | ------------------------ |
| `npm start`          | `ng serve --configuration local`      | `environment.local.ts`   |
| `npm run local`      | `ng serve --configuration local`      | `environment.local.ts`   |
| `npm run dev`        | `ng serve --configuration dev`        | `environment.dev.ts`     |
| `npm run cert`       | `ng serve --configuration cert`       | `environment.cert.ts`    |
| `npm run prod`       | `ng serve --configuration production` | `environment.prod.ts`    |
| `npm run build`      | `ng build`                            | producción (por defecto) |
| `npm run build:dev`  | `ng build --configuration dev`        | `environment.dev.ts`     |
| `npm run build:cert` | `ng build --configuration cert`       | `environment.cert.ts`    |
| `npm run build:prod` | `ng build --configuration production` | `environment.prod.ts`    |
| `npm test`           | `jest`                                | —                        |
| `npm run lint`       | `eslint "src/**/*.{ts,html}"`         | —                        |

El resultado de los builds se genera en `dist/`.

## Estructura del proyecto

```
src/
├── app/
│   ├── core/                  # interceptors, enums, modelos y utilidades globales
│   ├── shared/                # componentes UI (atoms/molecules), servicios y estilos compartidos
│   │   └── services/zoom/     # integración con Zoom Apps SDK
│   └── modules/assistant/
│       ├── components/        # modales: mapa mental, flashcards, resumen, ruleta, chat input...
│       ├── presentation/      # pantalla principal y pestañas (asistente, visual, notas)
│       └── infrastructure/    # servicios HTTP, stores, entidades e interfaces
└── environments/              # configuración por entorno
```

## Calidad de código

- Tests: `npm test` (Jest) o `npm run test:watch`
- Lint: `npm run lint`
- Antes de cada commit, Husky ejecuta `lint-staged` (ESLint + Prettier). Los mensajes de commit siguen [Conventional Commits](https://www.conventionalcommits.org/) (commitlint).

## Recursos

- [Angular CLI](https://angular.dev/tools/cli)
- [Zoom Apps SDK](https://developers.zoom.us/docs/zoom-apps/)
