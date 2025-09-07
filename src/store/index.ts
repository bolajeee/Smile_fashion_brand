import { combineReducers, configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import cartReducer from "./reducers/cart";
import userReducer from "./reducers/user";

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

export const makeStore = () => {
  if (typeof window === "undefined") {
    return makeConfiguredStore();
  }

  // If it's on client side, create a store which will persist
  const persistConfig = {
    key: "shoppingcart",
    whitelist: ["cart", "user"],
    storage,
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  (store as { __persistor?: ReturnType<typeof persistStore> }).__persistor = persistStore(store);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);
