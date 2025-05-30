import React, { useState } from "react";
import { Label } from "../ui/label";
import { Star } from "lucide-react";
import clsx from "clsx";

interface StarRatingProps {
	onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ onRatingChange }) => {
	const [rating, setRating] = useState<number>(0);

	const handleClick = (value: number) => {
		setRating(value);
		onRatingChange(value);
	};

	return (
		<div className="items-center justify-center space-x-2">
			<Label className="text-md">
				On a scale of 1 to 5 stars, where 1 star means &apos;Did not
				meet expectations&apos; and 5 stars means &apos;Far exceeded
				expectations&apos;, how would you rate your performance over the
				last year?
			</Label>
			<div className="flex items-center justify-center space-x-1">
				{[...Array(5)].map((_, index) => {
					const starValue = index + 1;
					return (
						<span
							key={starValue}
							onClick={() => handleClick(starValue)}
							className={clsx(
								starValue <= rating
									? "text-primary"
									: "text-gray-400",
							)}
						>
							<Star className="md:w-15 md:h-15 my-5 ml-2 h-8 w-8 cursor-pointer fill-current" />
						</span>
					);
				})}
			</div>
		</div>
	);
};

export default StarRating;
