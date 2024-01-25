import Image from "next/image";
import styles from "./page.module.css";
import {SessionProvider} from "next-auth/react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {redirect} from "next/navigation";
import {NoteService} from "@/services/NoteService";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions)
  if(session?.user.name) {
    const notes = await NoteService.getUserNotes(session.user.name)
    return (
        <main>
        <h1>Hello {session.user.name}</h1>
        <br/><br/><br/>
          <ul>
          { notes.map(note => (
            <li><Link href={"/notes/view/" + note.ID.toString()}>note.title</Link></li>
            ))}
          </ul>
        </main>
    );
  } else {
    redirect('/signin')
  }
}
