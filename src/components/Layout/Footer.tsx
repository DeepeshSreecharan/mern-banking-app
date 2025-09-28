import { CreditCard, Mail, MapPin, Phone, Shield } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-banking-gradient"></div>
              <span className="text-xl font-bold text-primary">CBI Bank</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Children's Bank of India - Teaching young minds the value of money and financial responsibility.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Savings Accounts
              </li>
              <li className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Fixed Deposits
              </li>
              <li className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                ATM Cards
              </li>
              <li>Digital Banking</li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Security</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                1800-CBI-BANK
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                support@cbibank.in
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Mumbai, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Children's Bank of India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}