import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapScreen = ({ route }) => {
	console.log(route.params.latitude, route.params.longitude, route)

	return (
		<View style={styles.container}>
			<MapView
				style={styles.mapStyle}
				region={{
					latitude: route.params.latitude,
					longitude: route.params.longitude,
					latitudeDelta: 0.003,
					longitudeDelta: 0.00321,
				}}
				mapType="standard"
				minZoomLevel={15}
			//onMapReady={() => console.log("Map is ready")}
			//onRegionChange={() => console.log("Region change")}
			>
				<Marker
					title="I am here"
					coordinate={{ latitude: route.params.latitude, longitude: route.params.longitude }}
					description='Hello'
				/>
			</MapView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	mapStyle: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	},
});

export default MapScreen;