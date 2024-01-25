import NextAuth, {NextAuthOptions} from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import {UserService} from "@/services/UserService";
import {authOptions} from "@/app/api/auth/[...nextauth]/AuthOptions";

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }