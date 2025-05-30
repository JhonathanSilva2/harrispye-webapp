import { getServerSession } from "next-auth";
import options from "./api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Home() {
	const session = await getServerSession(options);
	if (session) {
		redirect("/i");
	}
	redirect("/auth/signin");
}
