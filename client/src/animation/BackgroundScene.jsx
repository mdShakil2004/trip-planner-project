// BackgroundScene.jsx
import React from 'react';
import './BackgroundScan.css';

const BackgroundScene = () => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Stars Layer */}
      <div className="absolute inset-0 z-0 bg-black bg-stars" />

      {/* Twinkling Layer */}
      <div className="absolute top-0 bottom-0 right-0 z-[2] animate-twinkle bg-twinkling" />

      {/* Clouds Layer */}
      <div className="absolute top-0 bottom-0 right-0 z-[3] animate-clouds bg-clouds" />
    </div>
  );
};

export default BackgroundScene;