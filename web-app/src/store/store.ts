/* Библиотеки */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

/* Контекст */
import messageQueueReducer from "./reducers/MessageQueueSlice";
import userProfileReducer from "./reducers/user/UserProfileSlice";
import navigateReducer from "./reducers/NavigateReducer";
import authReducer from "./reducers/AuthSlice";
import adminReducer from "./reducers/admin/AdminSlice";
import bloggerReducer from "./reducers/blogger/BloggerSlice";
import userContentReducer from "./reducers/user/UserContentSlice";
import StoreConstants from "src/constants/store";
import countReloadReducer from "./reducers/CountReloadSlice";
import adminTransferTokenReducer from "./reducers/admin/TransferTokenSlice";
import adminUserReducer from "./reducers/admin/UserSlice";

/* Главный Reducer */
const rootReducer = combineReducers({
  authReducer,
  adminReducer,
  adminTransferTokenReducer,
  adminUserReducer,
  userContentReducer,
  messageQueueReducer,
  userProfileReducer,
  bloggerReducer,
  countReloadReducer,
});

// Конфигурация Persist
const persistConfig = {
  key: StoreConstants.mainStore,
  storage,
  blacklist: [
    "messageQueueReducer",
    "admin",
    "bloggerReducer",
    "userContentReducer",
    "adminTransferTokenReducer",
    "adminUserReducer"
  ],
};

// Создание Persist Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Конфигурирование общего хранилища
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const setupStore = () => {
  return store;
};

export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
