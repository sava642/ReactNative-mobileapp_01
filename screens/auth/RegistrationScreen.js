import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	ImageBackground,
	Platform,
	KeyboardAvoidingView,
	Keyboard,
	TouchableWithoutFeedback,
	Alert
} from "react-native";
import * as ImagePicker from 'expo-image-picker';

import { useDispatch } from "react-redux";
import { authSignUpUser } from "../../redux/auth/authOperations";

import Xcircle from "../../assets/svg/xcircle.svg";
import Logo from "../../assets/svg/addorange.svg";

const initialState = {
	email: "",
	password: "",
	login: "",
	photoURL: "",
};


const RegistrationScreen = ({ navigation }) => {
	const [isShowKeyboard, setIsShowKeyboard] = useState(true);
	const [state, setState] = useState(initialState);
	const [active, setActive] = useState(false);
	const [secureTextEntry, setSecureTextEntry] = useState(true);
	const [image, setImage] = useState(null);
	const [email, setEmail] = useState('');


	const hasAllProperties = state.email &&
		state.password &&
		state.login &&
		state.photoURL

	const dispatch = useDispatch();

	const keyboardHide = () => {
		setIsShowKeyboard(true);
		Keyboard.dismiss();
	};




	const handleSubmit = () => {

		if (hasAllProperties) {
			dispatch(authSignUpUser(state));
			setState(initialState);
			setImage(null);
			setActive(false);
		} else {
			Alert.alert(
				"Внимание",
				"Вы заполнили не все поля для регистрации",
				[
					{ text: "Я буду внимательнее", onPress: () => console.log("OK Pressed") }
				]
			);
		}
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
				setImage(result.assets[0].uri);
				setState((prevState) => ({ ...prevState, photoURL: result.assets[0].uri }))
				setActive(true)
			}
		} catch (error) {
			Alert.alert(
				"Ошибка запроса",
				"error",
				[
					{ text: "Ok", onPress: () => console.log("OK Pressed") }
				]
			);
		}
	};
	const deleteFoto = () => {
		setImage(null);
		setActive(false)
	}

	return (
		<TouchableWithoutFeedback onPress={keyboardHide}>
			<View style={styles.container}>
				<ImageBackground
					source={require("../../assets/images/photoBG.jpg")}
					resizeMode="cover"
					style={styles.image}
				>
					<KeyboardAvoidingView
						behavior={Platform.OS == "ios" ? "padding" : "null"}
					>
						<View style={styles.wrapper}>
							{isShowKeyboard && <View style={styles.avaBox}>
								<View style={styles.avatar}>
									<Image source={{ uri: image }} style={styles.foto} />
								</View>
								{active ?
									<Xcircle onPress={deleteFoto} style={styles.logo} /> :
									<Logo onPress={pickImage} style={styles.logo} />
								}
							</View>}
							<View style={styles.header}>
								<Text style={styles.headerTitle}>Регистрация</Text>
							</View>


							<View style={{ marginTop: 33 }}>
								<TextInput
									style={styles.input}
									textAlign={"left"}
									onFocus={() => setIsShowKeyboard(false)}
									value={state.login}
									onChangeText={(value) =>
										setState((prevState) => ({ ...prevState, login: value }))
									}
									placeholder="Логин"
									onSubmitEditing={keyboardHide}
								/>
							</View>
							<View style={{ marginTop: 16 }}>
								<TextInput
									style={styles.input}
									textAlign={"left"}
									onFocus={() => setIsShowKeyboard(false)}
									value={state.email}
									onChangeText={(value) =>
										setState((prevState) => ({ ...prevState, email: value }))
									}
									placeholder="Адрес электронной почты"
									onSubmitEditing={keyboardHide}
								/>
							</View>
							<View style={{ position: "relative", marginTop: 16 }}>
								<TextInput
									style={styles.input}
									textAlign={"left"}
									secureTextEntry={secureTextEntry}
									onFocus={() => setIsShowKeyboard(false)}
									value={state.password}
									onChangeText={(value) =>
										setState((prevState) => ({ ...prevState, password: value }))
									}
									placeholder="Пароль"
									xsonSubmitEditing={keyboardHide}
									minLength={8}
								/>
								<View style={styles.show}>
									<Text onPress={() => setSecureTextEntry((prevState) => (!prevState))}>Показать</Text>
								</View>
							</View>
							<TouchableOpacity
								activeOpacity={0.8}
								style={styles.btn}
								onPress={() => {
									handleSubmit();
									keyboardHide();
								}}
							>
								<Text style={styles.btnReg}>Зарегистрироваться</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.6}
								style={styles.entry}
								onPress={() => navigation.navigate('Login')}
							>
								<Text style={styles.btnEntry}>Уже есть аккаунт? Войти</Text>
							</TouchableOpacity>
						</View>
					</KeyboardAvoidingView>
				</ImageBackground >
			</View >
		</TouchableWithoutFeedback>
	)
}
export default RegistrationScreen;


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	image: {
		flex: 1,
		justifyContent: "flex-end"
	},
	wrapper: {
		height: 549,
		backgroundColor: "#FFFFFF",
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		justifyContent: "flex-end",
		position: "relative",
	},
	input: {
		borderWidth: 1,
		borderColor: "#E8E8E8",
		height: 50,
		borderRadius: 6,
		backgroundColor: "#F6F6F6",
		color: "#212121",
		padding: 16,
		marginHorizontal: 16,
	},
	inputTitle: {
		color: Platform.OS === "ios" ? "#212121" : "#212121",
		fontSize: 30,
		fontFamily: "Roboto-Regular",
	},
	btn: {
		borderRadius: 100,
		height: 51,
		marginTop: 40,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 16,
		...Platform.select({
			ios: {
				backgroundColor: "#FF6C00",
				borderColor: "#f0f8ff",
			},
			android: {
				backgroundColor: "#FF6C00",
				borderColor: "transparent",
			},
		}),
	},
	btnReg: {
		color: Platform.OS === "ios" ? "#FFFFFF" : "#FFFFFF",
		fontSize: 16,
		fontFamily: "Roboto-Regular",
	},
	btnEntry: {
		alignItems: "center",
		marginTop: 16,
		color: Platform.OS === "ios" ? "#1B4371" : "#1B4371",
		fontSize: 16,
		fontFamily: "Roboto-Regular",
	},
	header: {
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 40,
		color: "#212121",
		fontFamily: "Roboto-Regular",
	},
	entry: {
		alignItems: "center",
		marginBottom: 78,
	},
	show: {
		padding: 6,
		position: 'absolute',
		top: 10,
		right: 25,
	},
	foto: {
		width: "100%",
		height: "100%",
	},
	avaBox: {
		position: "absolute",
		top: -120 / 2,
		left: "50%",
		transform: [{ translateX: -120 / 2 }],
	},
	avatar: {
		// marginRight: 'auto',
		// marginLeft: 'auto',

		backgroundColor: "#F6F6F6",
		width: 120,
		height: 120,
		borderRadius: 16,
		overflow: "hidden",
	},
	logo: {
		position: "absolute",
		top: 75,
		left: 105,
		zIndex: 25,
		marginBottom: 14,
		width: 30,
		height: 30,
	},
});
