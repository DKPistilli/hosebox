import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = (props) => {
  const [activeTab, setActiveTab] = useState(props.activeTab);
  
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  }
  
  const tabData = [
    { id: 'Inventory', label: 'Inventory', content: 'This is the content for Deck 1', link: '' },
    { id: 'Wishlist', label: 'Wishlist', content: 'This is the content for Deck 2', link:  '' },
    { id: 'Decks', label: 'Decks', content: 'This is the content for Deck 3', link: '' }
  ];
  
  const mapTabs = (tab) => {
    return (
        <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
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