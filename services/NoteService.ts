import {database} from "@/services/DatabaseService";
import {noteSchema, sanitizeNoteContent} from "@/services/Validator";
import crypto from "crypto";

const db = await database()

const encrypt = (text, key, iv) => {
    key = crypto.pbkdf2Sync(key, iv, 100, 32, `sha512`)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
    let encrypted = cipher.update(text, 'utf-8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
};

const decrypt = (encryptedData, key, iv) => {
    key = crypto.pbkdf2Sync(key, iv, 100, 32, `sha512`)
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv, 'hex'))
    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8')
    decrypted += decipher.final('utf-8')
    return decrypted
}

export const NoteService = {
    addNote: async (noteData, username) => {
        noteData.note = sanitizeNoteContent(noteData.note)
        let salt, hash
        if(noteData.isEncrypted) {
            salt = crypto.randomBytes(16)
            hash = crypto.pbkdf2Sync(noteData.password, salt, 1000, 64, `sha512`).toString(`hex`);
            noteData.note = encrypt(noteData.note, noteData.password, salt)
        }
        await db.run("INSERT INTO Notes (title, noteContent, isEncrypted, hash, salt, username, isPublic) VALUES(?, ?, ?, ?, ?, ?, ?)",
            [noteData.title, noteData.note, noteData.isEncrypted, hash, salt, username, 0])
    },

    checkIfNoteEncrypted: async (noteId, username) => {
        const note = await db.get("SELECT isEncrypted FROM Notes WHERE ID = ? AND username = ?", [noteId, username])
        return (note.isEncrypted == 1)
    },

    getUnencryptedNote: async (noteId, username) => {
        return await db.get("SELECT * FROM Notes WHERE username = ? AND ID = ?", [username, noteId])
    },

    getEncryptedNote: async (noteId, username, password) => {
        const note = await db.get("SELECT * FROM Notes WHERE username = ? AND ID = ?", [username, noteId])
        if (!note) throw Error('No such note found')
        const hash = crypto.pbkdf2Sync(password, note.salt, 1000, 64, `sha512`).toString(`hex`);
        if (hash != note.hash) throw Error('Wrong note password')
        note.noteContent = decrypt(note.noteContent, password, note.salt)
        return note
    },

    getUserNotes: async (username) => {
        return await db.all("SELECT * FROM Notes WHERE username = ?", [username])
    },

    changeNoteVisibility: async (noteId, isPublic) => {
        return await db.run("UPDATE Notes SET isPublic = ? WHERE ID = ?", [isPublic, noteId])
    },

    getPublicNote: async (noteId) => {
        return await db.get("SELECT * FROM Notes WHERE ID = ? AND isPublic = 1", [noteId])
    }
}
