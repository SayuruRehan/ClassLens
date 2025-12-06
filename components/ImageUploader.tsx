import React, { useRef, useState } from 'react';
import { Upload, Camera, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUseCamera = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setIsCameraOpen(true);
      // Small delay to ensure video element is mounted
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 0);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Unable to access camera. Please ensure camera permissions are allowed.");
    }
  };

  const handleCloseCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
            onImageSelect(file);
            handleCloseCamera();
          }
        }, 'image/jpeg', 0.85);
      }
    }
  };

  const handleGalleryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {isCameraOpen ? (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={handleCloseCamera}
              className="text-white bg-gray-800/50 p-2 rounded-full hover:bg-gray-700 backdrop-blur-sm"
            >
              <X size={24} />
            </button>
          </div>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-8 w-full flex justify-center pb-safe">
             <button 
               onClick={handleCapture}
               className="w-20 h-20 bg-white/20 rounded-full border-4 border-white flex items-center justify-center shadow-lg active:scale-95 transition-transform backdrop-blur-sm"
             >
               <div className="w-16 h-16 bg-white rounded-full"></div>
             </button>
          </div>
        </div>
      ) : (
        <>
          <div 
            className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer p-8 text-center group relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Lesson Material</h3>
            <p className="text-gray-500 mb-6">
              Take a photo of a textbook, whiteboard, or worksheet.
            </p>
            
            {cameraError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                {cameraError}
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            <div className="flex justify-center gap-3 relative z-10">
                <button 
                  onClick={handleUseCamera}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 flex items-center gap-2 transition-colors active:scale-95"
                >
                    <Camera size={18} />
                    Use Camera
                </button>
                <span className="text-gray-400 self-center">or</span>
                <button 
                  onClick={handleGalleryClick}
                  className="bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors active:scale-95"
                >
                    <ImageIcon size={18} />
                    Gallery
                </button>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-800 text-sm mb-1">Works with Textbooks</h4>
                <p className="text-blue-600 text-xs">Snap a page to translate and quiz.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <h4 className="font-semibold text-green-800 text-sm mb-1">Works with Handwriting</h4>
                <p className="text-green-600 text-xs">Convert whiteboard notes to exercises.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};