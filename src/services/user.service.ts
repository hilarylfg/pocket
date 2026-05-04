import { User } from '@/prisma/generated/client'
import { prisma } from '@/src/lib'

class UserService {
	public async findProfile(id: string): Promise<User | null> {
		return prisma.user.findUnique({
			where: {
				id
			}
		})
	}
}

export const userService = new UserService()
