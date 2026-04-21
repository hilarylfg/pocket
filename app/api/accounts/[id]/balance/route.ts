import { NextResponse } from 'next/server'

import { prisma } from '@/src/lib'

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params

	const transactions = await prisma.transaction.findMany({
		where: { accountId: id }
	})

	const balance = transactions.reduce((acc, t) => {
		if (t.type === 'INCOME') return acc + t.amount
		if (t.type === 'EXPENSE') return acc - t.amount
		if (t.type === 'TRANSFER_IN') return acc + t.amount
		if (t.type === 'TRANSFER_OUT') return acc - t.amount
		return acc
	}, 0)

	const incomeTotal = transactions
		.filter(transaction => transaction.type === 'INCOME')
		.map(transaction => transaction.amount)
		.reduce((a, b) => a + b, 0)

	const expenseTotal = transactions
		.filter(transaction => transaction.type === 'EXPENSE')
		.map(transaction => transaction.amount)
		.reduce((a, b) => a + b, 0)

	return NextResponse.json({
		accountId: id,
		balance,
		incomeTotal,
		expenseTotal,
		computedAt: new Date()
	})
}
