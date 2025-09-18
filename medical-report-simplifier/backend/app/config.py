"""
🏥 Medical Report Simplifier - Configuration Management
Advanced configuration system with environment variable validation and defaults
"""

import os
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

@dataclass
class DatabaseConfig:
    """Database configuration settings"""
    url: str = os.getenv('DATABASE_URL', 'sqlite:///medical_reports.db')
    postgres_url: str = os.getenv('POSTGRES_URL', '')
    mongodb_uri: str = os.getenv('MONGODB_URI', '')
    redis_url: str = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

@dataclass
class AIConfig:
    """AI/ML service configuration"""
    gemini_api_key: str = os.getenv('GEMINI_API_KEY', '')
    openai_api_key: str = os.getenv('OPENAI_API_KEY', '')
    anthropic_api_key: str = os.getenv('ANTHROPIC_API_KEY', '')
    huggingface_api_key: str = os.getenv('HUGGINGFACE_API_KEY', '')
    
    # OCR Services
    google_vision_api_key: str = os.getenv('GOOGLE_VISION_API_KEY', '')
    azure_cv_key: str = os.getenv('AZURE_COMPUTER_VISION_KEY', '')
    azure_cv_endpoint: str = os.getenv('AZURE_COMPUTER_VISION_ENDPOINT', '')
    
    def has_ai_capability(self) -> bool:
        """Check if any AI service is configured"""
        return bool(self.gemini_api_key or self.openai_api_key or self.anthropic_api_key)
    
    def has_ocr_capability(self) -> bool:
        """Check if OCR services are configured"""
        return bool(self.google_vision_api_key or self.azure_cv_key)

@dataclass
class CloudConfig:
    """Cloud storage and services configuration"""
    # AWS
    aws_access_key_id: str = os.getenv('AWS_ACCESS_KEY_ID', '')
    aws_secret_access_key: str = os.getenv('AWS_SECRET_ACCESS_KEY', '')
    aws_s3_bucket: str = os.getenv('AWS_S3_BUCKET', '')
    aws_region: str = os.getenv('AWS_REGION', 'us-east-1')
    
    # Google Cloud
    gcp_project_id: str = os.getenv('GOOGLE_CLOUD_PROJECT_ID', '')
    gcs_bucket: str = os.getenv('GOOGLE_CLOUD_STORAGE_BUCKET', '')
    
    # Azure
    azure_storage_connection: str = os.getenv('AZURE_STORAGE_CONNECTION_STRING', '')
    
    def has_cloud_storage(self) -> bool:
        """Check if cloud storage is configured"""
        return bool(self.aws_s3_bucket or self.gcs_bucket or self.azure_storage_connection)

@dataclass
class SecurityConfig:
    """Security and authentication configuration"""
    jwt_secret_key: str = os.getenv('JWT_SECRET_KEY', 'default-jwt-secret-change-in-production')
    flask_secret_key: str = os.getenv('FLASK_SECRET_KEY', 'default-flask-secret-change-in-production')
    encryption_key: str = os.getenv('ENCRYPTION_KEY', '')
    
    # OAuth
    google_client_id: str = os.getenv('OAUTH_GOOGLE_CLIENT_ID', '')
    google_client_secret: str = os.getenv('OAUTH_GOOGLE_CLIENT_SECRET', '')
    github_client_id: str = os.getenv('OAUTH_GITHUB_CLIENT_ID', '')
    github_client_secret: str = os.getenv('OAUTH_GITHUB_CLIENT_SECRET', '')
    
    # Rate limiting
    rate_limit_per_minute: int = int(os.getenv('RATE_LIMIT_PER_MINUTE', '100'))
    
    def has_oauth_configured(self) -> bool:
        """Check if OAuth is configured"""
        return bool(self.google_client_id or self.github_client_id)

@dataclass
class EmailConfig:
    """Email service configuration"""
    smtp_server: str = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port: int = int(os.getenv('SMTP_PORT', '587'))
    smtp_username: str = os.getenv('SMTP_USERNAME', '')
    smtp_password: str = os.getenv('SMTP_PASSWORD', '')
    sendgrid_api_key: str = os.getenv('SENDGRID_API_KEY', '')
    mailgun_api_key: str = os.getenv('MAILGUN_API_KEY', '')
    
    def has_email_configured(self) -> bool:
        """Check if email service is configured"""
        return bool(self.smtp_username or self.sendgrid_api_key or self.mailgun_api_key)

