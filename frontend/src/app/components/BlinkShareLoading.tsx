import React from "react";

const BlinkLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="relative w-64 h-80">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 256 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mug body */}
          <path
            d="M40 40 H180 Q200 40 200 60 V260 Q200 280 180 280 H40 Q20 280 20 260 V60 Q20 40 40 40 Z"
            fill="#fcf5e5"
            stroke="#d4af37"
            strokeWidth="4"
          />
          {/* Handle */}
          <path
            d="M200 80 Q240 80 240 120 V200 Q240 240 200 240"
            fill="none"
            stroke="#d4af37"
            strokeWidth="8"
          />
          {/* Eye with Blinking animation */}
          <ellipse
            className="eye"
            cx="120"
            cy="100"
            rx="40"
            ry="20"
            fill="#fff"
            stroke="#000"
            strokeWidth="3"
          />
          {/* Blink animation effect */}
          <path
            className="blink"
            d="M80,100 Q120,50 160,100"
            fill="none"
            stroke="#000"
            strokeWidth="3"
          />
          {/* Foam */}
          <path
            className="foam"
            d="M30 70 H190"
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Definitions for gradients */}
          <defs>
            <linearGradient id="blinkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbb117" />
              <stop offset="100%" stopColor="#f0c420" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <style jsx>{`
        .blink {
          animation: blink-animation 1.5s ease-in-out infinite;
        }
        .foam {
          animation: foam-up 2s ease-out infinite;
        }

        @keyframes blink-animation {
          0% {
            d: path("M80,100 Q120,50 160,100"); /* Eye open */
          }
          50% {
            d: path("M80,100 Q120,80 160,100"); /* Eye closed */
          }
          100% {
            d: path("M80,100 Q120,50 160,100"); /* Eye open */
          }
        }

        @keyframes foam-up {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BlinkLoading;
