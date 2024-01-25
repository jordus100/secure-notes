import {noteSchema, registerFormSchema} from "@/services/Validator";
import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/AuthOptions";
import {NoteService} from "@/services/NoteService";

export async function POST(req: Request) {
    try {
        const data = await req.json()
        const noteData = noteSchema.parse(data)
        const session = await getServerSession(authOptions)
        if(session) {
            NoteService.addNote(noteData, session.user.name)
        } else {
            return NextResponse.json({}, { status: 403 })
        }
        return NextResponse.json({}, { status: 200 })
    } catch (e) {
        console.log(e)
        return NextResponse.json({}, { status: 400 })
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const noteId = searchParams.get('noteId')
        const password = searchParams.get('password')
        const session = await getServerSession(authOptions)
        if(session) {
            const note = await NoteService.getEncryptedNote(noteId, session.user.name, password)
            return NextResponse.json(note, { status: 200 })
        } else {
            return NextResponse.json({}, { status: 403 })
        }
    } catch (e) {
        console.log(e)
        return NextResponse.json({}, { status: 400 })
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json()
        const session = await getServerSession(authOptions)
        if(session) {
            await NoteService.changeNoteVisibility(data.noteId, data.isPublic)
            return NextResponse.json({isPublic: data.isPublic}, { status: 200 })
        } else {
            return NextResponse.json({}, { status: 403 })
        }
    } catch(e) {
        console.log(e)
        return NextResponse.json({}, { status: 400 })
    }
}