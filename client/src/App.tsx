import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CampaignDetails, CreateCampaign, Profile, Home } from './pages';
import { Sidebar, Navbar } from './components';

const App = () => {
  return (
    <div className="relative sm:p-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>
      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
