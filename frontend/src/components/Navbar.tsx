import { Link, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { Leaf } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../components/ui/navigation-menu'
import { useDataPersistenceStore } from '@/stores/dataStore'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Calculator', path: '/calculator' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'About Us', path: '/about' },
]

const Navbar = () => {
  const location = useLocation()
  const { persistedData } = useDataPersistenceStore()

  const currentNavItems = useMemo(() => {
    const baseItems = [...navItems]
    if (persistedData) {
      const hasResults = baseItems.some(item => item.path === '/results')
      if (!hasResults) {
        baseItems.push({ name: 'Results', path: '/results' })
      }
    }
    return baseItems
  }, [persistedData])

  return (
    <nav className="sticky top-0 z-10 bg-gradient-to-br from-green-400 to-blue-500 w-full shadow-lg p-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex gap-2 items-center font-semibold text-lg md:text-xl">
              <Leaf className="h-6 w-6 md:h-8 md:w-8 text-white" />
              EcoViz
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {currentNavItems.map(item => (
                  <NavigationMenuItem key={item.name}>
                    <Link to={item.path}>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                        active={location.pathname === item.path}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost">Menu</Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-4">
                  {currentNavItems.map(item => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`${
                        location.pathname === item.path ? 'bg-green-700/70 text-white' : 'text-green-100 '
                      } px-3 py-2 rounded-md text-sm font-medium`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
