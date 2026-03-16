import { Music2 } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container max-w-5xl mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
            <Music2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">TikSave</span>
        </a>

        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          <a href="/#features" className="hover:text-primary transition-colors">Features</a>
          <a href="/profile" className="hover:text-primary transition-colors">Profile Viewer</a>
          <a href="/#faq" className="hover:text-primary transition-colors">FAQ</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
