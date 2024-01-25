import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {redirect} from "next/navigation";
import {NoteService} from "@/services/NoteService";
import Link from "next/link";
import NoteVisibilityToggle from "@/app/notes/view/[noteId]/NoteVisibilityToggle";
import { revalidatePath } from 'next/cache'

export default async function Home() {
  const session = await getServerSession(authOptions)
    revalidatePath('/')
  if(session?.user.name) {
    const notes = await NoteService.getUserNotes(session.user.name)
    return (
        <main>
        <h1>Hello {session.user.name}</h1>
        <br/><br/><br/>
          <ul>
          { notes.map(note => (
            <li><Link href={"/notes/view/" + note.ID.toString()}>{note.title}</Link><br/>
                {note.isEncrypted ? null : <NoteVisibilityToggle noteId = {note.ID} isNotePublic = {note.isPublic}/>}
            </li>
            ))}
          </ul>
        <br/><br/><br/>
        <Link href="notes/add">Add new note</Link>
        <br/>
        <Link href="/api/auth/signout">Sign out</Link>
        </main>
    );
  } else {
    redirect('/signin')
  }
}
