import React, { createContext, useState, useContext } from 'react';

const ParcelContext = createContext();

export const useParcelContext = () => {
  const context = useContext(ParcelContext);
  if (!context) {
    throw new Error('useParcelContext debe usarse dentro de ParcelProvider');
  }
  return context;
};

export const ParcelProvider = ({ children }) => {
  const [parcels, setParcels] = useState([]);

  const addParcel = (parcelData) => {
    const newParcel = {
      ...parcelData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setParcels(prev => [...prev, newParcel]);
    return newParcel;
  };

  const deleteParcel = (id) => {
    setParcels(prev => prev.filter(p => p.id !== id));
  };

  const updateParcel = (id, updatedData) => {
    setParcels(prev => 
      prev.map(p => p.id === id ? { ...p, ...updatedData } : p)
    );
  };

  return (
    <ParcelContext.Provider value={{ 
      parcels, 
      addParcel, 
      deleteParcel, 
      updateParcel 
    }}>
      {children}
    </ParcelContext.Provider>
  );
};