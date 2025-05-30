"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
	endDate: Date;
	startDate: Date;
}

const ProgressBar = ({ endDate, startDate }: ProgressBarProps) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const updateProgress = () => {
			const now = new Date();
			const totalTime = endDate.getTime() - startDate.getTime(); // Tempo total
			const elapsedTime = now.getTime() - startDate.getTime(); // Tempo decorrido

			if (totalTime <= 0) {
				setProgress(100); // Se o tempo total já passou, progresso é 100%
				return;
			}

			const currentProgress = (elapsedTime / totalTime) * 100; // Progresso atual
			setProgress(Math.min(100, Math.max(0, currentProgress))); // Garante que o progresso fique entre 0% e 100%
		};

		const interval = setInterval(updateProgress, 1000); // Atualiza a cada segundo
		updateProgress(); // Chama imediatamente para evitar atraso inicial

		return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
	}, [startDate, endDate]);

	return (
		<div className="mb-6 h-3 overflow-hidden rounded-full bg-blue-700">
			<div
				className="h-full bg-sky-400 transition-all duration-1000 ease-linear"
				style={{ width: `${progress}%` }}
			></div>
		</div>
	);
};

export default ProgressBar;
