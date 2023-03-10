import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = (props) => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(props.activeTab);
  
  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.link);
  }
  
  const tabData = [
    { id: 'Inventory', label: 'Inventory', link: '/inventory', },
    { id: 'Wishlist',  label: 'Wishlist',  link: '/wishlist', },
    { id: 'Decks',     label: 'Decks',     link: '', content: 'This is the content for Deck 3',}
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