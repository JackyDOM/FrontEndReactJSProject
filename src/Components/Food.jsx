import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function Food() {
  const [foodName, setFoodName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [image, setImage] = useState(null);
  const [entries, setEntries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/provinces');
        setProvinces(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProvinces();

    // Load provinces from localStorage
    const storedFoods = localStorage.getItem('foods');
    if (storedFoods) {
      setEntries(JSON.parse(storedFoods));
    }
  }, []);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set image as Data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Form validation
    if (!foodName || !ingredients || !description || !location || !selectedProvince || !image) {
      setErrorMessage('You need to fill all fields and upload an image first!');
      return;
    }

    const selectedProvinceObj = provinces.find(province => province.provinceName === selectedProvince);

    // Use image directly from state
    const newFood = {
      foodName,
      foodDescription: description,
      foodIngredient: ingredients,
      foodLocation: location,
      province: selectedProvinceObj,
      foodImageName: fileInputRef.current.files[0]?.name, // Safely access file name
      foodImageType: fileInputRef.current.files[0]?.type, // Safely access file type
      foodImageData: image.split(',')[1], // Image data as base64
    };

    try {
      const response = await axios.post('http://localhost:8080/api/food', newFood);
      const addedFood = response.data;
      setEntries(prevEntries => {
        const updatedEntries = [...prevEntries, addedFood];
        localStorage.setItem('foods', JSON.stringify(updatedEntries));
        return updatedEntries;
      });
      resetForm();
    } catch (error) {
      console.error('Error creating Food:', error);
      setErrorMessage('Failed to create Food. Please try again.');
    }
  };

  const resetForm = () => {
    setFoodName('');
    setDescription('');
    setIngredients('');
    setLocation('');
    setImage(null); // Set image back to null
    setSelectedProvince('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/food/${id}`) // Adjusted to the correct endpoint
      .then(() => {
        setEntries(prevEntries => {
          // const updatedEntries = prevEntries.filter((_, i) => i !== id); // Correct filter logic
          const updatedEntries = prevEntries.filter(entry => entry.id !== id); // Correct filter logic
          localStorage.setItem('foods', JSON.stringify(updatedEntries));
          return updatedEntries;
        });
      })
      .catch(error => {
        console.error('Error deleting food:', error);
      });
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Food Section</h2>

      {/* Input for Food Name */}
      <div className="mb-4">
        <label htmlFor="foodName" className="block text-gray-700 font-bold mb-2">
          Food Name:
        </label>
        <input
          type="text"
          id="foodName"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter food name"
        />
      </div>

      {/* Input for Ingredients */}
      <div className="mb-4">
        <label htmlFor="ingredients" className="block text-gray-700 font-bold mb-2">
          Ingredients:
        </label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter ingredients"
        />
      </div>

      {/* Input for Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
          Description:
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description"
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

      {/* Dropdown for Province Selection */}
      <div className="mb-4">
        <label htmlFor="province" className="block text-gray-700 font-bold mb-2">
          Select Province:
        </label>
        <select
          id="province"
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a province</option>
          {provinces.map((province, index) => (
            <option key={index} value={province.provinceName}>
              {province.provinceName}
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
          ref={fileInputRef} // Attach ref to input
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error Message */}
      {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}

      {/* Submit Button */}
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Submit
      </button>

      {/* Display Submitted Entries */}
      <div className="mt-4">
        {entries.map((entry, index) => (
          <div key={index} className="border border-blue-300 p-4 mb-4 rounded-md">
            <h3 className="text-lg font-bold">Submitted Information:</h3>
            <p className="text-gray-700">Food Name: {entry.foodName}</p>
            <p className="text-gray-700">Description: {entry.foodDescription}</p>
            <p className="text-gray-700">Ingredients: {entry.foodIngredient}</p>
            <p className="text-gray-700">Location: {entry.foodLocation}</p>
            <p className="text-gray-700">Province: {entry.province.provinceName}</p>
            <img src={`data:${entry.foodImageType};base64,${entry.foodImageData}`} alt={entry.foodName} className="w-32 h-32 object-cover mt-2" />
            <button onClick={() => handleDelete(entry.id)} className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 mt-2">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Food;