@dataclass
class AnalyticsConfig:
    """Analytics and monitoring configuration"""
    google_analytics_id: str = os.getenv('GOOGLE_ANALYTICS_ID', '')
    mixpanel_token: str = os.getenv('MIXPANEL_TOKEN', '')
    sentry_dsn: str = os.getenv('SENTRY_DSN', '')
    new_relic_key: str = os.getenv('NEW_RELIC_LICENSE_KEY', '')
    datadog_api_key: str = os.getenv('DATADOG_API_KEY', '')
    
    def has_analytics_configured(self) -> bool:
        """Check if analytics is configured"""
        return bool(self.google_analytics_id or self.mixpanel_token)

@dataclass
class FeatureFlags:
    """Feature flags for enabling/disabling functionality"""
    enable_ai_analysis: bool = os.getenv('ENABLE_AI_ANALYSIS', 'True').lower() == 'true'
    enable_ocr_processing: bool = os.getenv('ENABLE_OCR_PROCESSING', 'True').lower() == 'true'
    enable_email_reports: bool = os.getenv('ENABLE_EMAIL_REPORTS', 'True').lower() == 'true'
    enable_multi_language: bool = os.getenv('ENABLE_MULTI_LANGUAGE', 'True').lower() == 'true'
    enable_push_notifications: bool = os.getenv('ENABLE_PUSH_NOTIFICATIONS', 'True').lower() == 'true'
    enable_social_login: bool = os.getenv('ENABLE_SOCIAL_LOGIN', 'True').lower() == 'true'
    enable_analytics: bool = os.getenv('ENABLE_ANALYTICS', 'True').lower() == 'true'
    enable_rate_limiting: bool = os.getenv('ENABLE_RATE_LIMITING', 'True').lower() == 'true'
    enable_file_encryption: bool = os.getenv('ENABLE_FILE_ENCRYPTION', 'True').lower() == 'true'
    enable_audit_logging: bool = os.getenv('ENABLE_AUDIT_LOGGING', 'True').lower() == 'true'

@dataclass
class MedicalAPIConfig:
    """Medical data APIs configuration"""
    fhir_server_url: str = os.getenv('FHIR_SERVER_URL', '')
    snomed_api_key: str = os.getenv('SNOMED_API_KEY', '')
    icd10_api_key: str = os.getenv('ICD10_API_KEY', '')
    drug_interaction_api_key: str = os.getenv('DRUG_INTERACTION_API_KEY', '')
    medical_reference_api_key: str = os.getenv('MEDICAL_REFERENCE_API_KEY', '')
    
    def has_medical_apis_configured(self) -> bool:
        """Check if medical APIs are configured"""
        return bool(self.fhir_server_url or self.snomed_api_key or self.icd10_api_key)

