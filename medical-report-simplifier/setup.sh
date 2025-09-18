#!/bin/bash

# Medical Report Simplifier - Setup and Run Script

echo "🏥 Medical Report Simplifier Setup"
echo "=================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ and try again."
    exit 1
fi

echo "✅ Python and Node.js found"

# Setup Backend
echo ""
echo "🔧 Setting up Backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "✅ Backend setup complete"

# Setup Frontend
echo ""
echo "🔧 Setting up Frontend..."
cd ../frontend

# Install Node dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete"

# Return to root directory
cd ..

echo ""
echo "🚀 Setup Complete!"
echo ""
echo "To run the application:"
echo "1. Backend:  cd backend && python app/main.py"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "Or use the run scripts:"
echo "- ./run_backend.sh"
echo "- ./run_frontend.sh"
echo ""
echo "⚠️  Remember: This tool is for educational purposes only!"
echo "💡 Always consult healthcare professionals for medical advice."