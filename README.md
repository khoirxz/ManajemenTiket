# 🚀 Aplikasi Manajemen Pelanggan & Tiket Gangguan ISP

Proyek ini merupakan aplikasi **Full-Stack** yang dikembangkan untuk memenuhi kebutuhan operasional perusahaan **Internet Service Provider (ISP)**.  
Aplikasi dirancang untuk mengelola data pelanggan, mencatat tiket gangguan, serta memantau status penanganan masalah secara **real-time** menggunakan **Laravel 12**, **React.js**, dan **Pusher**.

---

## 🧱 Tech Stack

| Layer        | Teknologi                                            |
| ------------ | ---------------------------------------------------- |
| **Frontend** | React.js + React Router + React Query + Tailwind CSS |
| **Backend**  | Laravel 12 (REST API + Sanctum Auth)                 |
| **Database** | MySQL (menggunakan UUID untuk Primary Key)           |
| **Realtime** | Laravel Echo + Pusher                                |
| **Auth**     | Laravel Sanctum (Bearer Token)                       |

---

## 🧩 Fitur Utama

### 👥 Modul Pelanggan

- CRUD data pelanggan (buat, lihat, ubah, hapus)
- Pencarian pelanggan berdasarkan nama/nomor telepon

### 🎫 Modul Tiket Gangguan

- CRUD tiket gangguan pelanggan
- Filter dan pencarian berdasarkan status & prioritas
- Aturan bisnis: tiket tidak bisa **CLOSED** tanpa melewati **RESOLVED**
- Riwayat perubahan status (timeline)
- **Realtime update** status tiket melalui **Pusher**

### 🔐 Autentikasi & Role-based Access

- **Admin** – akses penuh terhadap semua modul
- **Customer Service** – membuat & mengelola tiket pelanggan
- **Agent NOC** – menangani gangguan & memperbarui status tiket

---

## 🧠 Arsitektur Sistem

```
Frontend (React)
   ↓ REST API
Backend (Laravel 12)
   ↓
Database (MySQL)
   ↔
Broadcast (Pusher + Laravel Echo)
```

---

## 🗄️ Struktur Folder (Monorepo)

```
/project-root
 ├── /backend-laravel
 │    ├── app/
 │    ├── routes/
 │    ├── database/
 │    └── ...
 ├── /frontend-react
 │    ├── src/
 │    ├── public/
 │    └── ...
 └── README.md
```

---

## ⚙️ Setup & Instalasi

### 1️⃣ Backend (Laravel 12)

```bash
cd backend-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

> Pastikan `.env` sudah diset dengan konfigurasi berikut:

```env
DB_CONNECTION=mysql
DB_DATABASE=isp_management
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=pusher
PUSHER_APP_ID=xxxx
PUSHER_APP_KEY=xxxx
PUSHER_APP_SECRET=xxxx
PUSHER_APP_CLUSTER=ap1
```

---

### 2️⃣ Frontend (React)

```bash
cd frontend-react
npm install
cp .env.example .env
npm run dev
```

> Contoh isi `.env` untuk frontend:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_PUSHER_KEY=xxxx
VITE_PUSHER_CLUSTER=ap1
```

---

## 🔄 Realtime Event

**Events yang disiarkan Laravel:**

- `ticket.created`
- `ticket.updated`
- `ticket.status`

**Frontend (React) mendengarkan:**

```ts
echo.channel("tickets")
  .listen(".ticket.created", ...)
  .listen(".ticket.updated", ...)
  .listen(".ticket.status", ...);
```

---

## 🧪 Dokumentasi API (Postman)

Seluruh endpoint sudah terdokumentasi melalui **Postman Collection**  
📁 File: `docs/postman_collection.json`

Contoh endpoint utama:
| Method | Endpoint | Deskripsi |
|--------|-----------|-----------|
| GET | `/api/customers` | Daftar pelanggan |
| POST | `/api/tickets` | Membuat tiket baru |
| PATCH | `/api/tickets/{id}/status` | Mengubah status tiket |
| GET | `/api/tickets/{id}` | Detail tiket & timeline |
