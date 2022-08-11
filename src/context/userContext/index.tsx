import { createContext, useEffect, useState } from "react";
import { MokeponType } from "@utils/types";

interface userContextProps {
	children: React.ReactNode;
}

const UserContext = createContext({
	userId: "",
	setUserId: (userId: string) => {},
	mokepon: {} as MokeponType,
	setMokepon: (mokepon: MokeponType) => {},
});

const UserProvider = ({ children }: userContextProps) => {
	const [userId, setUserId] = useState("");
	const [mokepon, setMokepon] = useState({} as MokeponType);

	return (
		<UserContext.Provider
			value={{
				userId,
				setUserId,
				mokepon,
				setMokepon,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export { UserContext, UserProvider };
