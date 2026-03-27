import { userService } from '@/src/services'

export async function GET(request: Request) {
	try {
		const user = await userService.findProfile('cmmjfxopm000b1shicsi3d42y')

		if (!user) {
			return new Response(JSON.stringify({ error: 'Invalid token' }), {
				status: 401
			})
		}

		return new Response(JSON.stringify({ user: user }), { status: 200 })
	} catch (error) {
		console.error('[ME_GET] Server error', error)
		return new Response(JSON.stringify({ error: 'Server error' }), {
			status: 500
		})
	}
}
