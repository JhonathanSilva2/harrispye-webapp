import FileStorageImage from "../file-storage/image";

interface SidebarLogoProps {
	isExpanded: boolean;
}

export const SidebarLogo = ({ isExpanded }: SidebarLogoProps) => {
	return (
		<FileStorageImage
			src={
				isExpanded
					? "images/horizontal-logo.svg"
					: "images/logo-icon.svg"
			}
			alt="logo"
			width={isExpanded ? 180 : 50}
			height={isExpanded ? 80 : 50}
			className="mx-auto"
		/>
	);
};
