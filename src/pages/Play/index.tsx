import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@context";
import { chooseMokepon, deleteMokepon } from "@api";
import { Attack, MokeponType } from "@utils/types";
import { random } from "@utils";
import Map from "@assets/images/map.png";

const Play = () => {
	const navigate = useNavigate();
	const { userId, mokepon, setMokepon } = useContext(UserContext);
	const refreshIntervalRef = useRef<number>();
	const userRef = useRef({} as Mokepon);
	const canvasRef = useRef<HTMLCanvasElement>(null);

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
		}

		draw() {
			const ctx = canvasRef.current!.getContext("2d");
			ctx!.drawImage(this.mini, this.x, this.y, this.width, this.heigth);
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

	const drawPlayers = () => {
		const ctx = canvasRef.current!.getContext("2d");
		const img = new Image();
		img.src = Map;
		ctx!.drawImage(img, 0, 0);
		checkBordersX();
		checkBordersY();
		userRef.current.draw();

		// Send position to server

		// Draw other players
	};

	const moveUp = () => (userRef.current.speedY = -5);
	const moveDown = () => (userRef.current.speedY = 5);
	const moveLeft = () => (userRef.current.speedX = -5);
	const moveRight = () => (userRef.current.speedX = 5);

	const keyPressed = (e: KeyboardEvent) => {
		switch (e.key) {
			case "ArrowUp":
				moveUp();
				break;
			case "ArrowDown":
				moveDown();
				break;
			case "ArrowLeft":
				moveLeft();
				break;
			case "ArrowRight":
				moveRight();
				break;
			default:
				break;
		}
	};

	const stopX = () => (userRef.current.speedX = 0);
	const stopY = () => (userRef.current.speedY = 0);

	const stopMovement = (e: KeyboardEvent) => {
		switch (e.key) {
			case "ArrowUp":
			case "ArrowDown":
				stopY();
				break;
			case "ArrowLeft":
			case "ArrowRight":
				stopX();
				break;
			default:
				break;
		}
	};

	const initGame = () => {
		refreshIntervalRef.current = window.setInterval(drawPlayers, 50);

		window.addEventListener("keydown", (e) => keyPressed(e));
		window.addEventListener("keyup", (e) => stopMovement(e));
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
		if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);

		if (res.statusCode === 200) {
			setMokepon({} as MokeponType);
			navigate("/");
		}
	};

	// If you have been still for more than 15 seconds
	const setMokeponAFK = () => {
		// Set mokepon afk
		// Clear interval
	};

	useEffect(() => {
		window.addEventListener("beforeunload", quitGame);

		return () => {
			window.removeEventListener("beforeunload", quitGame);
		};
	}, []);
	return (
		<div>
			<p>{mokepon.name}</p>
			<canvas ref={canvasRef} width={500} height={500} />
			<button onClick={quitGame}>Quit</button>
		</div>
	);
};

export { Play };
