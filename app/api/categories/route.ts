import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/src/lib'

export async function GET(request: NextRequest) {
	const params = request.nextUrl.searchParams

	const scope = params.get('scope') || 'all'

	const categories = await prisma.category.findMany({
		where: { isSystem: scope === 'system' || scope === 'all' }
	})

	return NextResponse.json({ categories })
}
