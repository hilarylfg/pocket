import {
	ArrowLeftRight,
	ChevronRight,
	CreditCard,
	HelpCircle,
	LayoutDashboard,
	PieChart,
	PiggyBank,
	Receipt,
	Settings,
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

const systemNav = [
	{ title: 'Настройки', icon: Settings, url: '#' },
	{ title: 'Помощь', icon: HelpCircle, url: '#' }
]

export default async function Home() {
	const user = await userService.findProfile('cmmj8b663000beoesb74gm8h1')

	return (
		<div className='flex h-dvh items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
			<div className='flex h-10/12 w-5/6 rounded-2xl bg-gray-200 dark:bg-black'>
				<SidebarProvider>
					<Sidebar
						variant='sidebar'
						collapsible='none'
						className='h-full rounded-l-2xl bg-gray-300'
					>
						<SidebarHeader className='p-5'>
							<div className='flex items-center gap-3'>
								<div className='flex size-10 items-center justify-center rounded-md bg-foreground text-background'>
									<Wallet className='size-6' />
								</div>
								<span className='text-2xl font-bold tracking-tight'>
									pocket
								</span>
							</div>
						</SidebarHeader>

						<SidebarContent className='p-3'>
							<SidebarGroup>
								<SidebarGroupLabel>Главное</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										{mainNav.map(item => (
											<SidebarMenuItem key={item.title}>
												<SidebarMenuButton
													isActive={item.isActive}
												>
													<a
														href={item.url}
														className='flex items-center gap-2'
													>
														<item.icon className='h-5 w-5' />
														<span>
															{item.title}
														</span>
													</a>
												</SidebarMenuButton>
												{item.badge && (
													<SidebarMenuBadge>
														{item.badge}
													</SidebarMenuBadge>
												)}
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>

							<SidebarGroup>
								<SidebarGroupLabel>Продукты</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										{productsNav.map(item => (
											<SidebarMenuItem key={item.title}>
												<SidebarMenuButton>
													<a
														href={item.url}
														className='flex items-center gap-2'
													>
														<item.icon className='h-5 w-5' />
														<span>
															{item.title}
														</span>
													</a>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>

							<SidebarGroup>
								<SidebarGroupLabel>Система</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										{systemNav.map(item => (
											<SidebarMenuItem key={item.title}>
												<SidebarMenuButton>
													<a
														href={item.url}
														className='flex items-center gap-2'
													>
														<item.icon className='h-5 w-5' />
														<span>
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

						<SidebarFooter className='border-t border-border/50 p-4'>
							<div className='flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent'>
								<Avatar>
									<AvatarImage src={user?.avatar || ''} />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div className='flex flex-1 flex-col overflow-hidden'>
									<span className='truncate text-sm font-medium'>
										Алексей К.
									</span>
									<span className='text-xs text-muted-foreground'>
										Премиум клиент
									</span>
								</div>
								<ChevronRight className='h-4 w-4 text-muted-foreground' />
							</div>
						</SidebarFooter>
					</Sidebar>
				</SidebarProvider>
			</div>
		</div>
	)
}
