import { useState } from 'react';

// Firebase removed. Mock data is already in src/db/mockData.js so seeding is a no-op.
export const useSeed = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState(null);

  const uploadProducts = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    setIsLoading(false);
  };

  return { uploadProducts, isLoading, error };
};