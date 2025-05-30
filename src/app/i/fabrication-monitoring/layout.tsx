import { Metadata } from "next";
import { JSX } from "react";

export const metadata: Metadata = {
	title: "Fabrication Monitoring",
	description:
		"Fabrication Monitoring tool to track the progress of fabrication",
};

const FabricationMonitoringLayout = ({
	children,
}: {
	children: JSX.Element;
}) => {
	return children;
};

export default FabricationMonitoringLayout;
