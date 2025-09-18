import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app

if __name__ == '__main__':
    app = create_app()
    print("Medical Report Simplifier API")
    print("=" * 40)
    print("Starting server on http://127.0.0.1:5000")
    print("Available endpoints:")
    print("  - GET  /api/health          - Health check")
    print("  - POST /api/upload          - Upload PDF/TXT report")
    print("  - POST /api/analyze-text    - Analyze raw text")
    print("  - GET  /api/test-parameters - Get test parameters")
    print("  - GET  /api/disclaimers     - Get medical disclaimers")
    print("  - GET  /api/demo-analysis   - Demo analysis")
    print("=" * 40)
    print("WARNING: This tool is for educational purposes only!")
    print("Always consult healthcare professionals for medical advice.")
    print("=" * 40)
    
    app.run(host='127.0.0.1', port=5000, debug=True)