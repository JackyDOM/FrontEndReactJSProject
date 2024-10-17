import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function Category({ onAddCategory }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [entries, setEntries] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setEntries(JSON.parse(storedCategories));
    } else {
      const fetchCategories = async () => {
        try {
          const response = await axios.get('/api/categories');
          const categories = Array.isArray(response.data) ? response.data : [];
          setEntries(categories);
          localStorage.setItem('categories', JSON.stringify(categories));
        } catch (error) {
          console.error('Error fetching categories:', error);
          setEntries([]);
        }
      };
      fetchCategories();
    }
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name || !image) {
      setErrorMessage('You should input a name and upload an image first!');
      return;
    }

    const newCategory = {
      name,
      imageName: fileInputRef.current.files[0].name,
      imageType: fileInputRef.current.files[0].type,
      imageData: image.split(',')[1]
    };

    axios.post('http://localhost:8080/api/categories', newCategory)
      .then(response => {
        const addedCategory = response.data;
        setEntries(prevEntries => {
          const updatedEntries = [...prevEntries, addedCategory];
          localStorage.setItem('categories', JSON.stringify(updatedEntries));
          return updatedEntries;
        });
        setName('');
        setImage(null);
        setErrorMessage('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onAddCategory(addedCategory);
      })
      .catch(error => {
        console.error('Error adding category:', error);
        setErrorMessage('Failed to add category');
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/categories/${id}`)
      .then(() => {
        setEntries(prevEntries => {
          const updatedEntries = prevEntries.filter(entry => entry.id !== id);
          localStorage.setItem('categories', JSON.stringify(updatedEntries));
          return updatedEntries;
        });
      })
      .catch(error => {
        console.error('Error deleting category:', error);
      });
  };

  return (
    <div className="p-4 bg-blue-100 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Category Section</h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter category name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Upload Image:
        </label>
        <input
          type="file"
          onChange={handleImageChange}
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
            <div key={index} className="border border-red-300 p-4 mb-4 rounded-md">
              <h3 className="text-lg font-bold">Submitted Information:</h3>
              <p className="text-gray-700">Name: {entry.name}</p>
              {entry.imageData && (
                <img
                  src={`data:${entry.imageType};base64,${entry.imageData}`}
                  alt="Uploaded"
                  className="mt-2 w-32 h-32 object-cover"
                />
              )}
              <button onClick={() => handleDelete(entry.id)} className="bg-red-500 mt-2 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </div>
    </div>
  );
}

export default Category;
