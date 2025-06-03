import { configureStore } from "@reduxjs/toolkit";
import levelReducer from "../features/levelSlice"
import uiReducer from "../features/UISlice"


export const store = configureStore({
	reducer : {
		level : levelReducer,
		ui : uiReducer
	}
})

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch
// Same for the `RootState` type
export type RootState = ReturnType<typeof store.getState>