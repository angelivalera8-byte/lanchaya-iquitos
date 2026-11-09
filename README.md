# LanchaYa Iquitos

Aplicación web full stack donde las empresas fluviales registran sus salidas desde Iquitos y los pasajeros las consultan y filtran por destino, fecha y tipo de embarcación.

**Integrantes:** Christian Arévalo Jesús _(agrega aquí a tu pareja, si la tienes)_

## Requisitos
- Node.js 20 o superior
- npm

## Instalación y ejecución

Abre **dos terminales**.

### 1. Backend (API en el puerto 3000)
```bash
cd backend
npm install
npm run dev
```
La API queda en http://localhost:3000/api/salidas

### 2. Frontend (React + Vite en el puerto 5173)
```bash
cd frontend
npm install
npm run dev
```
Abre http://localhost:5173. Vite redirige las llamadas `/api` al backend, así que **el backend debe estar encendido**.

## Inicio de sesión (nuevo)

La app ahora tiene **registro e inicio de sesión** con dos tipos de cuenta:

| Rol | Puede |
|-----|-------|
| Pasajero | Ver y filtrar salidas |
| Empresa | Ver salidas + registrar, editar y eliminar **cualquier salida** |

Cuentas de prueba (contraseña `demo1234`): `pasajero@lanchaya.pe`, `fluvial@lanchaya.pe` (Fluvial Amazonas), `itaya@lanchaya.pe` (Transportes Río Itaya).

- Contraseñas guardadas con **scrypt** (nunca en texto plano) en `backend/src/data/usuarios.json`.
- Sesión con **token firmado HS256** (JWT) de 8 horas, enviado como `Authorization: Bearer <token>`.
- 5 intentos fallidos de login seguidos bloquean ese correo por 5 minutos.
- En producción define la variable de entorno `JWT_SECRET` con un valor largo y secreto.
- No requiere instalar dependencias nuevas.

## Diseño realista de la Amazonía

La cabecera y el login usan una **escena aérea en capas** (`frontend/src/components/EscenaAerea.jsx`):

- **Fondo:** foto aérea del río con la cámara "volando" despacio hacia adelante, bruma que se desplaza y luz de sol que respira.
- **Río vivo:** una máscara con la forma del río (`public/amazonia-rio.png`) hace que los destellos del sol brillen **solo sobre el agua**.
- **Guacamayos:** recortados de la foto (`public/guacamayo-*.webp`), en 2 profundidades, planean y aletean; otros lejanos cruzan el cielo.
- **Paralaje 3D:** cada capa se mueve distinto con el mouse y el scroll (`hooks/useParalaje.js`).
- **Tarjetas 3D** que se inclinan con el mouse (`hooks/useInclinar.js`).
- Respeta `prefers-reduced-motion` y no necesita librerías nuevas.

Para cambiar la foto, reemplaza `public/amazonia-fondo.jpg` (mínimo 1920 px de ancho para máxima nitidez).
También hay una versión ilustrada en `EscenaAmazonia.jsx`: cambia el import en `Cabecera.jsx` y `AuthPage.jsx` para usarla.

## Endpoints

| Método | Ruta | Descripción | Respuesta |
|--------|------|-------------|-----------|
| GET | `/api/salidas` | Lista salidas; acepta `?destino=`, `?fecha=YYYY-MM-DD`, `?tipo=`, `?q=` | 200 + arreglo |
| GET | `/api/salidas/:id` | Detalle | 200 o 404 |
| POST | `/api/salidas` | Registra una salida | 201 + objeto, o 400 |
| PUT | `/api/salidas/:id` | Actualiza una salida | 200, 400 o 404 |
| DELETE | `/api/salidas/:id` | Elimina una salida | 204 o 404 |
| GET | `/api/destinos` | Destinos sin repetir | 200 + arreglo |
| POST | `/api/auth/registro` | Crea cuenta (`nombre, email, password, rol, empresa`) | 201 + `{token, usuario}`, 400 o 409 |
| POST | `/api/auth/login` | Inicia sesión (`email, password`) | 200 + `{token, usuario}`, 401 o 429 |
| GET | `/api/auth/me` | Usuario de la sesión actual | 200 o 401 |

> POST, PUT y DELETE de `/api/salidas` ahora exigen token de **empresa** (401 sin sesión, 403 si la cuenta no es de empresa).

### Validaciones (400 con mensaje)
- `empresa`, `destino`, `puerto` y `fechaHora` son obligatorios.
- `precio` es un número mayor que 0.
- `tipo` solo acepta `lancha`, `rapido` o `deslizador`.
- `fechaHora` no puede estar en el pasado al registrar (al editar, solo si cambia la fecha).

Ejemplo de error:
```json
{ "mensaje": "El precio debe ser un número mayor que 0.", "errores": ["El precio debe ser un número mayor que 0."] }
```

### Prueba rápida
```bash
curl "http://localhost:3000/api/salidas?destino=Nauta&tipo=rapido"
curl -X POST http://localhost:3000/api/salidas -H "Content-Type: application/json" \
  -d '{"empresa":"Prueba","tipo":"rapido","destino":"Nauta","puerto":"Puerto Henry","fechaHora":"2030-01-01T08:00","precio":20}'
```

## Extras incluidos
- Indicador de cupos con color (verde: más de 20, amarillo: 6 a 20, rojo: 5 o menos).
- Búsqueda por texto de empresa o embarcación.

## Estructura
```
lanchaya/
├── backend/    API REST (Express, datos en src/data/*.json, auth en middleware/ y utils/)
├── frontend/   React 18 + Vite (AuthPage, Cabecera, SalidaCard, Filtros, SalidaForm)
└── README.md
```
