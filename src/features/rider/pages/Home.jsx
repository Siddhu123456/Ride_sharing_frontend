import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../components/LocationPicker';
import FareDiscovery from '../components/FareDiscovery';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('location'); // 'location' or 'fare'

  const handleLocationsSet = () => {
    setStep('fare');
  };

  return (
    <div className="home-page">
      {step === 'location' && (
        <LocationPicker onLocationsSet={handleLocationsSet} />
      )}
      {step === 'fare' && <FareDiscovery />}
    </div>
  );
};

export default Home;