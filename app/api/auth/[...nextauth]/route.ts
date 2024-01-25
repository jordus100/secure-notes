import NextAuth, {NextAuthOptions} from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import {UserService} from "@/services/UserService";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'credentials',
            type: 'credentials',
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "password", type: "password" },
                totpToken: { label: "totpToken", type: "text" }
            },
            authorize: async (credentials, req) => {
                return UserService.authorizeUser(credentials)
            }
        }),
    ],
    session: {
        jwt: true,
        maxAge: 60 * 60
    },
    pages: {
        signIn: '/signin'
    }
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }