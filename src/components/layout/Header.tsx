import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, BarChart3 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '../LanguageToggle';
export function Header() {
  const { t } = useTranslation();
  const navLinks = [
    { name: t('nav.features'), href: '#features' },
    { name: t('nav.pricing'), href: '#pricing' },
    { name: t('nav.faq'), href: '#faq' },
  ];
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            <span className="hidden font-bold sm:inline-block">ClarityDash</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
                <span className="font-bold">ClarityDash</span>
              </Link>
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <a key={link.name} href={link.href} className="text-foreground/80">
                    {link.name}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-2">
            <LanguageToggle />
            {isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')}>{t('header.go_to_dashboard')}</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  {t('nav.login')}
                </Button>
                <Button onClick={() => navigate('/signup')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {t('nav.signup')}
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}