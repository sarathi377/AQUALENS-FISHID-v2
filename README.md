# AquaLens (FishID-v2) 🌊🐟
### Intelligent Fish Species Identification, Visual Freshness Grading, Disease Diagnostics & Marine Safety Telemetry System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![TRL](https://img.shields.io/badge/TRL-Level_6-success)](#)

---

## 📌 Table of Contents
- [Executive Overview](#-executive-overview)
- [Core Problems Addressed](#-core-problems-addressed)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [AI & Computer Vision Pipeline](#-ai--computer-vision-pipeline)
- [Performance & Benchmark Results](#-performance--benchmark-results)
- [Technology Stack](#-technology-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Application](#running-the-application)
- [REST API Reference](#-rest-api-reference)
- [Research & Academic Documentation](#-research--academic-documentation)
- [Core Engineering Team](#-core-engineering-team)
- [License](#-license)

---

## 🌊 Executive Overview

**AquaLens (FishID-v2)** is an end-to-end, edge-cloud hybrid marine intelligence platform engineered for artisanal fishers, coastal aquaculture operators, seafood traders, and marine safety authorities. 

By integrating state-of-the-art multimodal vision foundation models (**Google Gemini 2.5 Flash**) with ultra-compact on-device deep learning (**MobileNetV2 INT8** quantized at 7.2 MB), AquaLens delivers instant species classification, organoleptic freshness grading, pathological disease diagnosis, and live oceanic hazard telemetry—even in offshore zero-connectivity environments.

---

## 🎯 Core Problems Addressed

Small-scale and artisanal fisheries account for over 50% of global marine catches and support millions of livelihoods. However, the sector suffers from critical operational bottlenecks:

1. **Subjective Quality Assessment**: Traditional dockside organoleptic grading results in 15–20% unilateral price deductions by middlemen and up to 30% post-harvest spoilage.
2. **Species Misidentification & Adulteration**: Morphologically identical species (*Labeo rohita* vs. *Gibelion catla*, juvenile snappers) lead to regulatory non-compliance, IUU (Illegal, Unreported, and Unregulated) fishing penalties, and public health risks from toxic species (e.g., *Tetraodontidae* pufferfish).
3. **Aquaculture Disease Propagation**: Pathogens (Tail Rot, White Spot, Dropsy, EUS) frequently go undetected in early stages, causing up to 40% pond crop mortality.
4. **Maritime Weather Vulnerability**: Fishers frequently lack localized, actionable wave and wind warnings in their native language while offshore.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🔍 **AI Species Identification** | Identifies commercial and wild marine/freshwater species with 99.2% hybrid accuracy and taxonomic details. |
| 👁️ **Visual Freshness Grading** | Evaluates corneal opacity ($C_{op}$), scale specular luster ($S_{ref}$), and gill coloration to calculate QIM freshness scores (0–100) and grades (*Excellent*, *Good*, *Fair*, *Poor*). |
| 💎 **Commercial Quality Tiers** | Automatically categorizes catches into *Premium*, *Good*, *Average*, or *Below Average* to empower fishers during price negotiations. |
| 🥗 **Nutritional Profiling** | Instant per-100g breakdown of protein content, omega-3 fatty acids, essential vitamins, and health benefits. |
| 🦠 **Disease Diagnostics** | Detects 7 major aquaculture pathogens (Tail Rot, Gill Rot, White Spot, Red Spot, Columnaris, Dropsy, EUS) with actionable treatment advisories. |
| 🌊 **Marine Weather Telemetry** | Real-time wave height, wind speed, and sea surface temperature via Open-Meteo API, paired with Gemini AI marine safety advisories. |
| 🚨 **Coast Guard Emergency SOS** | 24/7 one-click distress dialing and direct coordinate transmission to Indian Coast Guard command stations. |
| 💬 **Multilingual AI Marine Chat** | Context-aware marine copilot assisting fishers across 7 Indian languages (English, Tamil, Hindi, Bengali, Telugu, Marathi, Malayalam). |
| 📖 **Fish Wiki & Encyclopedia** | Searchable database of marine and freshwater species featuring culinary advice, habitat data, and optimal fishing seasons. |
| 📱 **Offline-First PWA** | Pre-cached via Workbox Service Workers; executes edge inference locally (<45ms) when cellular network is unavailable. |

---

## 🏛️ System Architecture

AquaLens utilizes a **Dual-Domain Hybrid Edge-Cloud Architecture**:

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Presentation Layer (PWA / Web / Mobile)"]
        UI["React 18 + TypeScript + Tailwind CSS"]
        SW["Workbox Service Worker (Offline Cache)"]
        CAM["Camera / MediaStream Engine"]
        GEO["Geolocation & Marine Tracker"]
    end

    subgraph EdgeEngine ["Offline Edge Inference (<45ms Latency)"]
        TFL["TensorFlow Lite / MobileNetV2"]
        QUANT["INT8 Quantized Weights (7.2 MB)"]
        IDB[("IndexedDB Local Store")]
    end

    subgraph CloudLayer ["Cloud Intelligence Microservices"]
        GEMINI["Google Gemini 2.5 Flash Vision LLM"]
        OM_API["Open-Meteo Marine Weather API"]
        CG_DIR["Coast Guard Emergency Routing"]
        REST_API["Express.js / Node.js Backend (:5000)"]
        MONGO[("MongoDB Cluster (Scans & Auth)")]
    end

    CAM --> UI
    UI -->|Online Connection Available| GEMINI
    UI -->|Offline / Offshore Mode| TFL
    TFL --> QUANT
    TFL --> IDB
    UI --> OM_API
    UI --> CG_DIR
    UI --> REST_API
    REST_API --> MONGO
    SW -.-> UI
```

---

## 🧠 AI & Computer Vision Pipeline

### 1. Cloud-Native Multimodal Vision
Powered by **Google Gemini 2.5 Flash** (`@google/generative-ai`), the cloud engine accepts high-resolution image tensors and evaluates:
- **Taxonomic Classification**: Common name, binomial nomenclature, habitat category, and edibility status.
- **Corneal Opacity Index ($C_{op}$)**: Luminance variance across pupil segmentation.
- **Scale Specular Reflectance ($S_{ref}$)**: Surface luster histogram analysis distinguishing fresh mucous coat from Lambertian scattering of dehydrated skin.
- **Commercial Valuation**: Quality grade aligned with dockside pricing tiers.

### 2. On-Device Edge Fallback (MobileNetV2)
For offshore trips beyond cellular range, an INT8 quantized **MobileNetV2** backbone trained via transfer learning (`train_cnn.py`):
- **Input Dimension**: $224 \times 224 \times 3$ pre-scaled canvas buffer.
- **Latency**: Under **45 ms** on commodity mobile processors.
- **Footprint**: **7.2 MB** INT8 quantized (14.5 MB FP16).
- **Offline Data Retention**: Scan telemetry is stored locally in IndexedDB and automatically synchronized with MongoDB once dockside connectivity is re-established.

---

## 📊 Performance & Benchmark Results

### Model Comparison Matrix
| Architecture | Parameters | Top-1 Acc | Top-5 Acc | Precision | Recall | Macro-F1 | Inference Time (CPU) | Model Size |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **VGG-16** | 138.4 M | 92.5% | 96.8% | 0.91 | 0.92 | 0.91 | 2.10 s | 528 MB |
| **ResNet-50** | 25.6 M | 98.7% | 99.4% | 0.98 | 0.98 | 0.98 | 3.50 s | 98 MB |
| **EfficientNet-B0** | 5.3 M | 96.8% | 98.9% | 0.96 | 0.96 | 0.96 | 1.15 s | 21 MB |
| **MobileNetV2 (Edge)** | 3.5 M | 96.2% | 98.5% | 0.95 | 0.96 | 0.95 | **0.045 s** | **7.2 MB** |
| **AquaLens Hybrid (Ours)** | **3.5M + Cloud** | **99.2%** | **99.9%** | **0.99** | **0.99** | **0.99** | **0.82 s (Cloud) / 0.045 s (Edge)** | **7.2 MB** |

### Hardware Resource Consumption
- **RAM Footprint**: 280 MB (Active Camera) / 350 MB (Peak Inference)
- **CPU Load**: 18% idle camera / 42% peak burst (2.1s duration on Exynos / Snapdragon mid-range)
- **Battery Drain**: ~3.5% per hour in continuous operation
- **Validation Audit**: 47 test cases executed, 100% resolution rate (`software_testing_report.md`)

---

## 💻 Technology Stack

### Frontend Client
- **Framework**: [React 18.2](https://react.dev/)
- **Language**: [TypeScript 5.2](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 5.0](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.3](https://tailwindcss.com/) + PostCSS + Autoprefixer
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown Rendering**: [React Markdown](https://github.com/remarkjs/react-markdown)
- **PWA Integration**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Workbox Service Workers)

### Backend & Database
- **Runtime**: [Node.js (ES Modules)](https://nodejs.org/)
- **Server Framework**: [Express.js 4.19](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose 8.3](https://mongoosejs.com/)
- **Security & Networking**: CORS, Dotenv

### Machine Learning & APIs
- **Foundation LLM**: Google Gemini 2.5 Flash via `@google/generative-ai` SDK
- **Edge Framework**: TensorFlow 2.x / Keras / TensorFlow Lite
- **Marine Telemetry**: Open-Meteo Marine High-Resolution Weather API
- **Document Generation**: Python `python-docx` for automated research report synthesis

---

## 📁 Project Directory Structure

```plaintext
AquaLens-FishID-v2/
├── .env                                  # Environment variables (API keys, ports)
├── .gitignore                            # Git exclusion rules
├── index.html                            # HTML5 root template
├── package.json                          # Node.js dependencies and scripts
├── postcss.config.js                     # PostCSS pipeline configuration
├── server.js                             # Express.js REST API microservice (ESM)
├── server.cjs                            # CommonJS fallback server
├── tailwind.config.js                    # Tailwind styling tokens & ocean theme
├── train_cnn.py                          # MobileNetV2 CNN training & export script
├── tsconfig.json                         # TypeScript compiler configuration
├── vite.config.ts                        # Vite configuration & PWA manifest setup
│
├── dataset/                              # Fish dataset and reference catalogs
│   ├── README.md                         # Dataset ingestion & annotation guidelines
│   └── fish_species.json                 # Comprehensive multi-lingual fish database
│
├── docs/                                 # Academic & technical publications
│   ├── AquaLens_Journal_Paper_IEEE.docx  # Formatted IEEE research paper
│   ├── AquaLens_Project_Review_Report.docx# Project review evaluation dossier
│   ├── GEMINI_SETUP.md                   # Gemini API key setup instructions
│   ├── JOURNAL_RESEARCH_PAPER.md         # Full text academic paper
│   ├── PPT_Content.md                    # Defense presentation slide deck content
│   ├── PROJECT_REVIEW_REPORT.md          # Technical audit & viva defense notes
│   └── QUICK_SETUP.md                    # Quickstart guide
│
├── public/                               # Static assets and PWA manifests
│   ├── favicon.png                       # Application favicon
│   ├── pwa-192x192.png                   # PWA home screen icon
│   ├── pwa-512x512.png                   # High-res PWA icon
│   └── team/                             # Core team profile photographs
│       ├── bala.jpeg
│       ├── gowtham.jpeg
│       └── keertha.png
│
├── scripts/                              # Utility and migration scripts
│   └── legacy_patches/                   # Version patch scripts
│
└── src/                                  # React application source code
    ├── App.tsx                           # Main application orchestrator & navigation
    ├── index.css                         # Global CSS & Tailwind utilities
    ├── main.tsx                          # React entry point
    ├── types.ts                          # Comprehensive TypeScript type definitions
    ├── vite-env.d.ts                     # Vite client environment declarations
    │
    └── components/                       # Modular UI components
        ├── About.tsx                     # Project overview & research mission
        ├── Auth.tsx                      # User registration and login modal
        ├── FishAnalysisDashboard.tsx     # Visual scan results, freshness & nutrition
        ├── TeamSection.tsx               # Alpha X engineering team showcase
        └── AI/
            └── CNNModel.tsx              # On-device CNN inference coordinator
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Community Server running locally on port `27017` (or MongoDB Atlas URI)
- **Google Gemini API Key**: Free key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sarathi377/AQUALENS-FISHID-v2.git
   cd AQUALENS-FISHID-v2
   ```

2. **Install frontend and backend dependencies:**
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory:
```env
# Google Gemini Vision API Key (Required for AI Scan & Chat)
VITE_GOOGLE_API_KEY=your_gemini_api_key_here
VITE_GEMINI_MODEL=gemini-2.5-flash

# Backend Configuration
PORT=5000
MONGO_URI=mongodb://localhost:27017/fishid
```

> 💡 **Tip:** To obtain an API key, visit [Google AI Studio](https://aistudio.google.com/), generate a key, and paste it into `VITE_GOOGLE_API_KEY`.

### Running the Application

You can run both the frontend and backend concurrently or independently:

#### Option A: Start Full Stack (Recommended)

1. **Start the MongoDB Backend Server:**
   ```bash
   npm run server
   ```
   *Backend will run on [http://localhost:5000](http://localhost:5000) and verify MongoDB connection.*

2. **In a separate terminal, start the Vite Frontend Dev Server:**
   ```bash
   npm run dev
   ```
   *Frontend will launch at [http://localhost:5173](http://localhost:5173).*

#### Option B: Build for Production
```bash
npm run build
npm run preview
```

---

## 📡 REST API Reference

The Express.js microservice (`server.js`) exposes the following endpoints:

| Method | Endpoint | Description | Payload / Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service and database health check | Returns `{ status, database }` |
| `POST` | `/api/auth/register` | Register new user account | `{ name, email, password }` |
| `POST` | `/api/auth/login` | Authenticate user | `{ email, password }` |
| `POST` | `/api/scans` | Save fish scan telemetry | `{ species, confidence, disease, freshness, quantity, location, userEmail }` |
| `GET` | `/api/scans` | Retrieve latest 50 scan records | Returns array of scan objects |
| `GET` | `/api/scans/:email` | Retrieve scans for specific user | `email` URL parameter |
| `GET` | `/api/stats` | Aggregated scan analytics | Total scans, healthy count, top species |

---

## 📚 Research & Academic Documentation

AquaLens was engineered as an advanced final-year engineering initiative affiliated with **Adhi College of Engineering and Technology**, affiliated with **Anna University**, Chennai, India.

Comprehensive documentation is provided in the [`docs/`](docs/) directory:
- 📄 [**Journal Research Paper (Full Text)**](docs/JOURNAL_RESEARCH_PAPER.md): Comprehensive methodology, equations, and experimental evaluations.
- 📑 [**Technical Audit & Review Dossier**](docs/PROJECT_REVIEW_REPORT.md): In-depth viva defense guide, architectural breakdown, and defect remediation lifecycle.
- 🧪 [**Software Testing Report**](software_testing_report.md): 47-point validation audit covering functional, stress, and security test cases.
- 📊 [**Slide Deck Content**](docs/PPT_Content.md): Ready-to-present technical defense slides.

---

## 👥 Core Engineering Team

Developed with pride by **Alpha X Core Engineering**:

| Member | Role | Responsibility |
| :--- | :--- | :--- |
| **KEERTHASARATHI G K** | **Lead Developer / AI Architect** | Deep Learning Pipelines, Gemini Integration, Edge Quantization, Core Architecture |
| **BALAKRISHNAN J** | **Full Stack Engineer** | Express REST APIs, MongoDB Telemetry Engine, PWA Service Worker Infrastructure |
| **GOWTHAM S** | **UI/UX Designer & Data Analyst** | User Interface Engineering, Dataset Curation, Marine Data Modeling, Visual Design |

**Academic Affiliation:**  
Department of Computer Science and Engineering  
**Adhi College of Engineering and Technology**  
*(Affiliated with Anna University, Chennai, Tamil Nadu, India)*

---

## 📄 License

This project is open-source under the [MIT License](LICENSE). Academic publications, forks, and commercial adaptations should cite the authors and project repository.

---

<p align="center">
  <b>AquaLens (FishID-v2)</b> • Advancing Sustainable Marine Informatics & Fisher Safety 🌊
</p>
