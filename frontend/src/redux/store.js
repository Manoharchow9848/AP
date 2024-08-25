import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer, { signoutSuccess } from './user/userSlice';
import themeReducer from './theme/themeSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Middleware to auto-logout after 10 minutes of inactivity
const inactivityMiddleware = (store) => {
  let timeoutId;

  const resetTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set the timeout to 10 minutes (600000 ms)
    timeoutId = setTimeout(() => {
      store.dispatch(signoutSuccess());
    }, 3600000);
  };

  return (next) => (action) => {
    // Reset the timeout for every user-related action
    const result = next(action);
    const { currentUser } = store.getState().user;

    if (currentUser) {
      resetTimeout();
    }

    return result;
  };
};

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(inactivityMiddleware),
});

export const persistor = persistStore(store);
