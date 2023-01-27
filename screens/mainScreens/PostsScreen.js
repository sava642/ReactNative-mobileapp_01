import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DefaultScreen from '../nestedScreens/DefaultScreen';
import CommentsScreen from '../nestedScreens/CommentsScreen';
import MapScreen from '../nestedScreens/MapScreen';
import { useDispatch } from 'react-redux';
import ArrowLeft from "../../assets/svg/arrow-left.svg";
import LogOut from "../../assets/svg/log-out.svg";
import { authSignOutUser } from "../../redux/auth/authOperations";


function PostsScreen({ navigation }) {

	const NestedScreen = createNativeStackNavigator()

	const dispatch = useDispatch();
	const signOut = () => {
		dispatch(authSignOutUser());
	};

	return (
		<NestedScreen.Navigator>
			<NestedScreen.Screen
				options={{
					title: 'Публикации',
					headerRight: (props) => (
						<LogOut
							onPress={signOut}
							size={25} style={{ marginRight: 5 }} />
					),
				}}
				name="DefaultScreen" component={DefaultScreen} />
			<NestedScreen.Screen
				options={{
					title: 'Комментарии',
					headerLeft: (props) => (
						<ArrowLeft
							style={{ marginRight: 20 }}
							onPress={() => navigation.goBack()} />
					),
				}}
				name="Комментарии" component={CommentsScreen} />
			<NestedScreen.Screen
				options={{
					title: 'Карта',
					headerLeft: (props) => (
						<ArrowLeft style={{ marginRight: 20 }}
							onPress={() =>
								navigation.goBack()
							} />
					),
				}}
				name="Карта" component={MapScreen} />
		</NestedScreen.Navigator>
	)
}

export default PostsScreen