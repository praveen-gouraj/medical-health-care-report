import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import axios from 'axios';

const FileUploader = ({ onAnalysisComplete, onAnalysisStart, loading, darkMode = false }) => {
  const [uploadError, setUploadError] = useState(null);
  const [gender, setGender] = useState('general');

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploadError(null);
    onAnalysisStart();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('gender', gender);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onAnalysisComplete(response.data);
      } else {
        setUploadError(response.data.error || 'Failed to analyze the file');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to upload and analyze the file';
      setUploadError(errorMessage);
      onAnalysisComplete(null);
    }
  }, [gender, onAnalysisComplete, onAnalysisStart]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxSize: 16 * 1024 * 1024, // 16MB
    multiple: false,
    disabled: loading
  });

  const tryDemo = async () => {
    setUploadError(null);
    onAnalysisStart();

    try {
      const response = await axios.get('/api/demo-analysis');
      
      if (response.data.success) {
        onAnalysisComplete(response.data);
      } else {
        setUploadError('Failed to load demo analysis');
      }
    } catch (error) {
      setUploadError('Failed to load demo analysis');
      onAnalysisComplete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Gender Selection */}
      <div className="flex items-center space-x-4">
        <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Gender (for accurate reference ranges):
        </label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className={`border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode 
              ? 'border-gray-600 bg-gray-700 text-white' 
              : 'border-gray-300 bg-white text-gray-900'
          }`}
          disabled={loading}
        >
          <option value="general">General</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <Upload className="h-8 w-8 text-blue-600" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Drop your medical report here' : 'Upload Medical Report'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Drag and drop your PDF or TXT file, or click to browse
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <FileText className="h-4 w-4" />
            <span>Supports PDF and TXT files up to 16MB</span>
          </div>
        </div>
      </div>

      {/* File Rejection Errors */}
      {fileRejections.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">File Upload Error</p>
              {fileRejections.map(({ file, errors }) => (
                <div key={file.path}>
                  <p>File: {file.path}</p>
                  <ul className="list-disc list-inside ml-2">
                    {errors.map((error) => (
                      <li key={error.code}>
                        {error.code === 'file-too-large' && 'File is too large (max 16MB)'}
                        {error.code === 'file-invalid-type' && 'Only PDF and TXT files are allowed'}
                        {error.code === 'too-many-files' && 'Only one file can be uploaded at a time'}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Analysis Error</p>
              <p>{uploadError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Demo Button */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">
          Don't have a medical report? Try our demo with sample data:
        </p>
        <button
          onClick={tryDemo}
          disabled={loading}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Try Demo Analysis
        </button>
      </div>

      {/* Supported Tests Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Supported Test Types:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
          <div>• Complete Blood Count (CBC)</div>
          <div>• Lipid Profile</div>
          <div>• Basic Metabolic Panel</div>
          <div>• Thyroid Function Tests</div>
          <div>• Liver Function Tests</div>
          <div>• And many more...</div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;