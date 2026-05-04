import { NextResponse } from 'next/server'

import { prisma } from '@/src/lib'
import { ApiError, ErrorCode } from '@/src/lib/api-error'

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params

		const account = await prisma.account.findUnique({
			where: { id },
			include: { transactions: true }
		})

		return NextResponse.json({ account })
	} catch (error) {
		console.error('[ACCOUNT_GET] Ошибка сервера', error)
		const apiError: ApiError = {
			code: ErrorCode.SERVER,
			message: 'Ошибка сервера',
			status: 500
		}
		return NextResponse.json(apiError, { status: apiError.status })
	}
}
