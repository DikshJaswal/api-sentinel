# API Sentinel — Distributed Synthetic Monitoring & Incident Dispatcher

[![Live Demo](https://img.shields.io/badge/Live_Demo-api--sentinel--psi.vercel.app-22c55e?style=for-the-badge&logo=vercel)](https://api-sentinel-psi.vercel.app/dashboard)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.3-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Twilio & SendGrid](https://img.shields.io/badge/Alerts-Twilio_%26_SendGrid-f22f46?style=for-the-badge&logo=twilio)](https://twilio.com/)

API Sentinel is an enterprise-grade synthetic health monitoring and real-time incident alerting platform built on Next.js 16 (App Router), React 19, and Tailwind CSS. It continuously audits production endpoints, measures HTTP latency distributions, calculates dynamic SLA uptime scores, and dispatches multi-channel alerts (Twilio SendGrid Email, Twilio SMS, and Webhooks) upon service degradation.

🔗 **Live Production Dashboard**: [https://api-sentinel-psi.vercel.app/dashboard](https://api-sentinel-psi.vercel.app/dashboard)

---

## ⚡ Integrated Application Ecosystem

API Sentinel serves as the central observability hub for our suite of full-stack production deployments:

| Monitored Service | Target Endpoint | Category | Health Checks |
| :--- | :--- | :--- | :--- |
| **RESOLVE Backend API** | `https://resolve-api-7q6z.onrender.com/api/health` | Production API | Live TiDB ping & uptime |
| **RESOLVE Web Client** | `https://resolve-pink-eight.vercel.app/` | Frontend App | HTTP 200 availability probe |
| **CodeFlow JS Debugger** | `https://codeflow-javascript-debugger.vercel.app/` | Frontend App | Runtime asset validation |
| **FinPilot Core API** | `https://jsonplaceholder.typicode.com/posts/1` | Microservice | Synthetic latency & JSON audit |

---

## 🚀 Key Features

* **Real-Time Synthetic Health Probes**: Executes asynchronous HTTP probes measuring exact round-trip response times, checking custom expected status codes, and enforcing strict timeouts.
* **Twilio & SendGrid Alert Dispatcher**: Dispatches instant incident notifications over HTTPS REST APIs (SendGrid Email & Twilio SMS), completely avoiding Vercel serverless SMTP port blocks.
* **Intelligent Deduplication & Cooldown**: Implements state-aware suppression so that on-call engineers receive **one** notification when an outage starts, followed by a **recovery alert** once service is restored—preventing notification fatigue.
* **Multi-Service Registry**: Add, customize, pause, and audit any public API or microservice on demand with configurable timeouts and expected response codes.
* **Interactive Telemetry Dashboard**:
  * Real-time latency trend chart with per-service target filtering.
  * System-wide SLA uptime score (e.g., 99.8% availability).
  * Interactive "Check All" probe triggering.
  * In-app audit log stream with millisecond precision.
* **Interactive Test Incident Simulator**: Test your notification pipeline directly from the UI with an on-demand synthetic test trigger.

---

## 🏗️ System Architecture

```text
               ┌────────────────────────────────────────────────────────┐
               │                     API Sentinel                       │
               │               (Next.js 16 + React 19)                  │
               └──────────┬───────────────────────────────┬─────────────┘
                          │                               │
        [Synthetic Probes / Fetch Engine]          [Notification Engine]
                          │                               │
       ┌──────────────────┴──────────────────┐    ┌───────┴─────────────────┐
       ▼                                     ▼    ▼                         ▼
 ┌───────────┐                         ┌───────────┐ ┌───────────────┐ ┌─────────────┐
 │  RESOLVE  │                         │ CodeFlow  │ │Twilio SendGrid│ │ Twilio SMS  │
 │Backend/DB │                         │  Vercel   │ │ (Email/Gmail) │ │(Mobile SMS) │
 └───────────┘                         └───────────┘ └───────────────┘ └─────────────┘
```

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16.1.1 (App Router, Turbopack)
* **Frontend**: React 19, Tailwind CSS 4, Chart.js, `react-chartjs-2`
* **Alert Integrations**: Twilio SendGrid REST API, Twilio SMS API, Discord Webhooks
* **Database ORM**: Prisma ORM (with in-memory zero-latency cache fallback)
* **Deployment**: Vercel Serverless Edge

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory (optional, system includes smart in-memory defaults for instant demo deployment):

```env
# Optional Database (PostgreSQL / TiDB / Neon / Supabase)
DATABASE_URL="postgresql://user:password@host:5432/apisentinel?schema=public"
USE_MOCK_DATA="false"

# Twilio SendGrid Email Alerts (HTTP REST API)
SENDGRID_API_KEY="SG.your_sendgrid_api_key"
SENDGRID_FROM_EMAIL="alerts@apisentinel.dev"
ALERT_EMAIL="yourname@gmail.com"

# Twilio SMS Alerts
TWILIO_ACCOUNT_SID="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="+1XXXXXXXXXX"
TWILIO_TO_PHONE="+1XXXXXXXXXX"

# Discord Webhook (Optional)
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
```

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/DikshJaswal/api-sentinel.git
cd api-sentinel

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the live dashboard.

---

## 📄 Resume Description (Google XYZ Format)

```markdown
**API Sentinel — Distributed Synthetic Monitoring & Incident Dispatcher** | *Next.js 16, React 19, TypeScript, Tailwind CSS, Twilio SendGrid, Prisma, Chart.js*
- Architected an automated synthetic monitoring and reliability platform that continuously probes microservices across deployed full-stack applications (RESOLVE, FinPilot, CodeFlow), evaluating p95 latencies and service health scores.
- Engineered an incident notification pipeline integrating Twilio SendGrid (Email) and Twilio SMS over HTTPS REST APIs, featuring state-aware alert deduplication and automated recovery confirmations to eliminate notification fatigue.
- Built a real-time observability workbench with multi-service dynamic registries, interactive latency distribution charts, configurable SLA thresholds, and sub-second health verification.
```
