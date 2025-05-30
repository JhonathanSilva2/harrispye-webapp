import { prismaBase } from "@/db/base-client";
import getUserFullProfile from "@/infra/get-user-full-profile";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const options: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "Username...",
				},
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				// const userReturn: User[] = await prismaBase.$queryRaw`
				// SELECT
				// 	u.id,
				// 	u.username,
				// 	u.password,
				// 	u.name,
				// 	u.display_name,
				// 	u.is_admin,
				// 	u.admission_date,
				// 	u.role,
				// 	u.hp_registration,
				// 	u.direct_manager,
				// 	GROUP_CONCAT(p.permission SEPARATOR ',') AS permissions
				// FROM users as u
				// 	LEFT JOIN users_permissions as up
				// 		ON u.hp_registration = up.user_id
				// 			LEFT JOIN permissions as p
				// 				ON up.permission_id = p.id
				// 					WHERE u.username = ${credentials!.email}
				// 						AND (up.end_at IS NULL OR up.end_at <= NOW())
				// 						GROUP BY
				// 							u.id,
				// 							u.username,
				// 							u.password,
				// 							u.name,
				// 							u.display_name,
				// 							u.is_admin,
				// 							u.admission_date,
				// 							u.role,
				// 							u.hp_registration,
				// 							u.direct_manager;`;

				// if (userReturn.length === 0) {
				// 	return null;
				// }

				// const user = userReturn[0];

				const user = await prismaBase.users.findFirst({
					where: {
						username: credentials!.email,
					},
					omit: {
						password: true,
						id_perfil: true,
						type_user: true,
					},
					include: {
						userAttributes: true,
					},
				});

				if (!user) {
					return null;
				}

				const password = await prismaBase.users.findFirst({
					where: {
						id: user.id,
					},
					select: {
						password: true,
					},
				});

				if (!password) {
					return null;
				}

				const match = await bcrypt.compare(
					credentials!.password,
					password.password,
				);

				if (match) {
					const userFullProfile = await getUserFullProfile(user);
					return {
						...userFullProfile,
						id: user.id.toString(), // Convert id from number to string
					};
				}

				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, account, user }) {
			if (account) {
				token = { ...user, id: parseInt(user.id) };
			}
			return token;
		},
		session({ session, token }) {
			if (session.user) {
				session.user.id = token.id;
				session.user.username = token.username;
				session.user.name = token.name;
				session.user.display_name = token.display_name;
				session.user.is_admin = token.is_admin;
				session.user.admission_date = token.admission_date;
				session.user.role = token.role;
				session.user.hp_registration = token.hp_registration;
				session.user.manager = token.manager;
				session.user.userAttributes = token.userAttributes;
				session.user.userAccessControl = token.userAccessControl;
			}
			return session;
		},
	},
	pages: {
		signIn: "/auth/signin",
		signOut: "/auth/signout",
		// error: "/auth/error",
	},
};

export default options;
