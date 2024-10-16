import React, { useState } from 'react';

function Province({ categories}) {
  const [provinceName, setProvinceName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [image, setImage] = useState(null); // State for the uploaded image
  const [entries, setEntries] = useState([]); // State to hold the submitted entries
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Create a URL for the uploaded image
    }
  };

  const handleSubmit = () => {
    if (!provinceName || !location || !selectedCategory || !image) {
      setErrorMessage('You should input a province name, location, select a category, and upload an image first!');
      return; // Prevent submission
    }

    // Add new entry to the entries array
    setEntries([...entries, { provinceName, location, selectedCategory, image }]);
    // Reset the inputs
    setProvinceName('');
    setLocation('');
    setSelectedCategory('');
    setImage(null); // Reset the image
    setErrorMessage(''); // Clear error message
  };

  const handleDelete = (index) => {
    // Remove entry at the specified index
    setEntries(entries.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Province Section</h2>

      {/* Input for Province Name */}
      <div className="mb-4">
        <label htmlFor="provinceName" className="block text-gray-700 font-bold mb-2">
          Province Name:
        </label>
        <input
          type="text"
          id="provinceName"
          value={provinceName}
          onChange={(e) => setProvinceName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter province name"
        />
      </div>

      {/* Input for Location */}
      <div className="mb-4">
        <label htmlFor="location" className="block text-gray-700 font-bold mb-2">
          Location:
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter location"
        />
      </div>

      {/* Dropdown for Category Selection */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
          Select Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select a Category --</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Image Upload Input */}
      <div className="mb-4">
        <label htmlFor="imageUpload" className="block text-gray-700 font-bold mb-2">
          Upload Image:
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 text-red-500">{errorMessage}</div>
      )}

      {/* Submit Button */}
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Submit
      </button>

      {/* Display Submitted Entries */}
      <div className="mt-4">
        {entries.map((entry, index) => (
          <div key={index} className="border border-blue-300 p-4 mb-4 rounded-md">
            <h3 className="text-lg font-bold">Submitted Information:</h3>
            <p className="text-gray-700">Province: {entry.provinceName}</p>
            <p className="text-gray-700">Location: {entry.location}</p>
            <p className="text-gray-700">Category: {entry.selectedCategory}</p>
            {entry.image && (
              <img src={entry.image} alt="Uploaded" className="mt-2 w-32 h-32 object-cover rounded" />
            )}
            <button onClick={() => handleDelete(index)} className="bg-red-500 mt-2 text-white px-4 py-2 rounded-md hover:bg-red-600">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Province;
