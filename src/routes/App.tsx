import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { Loader } from "@components";
import { UserProvider } from "@context";
const Home = React.lazy(() =>
	import("@pages").then(({ Home }) => ({
		default: Home,
	}))
);
const Play = React.lazy(() =>
	import("@pages").then(({ Play }) => ({
		default: Play,
	}))
);

const App = () => {
	return (
		<UserProvider>
			<BrowserRouter>
				<React.Suspense fallback={<p>Loading ...</p>}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/play" element={<Play />} />
						<Route path="*" element={<Navigate replace to="/" />} />
					</Routes>
				</React.Suspense>
			</BrowserRouter>
		</UserProvider>
	);
};

export default App;
