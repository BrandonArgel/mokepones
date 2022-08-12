import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@context";
import { chooseMokepon, deleteMokepon, sendPosition, setAFK } from "@api";
import { Attack, MokeponType } from "@utils/types";
import { random } from "@utils";
import Map from "@assets/images/map.png";
import styles from "./Play.module.scss";

const Play = () => {
	const navigate = useNavigate();
	const { userId, mokepon, setMokepon, mokeponsAvailable } = useContext(UserContext);
	const reshIntervalRef = useRef<number>();
	const intervalXRef = useRef<number>();
	const intervalYRef = useRef<number>();
	const userRef = useRef({} as Mokepon);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	let enemies = [] as Mokepon[];

	class Mokepon {
		name: string;
		mini: HTMLImageElement;
		attacks: Attack[];
		id: string;
		width: number;
		heigth: number;
		x: number;
		y: number;
		speedX: number;
		speedY: number;
		afk: boolean;

		constructor(name: string, mini: string, attacks: Attack[], id: string) {
			this.name = name;
			this.mini = new Image();
			this.mini.src = mini;
			this.attacks = attacks;
			this.id = id;
			this.width = 40;
			this.heigth = 40;
			this.x = random(0, canvasRef.current!.width - this.width);
			this.y = random(0, canvasRef.current!.height - this.heigth);
			this.speedX = 0;
			this.speedY = 0;
			this.afk = false;
		}

		draw() {
			const ctx = canvasRef.current!.getContext("2d");
			if (this.afk) {
				ctx!.globalAlpha = 0.5;
				ctx!.drawImage(this.mini, this.x, this.y, this.width, this.heigth);
				ctx!.globalAlpha = 1.0;
			} else {
				ctx!.drawImage(this.mini, this.x, this.y, this.width, this.heigth);
			}
		}
	}

	const checkBordersX = () => {
		const newPosition = userRef.current.x + userRef.current.speedX;

		if (newPosition < 0 - userRef.current.width) {
			return (userRef.current.x = canvasRef.current!.width);
		} else if (newPosition > canvasRef.current!.width) {
			return (userRef.current.x = 0 - userRef.current.width);
		}

		userRef.current.x = newPosition;
	};

	const checkBordersY = () => {
		const newPosition = userRef.current.y + userRef.current.speedY;

		if (newPosition < 0 - userRef.current.heigth) {
			return (userRef.current.y = canvasRef.current!.height);
		} else if (newPosition > canvasRef.current!.height) {
			return (userRef.current.y = 0 - userRef.current.heigth);
		}

		userRef.current.y = newPosition;
	};

	const sendCoordinates = async () => {
		const newEnemies = await sendPosition(userRef.current.x, userRef.current.y, userId);

		enemies = newEnemies.map((enemy) => {
			const enemyTemplate = mokeponsAvailable.find((mokepon) => mokepon.name === enemy.mokepon);

			if (enemyTemplate) {
				const newEnemy = new Mokepon(
					enemyTemplate!.name,
					enemyTemplate!.mini,
					enemyTemplate!.attacks,
					enemy!.id
				);

				newEnemy.x = enemy.x;
				newEnemy.y = enemy.y;
				newEnemy.afk = enemy.afk;

				return newEnemy;
			}
		}) as Mokepon[];
	};

	const drawPlayers = () => {
		const ctx = canvasRef.current!.getContext("2d");
		const img = new Image();
		img.src = Map;
		ctx!.drawImage(img, 0, 0);
		checkBordersX();
		checkBordersY();
		userRef.current.draw();

		sendCoordinates();

		enemies.forEach((enemy) => {
			enemy.draw();
			if (enemy.afk) return;
			checkCollision(enemy);
		});
	};

	const checkCollision = (enemy: Mokepon) => {
		const topEnemy = enemy.y;
		const bottomEnemy = enemy.y + enemy.heigth;
		const leftEnemy = enemy.x;
		const rightEnemy = enemy.x + enemy.width;
		const topUser = userRef.current.y;
		const bottomUser = userRef.current.y + userRef.current.heigth;
		const leftUser = userRef.current.x;
		const rightUser = userRef.current.x + userRef.current.width;

		if (
			bottomUser < topEnemy ||
			topUser > bottomEnemy ||
			rightUser < leftEnemy ||
			leftUser > rightEnemy
		) {
			return;
		}

		userRef.current.speedX = 0;
		userRef.current.speedY = 0;
		handleSetAFK();
		alert("Collision with" + enemy.id);
	};

	const moveMokepon = (e: MouseEvent) => {
		if (intervalXRef.current || intervalYRef.current) {
			clearInterval(intervalXRef.current);
			clearInterval(intervalYRef.current);
		}
		const { clientX, clientY } = e;
		const newX = clientX - userRef.current.width / 2;
		const newY = clientY - userRef.current.heigth;

		intervalXRef.current = window.setInterval(() => {
			if (userRef.current.x < newX) {
				userRef.current.x += 1;
			} else if (userRef.current.x > newX) {
				userRef.current.x -= 1;
			} else {
				clearInterval(intervalXRef.current);
				intervalXRef.current = 0;
			}
		}, 10);

		intervalYRef.current = window.setInterval(() => {
			if (userRef.current.y < newY) {
				userRef.current.y += 1;
			} else if (userRef.current.y > newY) {
				userRef.current.y -= 1;
			} else {
				clearInterval(intervalYRef.current);
				intervalYRef.current = 0;
			}
		}, 10);
	};

	const initGame = () => {
		reshIntervalRef.current = window.setInterval(drawPlayers, 50);

		canvasRef.current!.addEventListener("click", moveMokepon);
		window.addEventListener("visibilitychange", onVisibilityChange);
	};

	const onVisibilityChange = () => {
		if (document.visibilityState !== "visible") {
			handleSetAFK();
		} else {
			handleUnsetAFK();
		}
	};

	const handleSetAFK = () => {
		clearInterval(reshIntervalRef.current);
		setAFK(true, userId);
	};

	const handleUnsetAFK = () => {
		initGame();
		setAFK(false, userId);
	};

	const initMokepon = async () => {
		const res = await chooseMokepon(mokepon.name, userId);
		userRef.current = new Mokepon(mokepon.name, mokepon.mini, mokepon.attacks, userId);

		if (res.statusCode === 200) {
			initGame();
		}
	};

	useEffect(() => {
		if (!mokepon.name || !userId) navigate("/");
		initMokepon();
	}, []);

	const quitGame = async () => {
		const res = await deleteMokepon(userId);
		clearInterval(reshIntervalRef.current);

		if (res.statusCode === 200) {
			setMokepon({} as MokeponType);
			navigate("/");
		}
	};

	useEffect(() => {
		window.addEventListener("beforeunload", quitGame);

		return () => {
			window.removeEventListener("beforeunload", quitGame);
		};
	}, []);
	return (
		<div className={styles.container}>
			<p>{mokepon.name}</p>
			<canvas ref={canvasRef} width={500} height={500} />

			<button onClick={quitGame}>Quit</button>
		</div>
	);
};

export { Play };
