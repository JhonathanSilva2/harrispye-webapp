import { UserFullProfile } from "@/app/types";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		// what I want in the session add to UserSession
		user: UserSession & DefaultSession["user"];
	}
	type UserSession = UserFullProfile;
	interface User extends UserFullProfile {
		name: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends UserFullProfile {
		name: string;
	}
}
