'use client'

import {useState} from "react";
import {Api} from "@/services/Api";

export default function EncryptedNote({username, noteId}) {
    const [formData, setFormData] = useState({
        password: ''
    })
    const [message, setMessage] = useState('')
    const [note, setNote] = useState({})


    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const res = await Api.get('note', {params: {username: username, noteId: noteId, password: formData.password}})
            console.log(res.data)
            res.data.noteContent = {__html: res.data.noteContent}
            setNote(res.data)
        } catch (e) {
            setMessage('Note fetch failed')
        }
    }

    return (
        <>
        {
            !note.title && (
            <div>
            <h1>Enter note password:</h1>
            <form onSubmit={handleSubmit}>
            <input required type="password" id="password" value={formData.password} minLength="1" maxLength="255"
            onChange={event => { setFormData({ ...formData, password: event.target.value }) } }></input>
            <input type="submit" value="Submit"></input>
            </form>
            <p>{ message }</p>
            </div>
            )
        }
        {
            note.title && (
            <div>
                <h3>{username}'s note</h3>
                <h2>{note.title}</h2>
                <div dangerouslySetInnerHTML={note.noteContent}/>
            </div>
            )
        }
        </>
    )
}
