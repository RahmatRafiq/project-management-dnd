import * as NavigationMenu from '@radix-ui/react-navigation-menu';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold text-blue-600">NotionFlow</h1>

        <NavigationMenu.Root className="relative z-50">
          <NavigationMenu.List className="flex space-x-6 text-gray-700">
            <NavigationMenu.Item>
              <NavigationMenu.Link
                href="#features"
                className="hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Features
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                href="#workflow"
                className="hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Workflow
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                href="#templates"
                className="hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Templates
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                href="#cta"
                className="hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Get Started
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </header>
  );
}
