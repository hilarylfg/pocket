import { NextRequest, NextResponse } from 'next/server'

import { TransactionType } from '@/prisma/generated/enums'
import { prisma } from '@/src/lib'
import { ApiError, ErrorCode } from '@/src/lib/api-error'

interface TransferRequest {
	fromAccountId: string
	toAccountId: string
	amount: number
	description?: string
}

export async function POST(request: NextRequest) {
	try {
		const body: TransferRequest = await request.json()
		const { fromAccountId, toAccountId, amount, description } = body

		if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
			const error: ApiError = {
				code: ErrorCode.VALIDATION,
				message: 'Некорректные данные для перевода',
				status: 400
			}
			return NextResponse.json(error, { status: error.status })
		}

		if (fromAccountId === toAccountId) {
			const error: ApiError = {
				code: ErrorCode.VALIDATION,
				message: 'Невозможно перевести на тот же счет',
				status: 400
			}
			return NextResponse.json(error, { status: error.status })
		}

		const transferCategory = await prisma.category.findFirst({
			where: {
				name: 'Переводы',
				isSystem: true
			}
		})

		if (!transferCategory) {
			const error: ApiError = {
				code: ErrorCode.SERVER,
				message: 'Системная категория для переводов не найдена',
				status: 500
			}
			return NextResponse.json(error, { status: error.status })
		}

		const result = await prisma.$transaction(async tx => {
			const transferOut = await tx.transaction.create({
				data: {
					type: TransactionType.TRANSFER_OUT,
					amount: Math.round(amount),
					accountId: fromAccountId,
					categoryId: transferCategory.id,
					description: description || ''
				}
			})

			const transferIn = await tx.transaction.create({
				data: {
					type: TransactionType.TRANSFER_IN,
					amount: Math.round(amount),
					accountId: toAccountId,
					categoryId: transferCategory.id,
					description: description || '',
					relatedTransactionId: transferOut.id
				}
			})

			await tx.transaction.update({
				where: { id: transferOut.id },
				data: { relatedTransactionId: transferIn.id }
			})

			return { transferOut, transferIn }
		})

		return NextResponse.json({
			success: true,
			result
		})
	} catch (error) {
		console.error('[TRANSFERS_POST] Ошибка сервера', error)
		const apiError: ApiError = {
			code: ErrorCode.SERVER,
			message: 'Ошибка сервера',
			status: 500
		}
		return NextResponse.json(apiError, { status: apiError.status })
	}
}
