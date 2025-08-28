import Image from "next/image";

interface SidebarLogoProps {
    isExpanded: boolean;
}

export const SidebarLogo = ({ isExpanded }: SidebarLogoProps) => {
    return (
        <Image
            src={
                isExpanded
                    ? "/images/horizontal-logo.png"
                    : "/images/logo-icon.png"
            }
            alt="logo"
            width={isExpanded ? 180 : 50}
            height={isExpanded ? 80 : 50}
            className="mx-auto"
        />
    );
};
