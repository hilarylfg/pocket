import { userService } from '@/src/services'

const DEMO_USER_ID = 'cmmj8b663000beoesb74gm8h1'

export const getCurrentUser = async () => {
	// TODO: заменить на реальную auth
	return await userService.findProfile(DEMO_USER_ID)
}
