import React from "react";
import { useEffect } from "react";
import axios from "axios";

const App = () => {
	async function getData() {
		let res = await axios.get(`http://localhost:8000/test`);
		console.log(res.data);
	}

	useEffect(() => {
		getData();
	}, []);

	return <div>App</div>;
};

export default App;
