interface HealthScoreProps {
  score: number;
  trend?: string;
  status?: string;
}

const HealthScore = ({ score, trend = "up", status = "Good" }: HealthScoreProps) => {
  const percentage = score;
  const dashArray = `${percentage}, 100`;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold">Health Score</h3>
        <button className="text-gray-500">
          <i className="ri-information-line"></i>
        </button>
      </div>
      
      <div className="flex items-center justify-center my-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              fill="none" 
              stroke="#E0E0E0" 
              strokeWidth="3" 
            />
            <path 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              fill="none" 
              stroke={score > 75 ? "#4CAF50" : score > 50 ? "#FFC107" : "#E53935"} 
              strokeWidth="3" 
              strokeDasharray={dashArray} 
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-3xl font-bold text-secondary">{score}</div>
            <div className="text-xs text-gray-500">{status}</div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        {trend === "up" ? (
          <p className="flex items-center">
            <i className="ri-arrow-up-line text-green-500 mr-1"></i> 
            5% improvement since last month
          </p>
        ) : (
          <p className="flex items-center">
            <i className="ri-arrow-down-line text-red-500 mr-1"></i> 
            3% decrease since last month
          </p>
        )}
      </div>
    </div>
  );
};

export default HealthScore;
