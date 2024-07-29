import React from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';

interface Image {
  id: number;
  image: string;
}

interface ImagesProps {
  images: Image[];
  isEditing: boolean;
  onEdit: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: (imageId: number) => void;
  onCancel: () => void;
  onSave: () => void;
}

const ImagesSection: React.FC<ImagesProps> = ({
  images,
  isEditing,
  onEdit,
  onImageUpload,
  onDeleteImage,
  onCancel,
  onSave,
}) => {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Images</h3>
        <button onClick={onEdit} className="text-blue-500 hover:text-blue-600">
          <MdAdd size={24} />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative aspect-w-16 aspect-h-9">
            <img
              src={image.image}
              alt={`Property Image ${image.id}`}
              className="object-cover rounded-lg shadow-md"
            />
            {isEditing && (
              <button
                onClick={() => onDeleteImage(image.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-150 ease-in-out"
              >
                <MdDelete size={20} />
              </button>
            )}
          </div>
        ))}
      </div>
      {isEditing && (
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-150 ease-in-out"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 ease-in-out"
            >
              Upload Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesSection;