import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Province() {
  const [provinceName, setProvinceName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [image, setImage] = useState(null);
  const [entries, setEntries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null); // Reference for the file input

  // Fetch categories from backend on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();

    // Load provinces from localStorage
    const storedProvinces = localStorage.getItem('provinces');
    if (storedProvinces) {
      setEntries(JSON.parse(storedProvinces));
    }
  }, []);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 // Handle form submission
const handleSubmit = () => {
  if (!provinceName || !location || !selectedCategory || !image) {
    setErrorMessage('You should input a province name, location, select a category, and upload an image first!');
    return;
  }

  const selectedCategoryObj = categories.find(category => category.name === selectedCategory); // Find the category object

  const newProvince = {
    provinceName,
    location,
    category: selectedCategoryObj, // Pass the whole category object
    provinceImageName: fileInputRef.current.files[0].name,
    provinceImageType: fileInputRef.current.files[0].type,
    provinceImageData: image.split(',')[1],
  };

  axios.post('http://localhost:8080/api/provinces', newProvince)
    .then(response => {
      const addedProvince = response.data;
      setEntries(prevEntries => {
        const updatedEntries = [...prevEntries, addedProvince];
        localStorage.setItem('provinces', JSON.stringify(updatedEntries)); // Save to local storage
        return updatedEntries;
      });
      resetForm();
    })
    .catch(error => {
      console.error('Error creating province:', error);
      setErrorMessage('Failed to create province. Please try again.');
    });
};



  // Reset form fields
  const resetForm = () => {
    setProvinceName('');
    setLocation('');
    setSelectedCategory('');
    setImage(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle deletion of an entry
  const handleDelete = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    localStorage.setItem('provinces', JSON.stringify(updatedEntries)); // Update local storage
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Province Section</h2>

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
        />
      </div>

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
        />
      </div>

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
          <option value="">Select a category</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Upload Image:
        </label>
        <input
          type="file"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          accept="image/*"
        />
      </div>

      {errorMessage && (
        <div className="mb-4 text-red-500">{errorMessage}</div>
      )}

      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Submit
      </button>

      <div className="mt-4">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <div key={index} className="border border-gray-300 p-4 mb-4 rounded-md">
              <h3 className="text-lg font-bold">Submitted Information:</h3>
              <p className="text-gray-700">Province: {entry.provinceName}</p>
              <p className="text-gray-700">Location: {entry.location}</p>
              <p className="text-gray-700">Category: {entry.selectedCategory}</p>
              <img
                src={`data:${entry.provinceImageType};base64,${entry.provinceImageData}`}
                alt="Uploaded"
                className="mt-2 w-32 h-32 object-cover"
              />
              <button onClick={() => handleDelete(index)} className="bg-red-500 mt-2 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No provinces found.</p>
        )}
      </div>
    </div>
  );
}

export default Province;
