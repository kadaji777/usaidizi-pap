import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface PhotoUploadProps {
    onPhotosChange: (photos: string[]) => void;
    existingPhotos?: string[];
    maxPhotos?: number;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
    onPhotosChange, 
    existingPhotos = [], 
    maxPhotos = 5 
}) => {
    const [photos, setPhotos] = useState<string[]>(existingPhotos);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newPhotos: string[] = [];

        for (let i = 0; i < Math.min(files.length, maxPhotos - photos.length); i++) {
            const file = files[i];
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} is too large (max 5MB)`);
                continue;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                newPhotos.push(reader.result as string);
                if (newPhotos.length === Math.min(files.length, maxPhotos - photos.length)) {
                    const updatedPhotos = [...photos, ...newPhotos];
                    setPhotos(updatedPhotos);
                    onPhotosChange(updatedPhotos);
                    toast.success(`${newPhotos.length} photo(s) added`);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = (index: number) => {
        const updatedPhotos = photos.filter((_, i) => i !== index);
        setPhotos(updatedPhotos);
        onPhotosChange(updatedPhotos);
        toast.success('Photo removed');
    };

    return (
        <div className="mb-3">
            <label className="form-label">Photos (Max {maxPhotos})</label>
            <input
                type="file"
                className="form-control mb-2"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={photos.length >= maxPhotos}
            />
            {photos.length > 0 && (
                <div className="row g-2 mt-2">
                    {photos.map((photo, index) => (
                        <div key={index} className="col-4">
                            <div className="position-relative">
                                <img
                                    src={photo}
                                    alt={`Photo ${index + 1}`}
                                    className="img-fluid rounded"
                                    style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                                    style={{ width: '24px', height: '24px', padding: '0', fontSize: '12px' }}
                                    onClick={() => removePhoto(index)}
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <small className="text-muted">Upload JPG or PNG (max 5MB each)</small>
        </div>
    );
};

export default PhotoUpload;