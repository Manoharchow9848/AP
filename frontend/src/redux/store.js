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

// Middleware to auto-signout after 3 seconds of inactivity
const autoSignoutMiddleware = (store) => {
  let timeoutId;

  const startSignoutTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set the timeout to 3 seconds (3000 ms) for this trail
    timeoutId = setTimeout(() => {
      store.dispatch(signoutSuccess());
    }, 3000000);
  };

  return (next) => (action) => {
    const result = next(action);

    // If there's a current user, start the timer to sign out after 3 seconds
    const { currentUser } = store.getState().user;
    if (currentUser) {
      startSignoutTimer();
    }

    return result;
  };
};

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(autoSignoutMiddleware),
});

export const persistor = persistStore(store);
