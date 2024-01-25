import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NoteService} from "@/services/NoteService";
import {redirect} from "next/navigation";
import EncryptedNote from "@/app/notes/view/[noteId]/EncryptedNote";
import {catchClause} from "@babel/types";

export default async function ViewNote({ params }: { params: { noteId: string } }) {
    const session = await getServerSession(authOptions)
    const publicNote = await NoteService.getPublicNote(Number(params.noteId))
    if(publicNote) {
        return (
            <>
                <h3>{publicNote.username}'s note</h3>
                <h2>{publicNote.title}</h2>
                <div>
                    {publicNote.noteContent}
                </div>
            </>
        )
    }
    else if(session?.user.name) {
        try {
            if (!(await NoteService.checkIfNoteEncrypted(Number(params.noteId), session.user.name))) {
                const note = await NoteService.getUnencryptedNote(Number(params.noteId), session.user.name)
                if (note) {
                    return (
                        <>
                            <h3>{session.user.name}'s note</h3>
                            <h2>{note.title}</h2>
                            <div>
                                {note.noteContent}
                            </div>
                        </>
                    )
                } else {
                    redirect('/')
                }
            } else {
                return <><EncryptedNote username={session.user.name} noteId={Number(params.noteId)}/></>
            }
        } catch(e) {
            redirect('/')
        }
    } else {
        redirect('/')
    }
}