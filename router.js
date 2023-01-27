import React from 'react';
import PostsScreen from "./screens/mainScreens/PostsScreen";
import ProfileScreen from "./screens/mainScreens/ProfileScreen";
import CreatePostsScreen from "./screens/mainScreens/CreatePostsScreen";
import Grid from "./assets/svg/grid.svg";
import New from "./assets/svg/new.svg";
import User from "./assets/svg/user.svg";
import ArrowLeft from "./assets/svg/arrow-left.svg";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



import RegistrationScreen from "./screens/auth/RegistrationScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import { Platform } from 'expo-modules-core';





export const useRouting = (stateChange) => {
	const AuthStack = createNativeStackNavigator();
	const MainTab = createBottomTabNavigator();

	const height = Platform.OS === 'ios' ? 80 : 50

	if (!stateChange) {

		return (
			<AuthStack.Navigator>
				<AuthStack.Screen options={{
					headerShown: false,
				}} name="Login" component={LoginScreen} />
				<AuthStack.Screen options={{
					headerShown: false,
				}} name="Registration" component={RegistrationScreen} />
			</AuthStack.Navigator>
		)
	}
	return (
		<MainTab.Navigator>
			<MainTab.Screen
				options={{
					headerShown: false,
					tabBarShowLabel: false,
					tabBarHideOnKeyboard: true,
					tabBarStyle: [{
						height: height,
						alignItems: "center",
					}],
					tabBarIcon: ({ focused, size, color }) => (
						<Grid
							size={25}
						/>
					)
				}} name="Публикации" component={PostsScreen} />

			<MainTab.Screen
				options={{
					// headerLeft: () => (
					// 	<ArrowLeft
					// 		onPress={() => navigation.goBack()}
					// 		size={25} style={{ marginLeft: 20 }} />
					// ),

					headerShown: false,
					tabBarHideOnKeyboard: true,
					tabBarShowLabel: false,
					tabBarStyle: [{
						// height: height,
						// alignItems: "center",
						display: 'none',
					}],
					tabBarIcon: ({ focused, size, color }) => (
						<New
							size={25}
						/>

					)
				}} name="Создать публикацию" component={CreatePostsScreen} />

			<MainTab.Screen options={{

				headerShown: false,
				tabBarShowLabel: false,
				tabBarHideOnKeyboard: true,
				tabBarStyle: [{
					height: height,
					alignItems: "center",
				}],
				tabBarIcon: ({ focused, size, color }) => (
					<User
						size={25}
					/>
				)
			}} name="Профиль" component={ProfileScreen} />
		</MainTab.Navigator >
	)
}

export default useRouting;