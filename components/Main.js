import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { useRouting } from "../router";

import { authStateCahngeUser } from "../redux/auth/authOperations";

const Main = () => {
	const { stateChange } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		console.log("loading")
		dispatch(authStateCahngeUser());
	}, [stateChange]);


	const routing = useRouting(stateChange);


	return (
		<NavigationContainer >{routing}</NavigationContainer>
	)
};

export default Main;
