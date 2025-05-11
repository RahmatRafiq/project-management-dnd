import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavMain } from '@/components/nav-main';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import AppLogo from '@/components/app-logo';
import { LayoutGrid, Users, Shield, Settings, Folder, BookOpen } from 'lucide-react';
import { type NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<{
        auth: { user: { roles: { name: string }[] } };
    }>().props;

    const roleNames = auth.user.roles ? auth.user.roles.map((r) => r.name) : [];
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Log Activity',
            href: '/activity-logs',
            icon: LayoutGrid,
        },
        {
            title: 'Users Management',
            href: '',
            icon: Users,
            children: [
                {
                    title: 'Roles',
                    href: '/roles',
                    icon: Shield,
                },
                {
                    title: 'Permissions',
                    href: '/permissions',
                    icon: Shield,
                },
                ...(roleNames.includes('administrator')
                    ? [
                        {
                            title: 'User',
                            href: '/users',
                            icon: Settings,
                        },
                    ]
                    : []),
            ],
        },
        {
            title: 'Projects and Tasks',
            href: '/projects',
            icon: Folder,
        },
        {
            title: 'My Projects',
            href: '/my-projects',
            icon: Folder,
        }
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
