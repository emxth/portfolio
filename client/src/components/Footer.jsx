export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} emxth.dev. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="https://github.com/emxth" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
