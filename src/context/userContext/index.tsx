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
	mokeponsAvailable: [] as MokeponType[],
	setMokeponsAvailable: (mokeponsAvailable: MokeponType[]) => {},
});

const UserProvider = ({ children }: userContextProps) => {
	const [userId, setUserId] = useState("");
	const [mokepon, setMokepon] = useState({} as MokeponType);
	const [mokeponsAvailable, setMokeponsAvailable] = useState<MokeponType[]>([]);

	return (
		<UserContext.Provider
			value={{
				userId,
				setUserId,
				mokepon,
				setMokepon,
				mokeponsAvailable,
				setMokeponsAvailable,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export { UserContext, UserProvider };
