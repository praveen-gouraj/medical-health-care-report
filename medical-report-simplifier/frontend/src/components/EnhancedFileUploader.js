import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Upload, 
  FileText, 
  Image, 
  CheckCircle, 
  AlertCircle, 
  X,
  User,
  Calendar,
  Sparkles
} from 'lucide-react';
import apiService from '../services/apiService';

const EnhancedFileUploader = ({ onAnalysisComplete, onAnalysisStart, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: ''
  });
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload PDF, TXT, JPG, or PNG files only');
      return;
    }

    // Validate file size (16MB limit)
    if (file.size > 16 * 1024 * 1024) {
      toast.error('File size must be less than 16MB');
      return;
    }

    setSelectedFile(file);
    toast.success(`File "${file.name}" selected successfully!`);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    onAnalysisStart();

    try {
      // Use the enhanced API service with smart analysis
      const result = await apiService.uploadFile(selectedFile, patientInfo);
      toast.dismiss();

      if (result.success) {
        // If we have text content, try to get AI-enhanced analysis
        if (result.text_content) {
          try {
            const enhancedResult = await apiService.smartAnalyze(result.text_content, patientInfo, true);
            
            // Merge the upload result with enhanced analysis
            const finalResult = {
              ...result,
              ...enhancedResult,
              original_analysis: result.analysis,
              ai_enhanced: true
            };
            
            onAnalysisComplete(finalResult);
            toast.success('🚀 AI-powered analysis completed successfully!');
          } catch (aiError) {
            console.warn('AI analysis failed, using basic result:', aiError);
            onAnalysisComplete(result);
            toast.success('Analysis completed successfully!');
          }
        } else {
          onAnalysisComplete(result);
          toast.success('Analysis completed successfully!');
        }
      } else {
        toast.error(result.error || 'Analysis failed');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Upload failed. Please try again.');
      console.error('Upload error:', error);
    }
  };

  const getFileIcon = (file) => {
    if (file.type === 'application/pdf') return FileText;
    if (file.type.startsWith('image/')) return Image;
    return FileText;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Patient Information Form */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-blue-200/50 dark:border-gray-600/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-600" />
          <span>Patient Information (Optional)</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Age
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                value={patientInfo.age}
                onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                placeholder="Enter age"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                min="0"
                max="120"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              value={patientInfo.gender}
              onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* File Upload Area */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
              : selectedFile
              ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <AnimatePresence mode="wait">
            {selectedFile ? (
              <motion.div
                key="selected"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4">
                    {React.createElement(getFileIcon(selectedFile), {
                      className: "h-12 w-12 text-green-600 dark:text-green-400"
                    })}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    File Selected
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {React.createElement(getFileIcon(selectedFile), {
                          className: "h-6 w-6 text-gray-600 dark:text-gray-400"
                        })}
                        <div className="text-left">
                          <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-center">
                  <div className={`rounded-full p-6 ${
                    dragActive 
                      ? 'bg-blue-100 dark:bg-blue-900/30' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  } transition-colors duration-300`}>
                    <Upload className={`h-12 w-12 ${
                      dragActive 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    } transition-colors duration-300`} />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Upload Your Medical Report
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Drag and drop your medical report here, or click to browse files
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {[
                      { type: 'PDF', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
                      { type: 'TXT', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
                      { type: 'JPG', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
                      { type: 'PNG', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' }
                    ].map((format) => (
                      <span key={format.type} className={`px-3 py-1 rounded-full text-xs font-medium ${format.color}`}>
                        {format.type}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Maximum file size: 16MB
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || loading}
          className={`
            relative px-8 py-4 rounded-2xl font-semibold text-white text-lg shadow-lg transform transition-all duration-200
            ${selectedFile && !loading
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl'
              : 'bg-gray-400 cursor-not-allowed'
            }
          `}
        >
          <div className="flex items-center space-x-3">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Analyze Report</span>
              </>
            )}
          </div>
        </button>
      </motion.div>

      {/* Information Cards */}
      <motion.div
        className="grid md:grid-cols-2 gap-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                What We Analyze
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Blood test results (CBC, Chemistry panel)</li>
                <li>• Lipid profiles and cholesterol levels</li>
                <li>• Thyroid function tests</li>
                <li>• Metabolic markers and more</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Privacy & Security
              </h4>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• Files are processed locally</li>
                <li>• No data stored permanently</li>
                <li>• Automatic file cleanup</li>
                <li>• HIPAA-compliant processing</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedFileUploader;