import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

const FacebookIcon: React.FC<IconProps> = ({
  width = 16,
  height = 16,
  fill = "#595959",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.45703 16V8.8H11.6429L12 5.6H9.45703V4.04141C9.45703 3.21741 9.47808 2.4 10.6295 2.4H11.7958V0.112109C11.7958 0.0777094 10.794 0 9.78054 0C7.664 0 6.33872 1.32576 6.33872 3.76016V5.6H4V8.8H6.33872V16H9.45703Z"
      fill={fill}
    />
  </svg>
);

export default FacebookIcon;
