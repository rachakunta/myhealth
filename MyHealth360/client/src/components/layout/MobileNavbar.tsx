import { Link, useLocation } from "wouter";

export function MobileNavbar() {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 py-2 z-10">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center px-3 py-1 ${isActive("/") ? "text-primary" : "text-neutral-700"}`}>
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/consult">
          <a className={`flex flex-col items-center px-3 py-1 ${isActive("/consult") ? "text-primary" : "text-neutral-700"}`}>
            <i className="fas fa-user-md text-lg"></i>
            <span className="text-xs mt-1">Consult</span>
          </a>
        </Link>
        <Link href="/medicate">
          <a className={`flex flex-col items-center px-3 py-1 ${isActive("/medicate") ? "text-primary" : "text-neutral-700"}`}>
            <i className="fas fa-pills text-lg"></i>
            <span className="text-xs mt-1">Meds</span>
          </a>
        </Link>
        <Link href="/thrive">
          <a className={`flex flex-col items-center px-3 py-1 ${isActive("/thrive") ? "text-primary" : "text-neutral-700"}`}>
            <i className="fas fa-spa text-lg"></i>
            <span className="text-xs mt-1">Wellness</span>
          </a>
        </Link>
        <Link href="/manage">
          <a className={`flex flex-col items-center px-3 py-1 ${isActive("/manage") ? "text-primary" : "text-neutral-700"}`}>
            <i className="fas fa-user text-lg"></i>
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
