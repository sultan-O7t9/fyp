import React from "react";
const LoadingSpinner = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{
        margin: "auto",
        background: "none",
        display: "block",
        shapeRendering: "auto",
      }}
      width="100px"
      height="100px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle cx={84} cy={50} r={10} fill="#03a9f5">
        <animate
          attributeName="r"
          repeatCount="indefinite"
          dur="1.25s"
          calcMode="spline"
          keyTimes="0;1"
          values="7;0"
          keySplines="0 0.5 0.5 1"
          begin="0s"
        />
        <animate
          attributeName="fill"
          repeatCount="indefinite"
          dur="5s"
          calcMode="discrete"
          keyTimes="0;0.25;0.5;0.75;1"
          values="#03a9f5;#8823a7;#03a9f5;#8823a7;#03a9f5"
          begin="0s"
        />
      </circle>
      <circle cx={16} cy={50} r={10} fill="#03a9f5">
        <animate
          attributeName="r"
          repeatCount="indefinite"
          dur="5s"
          calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1"
          values="0;0;7;7;7"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          begin="0s"
        />
        <animate
          attributeName="cx"
          repeatCount="indefinite"
          dur="5s"
          calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1"
          values="16;16;16;50;84"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          begin="0s"
        />
      </circle>
      <circle cx={50} cy={50} r={10} fill="#8823a7">
        <animate
          attributeName="r"
          repeatCount="indefinite"
          dur="5s"
          calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1"
          values="0;0;7;7;7"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-1.25s"
        />
        <animate
          attributeName="cx"
          repeatCount="indefinite"
          dur="5s"
          calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1"
          values="16;16;16;50;84"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-1.25s"
        />
      </circle>
      <circle cx={84} cy={50} r={10} fill="#03a9f5">
        <animate
          attributeName="r"
          repeatCount="indefinite"
          dur="5s"
          calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1"
          values="0;0;7;7;7"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-2.5s"
        />
        <animate
          attributeName="cx"
          repeatCount="indefinite"
          dur="5s"
          calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1"
          values="16;16;16;50;84"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-2.5s"
        />
      </circle>
      <circle cx={16} cy={50} r={10} fill="#8823a7">
        <animate
          attributeName="r"
          repeatCount="indefinite"
          dur="5s"
          calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1"
          values="0;0;7;7;7"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-3.75s"
        />
        <animate
          attributeName="cx"
          repeatCount="indefinite"
          dur="5s"
          calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1"
          values="16;16;16;50;84"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-3.75s"
        />
      </circle>
    </svg>
  );
};

export default LoadingSpinner;
