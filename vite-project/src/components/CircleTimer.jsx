function CircleTimer({timer, maxTime}){
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const progress = (timer / maxTime) * circumference;
    const color = timer <= 5 ? "red" : timer <= 10 ? "orange" : "#4caf50";
    return (
        <div>
            <svg width="120" height="120">
                {/* background circle */}
                <circle
                    cx="60" cy="60" r={radius}
                    fill="none"
                    stroke="#333"
                    strokeWidth="8"
                />
                {/* progress circle */}
                <circle
                    cx="60" cy="60" r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                />
                {/* timer text */}
                <text
                    x="60" y="60"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="24"
                    fontWeight="bold"
                >
                    {timer}
                </text>
            </svg>
        </div>
    )
}
export default CircleTimer;