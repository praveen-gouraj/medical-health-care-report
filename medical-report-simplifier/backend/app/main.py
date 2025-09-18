from flask import Flask
import logging
import os
from app import create_app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def main():
    """Main function to run the Flask application"""
    app = create_app()
    
    # Get configuration from environment
    host = os.getenv('FLASK_HOST', '127.0.0.1')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print("🏥 Medical Report Simplifier API")
    print("=" * 40)
    print(f"🚀 Starting server on http://{host}:{port}")
    print(f"🔧 Debug mode: {debug}")
    print("📋 Available endpoints:")
    print("  - GET  /api/health          - Health check")
    print("  - POST /api/upload          - Upload PDF/TXT report")
    print("  - POST /api/analyze-text    - Analyze raw text")
    print("  - GET  /api/test-parameters - Get test parameters")
    print("  - GET  /api/disclaimers     - Get medical disclaimers")
    print("  - GET  /api/demo-analysis   - Demo analysis")
    print("=" * 40)
    print("⚠️  This tool is for educational purposes only!")
    print("💡 Always consult healthcare professionals for medical advice.")
    print("=" * 40)
    
    try:
        app.run(
            host=host,
            port=port,
            debug=debug,
            threaded=True
        )
    except Exception as e:
        logging.error(f"Failed to start server: {e}")
        return 1
    
    return 0

if __name__ == '__main__':
    exit(main())