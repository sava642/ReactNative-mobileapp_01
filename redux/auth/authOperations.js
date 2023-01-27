import db from "../../firebase/config";
import { authSlice } from "./authReducer";
import { Alert } from "react-native";



const { updateUserProfile, authStateChange, authSignOut } = authSlice.actions;

export const authSignUpUser = ({ email, password, login, photoURL }) => async (
	dispatch,
	getState
) => {
	const uniquePostId = Date.now().toString();
	let foto = photoURL
	let userEmail = email

	try {
		await db.auth().createUserWithEmailAndPassword(userEmail, password);

		const response = await fetch(foto);
		const file = await response.blob();
		const uniquePostId = Date.now().toString();
		await db.storage().ref(`avatarImage/${uniquePostId}`).put(file);

		const processedPhoto = await db
			.storage()
			.ref("avatarImage")
			.child(uniquePostId)
			.getDownloadURL();


		const user = await db.auth().currentUser;


		await user.updateProfile({
			displayName: login,
			photoURL: processedPhoto,
		});


		const { displayName, uid, photoURL, email } = db.auth().currentUser;

		const userUpdateProfile = {
			nickName: displayName,
			userId: uid,
			photoURL: photoURL,
			userEmail: email,
		};

		dispatch(authSlice.actions.updateUserProfile(userUpdateProfile));
	} catch (error) {

		Alert.alert(
			"Error",
			error.message,
			[
				{ text: "Ok", onPress: () => console.log("OK Pressed") }
			]
		);

	}
};

export const authSignInUser = ({ email, password }) => async () => {
	try {
		const user = await db.auth().signInWithEmailAndPassword(email, password);

		// if (user) {
		// 	console.log(user, "приходит ответ")
		// 	const userUpdateProfile = {
		// 		nickName: user.additionalUserInfo.displayName,
		// 		userId: user.additionalUserInfo.uid,
		// 		photoURL: user.additionalUserInfo.photoURL,
		// 	};
		// 	dispatch(updateUserProfile(userUpdateProfile));
		// 	dispatch(authStateChange({ stateChange: true }));

		// }
	} catch (error) {
		Alert.alert(
			"Error",
			error.message,
			[
				{ text: "Ok", onPress: () => console.log("OK Pressed") }
			]
		);

	}
};


export const authSignOutUser = () => async (dispatch, getState) => {
	await db.auth().signOut();
	dispatch(authSignOut());
};

export const authStateCahngeUser = () => async (dispatch, getState) => {
	console.log("next loading")
	db.auth().onAuthStateChanged((user) => {
		if (user) {
			console.log(user)
			const userUpdateProfile = {
				nickName: user.displayName,
				userId: user.uid,
				photoURL: user.photoURL,
				userEmail: user.email,
			};

			dispatch(authStateChange({ stateChange: true }));
			dispatch(updateUserProfile(userUpdateProfile));
		}
	});
};