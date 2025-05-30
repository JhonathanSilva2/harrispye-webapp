import { FabricationMonitoringFetchReturn } from "@/app/api/fabrication-monitoring/route";
import { AlertDialogComponent } from "@/components/alert";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clientEnv } from "@/lib/constants/config";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Edit2, MoreHorizontal, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteJob } from "../[job]/_actions/delete-job";
import { EditDialog } from "./edit-dialog";

export const ActionsCell: React.FC<{
	row: Row<FabricationMonitoringFetchReturn>;
}> = ({ row }) => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const queryClient = useQueryClient();

	return (
		<>
			<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenuTrigger asChild>
					<Button className="h-6" variant="ghost">
						<MoreHorizontal />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuLabel className="text-center">
						{row.getValue("hp")}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem
							onClick={() =>
								router.push(
									`${clientEnv.NEXT_PUBLIC_URL}/i/fabrication-monitoring/${row.getValue(
										"hp",
									)}`,
								)
							}
						>
							<Send />
							<span>Summary</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={(e) => {
								e.preventDefault();
								setIsEditDialogOpen(true);
							}}
						>
							<Edit2 />
							<span>Edit</span>
						</DropdownMenuItem>
						<AlertDialogComponent
							onConfirm={async () => {
								await deleteJob(row.getValue("hp"));
								queryClient.invalidateQueries({
									queryKey: ["fab-mon-jobs"],
								});
								setIsOpen(false);
							}}
							triggerBtn={
								<DropdownMenuItem
									onSelect={(e) => e.preventDefault()}
								>
									<Trash2 />
									<span>Delete</span>
								</DropdownMenuItem>
							}
						/>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			{isEditDialogOpen && (
				<EditDialog
					mode="edit"
					hp={row.getValue("hp")}
					open={isEditDialogOpen}
					setOpen={setIsEditDialogOpen}
				/>
			)}
		</>
	);
};
