import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { toggleFavProduct } from '@/store/reducers/user';

export function useFavorite(productId: string) {
  const dispatch = useDispatch();
  const favProducts = useSelector((state: RootState) => state.user.favProducts);
  const isFavorite = favProducts.includes(productId);

  const toggleFavorite = () => {
    dispatch(toggleFavProduct({ id: productId }));
  };

  return { isFavorite, toggleFavorite };
}
