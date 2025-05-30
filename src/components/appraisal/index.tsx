import ManagerAssessment from "./manager-assessment";
import SelfAssessment from "./self-assessment";

const AppraisalComponent = () => {
	return (
		<div className="mx-auto p-2 md:p-4">
			<h1 className="mb-6 text-center text-3xl md:mb-10 md:text-4xl">
				Appraisal
			</h1>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-2">
				<SelfAssessment />
				<ManagerAssessment />
			</div>
		</div>
	);
};

export default AppraisalComponent;
