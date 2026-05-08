import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import {
  getProductById,
  removeProduct,
  upsertProduct,
} from 'db/mockData';

// Firebase removed. Admin operations work against the in-memory mock catalog.
export const useAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFiles = async (_directory, { currentFiles, newFiles }) => {
    setError(null);
    try {
      const updated = [...currentFiles];
      for (const file of newFiles) {
        if (!file.type?.match('image.*')) continue;
        const exists = currentFiles.find((img) => img.name === file.name);
        if (exists) continue;
        const src = URL.createObjectURL(file);
        updated.push({ id: uuid(), name: file.name, src });
      }
      return updated;
    } catch (err) {
      setError(err);
    }
  };

  const deleteFile = (_directory, _file) => {
    // No-op without remote storage.
  };

  const getProduct = async (productId) => {
    setError(null);
    setIsLoading(true);
    try {
      const product = getProductById(productId);
      setIsLoading(false);
      return product ? { ...product, id: product.productId } : null;
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  const createProduct = async ({ productData, variants }) => {
    setError(null);
    setIsLoading(true);
    try {
      const productId = `p-${uuid()}`;
      upsertProduct({
        productId,
        id: productId,
        ...productData,
        variants: variants || [],
        createdAt: new Date(),
      });
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  const editProduct = async ({ productData, variants }) => {
    setError(null);
    setIsLoading(true);
    try {
      const existing = getProductById(productData.id);
      upsertProduct({
        ...(existing || {}),
        ...productData,
        productId: productData.id,
        variants: variants || existing?.variants || [],
      });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(err);
      setIsLoading(false);
    }
  };

  const deleteVariant = async ({ productId, variantId }) => {
    setError(null);
    setIsLoading(true);
    try {
      const product = getProductById(productId);
      if (!product) return;
      product.variants = product.variants.filter((v) => v.variantId !== variantId);
      if (product.variants.length === 0) removeProduct(productId);
      else upsertProduct(product);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(err);
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    setError(null);
    setIsLoading(true);
    try {
      removeProduct(productId);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(err);
      setIsLoading(false);
    }
  };

  return {
    uploadFiles,
    deleteFile,
    createProduct,
    editProduct,
    deleteVariant,
    deleteProduct,
    getProduct,
    isLoading,
    error,
  };
};