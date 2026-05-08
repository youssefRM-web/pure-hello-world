import { useReducer, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import ProductContext from './product-context';

import { getProductBySlug } from 'db/mockData';

const initialState = {
  productIsReady: false,
  selectedProduct: null,
  selectedVariant: null,
  selectedSkuId: '',
  selectedSize: '',
  singleSize: null,
};

const productReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'CLEAR_PRODUCT':
      return { ...initialState };
    case 'SET_PRODUCT':
      return {
        ...state,
        productIsReady: true,
        selectedProduct: payload.product,
        selectedVariant: payload.variant,
      };
    case 'SELECT_VARIANT':
      return {
        ...state,
        selectedVariant: payload,
        selectedSkuId: '',
        selectedSize: '',
      };
    case 'SELECT_SIZE':
      return {
        ...state,
        selectedSkuId: payload.skuId,
        selectedSize: payload.value,
      };
    case 'SINGLE_SIZE':
      return {
        ...state,
        singleSize: { quantity: payload.quantity },
        selectedSkuId: payload.selectedSkuId,
      };
    default:
      return state;
  }
};

const ProductProvider = ({ children }) => {
  const { id: slugId } = useParams();
  const { pathname, state: slugState } = useLocation();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(productReducer, initialState);

  useEffect(() => {
    if (slugState) {
      navigate({ pathname, state: null });
      return;
    }
    if (state.productIsReady) {
      dispatch({ type: 'CLEAR_PRODUCT' });
    }

    const slugArr = (slugId || '').split('-');
    const selectedColor = slugArr.pop();
    const formattedSlug = slugArr.join('-');

    const product = getProductBySlug(formattedSlug);
    if (!product) {
      dispatch({ type: 'SET_PRODUCT', payload: { product: null, variant: null } });
      return;
    }
    const variant = product.variants.find((v) => v.color === selectedColor) || product.variants[0];
    if (!variant) {
      dispatch({ type: 'SET_PRODUCT', payload: { product: null, variant: null } });
      return;
    }

    if (variant.sizes.length === 1) {
      dispatch({
        type: 'SINGLE_SIZE',
        payload: {
          selectedSkuId: variant.skus[0].skuId,
          quantity: variant.skus[0].quantity,
        },
      });
    }

    dispatch({ type: 'SET_PRODUCT', payload: { product, variant } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugId, slugState]);

  return (
    <ProductContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;