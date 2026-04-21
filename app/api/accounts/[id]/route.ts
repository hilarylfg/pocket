import { NextResponse } from 'next/server'

import { prisma } from '@/src/lib'

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params

	const account = await prisma.account.findUnique({
		where: { id },
		include: { transactions: true }
	})

	return NextResponse.json({ account })
}
