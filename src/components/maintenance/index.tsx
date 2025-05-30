"use client";

import { useEffect, useMemo, useState } from "react";
import ProgressBar from "./progress-bar";

const MaintenanceComponent = () => {
	const endDate = useMemo(() => new Date("2025-02-25T12:00:00"), []);
	const startDate = useMemo(() => new Date("2025-02-25T11:00:00"), []);
	const [timeLeft, setTimeLeft] = useState("00:00:00");

	useEffect(() => {
		const updateTimeLeft = () => {
			const now = new Date();
			const difference = endDate.getTime() - now.getTime();

			if (difference <= 0) {
				setTimeLeft("00:00:00"); // Se o tempo já passou, exibe 00:00:00
				return;
			}

			// Calcula horas, minutos e segundos
			const hours = Math.floor(difference / (1000 * 60 * 60));
			const minutes = Math.floor(
				(difference % (1000 * 60 * 60)) / (1000 * 60),
			);
			const seconds = Math.floor((difference % (1000 * 60)) / 1000);

			// Formata para sempre ter dois dígitos (ex: 01:05:09)
			const formattedTime = `${String(hours).padStart(2, "0")}:${String(
				minutes,
			).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

			setTimeLeft(formattedTime);
		};

		const interval = setInterval(updateTimeLeft, 1000); // Atualiza a cada segundo
		updateTimeLeft(); // Chama imediatamente para evitar atraso inicial

		return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
	}, [endDate]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
			<div className="max-w-2xl space-y-8 text-center">
				<div>
					<span
						className="text-8xl text-blue-400"
						role="img"
						aria-label="Tools"
					>
						🛠️
					</span>
				</div>

				<div className="space-y-4">
					<h1 className="text-5xl font-bold text-white md:text-6xl">
						System Maintenance
					</h1>

					<div className="rounded-2xl bg-gray-800 p-6 shadow-xl backdrop-blur-sm">
						<p className="mb-4 text-xl text-blue-100 md:text-2xl">
							We&apos;re working hard to improve your experience!
						</p>

						<ProgressBar endDate={endDate} startDate={startDate} />

						<p className="mb-8 text-lg text-blue-200/90">
							Estimated time remaining:{" "}
							<span className="font-mono text-sky-300">
								{timeLeft}
							</span>
						</p>
					</div>
				</div>

				<div className="flex flex-col justify-center gap-4 sm:flex-row">
					<a
						href="mailto:developer.brazil@harrispye.com"
						className="rounded-xl bg-gray-800 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-gray-700"
					>
						Emergency Contact
					</a>
				</div>
			</div>
		</div>
	);
};

export default MaintenanceComponent;
