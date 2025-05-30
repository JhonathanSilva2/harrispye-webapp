"use client";
import { useEffect, useState } from "react";

const useClientDevice = () => {
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [isMobile, setIsMobile] = useState(false);

	const checkIsMobile = () => {
		if (window.innerWidth <= 1024) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
	};
	useEffect(() => {
		const handleResize = () => {
			setScreenWidth(window.innerWidth);
			// Check if the screen width is less than or equal to 768px
			checkIsMobile();
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return {
		screenWidth,
		isMobile,
	};
};

export default useClientDevice;
