import AppraisalComponent from "@/components/appraisal";

const AppraisalPage = ({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	return <AppraisalComponent />;
};

export default AppraisalPage;
