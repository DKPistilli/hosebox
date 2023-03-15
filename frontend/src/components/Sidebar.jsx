import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = (props) => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(props.activeTab);
  const { ownerId } = useParams();
    
  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.link);
  }
  
  const tabData = [
    { id: 'Inventory', label: 'Inventory', link: `/inventories/${ownerId}`, },
    { id: 'Wishlist',  label: 'Wishlist',  link: `/wishlists/${ownerId}`,   },
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