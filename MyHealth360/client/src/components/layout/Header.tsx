import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Bell, Search, User } from "lucide-react"; // Changed UserCircle to User
import { useAuth } from "@/hooks/use-auth";
import MobileMenuButton from "./MobileMenuButton";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="border-b border-border bg-background sticky top-0 z-10">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-4 flex-1">
          {user && <MobileMenuButton />}
          <Link href="/">
            <div className="font-bold text-xl cursor-pointer">MyHealth360</div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <div className="border-l pl-4 ml-2 flex items-center gap-2">
                <span className="text-sm font-medium">
                  {user.fullName || user.username}
                </span>
                <Link href="/manage">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" /> {/* Changed UserCircle to User */}
                    <span className="sr-only">Profile</span>
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}