class Config:
    """Main configuration class that aggregates all config sections"""
    
    def __init__(self):
        # Flask configuration
        self.flask_env = os.getenv('FLASK_ENV', 'development')
        self.flask_debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
        self.flask_port = int(os.getenv('FLASK_PORT', '5000'))
        self.flask_host = os.getenv('FLASK_HOST', '127.0.0.1')
        
        # File handling
        self.max_content_length = int(os.getenv('MAX_CONTENT_LENGTH', '16777216'))  # 16MB
        self.max_file_size = os.getenv('MAX_FILE_SIZE', '50MB')
        self.allowed_extensions = os.getenv('ALLOWED_EXTENSIONS', 'pdf,txt,doc,docx,jpg,jpeg,png').split(',')
        
        # Internationalization
        self.supported_languages = os.getenv('SUPPORTED_LANGUAGES', 'en,es,fr,de,it,pt,hi,zh,ja,ar').split(',')
        self.default_language = os.getenv('DEFAULT_LANGUAGE', 'en')
        self.translation_api_key = os.getenv('TRANSLATION_API_KEY', '')
        
        # Logging
        self.log_level = os.getenv('LOG_LEVEL', 'INFO')
        self.log_file = os.getenv('LOG_FILE', 'logs/medical_app.log')
        
        # CORS
        self.cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
        
        # Testing
        self.testing_mode = os.getenv('TESTING_MODE', 'False').lower() == 'true'
        self.mock_ai_responses = os.getenv('MOCK_AI_RESPONSES', 'False').lower() == 'true'
        
        # Initialize configuration sections
        self.database = DatabaseConfig()
        self.ai = AIConfig()
        self.cloud = CloudConfig()
        self.security = SecurityConfig()
        self.email = EmailConfig()
        self.analytics = AnalyticsConfig()
        self.features = FeatureFlags()
        self.medical_apis = MedicalAPIConfig()
        
        # Set up logging
        self._setup_logging()
        
        # Validate critical configuration
        self._validate_config()
    
    def _setup_logging(self):
        """Configure logging based on environment settings"""
        import logging.config
        
        # Create logs directory if it doesn't exist
        log_dir = os.path.dirname(self.log_file)
        if log_dir and not os.path.exists(log_dir):
            os.makedirs(log_dir)
        
        logging_config = {
            'version': 1,
            'disable_existing_loggers': False,
            'formatters': {
                'default': {
                    'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
                },
                'detailed': {
                    'format': '[%(asctime)s] %(levelname)s [%(name)s:%(lineno)d] %(message)s',
                }
            },
            'handlers': {
                'console': {
                    'class': 'logging.StreamHandler',
                    'level': self.log_level,
                    'formatter': 'default',
                },
                'file': {
                    'class': 'logging.FileHandler',
                    'level': self.log_level,
                    'formatter': 'detailed',
                    'filename': self.log_file,
                }
            },
            'root': {
                'level': self.log_level,
                'handlers': ['console', 'file']
            }
        }
        
        logging.config.dictConfig(logging_config)
    
    def _validate_config(self):
        """Validate critical configuration settings"""
        logger = logging.getLogger(__name__)
        
        warnings = []
        errors = []
        
        # Check AI configuration
        if not self.ai.has_ai_capability() and self.features.enable_ai_analysis:
            warnings.append("AI analysis is enabled but no AI API keys are configured")
        
        # Check security settings
        if self.security.flask_secret_key.startswith('default-'):
            warnings.append("Using default Flask secret key - change in production!")
        
        if self.security.jwt_secret_key.startswith('default-'):
            warnings.append("Using default JWT secret key - change in production!")
        
        # Check email configuration
        if self.features.enable_email_reports and not self.email.has_email_configured():
            warnings.append("Email reports are enabled but no email service is configured")
        
        # Check cloud storage
        if not self.cloud.has_cloud_storage():
            warnings.append("No cloud storage configured - files will be stored locally")
        
        # Log warnings and errors
        for warning in warnings:
            logger.warning(f"⚠️  Configuration Warning: {warning}")
        
        for error in errors:
            logger.error(f"❌ Configuration Error: {error}")
        
        if errors:
            raise ValueError(f"Critical configuration errors found: {errors}")
        
        logger.info(f"✅ Configuration loaded successfully - Environment: {self.flask_env}")
    
    def get_capabilities(self) -> Dict[str, bool]:
        """Get a summary of enabled capabilities"""
        return {
            'ai_analysis': self.ai.has_ai_capability() and self.features.enable_ai_analysis,
            'ocr_processing': self.ai.has_ocr_capability() and self.features.enable_ocr_processing,
            'cloud_storage': self.cloud.has_cloud_storage(),
            'email_reports': self.email.has_email_configured() and self.features.enable_email_reports,
            'social_login': self.security.has_oauth_configured() and self.features.enable_social_login,
            'analytics': self.analytics.has_analytics_configured() and self.features.enable_analytics,
            'medical_apis': self.medical_apis.has_medical_apis_configured(),
            'multi_language': self.features.enable_multi_language,
            'push_notifications': self.features.enable_push_notifications,
            'rate_limiting': self.features.enable_rate_limiting,
            'file_encryption': self.features.enable_file_encryption,
            'audit_logging': self.features.enable_audit_logging,
        }
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary (excluding sensitive data)"""
        return {
            'environment': self.flask_env,
            'debug': self.flask_debug,
            'capabilities': self.get_capabilities(),
            'supported_languages': self.supported_languages,
            'allowed_extensions': self.allowed_extensions,
            'max_file_size': self.max_file_size,
        }

# Global configuration instance
config = Config()

# Export commonly used configurations
DATABASE_CONFIG = config.database
AI_CONFIG = config.ai
CLOUD_CONFIG = config.cloud
SECURITY_CONFIG = config.security
EMAIL_CONFIG = config.email
ANALYTICS_CONFIG = config.analytics
FEATURE_FLAGS = config.features
MEDICAL_API_CONFIG = config.medical_apis