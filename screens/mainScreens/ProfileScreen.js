import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, ImageBackground, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { authSignOutUser } from "../../redux/auth/authOperations";
import db from "../../firebase/config";
import * as ImagePicker from 'expo-image-picker';


import { authSlice } from "../../redux/auth/authReducer"




const { addPhoto } = authSlice.actions;

import LogOut from "../../assets/svg/log-out.svg";
import Xcircle from "../../assets/svg/xcircle.svg";
import Logo from "../../assets/svg/addorange.svg";
import Mappin from "../../assets/svg/mappin.svg";
import Shape from "../../assets/svg/shape.svg";
import FillShape from "../../assets/svg/fillshape.svg";

const ProfileScreen = ({ navigation }) => {
	const dispatch = useDispatch();
	const [userPosts, setUserPosts] = useState([]);
	const { userId, photoURL, nickName } = useSelector((state) => state.auth);
	const [active, setActive] = useState(true);
	const [image, setImage] = useState(null);

	useEffect(() => {
		getUserPosts();
		console.log(photoURL)
	}, [dispatch]);

	const getUserPosts = async () => {
		await db
			.firestore()
			.collection("posts")
			.onSnapshot((data) => {
				let array = (data.docs.map((doc) => ({ ...doc.data() })));
				if (array && userId) {
					let fiteredArray = array.filter((post) => post.state.userId === userId);
					setUserPosts(fiteredArray)
				}
				return null
			}
			);
	};

	const signOut = () => {
		dispatch(authSignOutUser());
	};


	const uploadPhotoToServer = async (foto) => {
		const response = await fetch(foto);
		const file = await response.blob();
		const uniquePostId = Date.now().toString();
		await db.storage().ref(`avatarImage/${uniquePostId}`).put(file);
		const processedPhoto = await db
			.storage()
			.ref("avatarImage")
			.child(uniquePostId)
			.getDownloadURL();
		return processedPhoto;
	};


	const pickImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});

			if (result.assets[0].uri) {
				const uploadedFoto = await uploadPhotoToServer(result.assets[0].uri)
				if (uploadedFoto) {
					const photo = {
						newPhoto: uploadedFoto
					}
					dispatch(addPhoto(photo))
					setActive(true)
				} else {
					return null
				}
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
	const deleteFoto = () => {
		dispatch(addPhoto(null))
		setActive(false)
	}
	const openMap = (latitude, longitude) => {
		navigation.navigate('Карта', { latitude, longitude })
	}
	const openComments = (postID, postFoto) => {
		navigation.navigate('Комментарии', { postID, postFoto })
	}
	return (
		<View style={styles.container}>
			<ImageBackground
				source={require("../../assets/images/photoBG.jpg")}
				resizeMode="cover"
				style={styles.image}
			>
				<View style={{

					flex: 1,
					marginTop: 119,
					padding: 10,
					backgroundColor: "#FFFFFF",
					borderTopLeftRadius: 25,
					borderTopRightRadius: 25,
					justifyContent: userPosts.length >= 2 ? "flex-end" : "flex-start",
					paddingTop: 110,
					position: "relative",


				}} >
					<LogOut
						onPress={signOut}
						size={25} style={styles.logout} />
					<View style={styles.avaBox}>
						<View style={styles.avatar}>
							<Image source={{ uri: photoURL }} style={styles.foto} />
						</View>
						{active ?
							<Xcircle onPress={pickImage} style={styles.logo} /> :
							<Logo onPress={pickImage} style={styles.logo} />
						}
					</View>
					<View style={styles.header}>
						<Text style={styles.headerTitle}>{nickName}</Text>
					</View>
					<View>
						<FlatList
							data={userPosts}
							keyExtractor={(item, indx) => indx.toString()}
							renderItem={({ item }) => (
								<>
									<View style={styles.fotoContainer}>
										<Image
											source={{ uri: item.state.uploadFoto }}
											style={styles.photo}
										/>
									</View>
									<Text style={styles.name}>{item.state.name}</Text>
									<View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
										<TouchableOpacity
											onPress={() => openComments(
												item.id,
												item.state.uploadFoto,
											)}
											style={{ flexDirection: "row", alignItems: 'center', marginTop: 9 }}>
											{item.comments ? <FillShape style={{ marginRight: 8 }} /> : <Shape style={{ marginRight: 8 }} />}
											<Text>{item.comments ? item.comments : 0}</Text>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => openMap(item.state.latitude, item.state.longitude)}
											style={{ flexDirection: "row", alignItems: 'center' }}>
											<Mappin />
											<Text style={{ marginLeft: 6, textDecorationLine: 'underline' }} >{item.state.location}</Text>
										</TouchableOpacity>
									</View>
								</>
							)}
						/>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	image: {
		flex: 1,
		justifyContent: "flex-end"
	},
	btn: {
		marginTop: 50,
	},

	avatar: {
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
	foto: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	avaBox: {
		position: "absolute",
		top: -120 / 2,
		left: "53%",
		transform: [{ translateX: -120 / 2 }],
	},
	header: {
		alignItems: "center",
		marginBottom: 5,
	},
	headerTitle: {
		fontSize: 30,
		color: "#212121",
		fontFamily: "Roboto-Regular",
		lineHeight: 35,
		fontWeight: "500",
		textAlign: "center",
		letterSpacing: 0.01,
	},
	logout: {
		position: "absolute",
		top: 20,
		right: 20,
	},
	photo: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	fotoContainer: {
		alignItems: 'center',
		width: "100%",
		height: 240,
		marginTop: 32,
		backgroundColor: "#F6F6F6",
		borderWidth: 1,
		borderColor: "#E8E8E8",
		borderRadius: 8,
		overflow: 'hidden',
	},
	name: {
		marginTop: 8,
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 19,
		color: "#212121",
	},
});

export default ProfileScreen;