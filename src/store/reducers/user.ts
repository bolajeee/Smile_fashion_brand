import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { remove } from "lodash";

type ProductType = {
  id: string;
  name: string;
  thumb: string;
  price: string;
  count: number;
  color: string;
  size: string;
};

type ToggleFavType = {
  id: string;
};

interface UserData {
  name: string;
  email?: string;
  role?: string;
  image?: string;
  phoneNumber?: string;
}

interface UserSliceTypes {
  user: UserData;
  favProducts: string[];
}

const initialState: UserSliceTypes = {
  user: {
    name: "Lucas Pulliese",
  },
  favProducts: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleFavProduct(state, action: PayloadAction<ToggleFavType>) {
      const index = state.favProducts.includes(action.payload.id);

      if (!index) {
        state.favProducts.push(action.payload.id);

        return;
      }

      remove(state.favProducts, (id) => id === action.payload.id);
    },
    setUserLogged(state, action: PayloadAction<ProductType>) {
      const index = state.favProducts.includes(action.payload.id);

      if (!index) {
        state.favProducts.push(action.payload.id);

        return {
          ...state,
          favProducts: state.favProducts,
        };
      }

      remove(state.favProducts, (id) => id === action.payload.id);

      return {
        ...state,
        favProducts: state.favProducts,
      };
    },
  },
});

export const { toggleFavProduct, setUserLogged } = userSlice.actions;
export default userSlice.reducer;
