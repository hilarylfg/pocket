import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/src/lib'
import { ApiError, ErrorCode } from '@/src/lib/api-error'

export async function GET(request: NextRequest) {
	try {
		const params = request.nextUrl.searchParams

		const scope = params.get('scope') || 'all'

		const categories = await prisma.category.findMany({
			where: { isSystem: scope === 'system' || scope === 'all' }
		})

		return NextResponse.json({ categories })
	} catch (error) {
		console.error('[CATEGORIES_GET] Ошибка сервера', error)
		const apiError: ApiError = {
			code: ErrorCode.SERVER,
			message: 'Ошибка сервера',
			status: 500
		}
		return NextResponse.json(apiError, { status: apiError.status })
	}
}
