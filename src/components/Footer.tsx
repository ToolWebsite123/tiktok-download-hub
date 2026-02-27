import { Music2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
              <Music2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              TikSave
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
            <a href="#" className="hover:text-primary transition-colors">DMCA</a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TikSave
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8 max-w-lg mx-auto">
          TikSave is not affiliated with TikTok or ByteDance. All trademarks belong to their respective owners.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
