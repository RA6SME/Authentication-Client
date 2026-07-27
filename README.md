# Next.js 15 Authentication Client

A secure, modern authentication frontend built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed to integrate seamlessly with an existing Express.js REST API backend running on port `7766`.

---

## 🚀 Features

* **Complete Auth Lifecycle**: Support for Sign In, Registration, Forgot Password, Reset Password, and Change Password.
* **Global State Management**: Powered by React Context API (`AuthContext`) and custom `useAuth()` hook.
* **Session Persistence**: Token and user session auto-restoration via `localStorage` with safe JSON parsing and corruption checks.
* **Protected Endpoint Handling**: Requests to protected routes automatically attach `Authorization: Bearer <token>` headers.
* **Modern UI Layout**: Responsive split-screen UI layout featuring interactive forms and hero visual assets.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 15 (App Router, Turbopack)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **State Management**: React Context API (`useState`, `useEffect`, `useContext`)
* **Persistence**: Browser `localStorage`
* **HTTP Client**: Native Browser Fetch API

---

## 📁 Project Structure

```text
authentication-client/
├── app/
│   ├── components/
│   │   └── LoginForm.tsx       # Interactive login form component
│   ├── context/
│   │   └── AuthContext.tsx     # Global Auth state, API actions, & storage persistence
│   ├── dashboard/
│   │   └── page.tsx            # Protected user dashboard & change password form
│   ├── forgot-password/
│   │   └── page.tsx            # Account recovery request page
│   ├── register/
│   │   └── page.tsx            # New user registration page
│   ├── reset-password/
│   │   └── page.tsx            # Password reset landing page (URL token based)
│   ├── globals.css             # Tailwind base styles and global styling
│   ├── layout.tsx              # Root layout wrapping application with AuthProvider
│   └── page.tsx                # Main login page layout
└── public/                     # Static image assets (hero artwork, logos)