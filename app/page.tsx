import { prisma } from '@/src/lib'

export default async function Home() {
	const debit = await prisma.account.findFirst({
		where: {
			userId: 'cmmjfxopm000b1shicsi3d42y'
		}
	})

	return (
		<div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
			<main className='flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-gray-200 dark:bg-black'>
				{debit && (
					<div className='text-gray-900'>
						{debit.name}
						{debit.currency}
					</div>
				)}
			</main>
		</div>
	)
}
