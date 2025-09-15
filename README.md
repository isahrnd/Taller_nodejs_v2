# BellezaTotal Backend (Taller NodeJS 2025-B)

## Descripción del Proyecto

**BellezaTotal** es una API RESTful construida con **Node.js, Express y MongoDB (Mongoose)**, diseñada para gestionar la operación de un salón de belleza moderno.  
Este backend implementa múltiples módulos como autenticación, usuarios, citas, servicios, inventario y reportes.

Este repositorio corresponde al desarrollo del **módulo de citas (appointments)** como parte del taller de la asignatura **Computación en Internet 3 – Universidad Icesi**.

---

## Tecnologías Usadas

- Node.js + Express  
- MongoDB + Mongoose  
- TypeScript  
- Zod (validación de esquemas)  
- JWT (autenticación)  
- Docker (opcional)  
- Thunder Client / Postman (testing manual)  
- Jest (testing unitario – parcialmente integrado)  

---

## Estructura del Proyecto

```
├── src
│   ├── controllers         // Lógica de rutas
│   ├── models              // Esquemas Mongoose
│   ├── services            // Lógica de negocio
│   ├── middlewares         // Auth y validaciones
│   ├── interfaces          // Tipado TypeScript
│   ├── schemas             // Validaciones Zod
│   └── routes              // Endpoints Express
├── scripts                 // Generador de JWT manual
├── .env.example            // Variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

---

## Autenticación

- Basada en JWT (`accessToken` y `refreshToken`)
- Tipado de roles (`admin`, `stylist`, `client`)
- Middleware de autenticación que inyecta `req.user` automáticamente

---

## Funcionalidades del Módulo de Citas

**Endpoints implementados:**

| Método | Ruta                          | Rol       | Descripción                              |
|--------|-------------------------------|-----------|------------------------------------------|
| POST   | `/api/appointments`           | `client`  | Crear una cita                           |
| GET    | `/api/appointments`           | `admin`   | (En progreso) Listar todas las citas     |
| PATCH  | `/api/appointments/:id`       | `client`  | (En progreso) Modificar o cancelar cita  |
| DELETE | `/api/appointments/:id`       | `admin`   | (En progreso) Eliminar cita              |

**Validaciones implementadas:**

- Duración exacta entre `start_at` y `end_at` según el servicio  
- Validación de traslapes de horarios  
- Restricción de acceso basado en `req.user.role`  
- Rechazo si el `client_id` del token no coincide con el del cuerpo  

---

## Testing

### Pruebas Manuales

- Realizadas con **Thunder Client** y **Postman**
- Flujo de login → generación de token → uso del token en endpoints protegidos
- Citas probadas con datos realistas (`service_id`, `client_id`, etc.)

### Pruebas Unitarias (parcial)

- Configurado `jest.config.ts`
- Tests creados para:
  - appointment.service.ts
  - appointment.controller.ts
  - modelos con Mongoose

Cobertura en citas:
-  `Statements: 96%`,  `Functions: 100%`,  `Branches: 81%`

---

##  Despliegue


- **Render.com** 

###  URL:

```
```

> Se requiere variable `MONGO_URL`, `SECRET`, `PORT`, etc. configuradas en Render

---


### 1. Clonar el repositorio

```bash
git clone https://github.com/usuario/bellezatotal-backend.git
cd bellezatotal-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear archivo `.env`

Crea `.env` a partir de `.env.example` y agrega tus claves:

```env
PORT=4000
MONGO_URL=mongodb+srv://...
SECRET=tu_clave
REFRESH_SECRET=otra_clave
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

### 5. Probar endpoints con Thunder Client / Postman

---

## Elementos no desarrollados completamente

- [ ] Rutas de agenda y disponibilidad (`GET /agenda`, `GET /availability`)
- [ ] Registro automático de asistencia (`POST /appointments/:id/attend`)
- [ ] Envío de notificaciones al confirmar cita
- [ ] Panel de reportes con filtros

---

## Dificultades encontradas

-  Mismatch entre el token generado y lo que esperaba el middleware (`decoded.user` vs `decoded.sub`)
-  Validaciones de duración y solapamiento tomaron más tiempo de lo previsto
-  Problemas con el tipado de `req.user` en TypeScript resueltos con `express.d.ts`
-  Pruebas unitarias iniciales con Mongoose requirieron mocks personalizados

---

## Autores

- Isabella Hernández  
- Karen Valeria Jurado  
- Santiago Santacruz  
- Alejandro Osejo

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/u_K3O14S)

## Deployment (Render)

Backend stack: Node.js + Express + TypeScript (MongoDB via Mongoose). A Dockerfile and Render config are included for easy deploy.

### Option A: Render without Docker (recommended)

Files used: `nodejs-tuxnet/render.yaml` (points to `backend` as root).

Steps:
1) Push this repo to GitHub/GitLab.
2) In Render, create New + Blueprint, select this repo.
3) In the service created (tuxnet-backend):
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`
   - Root Dir: `backend`
4) Set environment variables:
   - `MONGO_URL`: your MongoDB connection string (e.g. Atlas)
   - `PORT`: `3000` (optional; Render also sets one automatically)
5) Deploy. Health check: `GET /` returns "Osejo Was Here".

### Option B: Render with Docker

Files used: `nodejs-tuxnet/backend/Dockerfile`, `.dockerignore`.

Steps:
1) In Render, create New + Web Service from repo.
2) Root directory: `backend`. Render will detect the Dockerfile.
3) Set env vars `MONGO_URL` and optionally `PORT=3000`.
4) Deploy.

### MongoDB (Atlas)

Create a free cluster on MongoDB Atlas, allow network access (0.0.0.0/0 for testing), create a user, and grab the connection string. Replace user/pass and db name. Example:

```
MONGO_URL=mongodb+srv://USER:PASS@CLUSTER.mongodb.net/yourdb?retryWrites=true&w=majority
```

### Local run with Docker

From `nodejs-tuxnet/backend`:

```
docker build -t tuxnet-backend .
docker run -p 3000:3000 -e MONGO_URL="<your-connection-string>" tuxnet-backend
```

App listens on `/: GET` and `PORT` defaults to 3000.
