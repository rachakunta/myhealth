import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 border-t border-border bg-background">
      <div className="container px-4 flex flex-col gap-4 md:flex-row justify-between items-center">
        <div className="flex flex-col items-center md:items-start">
          <div className="font-bold text-lg">MyHealth360</div>
          <p className="text-sm text-muted-foreground">
            Complete Healthcare in One Platform
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div>
            <h4 className="font-medium mb-2">Company</h4>
            <div className="space-y-2">
              <div><Link href="/about"><div className="text-sm hover:underline cursor-pointer">About</div></Link></div>
              <div><Link href="/careers"><div className="text-sm hover:underline cursor-pointer">Careers</div></Link></div>
              <div><Link href="/contact"><div className="text-sm hover:underline cursor-pointer">Contact</div></Link></div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Legal</h4>
            <div className="space-y-2">
              <div><Link href="/privacy"><div className="text-sm hover:underline cursor-pointer">Privacy</div></Link></div>
              <div><Link href="/terms"><div className="text-sm hover:underline cursor-pointer">Terms</div></Link></div>
              <div><Link href="/cookies"><div className="text-sm hover:underline cursor-pointer">Cookies</div></Link></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container px-4 mt-6 text-center text-sm text-muted-foreground">
        &copy; {currentYear} MyHealth360. All rights reserved.
      </div>
    </footer>
  );
}