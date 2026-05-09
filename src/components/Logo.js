
export default function Logo({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="50" cy="50" r="48" stroke="url(#logoGradient)" strokeWidth="2" />
      
      {/* Book pages - left */}
      <path
        d="M 35 25 L 35 75 Q 35 80 40 80 L 55 80 L 55 25 Z"
        fill="url(#logoGradient)"
        opacity="0.8"
      />
      
      {/* Book pages - right */}
      <path
        d="M 65 25 L 65 75 Q 65 80 60 80 L 45 80 L 45 25 Z"
        fill="url(#logoGradient)"
        opacity="0.5"
      />
      
      {/* Brain/spark symbol - center top */}
      <g transform="translate(50, 35)">
        <circle cx="0" cy="0" r="4" fill="url(#logoGradient)" />
        <circle cx="0" cy="-8" r="2.5" fill="url(#logoGradient)" />
        <circle cx="6" cy="-4" r="2.5" fill="url(#logoGradient)" />
        <circle cx="-6" cy="-4" r="2.5" fill="url(#logoGradient)" />
        <line x1="0" y1="0" x2="0" y2="-8" stroke="url(#logoGradient)" strokeWidth="1" />
        <line x1="0" y1="0" x2="6" y2="-4" stroke="url(#logoGradient)" strokeWidth="1" />
        <line x1="0" y1="0" x2="-6" y2="-4" stroke="url(#logoGradient)" strokeWidth="1" />
      </g>
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#4A90E2", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#8A2BE2", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
}
