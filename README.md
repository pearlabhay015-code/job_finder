# Mera Job Saathi

Fast, responsive, Apple-inspired job portal with automatic system theme adaptation and smooth animations:

- `index.html` — Main job search portal and career listings
- `contact.html` — Contact desk, direct message form, and official community QR channels (WhatsApp & Telegram)
- `styles.css` — High-performance responsive design system optimized for phones, tablets, and desktop
- `app.js` — Interactive live search, multi-state filters, bookmarking, and modal application flow
- `theme.js` — Fluid Light/Dark theme switcher with system auto-detection on first visit
- `animations.js` — Hardware-accelerated bidirectional scroll reveals and landing cascades

Open `index.html` in any browser or launch with Live Server.

## MySQL development setup

This project can use the XAMPP MariaDB database named `job_saathi`. Start MySQL in XAMPP, then run the backend from the project folder:

```powershell
node backend\server.js
```

The backend creates the database and `jobs` table automatically when the configured MySQL user has permission to create databases. The API and frontend are available at `http://localhost:3000/`. The jobs table contains `job_id`, `title`, `organization`, `location`, `state`, `district`, and `last_date`.

Public job listings come only from the MySQL `jobs` table. If MySQL is stopped or the table is empty, the website will not display job records until MySQL is started and the table contains data.

## Admin page

Open `http://localhost:3000/admin.html` or `http://localhost/job_finder-main/admin.html`. The default local admin ID is `admin`, email is `admin@example.com`, and password is `change-me` until `CMS_ADMIN_USERNAME`, `CMS_ADMIN_EMAIL`, and `CMS_ADMIN_PASSWORD` are set in `.env`. The admin page writes new jobs directly to the MySQL `jobs` table.

Password recovery requires SMTP settings in `.env` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `MAIL_FROM`). After changing `.env`, restart the backend so the configured admin email is used for OTP delivery.

## Google login

The `Continue with Google` button uses server-side OAuth. Create a Google Cloud OAuth client of type **Web application**, add this exact authorized redirect URI, and copy the credentials into `.env`:

```text
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_SUCCESS_URL=http://localhost:3000/index.html
```

Restart the backend after changing `.env`. Google supplies the verified full name and email; an existing email is logged in, otherwise a new Job Saathi account is created automatically.

## Returning-user login payment

Each account gets one free job application. Login remains free, but every later job application from that account requires a ₹200 Razorpay payment. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env` and restart the backend to enable live Razorpay checkout; with blank keys, local development uses the existing demo-payment mode. The backend automatically adds the `users.login_count` column for existing databases.
