# ⚽ Arena Intelligence

**Smart Stadium Operations Platform for FIFA World Cup 2026**

> Unified operations platform for crowd management, tournament coordination, emergency response, fan engagement, and stadium analytics — powered by real-time AI.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000?style=for-the-badge&logo=vercel)](https://arena-intelligence.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Aish-transitminds/Arena-Intelligence)

---

## 🏟️ Overview

Arena Intelligence is a comprehensive stadium operations dashboard built for FIFA World Cup 2026. It provides real-time monitoring and management capabilities across multiple operational domains including crowd flow analytics, gate queue management, emergency coordination, security monitoring, and an AI-powered assistant (Arena IQ) for both staff and fans.

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend Framework** | React | 19.x |
| **Routing** | TanStack Router | 1.x |
| **SSR / Server** | TanStack Start + Nitro | Latest |
| **Build Tool** | Vite | 8.x |
| **Styling** | Tailwind CSS | 4.x |
| **Animations** | Framer Motion | 12.x |
| **Charts** | Recharts | 3.x |
| **Icons** | Lucide React | 0.575 |
| **AI Engine** | Groq API (Llama 3.3 70B) | Live |
| **QR Codes** | qrcode.react | 4.x |
| **UI Primitives** | Radix UI | Latest |
| **Deployment** | Vercel (Serverless) | Auto CD |
| **Language** | TypeScript | 5.x |

---

## ✨ Features

### 🎛️ Admin Operations Console
- **Live Attendance Tracking** — Real-time crowd count with capacity indicators
- **Gate Queue Analytics** — Visual bar charts showing wait times per gate
- **Section Occupancy Heatmap** — Color-coded progress bars and radial charts per stadium zone
- **Operational Recommendations** — AI-generated flow optimization suggestions
- **Live Incident Feed** — Real-time event logging with severity classification
- **Amenities & Restrooms** — Live load monitoring with crew dispatch

### 🎟️ Fan Dashboard
- **Digital Ticket** — QR code-based entry with seat/section info
- **3D Seat Viewer** — Interactive stadium preview
- **Stadium Directory** — Food courts, merch stores, emergency locations
- **Gate Queue Status** — Live wait times for all gates
- **Crowd Flow Visualization** — Real-time attendance chart

### 🤖 Arena IQ (AI Assistant)
- **Multi-Persona** — Staff, Fan, and Volunteer modes
- **Multilingual** — English, Spanish, French, Portuguese
- **Powered by Groq** — Llama 3.3 70B for lightning-fast responses
- **Context-Aware** — Stadium-specific knowledge about MetLife Stadium

### 🚨 Emergency Center
- **Emergency Protocols** — Predefined response plans
- **Medical Station Status** — Real-time availability
- **Evacuation Route Mapping** — Zone-based evacuation guidance
- **SOS Coordination** — Dispatch and incident management

### 🔒 Security Dashboard
- **Threat Level Monitoring** — Real-time security status
- **Camera Zone Grid** — Visual status of surveillance zones
- **Access Control Stats** — Credential scans, denied entries, VIP check-ins
- **Patrol Tracking** — Active security patrol zones

### 🏆 Tournament Hub
- **Match Schedule** — Group stage and knockout fixtures
- **Live Scores** — Real-time match updates
- **Team & Venue Info** — Stadium details and capacities

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/Aish-transitminds/Arena-Intelligence.git
cd Arena-Intelligence

# Install dependencies
npm install

# Create environment file
echo "VITE_GROQ_API_KEY=your_groq_api_key_here" > .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080/`

### Build for Production

```bash
npm run build
```

---

## 🌐 Deployment

### Vercel (Recommended)
The project is configured for automatic deployment on Vercel:
1. Import the repo on [vercel.com/new](https://vercel.com/new)
2. Add `VITE_GROQ_API_KEY` in Environment Variables
3. Deploy — Vercel auto-detects the Nitro + Vite config

### Docker
A `Dockerfile` is included for containerized deployment:
```bash
docker build -t arena-intelligence .
docker run -p 8080:8080 -e VITE_GROQ_API_KEY=your_key arena-intelligence
```

---

## 📁 Project Structure

```
src/
├── components/       # Shared UI components
│   ├── AIAssistant.tsx    # Arena IQ chat interface
│   ├── AppShell.tsx       # Layout shell with sidebar
│   └── Logo.tsx           # Brand logo component
├── lib/              # Utilities and helpers
│   ├── ai.ts              # AI recommendation engine
│   ├── mock-data.ts       # Stadium mock data
│   └── security.ts        # Auth & rate limiting
├── routes/           # Page routes (TanStack Router)
│   ├── index.tsx          # Landing page
│   ├── admin.tsx          # Operations console
│   ├── fan.tsx            # Fan dashboard
│   ├── emergency.tsx      # Emergency center
│   ├── security.tsx       # Security dashboard
│   ├── tournament.tsx     # Tournament hub
│   └── assistant.tsx      # Full-page AI assistant
└── styles.css        # Global styles & design tokens
```

---

## 👩‍💻 Author

**Aishwarya** — Ops Manager, TransitMinds

---

## 📄 License

This project is private and proprietary. All rights reserved.
