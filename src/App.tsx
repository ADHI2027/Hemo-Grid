import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Banner from './components/Banner';
import Nav from './components/Nav';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import RecommendationDetail from './pages/RecommendationDetail';
import NetworkGraph from './pages/NetworkGraph';
import FacilityDetail from './pages/FacilityDetail';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface text-ink flex flex-col font-sans">
        {/* Persistent disclaimer banner on every page */}
        <Banner />

        {/* Global navigation bar */}
        <Nav />

        {/* Main application router content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/recommendations/:id" element={<RecommendationDetail />} />
            <Route path="/network" element={<NetworkGraph />} />
            <Route path="/facilities/:id" element={<FacilityDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
