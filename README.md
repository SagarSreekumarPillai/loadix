# 🚀 Lodix - AI-Powered Logistics MVP for EU

**Lodix** is an intelligent logistics orchestration platform designed to streamline end-to-end supply chains in the European Union. Our MVP focuses on solving real bottlenecks with AI-driven recommendations rather than replacing existing systems.

## 🎯 Core Vision

- **Single Intelligent Layer**: Provide a unified platform for EU logistics companies
- **AI-Driven Optimization**: Reduce waste in planning, routing, warehousing, and delivery
- **EU Compliance Focus**: Address customs complexity, CO₂ compliance (Fit for 55), and fragmented carrier networks
- **Modular Foundation**: Start with MVP, expand to advanced integrations (ERP, IoT, customs)

## 🏗️ Architecture

```
lodix/
├── apps/
│   ├── frontend/     # Next.js + TypeScript + Tailwind + ShadCN UI
│   ├── backend/      # Node.js + Express + MongoDB
│   └── ai-service/   # FastAPI + ML models (Python)
├── docs/             # Project documentation
└── .github/          # CI/CD workflows
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Node.js, Express, MongoDB Atlas
- **AI Layer**: Python, FastAPI, Scikit-learn, PyTorch Lightning
- **Authentication**: Clerk or NextAuth.js
- **Deployment**: Vercel (frontend), Railway (backend), Docker (AI service)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB Atlas account
- Git

### Development Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <your-repo-url>
   cd lodix
   
   # Install frontend dependencies
   cd apps/frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   
   # Install AI service dependencies
   cd ../ai-service
   pip install -r requirements.txt
   ```

2. **Environment Setup**
   ```bash
   # Frontend (.env.local)
   cp apps/frontend/.env.example apps/frontend/.env.local
   
   # Backend (.env)
   cp apps/backend/.env.example apps/backend/.env
   
   # AI Service (.env)
   cp apps/ai-service/.env.example apps/ai-service/.env
   ```

3. **Run Development Servers**
   ```bash
   # Terminal 1: Frontend
   cd apps/frontend
   npm run dev
   
   # Terminal 2: Backend
   cd apps/backend
   npm run dev
   
   # Terminal 3: AI Service
   cd apps/ai-service
   uvicorn main:app --reload
   ```

## 📋 MVP Features

- **Order Management**: Shipment booking and order intake
- **AI Forecasting**: Demand prediction and volume optimization
- **Route Optimization**: AI-driven route planning with EU compliance
- **Real-time Tracking**: Live shipment status and ETA updates
- **Compliance Checks**: EU customs and regulatory validation
- **Analytics Dashboard**: Operational insights and performance metrics

## 🗺️ Roadmap

- **Phase 1**: Core logistics flow (Order → Shipment → Carrier)
- **Phase 2**: Real-time tracking and dashboard
- **Phase 3**: AI insights and forecasting
- **Phase 4**: Advanced compliance and analytics
- **Phase 5**: Enterprise integrations and scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for the EU logistics community**
