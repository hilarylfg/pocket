import { User } from '@/prisma/generated/client'

export type SessionUser = Omit<User, 'createdAt' | 'updatedAt'>
