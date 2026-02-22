# Tienda de ropa (SSR + Dashboard + MongoDB Atlas)

Proyecto backend desarrollado con **Node.js + Express + Mongoose**.  
Renderiza HTML usando template literals (SSR), incluye un dashboard protegido por login y expone una API JSON.

Deploy online:  
https://backend-project-break-ec08.onrender.com

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- express-session (autenticación)
- method-override (PUT / DELETE desde formularios)
- CSS básico

---

## Funcionalidades

- CRUD completo de productos
- Renderizado SSR sin motor de plantillas externo
- Filtro por categoría
- Dashboard protegido por login
- API REST en formato JSON
- Validaciones con Mongoose
- Uso de `enum` para categorías y tallas
- Variables de entorno para producción

---

## Login (Dashboard)

Credenciales por defecto:

Email: admin@mail.com  
Password: 123456  

Acceso al dashboard:  
`/login`

---

## API REST

### Obtener todos los productos
GET `/api/products`

### Obtener producto por ID
GET `/api/products/:id`

Devuelve datos en formato JSON.

---

## Instalación local

Clonar repositorio

```bash

git clone https://github.com/MarcGP98/backend-project-break.git
cd backend-project-break

```
Instalar dependencias

```bash

npm install

```
Ejecutar proyecto

```bash

npm start

```
## Estructura del proyecto

backend-project-break/
│
├── config/
│ └── db.js
│
├── controllers/
│ ├── productController.js
│ ├── apiProductController.js
│ └── authController.js
│
├── models/
│ └── Product.js
│
├── routes/
│ ├── productRoutes.js
│ ├── apiProductRoutes.js
│ └── authRoutes.js
│
├── middlewares/
│ └── authMiddleware.js
│
├── helpers/
│ ├── baseHtml.js
│ ├── getNavBar.js
│ └── template.js
│
├── public/
│ └── styles.css
│
├── .env.example
├── .gitignore
├── index.js
├── package.json
└── README.md