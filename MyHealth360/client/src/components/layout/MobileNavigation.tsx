import { Link, useLocation } from "wouter";
import { MOBILE_NAV_ITEMS } from "@/lib/constants";

const MobileNavigation = () => {
  const [location] = useLocation();

  return (
    <nav className="md:hidden bg-white border-t border-gray-200 shadow-lg fixed bottom-0 w-full">
      <div className="flex justify-around">
        {MOBILE_NAV_ITEMS.map((item) => (
          <Link key={item.name} href={item.path}>
            <a className={`flex flex-col items-center py-3 px-4 ${
              location === item.path 
                ? "text-primary" 
                : "text-gray-600"
            }`}>
              <i className={`${item.icon} text-xl`}></i>
              <span className="text-xs mt-1">{item.name}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;