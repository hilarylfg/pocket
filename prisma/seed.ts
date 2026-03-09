import 'dotenv/config'

import { Prisma } from '@/app/generated/prisma/client'

import { prisma } from '@/src/lib'

const userData: Prisma.UserCreateInput[] = []

export async function main() {
	for (const u of userData) {
		await prisma.user.create({ data: u })
	}
}

main()
