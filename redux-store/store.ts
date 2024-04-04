import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginLogic, logoutLogic, profileLogic } from "./slices/auth/logic";
import { assignmentsLogic } from "./slices/assignments/logic";
import { attendanceLogic } from "./slices/attendance/logic";
import assignmentsReducer from "./slices/assignments";
import attendanceSlice from "./slices/attendance";
import { createLogicMiddleware } from "redux-logic";

const RootReducer = combineReducers({
  auth: authReducer,
  assignments: assignmentsReducer,
  attendances: attendanceSlice,
});

const persistConfig: PersistConfig<any> = {
  key: "root", // key is required
  storage: AsyncStorage, // AsyncStorage as storage
  whitelist: ["auth", "attendances", "assignments"], // which reducer want to persist
};

const logicDependencies = {}; // optional, for logic only

const logicArray = [
  loginLogic,
  logoutLogic,
  profileLogic,
  assignmentsLogic,
  attendanceLogic,
]; // optional, for logic only

const logicMiddleware = createLogicMiddleware(logicArray, logicDependencies); // optional, for logic only

const persistedReducer = persistReducer(persistConfig, RootReducer); // create a persisted reducer

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logicMiddleware),
});

store.subscribe(() => {
  // console.log(JSON.stringify(store.getState().attendances, null, 2));
});

export type RootState = ReturnType<typeof store.getState>;

export default store;

export const persistor = persistStore(store); // used to create the persisted store, persistor will be used in the next step
