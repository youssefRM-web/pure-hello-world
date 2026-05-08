import { useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';

import { getProductsByCollection } from 'db/mockData';
import { formatDiscountNumber } from 'helpers/format';

const PAGE_SIZE = 4;

const sortVariants = (variants, sortBy) => {
  const arr = [...variants];
  const dir = sortBy?.direction === 'desc' ? -1 : 1;
  const field = sortBy?.field || 'createdAt';
  arr.sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
  return arr;
};

const buildVariantRows = (products) => {
  const rows = [];
  for (const product of products) {
    const { price: actualPrice } = product;
    for (const variant of product.variants) {
      const currentPrice = variant.variantPrice ?? variant.price;
      rows.push({
        ...product,
        ...variant,
        id: uuid(),
        productId: product.productId,
        variantId: variant.variantId,
        price: currentPrice,
        actualPrice,
        slides: variant.slides,
        images: variant.images,
        skus: variant.skus,
        sizes: variant.sizes,
        availableQuantity: variant.availableQuantity,
        isSoldOut: variant.isSoldOut,
        numberOfVariants: product.variants.length,
        allVariants: product.variants,
        discount: formatDiscountNumber({ currentPrice, actualPrice }),
        createdAt: product.createdAt,
      });
    }
  }
  return rows;
};

export const useCollection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const offsetRef = useRef(0);

  const getCollection = async ({
    collectionName,
    isNewQuery = true,
    sortBy = { field: 'createdAt', direction: 'asc' },
  }) => {
    setIsLoading(true);
    try {
      if (isNewQuery) {
        offsetRef.current = 0;
        setHasMore(true);
      }
      const products = getProductsByCollection(collectionName);
      const rows = sortVariants(buildVariantRows(products), sortBy);

      const start = offsetRef.current;
      const end = start + PAGE_SIZE;
      const slice = rows.slice(start, end);
      offsetRef.current = end;
      if (end >= rows.length) setHasMore(false);

      await new Promise((r) => setTimeout(r, 50));
      setIsLoading(false);
      return slice;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      return [];
    }
  };

  return { getCollection, isLoading, hasMore, error };
};