'use client';

import Link from 'next/link';
import { Bell, Menu, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { MobileNav } from './MobileNav';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <MobileNav />
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Shirt className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold">ThreadIQ</span>
        </Link>

        <div className="flex-1" />

        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <Bell className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
