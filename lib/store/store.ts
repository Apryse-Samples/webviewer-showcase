
import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./reducers";

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
});

export default store;

export type AppStore  = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch