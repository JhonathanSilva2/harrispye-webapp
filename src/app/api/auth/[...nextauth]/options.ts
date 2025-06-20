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
