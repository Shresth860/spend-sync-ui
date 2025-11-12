import { LayoutDashboard, BarChart3, Settings, LogOut } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isMobileMenuOpen = false, onClose }: SidebarProps) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  const handleLinkClick = () => {
    onClose?.();
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className={cn(
      "fixed lg:static top-0 left-0 h-full w-64 bg-card border-r border-border flex flex-col shadow-card transition-transform duration-300 z-40",
      "lg:translate-x-0",
      isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-6 border-b border-border hidden lg:block">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          ExpenseTracker
        </h1>
      </div>
      
      {/* Mobile Header Space */}
      <div className="h-16 lg:hidden"></div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
                activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all duration-200 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
