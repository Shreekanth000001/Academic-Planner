# Academic Planner - Web Client 🖥️

> **Compute Engine:** The FastAPI backend, Redis queue, and AI worker for this system can be found [here](https://github.com/Shreekanth000001/Academic-Planner-backend). Live [site](https://academic-planner-pdf.vercel.app/).

This repository houses the presentation layer of the Academic Planner platform. Built with the Next.js App Router, it operates as a strictly decoupled, zero-trust client that interacts with the backend compute engine entirely via REST APIs. 

<img width="923" height="1024" alt="Archietecture" src="https://github.com/user-attachments/assets/828662c3-87a3-43a5-9bd5-10dc77bed15f" />


## 🛠 Tech Stack

*   **Framework:** Next.js 15 (App Router, React Server Components)
*   **Styling:** Tailwind CSS
*   **Authentication:** Clerk (OAuth & JWT)
*   **Hosting:** Vercel (Edge Network & Serverless Functions)

---

## 🏛 Core Architecture & Frontend System Design

This client was engineered to handle asynchronous AI latency gracefully, utilizing modern React 19 paradigms to provide a seamless, non-blocking user experience.

### 1. Eventual Consistency & State Hydration
Because the backend processes PDFs via an out-of-band background worker, the frontend must bridge the "Eventual Consistency Gap" without relying on brittle WebSockets.
*   **Polling State Machine:** Uploading a syllabus triggers a React `useEffect` interval that polls a highly optimized backend status endpoint. 
*   **State Hydration:** If the user performs a hard refresh during an AI job, a mount-time initialization hook pings the backend for active jobs and seamlessly re-hydrates the polling state machine to resume tracking the background task.

### 2. Streaming & Suspense (Latency Masking)
To prevent backend database latency from blocking the main thread, the application utilizes React `<Suspense>` boundaries.
*   **Non-Blocking UI:** Server Components dynamically stream UI skeletons (`loading.tsx`) instantly to the browser, hot-swapping the DOM with the actual PostgreSQL relational data the millisecond the `await fetch()` resolves.

### 3. Distributed Authentication (Zero-Trust)
The frontend delegates all identity management and secrets to Clerk, ensuring no sensitive data touches the Next.js servers.
*   **Stateless Requests:** Both Client Components (via `useAuth`) and Server Components (via `auth()`) retrieve short-lived JSON Web Tokens (JWT) and inject them into the `Authorization` header, enforcing strict multi-tenant data isolation on the backend.
*   **Edge Protection:** Unauthenticated users are bounced at the edge using Next.js Middleware before the application even attempts to render the dashboard.

### 4. Optimistic UI & Cache Invalidation
Client-side mutations (like deleting a schedule) are built for perceived zero-latency.
*   **Server Cache Invalidation:** Upon a successful `DELETE` HTTP request, the client triggers `router.refresh()`, instructing the Next.js server to re-fetch the database and stream the updated HTML down to the client, surgically updating the DOM without a disruptive page reload.

---

## 💻 Local Development Setup

### 1. Environment Variables
Create a `.env.local` file in the root of your frontend directory:

```env
# The URL of your local FastAPI Backend
NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"

# Clerk Auth Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### 2. Installation & Running
Ensure you have Node.js 18+ installed on your local machine.

```bash
# 1. Clone the repository
git clone https://github.com/Shreekanth000001/Academic-Planner-Frontend.git
cd Academic-Planner-Frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The frontend application will now be available at `http://localhost:3000`. 

> **⚠️ Note on Full-Stack Testing:** To test the full AI upload, conversational RAG, and retrieval pipeline locally, ensure your FastAPI backend (`uvicorn main:app`) and Redis worker (`arq worker.WorkerSettings`) are running simultaneously on port `8000`.
