import {
	ArrowLeftRight,
	ChevronRight,
	CreditCard,
	LayoutDashboard,
	PieChart,
	PiggyBank,
	Receipt,
	Shield,
	TrendingUp,
	Wallet
} from 'lucide-react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider
} from '@/src/components'
import { userService } from '@/src/services'

const mainNav = [
	{ title: 'Обзор', icon: LayoutDashboard, url: '#', isActive: true },
	{ title: 'Переводы', icon: ArrowLeftRight, url: '#' },
	{ title: 'Платежи', icon: Receipt, url: '#', badge: '3' },
	{ title: 'Аналитика', icon: PieChart, url: '#' }
]

const productsNav = [
	{ title: 'Карты', icon: CreditCard, url: '#' },
	{ title: 'Накопления', icon: PiggyBank, url: '#' },
	{ title: 'Инвестиции', icon: TrendingUp, url: '#' },
	{ title: 'Страхование', icon: Shield, url: '#' }
]

export default async function Home() {
	const user = await userService.findProfile('cmmjfxopm000b1shicsi3d42y')

	return (
		<div className='flex h-dvh items-center justify-center bg-zinc-300 font-sans dark:bg-black'>
			<SidebarProvider>
				<Sidebar
					variant='sidebar'
					collapsible='none'
					className='bg-white p-3'
				>
					<SidebarHeader>
						<div className='flex items-center gap-3'>
							<div className='flex h-8 w-8 items-center justify-center rounded-md bg-black text-white'>
								<Wallet className='size-5' />
							</div>
							<span className='text-2xl font-bold text-black'>
								pocket
							</span>
						</div>
					</SidebarHeader>

					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel className='px-2 text-[11px] font-semibold uppercase text-gray-400'>
								Главное
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu className='gap-1.5'>
									{mainNav.map(item => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												isActive={item.isActive}
												className='group relative h-auto gap-3 rounded-[10px] px-3 py-2 text-[#525252] transition-all duration-150 hover:bg-[#f5f5f5] hover:text-[#0a0a0a] data-[active=true]:bg-[#0a0a0a] data-[active=true]:font-medium data-[active=true]:text-white data-[active=true]:hover:bg-[#0a0a0a] data-[active=true]:hover:text-white'
											>
												<a
													href={item.url}
													className='flex items-center gap-3'
												>
													<item.icon className='h-5 w-5 shrink-0 opacity-70 group-data-[active=true]:opacity-100' />
													<span className='flex-1 text-[13px]'>
														{item.title}
													</span>
												</a>
											</SidebarMenuButton>
											{item.badge && (
												<SidebarMenuBadge className='absolute right-3 top-1/2 bg-[#0a0a0a] text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center group-data-[active=true]:bg-white group-data-[active=true]:text-[#0a0a0a]'>
													{item.badge}
												</SidebarMenuBadge>
											)}
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>

						<SidebarGroup>
							<SidebarGroupLabel className='px-3 text-[11px] font-semibold uppercase text-gray-400'>
								Продукты
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu className='gap-0.5'>
									{productsNav.map(item => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton className='group h-auto gap-3 rounded-[10px] px-3 py-3 text-[#525252] transition-all duration-150 hover:bg-[#f5f5f5] hover:text-[#0a0a0a]'>
												<a
													href={item.url}
													className='flex items-center gap-3'
												>
													<item.icon className='h-5 w-5 shrink-0 opacity-70' />
													<span className='flex-1 text-[13px]'>
														{item.title}
													</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
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
		</div>
	)
}
