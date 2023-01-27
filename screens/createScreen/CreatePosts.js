import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import database from "../../firebase/config";
import { useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';

import CreateFoto from "../../assets/svg/createFoto.svg";
import Mappin from "../../assets/svg/mappin.svg";
import Clear from "../../assets/svg/trash.svg"


const initialState = {
	name: "",
	location: "",
	photo: "",
	longitude: 0,
	latitude: 0,
	nickName: "",
	userId: "",
	photoURL: "",
	uploadFoto: "",
};

const CreatePosts = ({ navigation }) => {


	//управление доступа к камере
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	//возможность переключения, в проекте не реализовано https://www.youtube.com/watch?v=9EoKurp6V0I
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
	//записываем данные, приходящие с камеры 
	const cameraRef = useRef(null);
	//сбор данных с импут
	//сохраняем абсолютный адрес к фото:
	const [state, setState] = useState(initialState);
	//локация
	const [errorMsg, setErrorMsg] = useState(null);
	const [isShowKeyboard, setIsShowKeyboard] = useState(true);

	const { userId, nickName, photoURL } = useSelector((state) => state.auth)


	useEffect(() => {

		(async () => {
			MediaLibrary.requestPermissionsAsync();
			const cameraStatus = await Camera.requestCameraPermissionsAsync();
			setHasCameraPermission(cameraStatus.status === 'granted');
		})();
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}
		})();

	}, []);

	if (errorMsg) {
		Alert.alert(
			'Ошибка',
			errorMsg,
			[
				{ text: 'OK', onPress: () => console.log('OK Pressed') },
			],
		);
	}
	const pickImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});
			if (result) {
				let pickedFoto = result.assets[0].uri
				const uploadedFoto = await uploadPhotoToServer(pickedFoto);
				if (uploadedFoto) {
					setState((prevState) => ({ ...prevState, uploadFoto: uploadedFoto }))
				} else {
					return null
				}
				setState((prevState) => ({ ...prevState, photo: pickedFoto }))
			}
		} catch (error) {
			Alert.alert(
				"Ошибка запроса",
				error.massege,
				[
					{ text: "Ok", onPress: () => console.log("OK Pressed") }
				]
			);
		}
	};
	const uploadPhotoToServer = async (foto) => {
		const response = await fetch(foto);
		const file = await response.blob();
		const uniquePostId = Date.now().toString();
		await database.storage().ref(`postImage/${uniquePostId}`).put(file);
		const processedPhoto = await database
			.storage()
			.ref("postImage")
			.child(uniquePostId)
			.getDownloadURL();
		return processedPhoto;
	};
	const uniquePostId = Date.now().toString();
	const uploadPostToServer = async () => {
		await database
			.firestore()
			.collection("posts")
			.add({ state, uniquePostId });
	}

	const publish = async () => {
		await uploadPostToServer();
		setState(initialState)
		setIsShowKeyboard(true)
		navigation.navigate('DefaultScreen')

	}
	const handleFoto = () => {
		setState((prevState) => ({ ...prevState, photo: "" }))
	}

	const takePicture = async () => {
		if (cameraRef) {
			try {
				const data = await cameraRef.current.takePictureAsync();
				const uploadedFoto = await uploadPhotoToServer(data.uri);
				const place = await Location.getCurrentPositionAsync({});

				setState((prevState) => ({
					...prevState,
					nickName: nickName,
					userId: userId,
					photoURL: photoURL,
					longitude: place.coords.longitude,
					latitude: place.coords.latitude,
					photo: data.uri,
					uploadFoto: uploadedFoto
				}))
			} catch (error) {
				console.log(error);
			}
		}
	};
	const keyboardHide = () => {
		setIsShowKeyboard(true);
		Keyboard.dismiss();
	};

	if (hasCameraPermission === false) {
		return <Text>No access to camera</Text>;
	}
	const disabled = state.name && state.location && state.photo

	const clrBack = disabled ? "#FF6C00" : "#F6F6F6"
	const clrTxt = disabled ? "#FFFFFF" : "#BDBDBD"

	return (
		<TouchableWithoutFeedback onPress={keyboardHide}>
			<View style={styles.container}>
				{true &&
					<View style={styles.cameraBox}>

						{!state.photo ?
							<Camera
								style={styles.camera}
								type={type}
								ref={cameraRef}
								flashMode={flash}>
								<TouchableOpacity onPress={takePicture} style={styles.camBtn}>
									<CreateFoto />
								</TouchableOpacity>
							</Camera>
							:
							<View style={styles.photoBox}>
								<Image source={{ uri: state.photo }} style={styles.photo} />
							</View>
						}
					</View>
				}

				{!state.photo ?
					<TouchableOpacity onPress={pickImage} >
						<Text style={styles.loding}>Загрузите фото</Text>
					</TouchableOpacity>
					:
					<TouchableOpacity onPress={handleFoto}>
						<Text style={styles.loding}>Изменить фото</Text>
					</TouchableOpacity>}

				<View style={{ marginTop: 33 }}>
					<TextInput
						style={styles.name}
						textAlign={"left"}
						onFocus={() => setIsShowKeyboard(false)}
						value={state.name}
						onChangeText={(value) =>
							setState((prevState) => ({ ...prevState, name: value }))
						}
						placeholder="Название..."
						onSubmitEditing={keyboardHide}
					/>
				</View>
				<View style={{ marginTop: 28 }}>
					<TextInput
						style={styles.location}
						textAlign={"left"}
						onFocus={() => setIsShowKeyboard(false)}
						value={state.location}
						onChangeText={(value) =>
							setState((prevState) => ({ ...prevState, location: value }))
						}
						placeholder="Местоположение..."
						onSubmitEditing={keyboardHide}
					/>
					<Mappin style={styles.logomap} />
				</View>
				<TouchableOpacity
					disabled={!disabled}
					onPress={publish}
					activeOpacity={0.6}
					style={{
						borderRadius: 100,
						height: 51,
						marginTop: 40,
						justifyContent: "center",
						alignItems: "center",
						marginHorizontal: 16,
						backgroundColor: clrBack,
					}}
				>
					<Text
						style={{
							fontSize: 16,
							fontFamily: "Roboto-Regular",
							lineHeight: 19, color: clrTxt
						}}>Опубликовать</Text>
				</TouchableOpacity>
				<View style={styles.clear} >
					<TouchableOpacity onPress={() => setState(initialState)}>
						<Clear />
					</TouchableOpacity>
				</View>

			</View >

		</TouchableWithoutFeedback >
	)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		//paddingTop: Constants.statusBarHeight,
		padding: 16,
		backgroundColor: "#FFFFFF",
	},
	cameraBox: {
		alignItems: 'center',
		width: "100%",
		height: 240,
		marginTop: 1,
		backgroundColor: "#F6F6F6",
		borderWidth: 1,
		borderColor: "#E8E8E8",
		borderRadius: 8,
		overflow: 'hidden',
	},
	photoBox: {
		width: "100%",
		height: 240,
		justifyContent: "center",
		alignItems: "center",

	},
	camera: {
		width: "100%",
		height: 240,
		justifyContent: "center",
		alignItems: "center",
	},
	camBtn: {
		opacity: 0.9,
		width: 60,
		height: 60,
	},
	photo: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	loding: {
		fontSize: 16,
		lineHeight: 19,
		color: "#BDBDBD",
		marginTop: 8,
	},
	name: {
		fontFamily: "Roboto-Regular",
		borderBottomColor: "#E8E8E8",
		borderBottomWidth: 1,
		fontSize: 16,
		lineHeight: 19,
		fontWeight: "500",
		color: '#212121',
		paddingBottom: 15,
		paddingTop: 15,
	},
	location: {
		borderBottomColor: "#E8E8E8",
		borderBottomWidth: 1,
		fontSize: 16,
		lineHeight: 19,
		fontFamily: "Roboto-Regular",
		color: '#212121',
		paddingBottom: 15,
		paddingTop: 15,
		paddingLeft: 30,
		position: 'relative',
	},
	logomap: {
		position: "absolute",
		top: 12,
		left: 2,
		width: 16,
		height: 18,
	},
	btn: {
		borderRadius: 100,
		height: 51,
		marginTop: 40,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 16,
	},
	btnReg: {
		fontSize: 16,
		fontFamily: "Roboto-Regular",
		lineHeight: 19,
	},
	clear: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: 'center',
		marginBottom: 22,
	}
});


export default CreatePosts
