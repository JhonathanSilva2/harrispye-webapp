import { Loader2 } from "lucide-react";

const Loading = () => {
	return (
		<div className="flex items-center justify-center space-x-4">
			<div className="flex animate-pulse items-center justify-center gap-2 text-muted-foreground">
				<Loader2 className="h-8 w-8 animate-spin" />
				<p className="text-2xl">Loading ...</p>
			</div>
		</div>
	);
};

export default Loading;
