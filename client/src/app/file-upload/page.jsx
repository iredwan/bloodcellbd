'use client';

import { useState, useRef } from 'react';
import uploadFiles from '@/utils/fileUpload';

export default function FileUploadPage() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      setError('');
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await uploadFiles(files, {
        maxFiles: 20,
        onSuccess: (fileData) => {
          setUploadedFiles(prev => [...prev, ...fileData]);
          setFiles([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
        onError: (errorMsg) => {
          setError(errorMsg);
        }
      });
    } catch (err) {
      // Error is handled by onError callback
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const clearUploadedFiles = () => {
    setUploadedFiles([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">File Upload</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <div 
          ref={dropAreaRef}
          className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center ${
            isDragging ? 'border-primary bg-neutral-100' : 'border-neutral-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="text-neutral-600 mb-2">Drag and drop files here, or</p>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            ref={fileInputRef}
            id="fileInput"
          />
          <label 
            htmlFor="fileInput"
            className="button inline-block cursor-pointer"
          >
            Browse Files
          </label>
          <p className="text-sm text-neutral-500 mt-2">
            You can upload up to 20 files at once
          </p>
        </div>
        
        {files.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Selected Files ({files.length})</h3>
            <div className="max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border-b">
                  <div className="flex-1 truncate">
                    <p className="truncate">{file.name}</p>
                    <p className="text-xs text-neutral-500">{Math.round(file.size / 1024)} KB</p>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-primary hover:text-primary-dark ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <button
            onClick={handleUpload}
            disabled={isLoading || !files.length}
            className="button"
          >
            {isLoading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Uploaded Files ({uploadedFiles.length})</h2>
            <button 
              onClick={clearUploadedFiles}
              className="button-secondary text-sm"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center p-3 border rounded">
                <div className="flex-1">
                  <p className="font-medium">{file.originalname}</p>
                  <p className="text-sm text-gray-500">{Math.round(file.size / 1024)} KB</p>
                </div>
                <a 
                  href={process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') + file.url : 'http://localhost:5000' + file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 