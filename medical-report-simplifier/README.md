# 🏥 Medical Report Simplifier

> **AI-Powered Healthcare Accessibility Platform**  
> *Transforming complex medical reports into clear, actionable health insights*

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/your-username/medical-report-simplifier)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20%2B%20Enhanced-brightgreen.svg)](https://github.com/your-username/medical-report-simplifier)
[![SDG](https://img.shields.io/badge/UN%20SDG-3%20%26%2010-orange.svg)](https://sdgs.un.org/goals)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

##  Hackathon Winning Features

###  **Dual AI Analysis Engine**
- **Gemini AI Integration**: Advanced natural language understanding for medical reports
- **Smart Fallback System**: Enhanced rule-based analysis when AI is unavailable
- **Multi-Parameter Analysis**: Comprehensive health scoring (0-100) and risk assessment (0-10)

###  **5-Tab Interactive Interface**
1. **🏠 Health Dashboard**: Real-time health metrics, achievements, and progress tracking
2. **📄 Upload Report**: Smart file processing with patient information forms
3. **💬 Analyze Text**: Direct text input with AI-powered analysis
4. **🤖 AI Assistant**: Conversational health guidance and parameter explanations
5. **📈 Health Trends**: Comparative analysis with exportable trend data

### **Competition Differentiators**
- **Modern UI/UX**: Glassmorphism design, dark mode, framer-motion animations
- **Data Visualization**: Interactive charts (recharts, chart.js) with health analytics
- **Gamification**: Achievement system, health scoring, improvement streaks
- **Global Impact**: Direct UN SDG 3 & 10 contributions with impact tracking

##  SDG Alignment

### **UN SDG 3: Good Health and Well-being**
- **Democratizing Health Information**: Making medical reports accessible to everyone
- **Early Detection**: AI-powered risk assessment for preventive care
- **Health Education**: Patient-friendly explanations of medical terms

### **UN SDG 10: Reduced Inequalities**
- **Language Support**: Multi-language medical report analysis
- **Economic Accessibility**: Free AI-powered health insights
- **Geographic Reach**: Cloud-based platform for global access

##  Quick Start

### **Option 1: Automated Setup (Recommended)**
```bash
# Clone the repository
git clone https://github.com/your-username/medical-report-simplifier.git
cd medical-report-simplifier

# Run the setup wizard
python setup.py
```

### **Option 2: Manual Setup**
```bash
# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install

# Environment configuration
cp backend/.env.example backend/.env
# Edit .env file with your API keys
```

## API Keys & Configuration

### **Essential (for full functionality):**
```bash
GEMINI_API_KEY=your_gemini_api_key_here  # Get from: https://makersuite.google.com/app/apikey
```

### **Optional Enhancements:**
```bash
# Backup AI Services
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_claude_key

# OCR & Document Processing
GOOGLE_VISION_API_KEY=your_vision_key
AZURE_COMPUTER_VISION_KEY=your_azure_key

# Cloud Storage
AWS_ACCESS_KEY_ID=your_aws_key
GOOGLE_CLOUD_STORAGE_BUCKET=your_gcs_bucket

# Email Services
SENDGRID_API_KEY=your_sendgrid_key
SMTP_USERNAME=your_email@gmail.com

# Analytics
GOOGLE_ANALYTICS_ID=your_ga_id
SENTRY_DSN=your_sentry_dsn
```

## 🏃‍♂️ Running the Application

### **Using Startup Scripts:**
```bash
# Windows
start_backend.bat
start_frontend.bat

# Linux/Mac
./start_backend.sh
./start_frontend.sh
```

### **Manual Start:**
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
python -c "from app import create_app; app = create_app(); app.run(host='127.0.0.1', port=5000, debug=True)"

# Terminal 2 - Frontend
cd frontend
npm start
```

### **Access Points:**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://127.0.0.1:5000
- 📊 **System Status**: http://127.0.0.1:5000/api/system-status
- 🤖 **AI Status**: http://127.0.0.1:5000/api/ai-status

## 🏗️ Technology Stack

### **Backend**
- **Framework**: Python Flask with comprehensive API
- **AI Engine**: Google Gemini AI with fallback systems
- **Document Processing**: PyPDF2, pdfplumber, OCR engines
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Cloud Integration**: AWS S3, Google Cloud Storage
- **Configuration**: Advanced environment management

### **Frontend**
- **Framework**: React with modern hooks
- **UI Components**: Material-UI, Styled Components
- **Animations**: Framer Motion, React Spring
- **Charts**: Recharts, Chart.js, D3.js
- **State Management**: Redux Toolkit
- **Routing**: React Router with protected routes
```bash
cd backend
pip install -r requirements.txt
python app/main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Important Disclaimer
⚠️ **This tool is for educational purposes only and should not replace professional medical advice. Always consult with healthcare professionals for medical concerns.**

## Sample Input/Output
**Input**: CBC report showing Hemoglobin: 8.5 g/dL (Normal: 12-16)
**Output**: "Your hemoglobin level is low (8.5), which is below the normal range (12-16). This could indicate anemia. Please discuss this with your doctor."

## Contributing
This project was developed for hackathon purposes. Contributions welcome!

## License
MIT License
