import React, { useState, useRef } from 'react';

function Category({ onAddCategory }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [entries, setEntries] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

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

    // Call the onAddCategory prop to add the new category
    onAddCategory(name);

    setEntries([...entries, { name, image }]);
    setName('');
    setImage(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
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
          placeholder="Enter your name"
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
        {entries.map((entry, index) => (
          <div key={index} className="border border-red-300 p-4 mb-4 rounded-md">
            <h3 className="text-lg font-bold">Submitted Information:</h3>
            <p className="text-gray-700">Name: {entry.name}</p>
            {entry.image && <img src={entry.image} alt="Uploaded" className="mt-2 w-32 h-32 object-cover" />}
            <button onClick={() => handleDelete(index)} className="bg-red-500 mt-2 text-white px-4 py-2 rounded-md hover:bg-red-600">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;
