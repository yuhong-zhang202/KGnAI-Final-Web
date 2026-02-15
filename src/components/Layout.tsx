import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Moon, Sun } from "lucide-react";
import { ROUTE_PATHS } from "@/lib/index";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isDemoPage = location.pathname === ROUTE_PATHS.DEMO;
  
  return (
    <div className="min-h-screen bg-background">
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isDemoPage 
            ? 'bg-card/80 backdrop-blur-md border-b border-border/30' 
            : 'bg-background/80 backdrop-blur-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={ROUTE_PATHS.HOME} className="flex items-center space-x-3 group">
              <div className="relative">
                <Brain className="h-8 w-8 text-primary group-hover:text-neural-primary transition-colors duration-300" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:bg-neural-primary/30 transition-all duration-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-neural-primary bg-clip-text text-transparent">
                  Cognitive Drive
                </h1>
                <p className="text-xs text-muted-foreground -mt-1">AI Reasoning Engine</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to={ROUTE_PATHS.HOME}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  location.pathname === ROUTE_PATHS.HOME 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                Home
              </Link>
              <Link 
                to={ROUTE_PATHS.DEMO}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  location.pathname === ROUTE_PATHS.DEMO 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                Interactive Demo
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 p-0 hover:bg-primary/10"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>
      
      <main className={isDemoPage ? "" : "pt-20"}>
        {children}
      </main>
    </div>
  );
}
