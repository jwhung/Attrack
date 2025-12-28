import React from 'react';

interface ProgressRingProps {
    radius: number;
    stroke: number;
    progress: number;
    color?: string;
    className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
    radius,
    stroke,
    progress,
    color = '#6366f1',
    className = ''
}) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <svg
                height={radius * 2}
                width={radius * 2}
                className="transform -rotate-90"
            >
                <circle
                    stroke="#161618"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke={color}
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold font-sans text-white">{progress}%</span>
            </div>
        </div>
    );
};
