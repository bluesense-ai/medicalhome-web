import React, { useState, useRef } from 'react';

interface ImageUploadDisplayProps {
  onImageUpload: (file: File) => void;
}

const ImageUploadDisplay: React.FC<ImageUploadDisplayProps> = ({ onImageUpload }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-shrink-0 flex flex-col items-center">
      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
        {uploadedImage ? (
          <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
        ) : (
          <img src="/Icons/file_upload.svg" alt="Upload" className="h-8 w-8 text-gray-400" />
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <button
        type="button"
        onClick={triggerFileInput}
        className="mt-2 w-full hover:bg-[#c4e6f5] border text-black px-2 py-1 rounded text-xs font-medium flex items-center justify-center"
      >
        <img src="/Icons/upload_file.svg" alt="Upload" className="w-4 h-4 mr-1" />
        Upload image
      </button>
    </div>
  );
};

export default ImageUploadDisplay;