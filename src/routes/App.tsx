import * as React from "react";
import { getUserId } from "@api";

function App() {
	const initialRequest = async () => {
		const id = await getUserId();
		console.log(id);
	};
	
	React.useEffect(() => {
		initialRequest();
	}, []);

	return <p>Mokepones</p>;
}

export default App;
