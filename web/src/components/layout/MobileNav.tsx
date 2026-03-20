'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Shirt, Sparkles, User, Settings, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';

const NAV_ITEMS = [
  { href: '/', label: 'Today', icon: Home },
  { href: '/wardrobe', label: 'Wardrobe', icon: Shirt },
  { href: '/outfits', label: 'Outfits', icon: Sparkles },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shirt className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">ThreadIQ</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <SheetClose asChild key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            </SheetClose>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <SheetClose asChild>
          <Button asChild className="w-full" size="sm">
            <Link href="/item/add">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Link>
          </Button>
        </SheetClose>
      </div>
    </div>
  );
}
