import sqlite3 from "sqlite3";
import { open } from 'sqlite'

let dbDriver

export const database = async () => {
    if(!dbDriver) {
        dbDriver = await open({filename: '/tmp/notes_db', driver: sqlite3.Database})
        await initDatabase()
        return dbDriver
    }
    return dbDriver
}

const initDatabase = async () => {
    await dbDriver.exec('CREATE TABLE IF NOT EXISTS Users (username TEXT, hash TEXT, salt TEXT, secret TEXT, id INTEGER PRIMARY KEY)')
    await dbDriver.exec('CREATE TABLE IF NOT EXISTS Notes (title TEXT, noteContent TEXT, isEncrypted INT, hash TEXT, salt TEXT, username INTEGER, isPublic INTEGER, ID INTEGER PRIMARY KEY, FOREIGN KEY (username) REFERENCES Users(username))')
    await dbDriver.exec('CREATE TABLE IF NOT EXISTS Logins (username TEXT, attemptNumber INT, lastAttempt INT)')
}