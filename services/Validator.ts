import {boolean, object, optional, string} from 'zod'
import sanitizeHtml from 'sanitize-html';

export const registerFormSchema = object({
    username: string().min(1).max(100),
    password: string().min(8).max(255),
})

export const noteSchema = object({
    title: string().min(1).max(100),
    note: string(),
    isEncrypted: boolean(),
    password: string().min(8).max(255).optional()
})

export const sanitizeNoteContent = (noteContent) => {
    return sanitizeHtml(noteContent, {
        allowedTags: [ 'b', 'i', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'a'],
        disallowedTagsMode: 'escape'
    })
}