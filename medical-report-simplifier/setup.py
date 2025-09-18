#!/usr/bin/env python3
"""
🏥 Medical Report Simplifier - Setup Script
Automated setup and configuration for hackathon deployment
"""

import os
import sys
import subprocess
import platform
import json
from pathlib import Path

class Colors:
    """ANSI color codes for terminal output"""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_colored(message, color=Colors.OKGREEN):
    """Print colored message to terminal"""
    print(f"{color}{message}{Colors.ENDC}")

def print_header(message):
    """Print formatted header"""
    print_colored(f"\n{'='*60}", Colors.HEADER)
    print_colored(f"🏥 {message}", Colors.HEADER + Colors.BOLD)
    print_colored(f"{'='*60}", Colors.HEADER)

def run_command(command, description=""):
    """Run shell command with error handling"""
    if description:
        print_colored(f"🔄 {description}...", Colors.OKCYAN)
    
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print_colored(f"✅ Success: {description}", Colors.OKGREEN)
            return True
        else:
            print_colored(f"❌ Failed: {description}", Colors.FAIL)
            print_colored(f"Error: {result.stderr}", Colors.WARNING)
            return False
    except Exception as e:
        print_colored(f"❌ Exception: {str(e)}", Colors.FAIL)
        return False

def check_python_version():
    """Check if Python version is compatible"""
    print_header("CHECKING PYTHON VERSION")
    
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print_colored(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible", Colors.OKGREEN)
        return True
    else:
        print_colored(f"❌ Python {version.major}.{version.minor}.{version.micro} is not compatible. Need Python 3.8+", Colors.FAIL)
        return False

def setup_virtual_environment():
    """Create and setup virtual environment"""
    print_header("SETTING UP VIRTUAL ENVIRONMENT")
    
    venv_path = "venv"
    
    if not os.path.exists(venv_path):
        if run_command("python -m venv venv", "Creating virtual environment"):
            print_colored("✅ Virtual environment created", Colors.OKGREEN)
        else:
            return False
    else:
        print_colored("✅ Virtual environment already exists", Colors.OKGREEN)
    
    # Activate virtual environment
    if platform.system() == "Windows":
        activate_cmd = "venv\\Scripts\\activate"
        pip_cmd = "venv\\Scripts\\pip"
    else:
        activate_cmd = "source venv/bin/activate"
        pip_cmd = "venv/bin/pip"
    
    return True

def install_dependencies():
    """Install Python dependencies"""
    print_header("INSTALLING DEPENDENCIES")
    
    # Determine pip command based on OS
    if platform.system() == "Windows":
        pip_cmd = "venv\\Scripts\\pip"
    else:
        pip_cmd = "venv/bin/pip"
    
    # Install core dependencies first
    core_deps = [
        "flask",
        "flask-cors",
        "python-dotenv",
        "google-generativeai",
        "PyPDF2",
        "pdfplumber",
    ]
    
    print_colored("📦 Installing core dependencies...", Colors.OKCYAN)
    for dep in core_deps:
        if not run_command(f"{pip_cmd} install {dep}", f"Installing {dep}"):
            print_colored(f"⚠️  Failed to install {dep}, continuing...", Colors.WARNING)
    
    # Install from requirements.txt if exists
    if os.path.exists("requirements.txt"):
        run_command(f"{pip_cmd} install -r requirements.txt", "Installing from requirements.txt")
    
    return True

def setup_environment_file():
    """Create .env file from .env.example"""
    print_header("SETTING UP ENVIRONMENT CONFIGURATION")
    
    env_example = ".env.example"
    env_file = ".env"
    
    if os.path.exists(env_example):
        if not os.path.exists(env_file):
            try:
                with open(env_example, 'r') as example:
                    content = example.read()
                
                with open(env_file, 'w') as env:
                    env.write(content)
                
                print_colored("✅ .env file created from .env.example", Colors.OKGREEN)
                print_colored("⚠️  Remember to update API keys in .env file", Colors.WARNING)
            except Exception as e:
                print_colored(f"❌ Failed to create .env file: {e}", Colors.FAIL)
                return False
        else:
            print_colored("✅ .env file already exists", Colors.OKGREEN)
    else:
        print_colored("⚠️  .env.example not found, creating basic .env", Colors.WARNING)
        basic_env = """GEMINI_API_KEY=your_gemini_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_SECRET_KEY=change_this_in_production
"""
        with open(env_file, 'w') as f:
            f.write(basic_env)
    
    return True

def setup_directories():
    """Create necessary directories"""
    print_header("CREATING DIRECTORIES")
    
    directories = [
        "uploads",
        "logs",
        "data",
        "tests",
        "app/static",
        "app/templates"
    ]
    
    for directory in directories:
        try:
            Path(directory).mkdir(parents=True, exist_ok=True)
            print_colored(f"✅ Created directory: {directory}", Colors.OKGREEN)
        except Exception as e:
            print_colored(f"❌ Failed to create {directory}: {e}", Colors.FAIL)
    
    return True

def setup_frontend():
    """Setup frontend dependencies"""
    print_header("SETTING UP FRONTEND")
    
    frontend_path = "frontend"
    
    if os.path.exists(frontend_path):
        os.chdir(frontend_path)
        
        if os.path.exists("package.json"):
            if run_command("npm install", "Installing npm dependencies"):
                print_colored("✅ Frontend dependencies installed", Colors.OKGREEN)
            else:
                print_colored("⚠️  npm install failed, try running manually", Colors.WARNING)
        else:
            print_colored("⚠️  package.json not found in frontend directory", Colors.WARNING)
        
        os.chdir("..")
    else:
        print_colored("⚠️  Frontend directory not found", Colors.WARNING)
    
    return True

def create_startup_scripts():
    """Create convenient startup scripts"""
    print_header("CREATING STARTUP SCRIPTS")
    
    # Backend startup script
    if platform.system() == "Windows":
        backend_script = """@echo off
echo 🏥 Starting Medical Report Simplifier Backend...
cd /d "%~dp0"
call venv\\Scripts\\activate
python -c "import sys; import os; sys.path.insert(0, os.getcwd()); from app import create_app; app = create_app(); print('🚀 Backend starting on http://127.0.0.1:5000'); app.run(host='127.0.0.1', port=5000, debug=True)"
pause
"""
        with open("start_backend.bat", "w") as f:
            f.write(backend_script)
        
        frontend_script = """@echo off
echo 🌐 Starting Medical Report Simplifier Frontend...
cd /d "%~dp0\\frontend"
npm start
pause
"""
        with open("start_frontend.bat", "w") as f:
            f.write(frontend_script)
            
    else:
        backend_script = """#!/bin/bash
echo "🏥 Starting Medical Report Simplifier Backend..."
cd "$(dirname "$0")"
source venv/bin/activate
python -c "import sys; import os; sys.path.insert(0, os.getcwd()); from app import create_app; app = create_app(); print('🚀 Backend starting on http://127.0.0.1:5000'); app.run(host='127.0.0.1', port=5000, debug=True)"
"""
        with open("start_backend.sh", "w") as f:
            f.write(backend_script)
        os.chmod("start_backend.sh", 0o755)
        
        frontend_script = """#!/bin/bash
echo "🌐 Starting Medical Report Simplifier Frontend..."
cd "$(dirname "$0")/frontend"
npm start
"""
        with open("start_frontend.sh", "w") as f:
            f.write(frontend_script)
        os.chmod("start_frontend.sh", 0o755)
    
    print_colored("✅ Startup scripts created", Colors.OKGREEN)
    return True

def display_final_instructions():
    """Display final setup instructions"""
    print_header("SETUP COMPLETE! 🎉")
    
    instructions = """
🔧 NEXT STEPS:

1. 🔑 UPDATE API KEYS:
   Edit the .env file and add your actual API keys:
   - GEMINI_API_KEY (Get from: https://makersuite.google.com/app/apikey)
   - Add other optional API keys as needed

2. 🚀 START THE APPLICATION:
   
   Option A - Use startup scripts:
   • Windows: Double-click start_backend.bat and start_frontend.bat
   • Linux/Mac: Run ./start_backend.sh and ./start_frontend.sh
   
   Option B - Manual start:
   • Backend: Activate venv and run 'python app/main.py'
   • Frontend: Go to frontend/ and run 'npm start'

3. 🌐 ACCESS THE APPLICATION:
   • Frontend: http://localhost:3000
   • Backend API: http://127.0.0.1:5000
   • System Status: http://127.0.0.1:5000/api/system-status

4. 🏆 HACKATHON FEATURES:
   • ✅ AI-Powered Analysis (Gemini + Fallbacks)
   • ✅ Interactive Health Dashboard
   • ✅ Health Trends & Comparison
   • ✅ AI Health Assistant Chat
   • ✅ Modern UI with Animations
   • ✅ SDG 3 & 10 Impact Tracking

5. 🔧 OPTIONAL ENHANCEMENTS:
   • Add cloud storage credentials for file uploads
   • Configure email services for report sharing
   • Set up analytics and monitoring
   • Enable OAuth for social login
   • Add medical API integrations

🎯 Your hackathon project is ready to impress judges!
"""
    
    print_colored(instructions, Colors.OKGREEN)

def main():
    """Main setup function"""
    print_colored("""
🏥 MEDICAL REPORT SIMPLIFIER - SETUP WIZARD
============================================
Welcome to the automated setup for your hackathon project!
This script will configure everything you need to get started.
""", Colors.HEADER + Colors.BOLD)
    
    # Change to project directory if running from elsewhere
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Run setup steps
    steps = [
        ("Checking Python version", check_python_version),
        ("Setting up virtual environment", setup_virtual_environment),
        ("Installing dependencies", install_dependencies),
        ("Setting up environment configuration", setup_environment_file),
        ("Creating directories", setup_directories),
        ("Setting up frontend", setup_frontend),
        ("Creating startup scripts", create_startup_scripts),
    ]
    
    success_count = 0
    for description, step_function in steps:
        try:
            if step_function():
                success_count += 1
        except Exception as e:
            print_colored(f"❌ {description} failed: {e}", Colors.FAIL)
    
    print_colored(f"\n📊 Setup completed: {success_count}/{len(steps)} steps successful", 
                 Colors.OKGREEN if success_count == len(steps) else Colors.WARNING)
    
    if success_count >= len(steps) - 1:  # Allow for 1 failure
        display_final_instructions()
    else:
        print_colored("⚠️  Setup incomplete. Please review errors above and run setup again.", Colors.WARNING)

if __name__ == "__main__":
    main()