'use client'

import { useState } from "react";
import {registerFormSchema} from "@/services/Validator";
import { Api } from '@/services/Api'
import { passwordStrength } from 'check-password-strength'
import QRCode from "react-qr-code";
import Link from "next/link";

export default function Register() {
    const [formData, setFormData] = useState({
        username: '', password: ''
    })
    const [message, setMessage] = useState('')
    const [totpUrl, setTotpUrl] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            registerFormSchema.parse(formData)
        } catch(e) {
            setMessage('Invalid registration data')
            return
        }
        try {
            const res = await Api.post('register', formData)
            setMessage('Registered successfully, scan the QR code in a TOTP authenticator app')
            setTotpUrl(res.data.totpUrl)
        } catch (e) {
            setMessage('Registration unsuccesful')
        }
    }

    return (
        <>
        <h1>Register:</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">username:</label>
            <input type="text" id="username" value={formData.username} minLength="1" maxLength="100"
                   onChange={event => { setFormData({ ...formData, username: event.target.value }) } }></input>
            <br/>
            <label htmlFor="password">password:</label>
            <input type="password" id="password" value={formData.password} minLength="8" maxLength="255"
                   onChange={event => { setFormData({ ...formData, password: event.target.value }) } }></input>
            <br/>
            <p>Password strength: { passwordStrength(formData.password).value }</p>
            <input type="submit" value="Register"></input>
        </form>
        <p>{ message }</p>
        <QRCode value={totpUrl}></QRCode>
        <br/>
        <button>
            <Link href="/">Go to homepage</Link>
        </button>
        </>
    )
}