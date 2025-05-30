import React from "react";
import AddSpoolButton from "./add-spool-button";
import EditTableToggle from "./edit-table-toggle";

interface TableHeaderProps {
	job: string;
	onToggle?: (isEditing: boolean) => void;
}
export default function TableHeader({ job, onToggle }: TableHeaderProps) {
	return (
		<div className="gapx-2 flex">
			<AddSpoolButton job={job} />
			<EditTableToggle onToggle={onToggle} />
		</div>
	);
}
