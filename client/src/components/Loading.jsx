const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full space-y-[.8px]">
      <div className="relative w-full h-2 bg-blue-300 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 animate-[move-left_1s_linear_infinite]"
          style={{ width: '100%' }}
        ></div>
      </div>
      <div className="relative w-full h-2 bg-green-300 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-l from-blue-500 to-green-500 animate-[move-left_2s_linear_infinite]"
          style={{ width: '100%' }}
        ></div>
      </div>
      <div className="relative w-full h-2 bg-blue-300 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 animate-[move-left_1s_linear_infinite]"
          style={{ width: '100%' }}
        ></div>
      </div>
      <style>
        {`
          @keyframes move-left {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes move-right {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </div>
  );
};

export default Loading;