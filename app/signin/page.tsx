'use client'

import {useEffect, useState} from "react";
import {signIn, useSession} from "next-auth/react";
import {redirect, useRouter} from "next/navigation";
import Link from "next/link";

export default function SignInForm() {
    const [formData, setFormData] = useState({
        username: '', password: '', token: ''
    })
    const [message, setMessage] = useState('')
    const { data: session, status } = useSession()
    const router = useRouter()

    const handleSubmit = async (event) => {
        event?.preventDefault()
        const res = await signIn('credentials', {username: formData.username, password: formData.password, totpToken: formData.token, redirect: false})
        if (res.ok) {
            router.push('/')
        } else {
            setMessage('Logging in failed')
        }
    }

    return (
        <>
            <h1>Log in:</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">username:</label>
                <input type="text" id="username" value={formData.username} minLength="1" maxLength="100"
                       onChange={event => {
                           setFormData({...formData, username: event.target.value})
                       }}></input>
                <br/>
                <label htmlFor="password">password:</label>
                <input type="password" id="password" value={formData.password} minLength="8" maxLength="255"
                       onChange={event => {
                           setFormData({...formData, password: event.target.value})
                       }}></input>
                <br/>
                <label htmlFor="token">TOTP token</label>
                <input type="password" id="token" value={formData.token}
                       onChange={event => {
                           setFormData({...formData, token: event.target.value})
                       }}></input>
                <br/>
                <input type="submit" value="Log in"></input>
                <br/>
                <Link href="register">...or register</Link>
            </form>
            <p>{message}</p>
        </>
    )
}