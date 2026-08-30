# 🌪️ Cyclone AI — Tropical Cyclone Intelligence Platform

> **AI-powered cyclone monitoring, detection, classification, and track intelligence for faster and more informed disaster preparedness.**

Cyclone AI is a modern tropical cyclone intelligence platform designed to bring **cyclone detection, classification, movement analysis, track prediction, historical records, and operational reporting** into a single interactive workspace.

The platform combines an intuitive analytics dashboard with geospatial visualization to help researchers, analysts, emergency-response teams, and weather enthusiasts understand cyclone activity and monitor developing systems.

---

## ✨ Key Features

### 🛰️ Cyclone Detection

Analyze cyclone systems and identify potential tropical disturbances through an intuitive detection workflow.

### 🧠 AI-Based Classification

Classify cyclone systems and organize storm information for easier analysis and decision-making.

### 🗺️ Track Prediction

Visualize:

* Observed cyclone tracks
* Forecast tracks
* Prediction paths
* Uncertainty cones
* Cyclone movement over geographic regions

The platform provides a dedicated track-prediction workspace for monitoring cyclone trajectories.

### 🌍 Interactive Globe & Maps

Explore cyclone activity through immersive geographic visualizations, including:

* Interactive maps
* Cyclone tracks
* Geographic overlays
* 3D Earth visualization
* Storm movement visualization

### 📊 Analytics Dashboard

A centralized operational dashboard provides quick access to cyclone intelligence and analysis workflows.

### 🗃️ Prediction History

Review previous prediction and analysis records to compare cyclone activity over time.

### 🌪️ Cyclone Archive

Maintain an organized archive of cyclone systems and historical storm information.

### 📄 Reports

Generate and access cyclone-related reports from the platform's dedicated reporting workspace.

### ⚙️ System Settings

Manage application-level configuration through a dedicated settings section.

### 📱 Responsive Interface

The application is designed to work across desktop and mobile screen sizes with responsive navigation and layouts.

### 🎨 Modern Visualization

The interface uses animated components, interactive charts, maps, data cards, and a modern glass-style visual system to create an operations-center experience.

---

## 🖥️ Platform Overview

```text
                    ┌─────────────────────────┐
                    │       CYCLONE AI        │
                    │ Tropical Cyclone        │
                    │ Intelligence Platform   │
                    └────────────┬────────────┘
                                 │
             ┌───────────────────┼───────────────────┐
             │                   │                   │
             ▼                   ▼                   ▼
       🛰️ Detection        🧠 Classification    🗺️ Prediction
             │                   │                   │
             └───────────────────┼───────────────────┘
                                 │
                                 ▼
                       📊 Intelligence Dashboard
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
        🗃️ Cyclone Archive  📈 History         📄 Reports
```

---

## 🧭 Dashboard Modules

| Module                 | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| **Dashboard**          | Central operational overview             |
| **Detection**          | Cyclone detection and analysis           |
| **Classification**     | Cyclone/storm classification             |
| **Track Prediction**   | Visualize cyclone movement and forecasts |
| **Prediction History** | Review previous prediction results       |
| **Cyclone Archive**    | Explore historical cyclone information   |
| **Reports**            | Access cyclone analysis reports          |
| **Settings**           | Configure platform preferences           |

---

## 🛠️ Technology Stack

### Frontend

* **React 19**
* **TypeScript**
* **TanStack Start**
* **TanStack Router**
* **Vite**
* **Tailwind CSS**

### Visualization & Geospatial

* **Three.js**
* **React Three Fiber**
* **React Leaflet**
* **Leaflet**
* **Recharts**

### UI & Interaction

* **Radix UI**
* **Lucide React**
* **Framer Motion**
* **React Hook Form**
* **Zod**
* **Sonner**

The current project configuration defines these technologies and dependencies directly in `package.json`.

---

## 📁 Project Structure

```text
cyclone_detect_intelAi/
│
├── public/
│   ├── favicon1.ico
│   └── robots.txt
│
├── src/
│   ├── assets/
│   │   ├── cyclone-sprite.png
│   │   ├── earth-auth-panel.jpg
│   │   ├── earth-night.jpg
│   │   ├── earth-topology.png
│   │   └── earth-water.png
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── brand/
│   │   ├── globe/
│   │   ├── layout/
│   │   ├── maps/
│   │   └── ui/
│   │
│   ├── routes/
│   │   ├── dashboard/
│   │   └── index.tsx
│   │
│   ├── sections/
│   └── ...
│
├── package.json
├── tsconfig.json
├── vite.config.*
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* **Node.js**
* **npm**

### 1. Clone the repository

```bash
git clone https://github.com/sankha166/cyclone_detect_intelAi.git
```

### 2. Navigate to the project

```bash
cd cyclone_detect_intelAi
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available through the local Vite development server.

---

## 📦 Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🔍 Code Quality

Run ESLint:

```bash
npm run lint
```

Format the project:

```bash
npm run format
```

---

## 🔬 Vision

Cyclone AI aims to evolve into a comprehensive **AI-assisted tropical cyclone intelligence system** capable of combining multiple sources of meteorological information and transforming complex storm data into actionable intelligence.

Future development can include:

* Real-time satellite data integration
* Automated cyclone detection models
* Deep-learning-based storm classification
* Multi-model track prediction
* Live weather and oceanographic data
* Intensity forecasting
* Storm surge estimation
* Risk-zone mapping
* Automated early-warning generation
* Historical cyclone analytics
* Model performance monitoring
* Explainable AI for cyclone predictions

---

## 🌏 Potential Impact

Tropical cyclones can cause significant damage to communities, infrastructure, agriculture, and coastal ecosystems.

By bringing cyclone information into a single visual intelligence platform, Cyclone AI can help make complex storm information easier to understand and support:

* 🌊 Disaster preparedness
* 🏘️ Community awareness
* 🚨 Emergency response
* 🛰️ Meteorological research
* 📊 Climate and storm analysis
* 🧑‍🔬 Scientific experimentation

---

## ⚠️ Project Status

**Active Development**

The current repository primarily contains the interactive frontend and visualization experience. Some cyclone visualizations and datasets are currently based on application-provided/mock data rather than a production live meteorological data pipeline.

The platform is designed so that real-time data sources, trained AI/ML models, and production prediction services can be integrated as the project evolves.

---

## 🤝 Contributing

Contributions, ideas, and improvements are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add your feature"
```

5. Push the branch

```bash
git push origin feature/your-feature
```

6. Open a Pull Request

---

## 📜 License

This project currently does not specify a license.

If you intend to make the project open source, consider adding an appropriate license such as MIT before publishing it for unrestricted reuse.

---

## 👨‍💻 Author

**Sankhadip Santra**

GitHub: [@sankha166](https://github.com/sankha166)

---

## ⭐ Support

If you find **Cyclone AI** interesting or useful, consider giving the repository a ⭐ on GitHub.

---

> **Cyclone AI — Turning cyclone data into actionable intelligence.**
