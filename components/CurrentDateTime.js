import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import moment from 'moment';

const CurrentDateTime = () => {
	const [dateTime, setDateTime] = useState('');

	useEffect(() => {

		const dateTimeString = moment().format(' MMMM  YYYY, h:mm:ss');
		setDateTime(dateTimeString);

	}, []);

	return <Text>{dateTime}</Text>;
};

export default CurrentDateTime;
