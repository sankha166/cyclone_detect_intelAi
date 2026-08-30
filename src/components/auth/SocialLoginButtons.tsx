const providers = [
  {
    name: "Google",
    svg: (
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <path fill="#EA4335" d="M12 10.2v3.9h5.5a4.7 4.7 0 0 1-2 3.1l3.2 2.5c1.9-1.7 3-4.3 3-7.3 0-.7-.1-1.4-.2-2H12Z" />
        <path fill="#34A853" d="M6.6 14.3 5.9 15l-2.5 2A9 9 0 0 0 12 21c2.4 0 4.5-.8 6-2.2l-3.2-2.5c-.8.6-1.9.9-2.8.9a4.9 4.9 0 0 1-4.6-3.3Z" />
        <path fill="#FBBC05" d="M3.4 7A9 9 0 0 0 3.4 17l3.2-2.5a5.4 5.4 0 0 1 0-3.4L3.4 7Z" />
        <path fill="#4285F4" d="M12 6.6c1.3 0 2.5.5 3.5 1.4l2.6-2.6A9 9 0 0 0 3.4 7l3.2 2.5A4.9 4.9 0 0 1 12 6.6Z" />
      </svg>
    ),
  },
  {
    name: "Microsoft",
    svg: (
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <path fill="#F25022" d="M3 3h8.5v8.5H3z" />
        <path fill="#7FBA00" d="M12.5 3H21v8.5h-8.5z" />
        <path fill="#00A4EF" d="M3 12.5h8.5V21H3z" />
        <path fill="#FFB900" d="M12.5 12.5H21V21h-8.5z" />
      </svg>
    ),
  },
  {
    name: "Apple",
    svg: (
      <svg viewBox="0 0 24 24" className="size-5 fill-foreground" aria-hidden="true">
        <path d="M16.4 12.8c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.5-.1-2.9.8-3.6.8-.7 0-1.9-.8-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.1 1.2 9.4.8 1.1 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8 1.4 0 1.8.8 3.1.7 1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.6-3.7ZM14 5.7c.6-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.8-1.5Z" />
      </svg>
    ),
  },
];

export function SocialLoginButtons() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {providers.map((provider) => (
        <button
          key={provider.name}
          type="button"
          aria-label={`Continue with ${provider.name}`}
          className="inline-flex items-center justify-center rounded-xl border border-border bg-surface/60 py-3 transition-all hover:scale-[1.02] hover:border-primary/40 hover:bg-surface-2"
        >
          {provider.svg}
        </button>
      ))}
    </div>
  );
}
