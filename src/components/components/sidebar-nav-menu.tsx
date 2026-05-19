import { LucideIcon } from 'lucide-react'

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarNavMenuItem
} from '@/src/components'

export interface MenuItem {
	title: string
	Icon: LucideIcon
	isActive?: boolean
	url: string
	badge?: string
}

interface Props {
	titleTab: string
	tabs: MenuItem[]
}

export function SidebarNavMenu({ titleTab, tabs }: Props) {
	return (
		<SidebarGroup className='p-3'>
			<SidebarGroupLabel className='px-2 text-[11px] font-semibold uppercase text-muted-foreground'>
				{titleTab}
			</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu className='gap-1.5'>
					{tabs.map(item => (
						<SidebarNavMenuItem
							key={item.title}
							title={item.title}
							Icon={item.Icon}
							isActive={item.isActive}
							url={item.url}
							badge={item.badge}
						/>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
