import React from 'react';

/**
 * ArahLogo Component
 * SVG representation of the ARAH logo featuring targetable letter groups:
 * - .letter-a
 * - .letter-r
 * - .letter-a2 (with targetable .diamond-cutout)
 * - .letter-h
 * 
 * Enhanced with 100% Solid Ultra-Bright Glass & Metallic SVG Gradients for Maximum Visibility.
 */
export default function ArahLogo({
  className = "w-full h-auto",
  color = "url(#glassy-white-gradient)",
  cutoutColor = "#090a10",
  ...props
}) {
  return (
    <svg
      viewBox="0 0 820 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="ARAH Logo"
      {...props}
    >
      <defs>
        {/* Ultra-Bright High-Contrast White Platinum Gradient (100% Opacity) */}
        <linearGradient id="glassy-white-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="60%" stopColor="#f8fafc" stopOpacity="1" />
          <stop offset="100%" stopColor="#e2e8f0" stopOpacity="1" />
        </linearGradient>

        {/* Glassy Pink Quartz Gradient (100% Opacity) */}
        <linearGradient id="glassy-pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="1" />
          <stop offset="50%" stopColor="#fb7185" stopOpacity="1" />
          <stop offset="100%" stopColor="#e11d48" stopOpacity="1" />
        </linearGradient>

        {/* Metallic Gold Gradient (100% Opacity) */}
        <linearGradient id="glassy-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff7ed" stopOpacity="1" />
          <stop offset="50%" stopColor="#fde047" stopOpacity="1" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Letter A (First A) */}
      <g className="letter-a" fill={color}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 87.5 0 L 175 180 H 133 L 116 142 H 59 L 42 180 H 0 L 87.5 0 Z M 87.5 46 L 69 104 H 106 L 87.5 46 Z"
        />
      </g>

      {/* Letter R */}
      <g className="letter-r" fill={color}>
        <path d="M 215 0 H 255 V 180 H 215 V 0 Z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 255 0 H 335 C 365 0 385 18 385 47 C 385 76 365 94 335 94 H 255 V 0 Z M 255 35 V 59 H 328 C 338 59 346 54 346 47 C 346 40 338 35 328 35 H 255 Z"
        />
        <path d="M 292 94 L 382 180 H 334 L 255 104 V 94 H 292 Z" />
      </g>

      {/* Letter A2 (Second A with central diamond cutout) */}
      <g className="letter-a2" fill={color}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 517.5 0 L 605 180 H 563 L 517.5 130 L 472 180 H 430 L 517.5 0 Z M 517.5 50 L 542 98 L 517.5 146 L 493 98 L 517.5 50 Z"
        />
        {/* Independently animatable diamond cutout overlay */}
        <polygon
          className="diamond-cutout"
          points="517.5,50 542,98 517.5,146 493,98"
          fill={cutoutColor}
          style={{ transformOrigin: "517.5px 98px" }}
        />
      </g>

      {/* Letter H */}
      <g className="letter-h" fill={color}>
        <path d="M 645 0 H 685 V 72 H 780 V 0 H 820 V 180 H 780 V 108 H 685 V 180 H 645 V 0 Z" />
      </g>
    </svg>
  );
}
