import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, ArrowLeftRight, Globe, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Convert', path: '/convert', icon: ArrowLeftRight },
    { name: 'Currencies', path: '/currencies', icon: Globe },
  ];

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-card/50">
        <div className="h-14 flex items-center px-6 border-b">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <span className="bg-primary text-primary-foreground p-1 rounded-md">
              <ArrowLeftRight className="w-5 h-5" />
            </span>
            LedgerFX
          </div>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t">
          <Button asChild className="w-full justify-start shadow-sm" variant="default">
            <Link to="/transactions/new">
              <Plus className="w-4 h-4 mr-2" />
              New Transaction
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-card/50 px-6 md:hidden">
          <span className="bg-primary text-primary-foreground p-1 rounded-md">
            <ArrowLeftRight className="w-5 h-5" />
          </span>
          <span className="font-bold text-xl text-primary">LedgerFX</span>
        </header>

        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
