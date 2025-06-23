import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

const YoutubeIcon: React.FC<IconProps> = ({
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
    <g clipPath="url(#clip0_3_68)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.39075 10.0689V5.57943C7.98452 6.32938 9.21887 7.05384 10.6788 7.8349C9.47467 8.50267 7.98452 9.25193 6.39075 10.0689ZM15.2728 3.34662C14.9979 2.98441 14.5293 2.70247 14.0305 2.60912C12.5642 2.33068 3.41679 2.32989 1.95132 2.60912C1.55129 2.68411 1.19507 2.86538 0.889066 3.14701C-0.40029 4.34373 0.00373294 10.7614 0.314518 11.8009C0.445206 12.2509 0.614152 12.5754 0.82692 12.7884C1.10105 13.07 1.47637 13.264 1.90749 13.3509C3.11476 13.6006 9.33443 13.7403 14.005 13.3884C14.4353 13.3134 14.8162 13.1133 15.1166 12.8197C16.3087 11.6277 16.2275 4.8497 15.2728 3.34662Z"
        fill={fill}
      />
    </g>
    <defs>
      <clipPath id="clip0_3_68">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default YoutubeIcon;
