# Proyecto Tecnocraft

Guía de pasos a seguir para poder arrancar el proyecto

## Instalación

1. Instalar node.js en caso de que no lo tengas instalado en tu equipo. Si ya lo tienes puedes omitir este paso.

```bash
sudo apt update && sudo apt install nodejs npm
```

2. Instalar las dependencias

Para el backend:

```bash
cd backend && npm install
```

Para el frontend:

```bash
cd frontend && npm install
```

## Inciar proyecto

Desde la capeta raíz abrir dos terminales y ejecutar los siguientes comandos.

1. Servidor node (backend)

```bash
cd backend && node server.js
```

El servidor backend se ha abierto en la dirección [http://localhost:3000](http://localhost:3000/)

2. Servidor cliente (frontend)

```bash
cd frontend && npm run dev
```

Para poder ver la página web, el servidor frontend se ha abierto en la dirección [http://localhost:5173](http://localhost:5173)