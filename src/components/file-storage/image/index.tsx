"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { clientEnv } from "@/lib/constants/config";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

const FileStorageImage = (props: ImageProps) => {
	const [isLoading, setIsLoading] = useState(true);
	const src = props.src as string;

	if (!src) {
		throw new Error("Image source is required.");
	}

	const [container, filename] = src.split("/");
	if (!container || !filename) {
		throw new Error(
			"Invalid image source format. Expected format: {container}/{filename.ext}",
		);
	}
	const imageEndpoint = `${clientEnv.NEXT_PUBLIC_URL}/api/storage/${container}/${filename}`;

	return (
		<div
			className="relative flex items-center justify-center self-center"
			style={{
				width: props.width || "100%",
				height: props.height || "auto",
				aspectRatio: props.fill
					? undefined
					: typeof props.width === "number" &&
						  typeof props.height === "number"
						? `${props.width}/${props.height}`
						: undefined,
			}}
		>
			{isLoading && (
				<Skeleton className="absolute inset-0 h-full w-full" />
			)}
			<Image
				{...props}
				src={imageEndpoint}
				alt={props.alt || "image endpoint"}
				onLoadingComplete={() => setIsLoading(false)}
				onError={() => setIsLoading(false)}
			/>
		</div>
	);
};

export default FileStorageImage;
