'use client'

import {useState} from "react";
import {passwordStrength} from "check-password-strength";
import {noteSchema, registerFormSchema} from "@/services/Validator";
import {Api} from "@/services/Api";
import {redirect, useRouter} from "next/navigation";

export default function AddNote() {
    const [formData, setFormData] = useState({
        title: '', note: '', isEncrypted: false, password: undefined
    })
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(!formData.isEncrypted){
            formData.password = undefined
        }
        let noteData
        try {
            noteData = noteSchema.parse(formData)
        } catch(e) {
            console.log(e)
            setMessage('Invalid note')
            return
        }
        try {
            const res = await Api.post('note', noteData)
            router.prefetch('/')
            router.push('/#')
        } catch (e) {
            console.log(e)
            setMessage('Note adding failed')
        }
    }
    return (
        <>
        <h1>Add new note</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">title:</label>
            <input type="text" id="title" value={formData.title} minLength="1" maxLength="100"
                   onChange={event => {
                       setFormData({...formData, title: event.target.value})
                   }}></input>
            <br/>
            <textarea value={formData.note}
              onChange={event => { setFormData({...formData, note: event.target.value}) } } />
            <br/>
            <label htmlFor="isEncrypted">Encrypt note?</label>
            <input type="checkbox" id="isEncrypted" name="Encrypt note?"
            onChange={event => { setFormData({...formData, isEncrypted: !formData.isEncrypted}) } }
            checked={formData.isEncrypted}
            />
            <br/>
            <label htmlFor="password">password:</label>
            <input type="password" id="password" value={formData.password} minLength="8" maxLength="255"
                   onChange={event => {
                       setFormData({...formData, password: event.target.value})
                   }}></input>
            <br/>
            <p>Password strength: { passwordStrength(formData.password).value }</p>
            <br/>
            <input type="submit" value="Save note"></input>
        </form>
        <p>{message}</p>
        </>
    )
}