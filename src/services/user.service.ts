import { prisma } from '@/src/lib'

class UserService {
	public async findProfile(id: string) {
		return prisma.user.findUnique({
			where: {
				id
			}
		})
	}
}

export const userService = new UserService()
