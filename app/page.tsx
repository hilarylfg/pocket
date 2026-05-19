import {
	ArrowLeftRight,
	Bell,
	ChevronRight,
	CreditCard,
	LayoutDashboard,
	MessageCircle,
	PieChart,
	PiggyBank,
	Receipt,
	Search,
	Shield,
	TrendingUp,
	Wallet
} from 'lucide-react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Input,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarNavMenu,
	SidebarProvider
} from '@/src/components'
import { userService } from '@/src/services'

const mainNav = [
	{ title: 'Обзор', Icon: LayoutDashboard, url: '#', isActive: true },
	{ title: 'Переводы', Icon: ArrowLeftRight, url: '#' },
	{ title: 'Платежи', Icon: Receipt, url: '#', badge: '3' },
	{ title: 'Аналитика', Icon: PieChart, url: '#' }
]

const productsNav = [
	{ title: 'Карты', Icon: CreditCard, url: '#' },
	{ title: 'Накопления', Icon: PiggyBank, url: '#' },
	{ title: 'Инвестиции', Icon: TrendingUp, url: '#' },
	{ title: 'Страхование', Icon: Shield, url: '#' }
]

export default async function Home() {
	const user = await userService.findProfile('cmmj8b663000beoesb74gm8h1')

	return (
		<div className='flex h-dvh bg-secondary font-sans'>
			<SidebarProvider>
				<Sidebar
					className='bg-background border-r border-solid'
					collapsible='none'
				>
					<SidebarHeader className='p-4 border-b border-solid'>
						<div className='flex items-center gap-3'>
							<div className='flex size-8 items-center justify-center rounded-md bg-foreground text-primary-foreground'>
								<Wallet className='size-5' />
							</div>
							<span className='text-l font-bold text-primary'>
								pocket
							</span>
						</div>
					</SidebarHeader>

					<SidebarContent>
						<SidebarNavMenu titleTab='Главное' tabs={mainNav} />
						<SidebarNavMenu
							titleTab='Продукты'
							tabs={productsNav}
						/>
					</SidebarContent>
					<SidebarFooter>
						<div className='flex cursor-pointer items-center gap-3 rounded-[10px] p-2 transition-colors duration-150 hover:bg-[#f5f5f5]'>
							<Avatar>
								<AvatarImage src={user?.avatar || ''} />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className='flex min-w-0 flex-1 flex-col'>
								<span className='truncate text-[13px] font-medium text-black'>
									{user?.firstName}
								</span>
								<span className='text-[11px] text-muted-foreground'>
									Премиум клиент
								</span>
							</div>
							<ChevronRight className='h-4 w-4 shrink-0 text-muted-foreground' />
						</div>
					</SidebarFooter>
				</Sidebar>
			</SidebarProvider>
			<div className='w-full h-[65px] border-b border-solid bg-background flex items-center px-8'>
				<div className='flex items-center relative w-full max-w-120'>
					<Search className='absolute size-4 left-3 top-1/2 -translate-y-1/2' />
					<Input
						className='pl-9 py-5'
						placeholder='Поиск по операциям, картам, счетам...'
					/>
				</div>
				<div className='flex ml-auto items-center gap-2'>
					<Button variant='ghost' className='size-10'>
						<Bell className='size-5' />
					</Button>
					<Button variant='ghost' className='size-10'>
						<MessageCircle className='size-5' />
					</Button>
				</div>
			</div>
		</div>
	)
}
