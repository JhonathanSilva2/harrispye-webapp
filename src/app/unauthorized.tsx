import { redirect } from "next/navigation";

const Unauthorized = () => {
	redirect("/auth/signin?error=Unauthorized");
};

export default Unauthorized;
