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
                return await prismaBase.$transaction(async (tx) => {
                    const user = await tx.users.findFirst({
                        where: {
                            username: credentials!.email,
                        },
                        omit: {
                            password: true,
                            id_perfil: true,
                            type_user: true,
                        },
                        include: {
                            user_attributes: true,
                        },
                    });

                    if (!user) {
                        return null;
                    }

                    const password = await tx.users.findFirst({
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
                        const userFullProfile = await getUserFullProfile(
                            user,
                            tx,
                        );
                        return {
                            ...userFullProfile,
                            id: user.id.toString(), // Convert id from number to string
                        };
                    }

                    return null;
                });
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
        async session({ session, token }) {
            if (session.user) {
                const userSession = await prismaBase.$transaction(
                    async (tx) => {
                        const user = await tx.users.findUnique({
                            where: {
                                id: token.id,
                            },
                            omit: {
                                password: true,
                                id_perfil: true,
                                type_user: true,
                            },
                            include: {
                                user_attributes: true,
                            },
                        });

                        if (!user) {
                            return null;
                        }

                        const userFullProfile = await getUserFullProfile(
                            user,
                            tx,
                        );

                        return userFullProfile;
                    },
                );
                if (userSession) {
                    session.user = userSession;
                }
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
