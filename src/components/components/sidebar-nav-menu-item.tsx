import { MenuItem } from './sidebar-nav-menu'
import {
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/src/components'

export function SidebarNavMenuItem({
	title,
	isActive,
	url,
	Icon,
	badge
}: MenuItem) {
	return (
		<SidebarMenuItem key={title}>
			<SidebarMenuButton
				isActive={isActive}
				className='group relative h-auto gap-3 rounded-md p-3 text-muted-foreground transition-all duration-150 hover:bg-secondary hover:text-primary data-active:bg-foreground data-active:font-medium data-active:text-primary-foreground data-active:hover:bg-secondary-foreground data-active:hover:text-secondary'
			>
				<a href={url} className='flex items-center gap-3'>
					<Icon className='size-5 opacity-70 group-data-active:opacity-100' />
					<span className='flex-1 text-[13px]'>{title}</span>
				</a>
			</SidebarMenuButton>
			{badge && (
				<SidebarMenuBadge className='absolute right-3 top-1/4 bg-primary text-primary-foreground text-[11px] font-semibold px-1.75 py-0.5 rounded-full min-w-[18px] text-center group-data-active:bg-background group-data-active:text-primary'>
					{badge}
				</SidebarMenuBadge>
			)}
		</SidebarMenuItem>
	)
}
