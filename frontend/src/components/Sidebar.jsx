import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = (props) => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(props.activeTab);

  const { user } = useSelector((state) => state.auth);
    
  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.link);
  }
  
  const tabData = [
    { id: 'Inventory', label: 'Inventory', link: `/inventories/${user._id}`, },
    { id: 'Wishlist',  label: 'Wishlist',  link: `/wishlists/${user._id}`,   },
    { id: 'Decks',     label: 'Decks',     link: '', content: 'Content for Decks',}
  ];
  
  const mapTabs = (tab) => {
    return (
        <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
        >
            {tab.label}
        </button>
    );
  }

  return (
    <div className="sidebar">
      <div className="tab-bar">
        {tabData.map(mapTabs)}
      </div>
    </div>
  );
};

export default Sidebar;