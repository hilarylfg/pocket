import { NextResponse } from 'next/server'

import { ApiError, ErrorCode, getCurrentUser } from '@/src/lib'

export async function GET(request: Request) {
	try {
		const user = await getCurrentUser()

		if (!user) {
			return NextResponse.json(
				{
					code: ErrorCode.AUTH,
					message: 'Неавторизованный',
					status: 401
				},
				{ status: 401 }
			)
		}

		return NextResponse.json({ user })
	} catch (error) {
		console.error('[AUTH_ME_GET] Ошибка сервера', error)
		const apiError: ApiError = {
			code: ErrorCode.SERVER,
			message: 'Ошибка сервера',
			status: 500
		}
		return NextResponse.json(apiError, { status: apiError.status })
	}
}
