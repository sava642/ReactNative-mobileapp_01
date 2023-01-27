import { createSlice } from "@reduxjs/toolkit";

state = {
	nickName: null,
	userId: null,
	photoURL: null,
	stateChange: false,
	userEmail: null,
}


export const authSlice = createSlice({
	name: "auth",
	initialState: state,
	reducers: {
		updateUserProfile: (state, { payload }) => ({
			...state,
			nickName: payload.nickName,
			userId: payload.userId,
			photoURL: payload.photoURL,
			userEmail: payload.userEmail,
		}),
		addPhoto: (state, { payload }) => ({
			...state,
			photoURL: payload.newPhoto,
		}),
		authStateChange: (state, { payload }) => ({
			...state,
			stateChange: payload.stateChange,
		}),
		authSignOut: () => state,
	},
});