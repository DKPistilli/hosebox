import React, { useState } from 'react';
import { useNavigate }     from 'react-router-dom';

import Deckslist from './Deckslist';
import Spinner   from './Spinner';

import '../styles/Sidebar.css';

const Sidebar = (props) => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(props.activeTab);
  const owner = props.owner;
    
  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.link);
  }
  
  const tabData = [
    { id: 'Inventory', label: 'Inventory', link: `/inventories/${owner._id}`, },
    { id: 'Wishlist',  label: 'Wishlist',  link: `/wishlists/${owner._id}`,   },
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

  if (!owner) {
    return <Spinner />
  }

  return (
    <div className="sidebar">
      <div>
        <h2>Collections</h2>
      </div>
      <div className="tab-bar">
        {tabData.map(mapTabs)}
      </div>
      <div>
        <Deckslist ownerId={owner._id} />
      </div>
    </div>
  );
};

export default Sidebar;