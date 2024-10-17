import React, { useState } from 'react';
import Category from '../Components/Category';
import Province from '../Components/Province';
import Food from '../Components/Food';

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);

  const handleAddCategory = (category) => {
    setCategories((prevCategories) => [...prevCategories, category]);
  };

  const handleAddProvince = (province) => {
    setProvinces((prevProvinces) => [...prevProvinces, province]);
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case 'Category':
        return <Category onAddCategory={handleAddCategory} />;
      case 'Province':
        return <Province categories={categories} />;
      case 'Food':
        return <Food provinces={provinces} />;
      default:
        return <p>Please select a category from the sidebar.</p>;
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Travel Dashboard</h2>
        <ul>
          {['Category', 'Province', 'Food'].map((category) => (
            <li
              key={category}
              className={`p-2 cursor-pointer ${selectedCategory === category ? 'bg-gray-600' : ''} hover:bg-gray-600`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 bg-gray-100 p-4">
        <h1 className="text-2xl font-bold">Dashboard Content</h1>
        <div className="mt-4 p-4 bg-white shadow rounded">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
