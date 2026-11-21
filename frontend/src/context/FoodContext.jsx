import { createContext, useContext, useState, useEffect } from 'react';
import { apiBrowseOffers } from '../utils/api';

const FoodContext = createContext(null);

export function FoodProvider({ children }) {
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    apiBrowseOffers({ page: 0, size: 3 })
      .then(data => setFeaturedOffers(data?.content || []))
      .catch(() => setFeaturedOffers([]))
      .finally(() => setFeaturedLoading(false));
  }, []);

  const refreshFeatured = () => {
    apiBrowseOffers({ page: 0, size: 3 })
      .then(data => setFeaturedOffers(data?.content || []))
      .catch(() => {});
  };

  return (
    <FoodContext.Provider value={{ featuredOffers, featuredLoading, refreshFeatured }}>
      {children}
    </FoodContext.Provider>
  );
}

export function useFood() {
  const ctx = useContext(FoodContext);
  if (!ctx) throw new Error('useFood must be used within FoodProvider');
  return ctx;
}
