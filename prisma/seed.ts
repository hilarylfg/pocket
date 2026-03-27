import 'dotenv/config'

import { prisma } from '@/src/lib'
import {type Prisma} from "@/prisma/generated/client";

const systemCategories: Prisma.CategoryCreateInput[] = [
	{ name: 'Зарплата', emoji: '💰', isSystem: true },
	{ name: 'Фриланс', emoji: '💻', isSystem: true },
	{ name: 'Подарок', emoji: '🎁', isSystem: true },
	{ name: 'Продукты', emoji: '🛒', isSystem: true },
	{ name: 'Кафе и рестораны', emoji: '🍽️', isSystem: true },
	{ name: 'Транспорт', emoji: '🚌', isSystem: true },
	{ name: 'ЖКХ', emoji: '🏠', isSystem: true },
	{ name: 'Здоровье', emoji: '💊', isSystem: true },
	{ name: 'Развлечения', emoji: '🎬', isSystem: true },
	{ name: 'Одежда', emoji: '👗', isSystem: true },
	{ name: 'Переводы', emoji: '🔄', isSystem: true }
]

const userData: Prisma.UserCreateInput[] = [
	{
		phone: '+79001234567',
		firstName: 'Ivan',
		lastName: 'Petrov',
		avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=ivan',
		accounts: {
			create: [
				{
					type: 'DEBIT',
					currency: 'RUB',
					name: 'Основная карта'
				},
				{
					type: 'SAVINGS',
					currency: 'RUB',
					name: 'Накопительный счёт'
				}
			]
		}
	},
	{
		phone: '+79009876543',
		firstName: 'Daria',
		lastName: 'Sidorova',
		avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=daria',
		accounts: {
			create: [
				{
					type: 'DEBIT',
					currency: 'RUB',
					name: 'Дебетовая карта'
				}
			]
		}
	}
]

export async function main() {
	console.log('  → Creating system categories...')
	const createdCategories: Record<string, string> = {}
	for (const cat of systemCategories) {
		const created = await prisma.category.create({ data: cat })
		createdCategories[cat.name] = created.id
	}

	console.log('  → Creating users with accounts...')
	for (const u of userData) {
		await prisma.user.create({ data: u })
	}

	console.log('  → Creating transactions...')

	const ivan = await prisma.user.findFirst({
		where: { firstName: 'Ivan' },
		include: { accounts: true }
	})
	const daria = await prisma.user.findFirst({
		where: { firstName: 'Daria' },
		include: { accounts: true }
	})

	const ivanDebit = ivan!.accounts.find(a => a.type === 'DEBIT')!
	const ivanSavings = ivan!.accounts.find(a => a.type === 'SAVINGS')!
	const dariaDebit = daria!.accounts[0]

	await prisma.transaction.createMany({
		data: [
			{
				accountId: ivanDebit.id,
				amount: 15000000,
				type: 'INCOME',
				categoryId: createdCategories['Зарплата'],
				description: 'Зарплата за февраль'
			},
			{
				accountId: ivanDebit.id,
				amount: 2500000,
				type: 'INCOME',
				categoryId: createdCategories['Фриланс'],
				description: 'Проект по разработке сайта'
			},
			{
				accountId: ivanDebit.id,
				amount: 450000,
				type: 'EXPENSE',
				categoryId: createdCategories['Продукты'],
				description: 'Пятёрочка'
			},
			{
				accountId: ivanDebit.id,
				amount: 120000,
				type: 'EXPENSE',
				categoryId: createdCategories['Кафе и рестораны'],
				description: 'Обед в кафе'
			},
			{
				accountId: ivanDebit.id,
				amount: 320000,
				type: 'EXPENSE',
				categoryId: createdCategories['ЖКХ'],
				description: 'Оплата квартиры'
			}
		]
	})

	const transferOut = await prisma.transaction.create({
		data: {
			accountId: ivanDebit.id,
			amount: 3000000,
			type: 'TRANSFER_OUT',
			categoryId: createdCategories['Переводы'],
			description: 'Перевод на накопительный счёт'
		}
	})
	await prisma.transaction.create({
		data: {
			accountId: ivanSavings.id,
			amount: 3000000,
			type: 'TRANSFER_IN',
			categoryId: createdCategories['Переводы'],
			description: 'Пополнение с дебетовой карты',
			relatedTransactionId: transferOut.id
		}
	})

	await prisma.transaction.update({
		where: { id: transferOut.id },
		data: { relatedTransactionId: transferOut.id }
	})

	await prisma.transaction.createMany({
		data: [
			{
				accountId: dariaDebit.id,
				amount: 9000000,
				type: 'INCOME',
				categoryId: createdCategories['Зарплата'],
				description: 'Зарплата за февраль'
			},
			{
				accountId: dariaDebit.id,
				amount: 500000,
				type: 'INCOME',
				categoryId: createdCategories['Подарок'],
				description: 'Подарок на день рождения'
			},
			{
				accountId: dariaDebit.id,
				amount: 870000,
				type: 'EXPENSE',
				categoryId: createdCategories['Одежда'],
				description: 'Зимние сапоги'
			},
			{
				accountId: dariaDebit.id,
				amount: 230000,
				type: 'EXPENSE',
				categoryId: createdCategories['Здоровье'],
				description: 'Аптека'
			},
			{
				accountId: dariaDebit.id,
				amount: 90000,
				type: 'EXPENSE',
				categoryId: createdCategories['Транспорт'],
				description: 'Карточка метро'
			},
			{
				accountId: dariaDebit.id,
				amount: 150000,
				type: 'EXPENSE',
				categoryId: createdCategories['Развлечения'],
				description: 'Кино с друзьями'
			}
		]
	})

	console.log('Seeding complete')
}

main()
