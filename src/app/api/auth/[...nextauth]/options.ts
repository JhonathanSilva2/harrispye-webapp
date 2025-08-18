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

                    if (!user || !user.ativo) {
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
        async jwt({ token, account, user, session }) {
            if (account) {
                return { ...user, id: parseInt(user.id) };
            }

            const userSession = await prismaBase.$transaction(async (tx) => {
                const userDb = await tx.users.findUnique({
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

                if (!userDb) {
                    return null;
                }

                const userFullProfile = await getUserFullProfile(userDb, tx);

                return userFullProfile;
            });

            if (!userSession || !userSession.ativo) {
                token = {
                    ...token,
                    ...userSession,
                    ativo: false,
                };
            }

            return {
                ...token,
                ...userSession,
            };
        },
        async session({ session, token }) {
            session.user = {
                ...token,
            };

            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error",
    },
};

export default options;
