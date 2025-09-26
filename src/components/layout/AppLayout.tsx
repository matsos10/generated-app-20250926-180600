import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Home,
  Settings,
  LogOut,
  User,
  Menu,
  Bot,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Notifications } from '../dashboard/Notifications';
import { LanguageToggle } from '../LanguageToggle';
import { useTranslation } from 'react-i18next';
export function AppLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const navItems = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: Home },
    { name: t('nav.analytics'), href: '/dashboard/analytics', icon: BarChart3 },
    { name: t('nav.meeting_analysis'), href: '/dashboard/meeting-analysis', icon: Bot },
    { name: t('nav.billing'), href: '/dashboard/billing', icon: CreditCard },
    { name: t('nav.settings'), href: '/dashboard/settings', icon: Settings },
  ];
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span>ClarityDash</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  isActive && 'bg-muted text-primary'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          {t('app_layout.logout')}
        </Button>
      </div>
    </div>
  );
  const HeaderContent = () => (
    <>
      <div className="flex-1">
        {/* Can add breadcrumbs here */}
      </div>
      <LanguageToggle />
      <Notifications />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full h-8 w-8">
            <User className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>{t('nav.settings')}</DropdownMenuItem>
          <DropdownMenuItem>{t('app_layout.support')}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>{t('app_layout.logout')}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
  if (isMobile) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <HeaderContent />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    );
  }
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-background lg:block">
        <SidebarContent />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <HeaderContent />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}