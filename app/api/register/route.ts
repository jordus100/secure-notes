import { registerFormSchema } from "@/services/Validator";
import { UserService } from "@/services/UserService";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json()
        const registrationData = registerFormSchema.parse(data)
        const totpSecret = await UserService.registerUser(registrationData)
        const totpUrl = UserService.generateTotpUrl(registrationData.username, totpSecret)
        return NextResponse.json({totpUrl: totpUrl}, { status: 200 })
    } catch (e) {
        console.log(e)
        return NextResponse.json({}, { status: 400 })
    }
}