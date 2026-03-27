import { type ClassValue, clsx } from 'clsx'
import { SignJWT, jwtVerify } from 'jose'
import { twMerge } from 'tailwind-merge'

import { User } from '@/prisma/generated/client'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

function getSecret(): Uint8Array {
	const secret = process.env.AUTH_SECRET
	if (!secret) throw new Error('AUTH_SECRET не задан в переменных окружения')
	return new TextEncoder().encode(secret)
}

export async function createSessionToken(user: User): Promise<string> {
	return new SignJWT({ ...user })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('30d')
		.sign(getSecret())
}

export async function verifySessionToken(token: string): Promise<User | null> {
	try {
		const { payload } = await jwtVerify(token, getSecret())

		if (
			typeof payload.id !== 'string' ||
			typeof payload.phone !== 'string' ||
			typeof payload.avatar !== 'string' ||
			typeof payload.firstName !== 'string' ||
			typeof payload.lastName !== 'string'
		) {
			return null
		}

		return {
			id: payload.id,
			phone: payload.phone,
			avatar: payload.avatar,
			firstName: payload.firstName,
			lastName: payload.lastName
		}
	} catch {
		return null
	}
}
