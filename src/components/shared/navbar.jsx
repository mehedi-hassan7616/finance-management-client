import {
  Home,
  PlusCircle,
  List,
  BarChart3,
  LogOut,
  LogIn,
  UserPlus,
  User,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthContext } from "@/context/auth-context";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logOut, loader } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Home, public: true },
    {
      path: "/add-transaction",
      label: "Add Transaction",
      icon: PlusCircle,
      public: false,
    },
    {
      path: "/transactions",
      label: "My Transactions",
      icon: List,
      public: false,
    },
    { path: "/reports", label: "Reports", icon: BarChart3, public: false },
  ];

  const visibleNavLinks = navLinks.filter(
    (link) => link.public || user
  );

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/" className="text-lg sm:text-xl font-bold whitespace-nowrap">
              Finance Tracker
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {visibleNavLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.path} to={link.path}>
                    <Button
                      variant={isActive(link.path) ? "default" : "ghost"}
                      className="gap-2"
                      size="sm"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - User menu and theme toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ModeToggle />
            {loader ? (
              <div className="hidden sm:flex items-center gap-2">
                <Skeleton className="h-9 sm:h-10 w-16 sm:w-20" />
                <Skeleton className="h-9 sm:h-10 w-16 sm:w-20" />
              </div>
            ) : user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0">
                      <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                        <AvatarImage
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                        />
                        <AvatarFallback className="text-xs sm:text-sm">
                          {user.displayName
                            ? user.displayName.charAt(0).toUpperCase()
                            : user.email
                            ? user.email.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem disabled>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {user.displayName || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Mobile Menu Button */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-2">
                      {visibleNavLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Button
                              variant={isActive(link.path) ? "default" : "ghost"}
                              className="w-full justify-start gap-3"
                            >
                              <Icon className="h-5 w-5" />
                              {link.label}
                            </Button>
                          </Link>
                        );
                      })}
                      <div className="pt-4 border-t mt-4">
                        <div className="px-3 py-2 mb-2">
                          <p className="text-sm font-medium">{user.displayName || "User"}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-3">
                            <User className="h-5 w-5" />
                            My Profile
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 text-red-600 hover:text-red-600"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-5 w-5" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="outline" className="gap-2" size="sm">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="gap-2" size="sm">
                      <UserPlus className="h-4 w-4" />
                      Signup
                    </Button>
                  </Link>
                </div>
                {/* Mobile Menu Button for non-logged in users */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="sm:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px]">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-2">
                      {visibleNavLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Button
                              variant={isActive(link.path) ? "default" : "ghost"}
                              className="w-full justify-start gap-3"
                            >
                              <Icon className="h-5 w-5" />
                              {link.label}
                            </Button>
                          </Link>
                        );
                      })}
                      <div className="pt-4 border-t mt-4 space-y-2">
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full justify-start gap-3">
                            <LogIn className="h-5 w-5" />
                            Login
                          </Button>
                        </Link>
                        <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full justify-start gap-3">
                            <UserPlus className="h-5 w-5" />
                            Signup
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
