import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Keyboard, } from 'react-native';
import React, { useEffect, useState } from 'react';
import db from "../../firebase/config";
import { useSelector } from "react-redux";

import Mappin from "../../assets/svg/mappin.svg";
import Shape from "../../assets/svg/shape.svg";
import FillShape from "../../assets/svg/fillshape.svg";

const DefaultScreen = ({ navigation }) => {
	const [posts, setPosts] = useState([])
	const [size, setSize] = useState(0)



	const getAllPost = async () => {
		await db
			.firestore()
			.collection("posts")
			.onSnapshot((data) =>
				setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
			);
	};

	const { userId, photoURL, userEmail, nickName } = useSelector((state) => state.auth);

	useEffect(() => {
		getAllPost();

	}, []);

	// const getSizeCollection = async () => {
	// 	await db
	// 		.firestore()
	// 		.collection("comments")
	// 		.onSnapshot((data) =>
	// 			console.log((data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))).length)
	// 		);
	// }



	const openMap = (latitude, longitude) => {
		navigation.navigate('Карта', { latitude, longitude })
	}
	const openComments = (postID, postFoto) => {
		navigation.navigate('Комментарии', { postID, postFoto })
	}

	return (

		<View style={styles.container}>
			<View style={{ flexDirection: "row", paddingBottom: 10 }}>
				<View>
					<View style={styles.avatar}>
						<Image source={{ uri: photoURL }} style={styles.foto} />
					</View>
				</View>
				<View style={{ marginLeft: 8, justifyContent: "center" }}>
					<Text style={styles.nickname} >{nickName}</Text>
					<Text style={styles.useremail}>{userEmail}</Text>
				</View>
			</View>
			<FlatList
				data={posts}
				keyExtractor={(item, index) => item.id}
				renderItem={({ item, index }) => (
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
				)} />
		</View>
	)
}
export default DefaultScreen;


const styles = StyleSheet.create({
	container: {
		flex: 1,
		//paddingTop: Constants.statusBarHeight,
		padding: 16,
		backgroundColor: "#FFFFFF",
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
	photo: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	name: {
		marginTop: 8,
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 19,
		color: "#212121",
	},
	foto: {
		width: "100%",
		height: "100%",
	},
	avatar: {
		backgroundColor: "#F6F6F6",
		width: 60,
		height: 60,
		borderRadius: 16,
		overflow: "hidden",
	},
	nickname: {
		fontWeight: "700",
		fontSize: 13,
		lineHeight: 15,
		color: "#212121",
	},
	useremail: {
		fontSize: 11,
		lineHeight: 13,
		color: "#212121cc",
	}
})