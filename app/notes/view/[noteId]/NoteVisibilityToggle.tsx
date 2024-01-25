'use client'

import React from "react";
import {Api} from "@/services/Api";

export default function NoteVisibilityToggle({noteId, isNotePublic}) {
    const [isPublic, setIsPublic] = React.useState(isNotePublic)
    console.log(isNotePublic)

    const onBtnClick = async () => {
        try {
            const res = await Api.put('note', {noteId: noteId, isPublic: !isPublic})
            setIsPublic(res.data.isPublic)
        } catch(e) {
            console.log(e)
        }
    }

    return (
        <button onClick={e => {onBtnClick()}}>{isPublic ? 'Make private' : 'Make public'}</button>
    )
}