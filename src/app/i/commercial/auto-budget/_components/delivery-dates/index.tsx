import { delivery_list } from "@/app/api/commercial/generate-job-number/type";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { CalendarCog } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { deliveryDatesInputData } from "./inputData";
interface DeliveryDatesProps {
	values: delivery_list;
	setValues: Dispatch<SetStateAction<delivery_list>>;
	shouldOpen: boolean;
	setShouldOpen: (open: boolean) => void;
}

const STORAGE_KEY = "deliveryDates";

type StoredType = Record<string, number> & { estimatedDays: number };

type ValuesType = Record<string, number>;

export function DeliveryDates({
	values,
	setValues,
	shouldOpen,
	setShouldOpen,
}: DeliveryDatesProps) {
	// função para verificar se ao

	// const [values, setValues] = useState<ValuesType>(() => {
	// 	if (typeof window !== "undefined") {
	// 		const stored = window.localStorage.getItem(STORAGE_KEY);
	// 		if (stored) {
	// 			try {
	// 				const parsed: StoredType = JSON.parse(stored);
	// 				return deliveryDatesInputData.reduce((acc, { name }) => {
	// 					acc[name] =
	// 						typeof parsed[name] === "number" ? parsed[name] : 0;
	// 					return acc;
	// 				}, {} as ValuesType);
	// 			} catch {
	// 				console.warn("Invalid JSON in storage, resetting");
	// 			}
	// 		}
	// 	}

	// 	return deliveryDatesInputData.reduce((acc: ValuesType, { name }) => {
	// 		acc[name] = 0;
	// 		return acc;
	// 	}, {} as ValuesType);
	// });

	// const estimatedDays = Object.values(values).reduce(
	// 	(total, val) => total + val,
	// 	0,
	// );

	// const saveToStorage = (newValues: ValuesType, estDays: number) => {
	// 	if (typeof window !== "undefined") {
	// 		const toStore: StoredType = {
	// 			...newValues,
	// 			estimatedDays: estDays,
	// 		};
	// 		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
	// 	}
	// };

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		const num = Number(value) || 0;

		setValues((prev) => {
			const updated = {
				...prev,
				[id]: num,
			};

			const estimatedDays = Object.entries(updated)
				.filter(([key]) => key !== "extimated_date")
				.reduce((total, [, val]) => total + (Number(val) || 0), 0);

			return {
				...updated,
				extimated_date: estimatedDays,
			};
		});
	};

	return (
		<Sheet open={shouldOpen} onOpenChange={setShouldOpen}>
			<SheetTrigger asChild>
				<Button variant={"outline"} className="w-full">
					<CalendarCog />
				</Button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="mx-7 w-[425px] border-0 bg-transparent px-0 py-2 text-center"
			>
				<Card className="w-full p-5 py-4">
					<SheetHeader>
						<SheetTitle className="text-center text-2xl">
							Delivery Dates
						</SheetTitle>
					</SheetHeader>

					<div className="mt-5 grid grid-cols-2 gap-4 py-4">
						{deliveryDatesInputData.map((input) => (
							<Label
								key={input.name}
								htmlFor={input.name}
								className="flex flex-col"
							>
								{input.label}
								<Input
									id={input.name}
									type={input.type}
									// placeholder={input.placeholder}
									className="mt-2"
									value={values[input.name]}
									onChange={handleChange}
								/>
							</Label>
						))}
					</div>

					<div className="text-center">
						<Label
							htmlFor="estimated_days"
							className="flex flex-col"
						>
							Estimated Days
							<Input
								id="estimated_days"
								type="number"
								className="mt-2 bg-muted text-center"
								value={values.extimated_date || 0}
								disabled
							/>
						</Label>
					</div>
				</Card>
			</SheetContent>
		</Sheet>
	);
}
