# Farmers Fertilizer Mart

Smart agriculture e-commerce website for buying fertilizers, seeds, pesticides, and farming tools, checking weather, reading agricultural blogs, and managing orders.

**Stack:** React (Vite) · Node.js / Express · MongoDB / Mongoose · JWT · bcrypt · OpenWeather API · Axios · Lucide React

---

## Features

- Browse products from MongoDB (Pesticides, Organic Fertilizers, Seeds, Farming Tools)
- Search, category filters, price sorting, pagination
- Product details with safety and usage information for crop-protection items
- Guest cart (localStorage) + logged-in cart (MongoDB) with stock checks
- JWT authentication (customer / admin roles)
- Checkout with Cash on Delivery and real order creation
- Weather dashboard via secure backend OpenWeather proxy
- Agricultural blogs with admin CRUD
- Admin dashboard: products, blogs, orders, users, stock summary

---

## Folder structure

```
farmer fertilizer/
├── client/                 # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       └── styles/
├── server/                 # Express API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── seed/
│   ├── utils/
│   └── server.js
└── README.md
```

---

## Prerequisites

1. **Node.js** 18+ and npm  
2. **MongoDB** running locally (or a MongoDB Atlas connection string)  
3. Optional: **OpenWeather API key** for weather features  

### Install MongoDB (Windows)

- Download from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)  
- Or use MongoDB Atlas and paste the connection URI into `server/.env`

### OpenWeather API key

1. Sign up at [https://openweathermap.org/api](https://openweathermap.org/api)  
2. Create a free API key  
3. Put it in `server/.env` as `OPENWEATHER_API_KEY`  
4. Keys can take a few minutes to activate  

---

## Installation

From the project root:

```bash
npm install
npm run install:all
```

Or separately:

```bash
cd server && npm install
cd ../client && npm install
```

---

## Environment variables

### Server — copy `server/.env.example` to `server/.env`

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/farmers_fertilizer_mart
JWT_SECRET=change_this_to_a_long_random_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
OPENWEATHER_API_KEY=your_openweather_api_key_here
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@farmersmart.com
ADMIN_MOBILE=9999999999
ADMIN_PASSWORD=Admin@12345
```

### Client — copy `client/.env.example` to `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Never commit real secrets. `.env` is gitignored.

---

## Seed sample data & create admin

With MongoDB running:

```bash
# From project root — inserts sample products + blogs and ensures admin exists
npm run seed

# Or create / promote admin only
npm run create-admin
```

Default admin (from `.env`):

| Field    | Value                   |
|----------|-------------------------|
| Email    | `admin@farmersmart.com` |
| Password | `Admin@12345`           |

Change `ADMIN_PASSWORD` before production use.

---

## Run the app

```bash
# Both API + frontend
npm run dev
```

Or separately:

```bash
npm run dev:server   # http://localhost:5000
npm run dev:client   # http://localhost:5173
```

Open **http://localhost:5173**

---

## API overview

| Area     | Endpoints |
|----------|-----------|
| Auth     | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Products | `GET/POST /api/products`, `GET/PUT/DELETE /api/products/:id` |
| Cart     | `GET/POST /api/cart`, `PUT/DELETE /api/cart/:itemId`, `POST /api/cart/sync` |
| Orders   | `POST /api/orders`, `GET /api/orders/my-orders`, admin status updates |
| Blogs    | `GET /api/blogs`, `GET /api/blogs/:slug`, admin CRUD |
| Weather  | `GET /api/weather?city=Mumbai` |
| Admin    | `GET /api/admin/stats`, `GET /api/admin/users` |
| Health   | `GET /api/health` |

Admin routes require a JWT with `role: admin`.

---

## Testing checklist

1. Register a customer → login → token persists after refresh  
2. Browse products (data from MongoDB, not hardcoded UI arrays)  
3. Add to cart as guest → login → cart syncs  
4. Place COD order → confirmation page shows real order ID  
5. View **My Orders**  
6. Login as admin → manage products, blogs, orders, users  
7. Weather page with a valid API key  
8. Blog list / detail / search / filter  

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Failed to connect to MongoDB` | Start MongoDB locally or fix `MONGODB_URI` |
| Weather 503 / not configured | Set `OPENWEATHER_API_KEY` in `server/.env` and restart server |
| Invalid OpenWeather key | Wait for key activation; confirm key on OpenWeather dashboard |
| CORS errors | Ensure `CLIENT_URL` matches the Vite URL (`http://localhost:5173`) |
| Blank products | Run `npm run seed` |
| Cannot access `/admin` | Login with the admin account from `create-admin` / seed |
| Image upload fails | Check `server/uploads` exists and is writable |

---

## Security notes

- Passwords are hashed with bcrypt; API responses never return `passwordHash`  
- JWT protects private and admin routes  
- Product prices for orders are taken from MongoDB, not from the client  
- Stock is decremented with conditional updates to reduce overselling  
- Pesticide pages include safety text and eligibility notes—always follow official labels  

---

## License

Educational project — Farmers Fertilizer Mart.
