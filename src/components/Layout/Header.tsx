import { Button } from "@/components/ui/button"
import { HeroButton } from "@/components/ui/hero-button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CreditCard, LogOut, Menu, Phone, Shield, User } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  
  const isLoggedIn = localStorage.getItem('cbi_user_token')

  const handleLogout = () => {
    localStorage.removeItem('cbi_user_token')
    localStorage.removeItem('cbi_user_data')
    navigate('/')
  }

  const navigationItems = [
    { name: "Accounts", href: "/dashboard", icon: CreditCard },
    { name: "Fixed Deposits", href: "/fixed-deposits", icon: Shield },
    { name: "ATM Cards", href: "/atm-cards", icon: CreditCard },
    { name: "Transactions", href: "/transactions", icon: User },
    { name: "Contact", href: "/contact", icon: Phone },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="h-8 w-8 rounded-full bg-banking-gradient"></div>
            <span className="text-xl font-bold text-primary">CBI Bank</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-center space-x-8">
          {isLoggedIn && navigationItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              onClick={() => navigate(item.href)}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.name}
            </Button>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <User className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/auth/login')}>
                Login
              </Button>
              <HeroButton onClick={() => navigate('/auth/register')}>
                Get Started
              </HeroButton>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-6">
              {isLoggedIn && navigationItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => {
                    navigate(item.href)
                    setIsOpen(false)
                  }}
                  className="justify-start"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              ))}
              
              <div className="border-t pt-4">
                {isLoggedIn ? (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        navigate('/dashboard')
                        setIsOpen(false)
                      }}
                      className="w-full justify-start mb-2"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        navigate('/auth/login')
                        setIsOpen(false)
                      }}
                      className="w-full justify-start mb-2"
                    >
                      Login
                    </Button>
                    <HeroButton 
                      onClick={() => {
                        navigate('/auth/register')
                        setIsOpen(false)
                      }}
                      className="w-full"
                    >
                      Get Started
                    </HeroButton>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}