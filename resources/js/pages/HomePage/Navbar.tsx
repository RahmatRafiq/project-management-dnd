import { useState, useEffect } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Disclosure } from '@headlessui/react';
import { Menu, X } from 'lucide-react';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

const links = ['Features', 'Workflow', 'Templates', 'Get Started'];
let auth: SharedData['auth'];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { auth: pageAuth } = usePage<SharedData>().props;
  auth = pageAuth;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Disclosure as="header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-md'
          : 'bg-transparent dark:bg-transparent'
        }`}
    >
      {({ open }) => (
        <>
          <div className="container mx-auto flex justify-between items-center py-4 px-6">
            <h1 className="text-2xl font-bold text-gray-700 dark:text-blue-400">
              NotionFlow
            </h1>
            <nav className="hidden md:flex items-center space-x-6">
              <NavigationMenu.Root className="relative z-50">
                <NavigationMenu.List className="flex space-x-4">
                  {links.map((label) => (
                    <NavigationMenu.Item key={label}>
                      <NavigationMenu.Link
                        href={`#${label.toLowerCase().replace(' ', '')}`}
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
                      >
                        {label}
                      </NavigationMenu.Link>
                    </NavigationMenu.Item>
                  ))}
                </NavigationMenu.List>
              </NavigationMenu.Root>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Appearance
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="mt-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg transition-colors">
                  <AppearanceToggleTab />
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </nav>
            <nav className="flex items-center justify-end gap-4">
              {auth.user ? (
                <Link
                  href={route('dashboard')}
                  className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href={route('login')}
                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                  >
                    Log in
                  </Link>
                  <Link
                    href={route('register')}
                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
            <Disclosure.Button className="md:hidden text-gray-700 dark:text-gray-300">
              {open ? <X size={24} /> : <Menu size={24} />}
            </Disclosure.Button>
          </div>
          <Disclosure.Panel className="md:hidden bg-white dark:bg-gray-900/90 backdrop-blur-sm transition-colors">
            <div className="px-6 pb-4 space-y-2">
              {links.map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace(' ', '')}`}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  {label}
                </a>
              ))}
              <div className="mt-2 px-4">
                <AppearanceToggleTab />
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
