import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ImageBackground,
	TextInput,
	Platform,
	KeyboardAvoidingView,
	Keyboard,
	TouchableWithoutFeedback,
	Alert
} from "react-native";
import { useDispatch } from "react-redux";
import { authSignInUser } from "../../redux/auth/authOperations";


const initialState = {
	email: "",
	password: "",
};


const LoginScreen = ({ navigation }) => {
	const [isShowKeyboard, setIsShowKeyboard] = useState(false);
	const [iasReady, setIasReady] = useState(false);
	const [state, setState] = useState(initialState);
	const [secureTextEntry, setSecureTextEntry] = useState(true);

	const dispatch = useDispatch();

	const hasAllProperties = state.email &&
		state.password

	const keyboardHide = () => {
		setIsShowKeyboard(false);
		Keyboard.dismiss();
	};


	const handleSubmit = () => {
		if (hasAllProperties) {
			dispatch(authSignInUser(state))
			setState(initialState);
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
							<View style={styles.header}>
								<Text style={styles.headerTitle}>Войти</Text>
							</View>
							<View style={{ marginTop: 33 }}>
								<TextInput
									style={styles.input}
									textAlign={"left"}
									onFocus={() => setIsShowKeyboard(true)}
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
									onFocus={() => setIsShowKeyboard(true)}
									value={state.password}
									onChangeText={(value) =>
										setState((prevState) => ({ ...prevState, password: value }))
									}
									placeholder="Пароль"
									onSubmitEditing={keyboardHide}
								/>
								<View style={styles.show}>
									<Text onPress={() => setSecureTextEntry((prevState) => (!prevState))}>Показать</Text>
								</View>
							</View>
							<TouchableOpacity
								activeOpacity={0.8}
								style={styles.btn}
								onPress={() => {
									handleSubmit()
									keyboardHide();
								}}
							>
								<Text style={styles.btnReg}>Зарегистрироваться</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.6}
								style={styles.entry}
								onPress={() => navigation.navigate('Registration')}
							>
								<Text style={styles.btnEntry}>Нет аккаунта? Зарегистрироваться</Text>
							</TouchableOpacity>
						</View>
					</KeyboardAvoidingView>
				</ImageBackground >
			</View >
		</TouchableWithoutFeedback>
	)
}
export default LoginScreen;


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	image: {
		flex: 1,
		justifyContent: "flex-end"
	},
	wrapper: {
		height: 489,
		backgroundColor: "#FFFFFF",
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		justifyContent: "flex-end",
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
		color: "#212121",
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
		color: "#FFFFFF",
		fontSize: 16,
		fontFamily: "Roboto-Regular",
	},
	btnEntry: {
		alignItems: "center",
		marginTop: 16,
		color: "#1B4371",
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
	avatar: {
		backgroundColor: "#F6F6F6",
		width: 120,
		height: 120,
		borderRadius: 16,
		overflow: "hidden",
		position: 'absolute',
		top: -120 / 2,
		left: "50%",
		transform: [{ translateX: -120 / 2 }],
	},
	logo: {
		position: "absolute",
		top: 81 - 6,
		left: 107 - 6,
		zIndex: 25,
		marginBottom: 14,
		width: 25,
		height: 25,
	},

});
