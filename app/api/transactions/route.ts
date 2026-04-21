import { NextRequest, NextResponse } from 'next/server'

import { TransactionType } from '@/prisma/generated/enums'
import {
	type ApiError,
	ErrorCode,
	type Result,
	getCurrentUser,
	prisma
} from '@/src/lib'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

interface QueryParams {
	categoryId?: string
	type?: TransactionType
	from?: Date
	to?: Date
	limit: number
}

interface TransactionRequest {
	accountId: string
	type: TransactionType
	amount: number
	categoryId: string
	description?: string
}

function parseQuery(request: NextRequest): Result<QueryParams, ApiError> {
	const params = request.nextUrl.searchParams

	const limit = Number(params.get('limit') || DEFAULT_LIMIT)
	if (Number.isNaN(limit) || limit < 1) {
		return {
			ok: false,
			error: {
				code: ErrorCode.BAD_REQUEST,
				message: '"limit" должен быть положительным целым числом',
				status: 400
			}
		}
	}

	const typeValue = params.get('type')
	const type = typeValue
		? Object.values(TransactionType).includes(typeValue as TransactionType)
			? (typeValue as TransactionType)
			: null
		: undefined

	if (typeValue !== null && type === null) {
		return {
			ok: false,
			error: {
				code: ErrorCode.BAD_REQUEST,
				message: `Ожидаемый "type". Ожидаемый: ${Object.values(TransactionType).join(', ')}`,
				status: 400
			}
		}
	}

	const fromValue = params.get('from')
	const toValue = params.get('to')
	const from = fromValue ? new Date(fromValue) : undefined
	const to = toValue ? new Date(toValue) : undefined

	if (fromValue && Number.isNaN(from!.getTime())) {
		return {
			ok: false,
			error: {
				code: ErrorCode.BAD_REQUEST,
				message: '"from" должна быть указана действительная дата',
				status: 400
			}
		}
	}

	if (toValue && Number.isNaN(to!.getTime())) {
		return {
			ok: false,
			error: {
				code: ErrorCode.BAD_REQUEST,
				message: '"to" должна быть указана действительная дата',
				status: 400
			}
		}
	}

	const categoryId = params.get('categoryId') || undefined

	return {
		ok: true,
		data: {
			categoryId,
			type: type as TransactionType,
			from,
			to,
			limit: Math.min(limit, MAX_LIMIT)
		}
	}
}

export async function GET(request: NextRequest) {
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

	const parsed = parseQuery(request)
	if (!parsed.ok) {
		return NextResponse.json(parsed.error, { status: parsed.error.status })
	}

	const transactions = await prisma.transaction.findMany({
		where: {
			account: { userId: user.id },
			...(parsed.data.categoryId && {
				categoryId: parsed.data.categoryId
			}),
			...(parsed.data.type && { type: parsed.data.type }),
			...(parsed.data.from || parsed.data.to
				? {
						createdAt: {
							...(parsed.data.from && { gte: parsed.data.from }),
							...(parsed.data.to && { lte: parsed.data.to })
						}
					}
				: {})
		},
		take: parsed.data.limit,
		orderBy: { createdAt: 'desc' }
	})

	return NextResponse.json({ transactions })
}

export async function POST(request: NextRequest) {
	try {
		const body: TransactionRequest = await request.json()
		const { accountId, type, amount, categoryId, description } = body

		if (!accountId || !type || !amount || amount <= 0) {
			const error: ApiError = {
				code: ErrorCode.VALIDATION,
				message: 'Некорректные данные транзакции',
				status: 400
			}
			return NextResponse.json(error, { status: error.status })
		}

		const transaction = await prisma.transaction.create({
			data: {
				type: type,
				amount: amount,
				accountId: accountId,
				categoryId: categoryId,
				description: description || ''
			}
		})

		return NextResponse.json({
			success: true,
			transaction
		})
	} catch (error) {
		console.error('[TRANSACTION_POST] Ошибка сервера', error)
		const apiError: ApiError = {
			code: ErrorCode.SERVER,
			message: 'Ошибка сервера',
			status: 500
		}
		return NextResponse.json(apiError, { status: apiError.status })
	}
}
