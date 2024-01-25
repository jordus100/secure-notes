import { database } from "@/services/DatabaseService";
import crypto from 'crypto'
import { authenticator } from 'otplib';

const db = await database()

export const UserService = {
    registerUser: async (registerData) => {
        const checkUser = await db.get("SELECT 1 FROM Users WHERE username = ?", registerData.username)
        if(checkUser) throw Error('User already exists!')
        const secret = authenticator.generateSecret()
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(registerData.password, salt, 1000, 64, `sha512`).toString(`hex`);
        await db.run("INSERT INTO Users (username, hash, salt, secret) VALUES (?, ?, ?, ?)", [registerData.username, hash, salt, secret])
        return secret
    },

    generateTotpUrl: (username, secret) => {
        return authenticator.keyuri(username, 'finalnotes', secret)
    },

    authorizeUser: async (credentials) => {
        const user = await db.get("SELECT * FROM Users WHERE username = ?", credentials.username)
        if (!user) return undefined
        const hash = crypto.pbkdf2Sync(credentials.password, user.salt, 1000, 64, `sha512`).toString(`hex`);
        if (hash != user.hash) return undefined
        if (!authenticator.check(credentials.totpToken, user.secret)) return undefined
        return {
            name: user.username,
        }
    }
}