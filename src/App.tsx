import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { ROUTE_PATHS } from "@/lib/index";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Demo from "@/pages/Demo";

/**
 * Initialize React Query Client for state management and caching
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

/**
 * Root Application Component
 * Configures the global providers, routing, and layout structure.
 * © 2026 AI-Driven Autonomous Driving Project.
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <MotionConfig reducedMotion="user">
          <TooltipProvider>
            {/* Feedback components for system notifications */}
            <Toaster />
            <Sonner position="top-right" />
            
            {/* 
              HashRouter is used for better compatibility with static hosting environments.
              The Layout component provides the persistent navigation and branding container.
            */}
            <HashRouter>
          <Layout>
            <Routes>
              {/* Main Landing Page */}
              <Route 
                path={ROUTE_PATHS.HOME} 
                element={<Home />} 
              />

              {/* Interactive Demo Environment */}
              <Route 
                path={ROUTE_PATHS.DEMO} 
                element={<Demo />} 
              />

              {/* 
                Catch-all redirect: 
                Since no specific 404 page is defined in the project scope, 
                we gracefully redirect users back to the landing page.
              */}
              <Route 
                path="*" 
                element={<Home />} 
              />
            </Routes>
            </Layout>
          </HashRouter>
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
