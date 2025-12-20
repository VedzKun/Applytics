export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="applytics-grad" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--secondary)" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#applytics-grad)" />
      <g transform="translate(6,6) scale(0.75)" fill="#fff">
        <path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 16.5c-3.6 0-6.5-2.9-6.5-6.5S8.4 5.5 12 5.5 18.5 8.4 18.5 12 15.6 18.5 12 18.5z" opacity="0.95"/>
        <path d="M8.5 13.5h1.8l2.7-5.2v5.2h1.6v-8h-1.8l-2.9 5.6V5.5H8.5v8z"/>
      </g>
    </svg>
  );
}
