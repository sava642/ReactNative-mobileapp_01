import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	FlatList,
	Image,
} from "react-native";
import { useSelector } from "react-redux";


import CurrentDateTime from "../../components/CurrentDateTime"
import db from "../../firebase/config";

import Vector from "../../assets/svg/vector.svg";

const CommentsScreen = ({ route }) => {

	const { postID, postFoto } = route.params;
	const [comment, setComment] = useState('');
	const [allComments, setAllComments] = useState([]);
	const { nickName, photoURL } = useSelector((state) => state.auth)

	const uniquePostId = Date.now().toString();
	const yourRef = useRef(null);


	let size = allComments.length



	useEffect(() => {
		getAllPosts();
		getLength();
	}, [size]);
	const createPost = async () => {
		await db.firestore()
			.collection("posts")
			.doc(postID)
			.collection("comments")
			.add({ comment, nickName, uniquePostId, photoURL });
		setComment('')
	};

	const getAllPosts = async () => {
		await db.firestore()
			.collection("posts")
			.doc(postID)
			.collection("comments")
			.orderBy("uniquePostId", "asc")
			.onSnapshot((data) =>
				setAllComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
			);
	};

	const getLength = async () => {
		await db.firestore()
			.collection("posts")
			.doc(postID)
			.update({
				comments: size
			})
	};

	return (
		<View style={styles.container}>
			<View style={styles.fotoContainer}>
				<Image
					source={{ uri: postFoto }}
					style={styles.photo}
				/>
			</View>
			<View style={{ flex: 1 }}>
				<FlatList
					data={allComments}
					ref={yourRef}
					onContentSizeChange={() => yourRef.current.scrollToEnd()}
					onLayout={() => yourRef.current.scrollToEnd()}
					renderItem={({ item }) => (
						<View style={{
							flexDirection: item.photoURL === photoURL ? "row" : "row-reverse",
							justifyContent: "space-between",
							padding: 10,
							marginBottom: 32,
						}}>
							<View style={styles.avatarContainer}>
								<Image
									source={{ uri: item.photoURL }}
									style={styles.photo} />
							</View>
							<View style={styles.message}>
								<View>
									<Text>{item.comment}</Text>
									<CurrentDateTime />
								</View>
							</View>
						</View>
					)}
					keyExtractor={(item) => item.id}
				/>
			</View>

			<View style={styles.addCommentBox}>
				<View style={styles.inputContainer}>
					<TextInput
						placeholder="Комментировать..."
						multiline={true}
						numberOfLines={2}
						style={styles.input}
						value={comment}
						onChangeText={setComment} />
				</View>
				<TouchableOpacity onPress={createPost} style={styles.sendBtn}>
					<Vector />
				</TouchableOpacity>
			</View>

		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#FFFFFF",
	},
	fotoContainer: {
		alignItems: 'center',
		width: "100%",
		height: 240,
		marginBottom: 12,
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

	sendBtn: {
		width: 34,
		height: 34,
		bottom: 28,
		right: 10,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 17,
		backgroundColor: "#FF6C00",
		position: "absolute",
	},
	sendLabel: {
		color: "#20b2aa",
		fontSize: 20,
	},
	inputContainer: {
		position: "relative",
		marginBottom: 20,
		backgroundColor: "#F6F6F6",
		minHeight: 50,
		justifyContent: "center",
		borderWidth: 1,
		borderRadius: 100,
		borderColor: "#E8E8E8",
	},
	input: {
		paddingLeft: 25,
		paddingRight: 50,
		paddingBottom: 4,
		fontWeight: "400",
		fontSize: 13,
		lineHeight: 18,
		color: "#212121",
		alignItems: "center",
	},
	avatarContainer: {
		backgroundColor: "#F6F6F6",
		alignItems: 'center',
		width: 32,
		height: 32,
		borderRadius: 16,
		overflow: "hidden",

	},
	message: {
		width: "87%",
		padding: 16,
		backgroundColor: "#00000008",
		borderRadius: 6,
		borderTopLeftRadius: 0,
	}
});

export default CommentsScreen;