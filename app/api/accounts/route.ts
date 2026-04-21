import { NextResponse } from 'next/server'

import { ErrorCode, getCurrentUser, prisma } from '@/src/lib'

export async function GET(request: Request) {
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

	const accounts = await prisma.account.findMany({
		where: { userId: user.id },
		include: {
			transactions: { take: 3, orderBy: { createdAt: 'desc' } }
		}
	})

	return NextResponse.json({ accounts })
}
