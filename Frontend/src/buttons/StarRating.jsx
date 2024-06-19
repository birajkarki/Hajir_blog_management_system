import React from 'react';
import "./rating.css"



const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starNumber = index + 1;
    const isFilled = starNumber <= rating;
    const isHalfFilled = !isFilled && starNumber - 0.5 <= rating;

    return (
      <svg
        key={index}
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 ${
          isFilled ? 'text-yellow-400' : isHalfFilled ? 'text-yellow-400 half-filled' : 'hidden'
        }`}
        fill={isFilled || isHalfFilled ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2 z"
        />
        {isHalfFilled && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 V2 z"
          />
        )}
      </svg>
    );
  });

  return <div className="flex">{stars}</div>;
};

export default StarRating;
