@echo off
REM Medical Report Simplifier - Windows Setup Script
echo 🏥 Medical Report Simplifier Setup
echo 
REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.7+ and try again.
    pause
    exit /b 1
)
REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 14+ and try again.
    pause
    exit /b 1
)
echo ✅ Python and Node.js found
REM Setup Backend
echo.
echo 🔧 Setting up Backend...
cd backend
REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)
REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
echo ✅ Backend setup complete

REM Setup Frontend
echo.
echo 🔧 Setting up Frontend...
cd ..\frontend
REM Install Node dependencies
echo Installing Node.js dependencies...
npm install

echo ✅ Frontend setup complete
REM Return to root directory
cd ..
echo.
echo 🚀 Setup Complete!
echo.
echo To run the application:
echo 1. Backend:  cd backend ^&^& python app/main.py
echo 2. Frontend: cd frontend ^&^& npm start
echo.
echo Or use the run scripts:
echo - run_backend.bat
echo - run_frontend.bat
echo.
echo ⚠️  Remember: This tool is for educational purposes only!
echo 💡 Always consult healthcare professionals for medical advice.

pause
