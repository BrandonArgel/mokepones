import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@context";
import { getMokepons, getUserId } from "@api";
import { MokeponType } from "@utils/types";
import styles from "./Home.module.scss";

const Home = () => {
	const navigate = useNavigate();
	const { setUserId, mokepon, setMokepon, mokeponsAvailable, setMokeponsAvailable } =
		useContext(UserContext);
	const [mokepons, setMokepons] = useState([]);

	const initUser = async () => {
		await getUserId()
			.then((id) => {
				setUserId(id);
			})
			.then(() => {
				navigate("/play");
			})
			.catch(() => {
				console.log("Error getting user id");
			});
	};

	const initialRequest = async () => {
		const data = await getMokepons();
		setMokeponsAvailable(data);
	};

	useEffect(() => {
		initialRequest();
	}, []);
	return (
		<div className={styles.home}>
			<h1 className={styles.home__title}>Mokepones</h1>
			<h2 className={styles.home__subtitle}>Choose your mokepon</h2>
			<div className={styles.mokepons}>
				{mokeponsAvailable.length > 0 &&
					mokeponsAvailable.map((m: MokeponType) => (
						<button
							key={m.id}
							onClick={() => setMokepon(m)}
							className={`${styles.mokepons__button} ${m.name === mokepon.name && styles.active}`}
						>
							<img src={m.img} alt={m.name} className={styles.mokepons__button_img} />
							<p className={styles.mokepons__button_name}>{m.name}</p>
						</button>
					))}
			</div>
			<button
				type="button"
				onClick={initUser}
				disabled={!mokepon.name}
				className={styles.home__button}
			>
				{mokepon.name ? `Play with: ${mokepon.name}` : "Choose your mokepon"}
			</button>
		</div>
	);
};

export { Home };
