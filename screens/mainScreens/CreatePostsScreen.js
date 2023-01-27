import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DefaultScreen from '../nestedScreens/DefaultScreen';
import CommentsScreen from '../nestedScreens/CommentsScreen';
import MapScreen from '../nestedScreens/MapScreen';
import { useDispatch } from 'react-redux';
import ArrowLeft from "../../assets/svg/arrow-left.svg";
import LogOut from "../../assets/svg/log-out.svg";
import User from "../../assets/svg/user.svg";
import { authSignOutUser } from "../../redux/auth/authOperations";
import CreatePosts from '../createScreen/CreatePosts';
//import { getFocusedRouteNameFromRoute } from '@react-navigation/native';



function CreatePostsScreen({ navigation }) {

	const NestedScreen = createNativeStackNavigator()

	// const routeName = getFocusedRouteNameFromRoute(route);
	// console.log(routeName)

	const dispatch = useDispatch();
	const signOut = () => {
		dispatch(authSignOutUser());
	};

	return (

		<NestedScreen.Navigator>
			<NestedScreen.Screen


				options={{


					title: 'Создать публикацию ',
					headerLeft: () => (
						<ArrowLeft
							onPress={() => navigation.goBack()}
							size={25} style={{ marginRight: 20 }} />
					),


				}}

				name="CreatePosts" component={CreatePosts} />
		</NestedScreen.Navigator>
	)
}

export default CreatePostsScreen;