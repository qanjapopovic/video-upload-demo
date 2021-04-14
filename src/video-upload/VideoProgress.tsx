import { FC } from "react";

const progressContainerStyle = {
  width: "100%",
  backgroundColor: "lightgray",
};

const labelStyle = {
  padding: 4,
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 13,
};

interface VideoProgressProps {
  completed: number;
  color?: string;
  style?: any;
}

export const VideoProgress: FC<VideoProgressProps> = ({
  completed,
  color = "blue",
  style,
}) => {
  const renderProgressBar = () => {
    return (
      <div
        style={{
          width: `${completed}%`,
          backgroundColor: color,
          height: "100%",
          textAlign: "center",
          borderRadius: "4px",
          transition: "width 1s ease-in-out",
        }}
      >
        <div style={labelStyle}>{`${completed}%`}</div>
      </div>
    );
  };
  return (
    <div style={{ ...progressContainerStyle, ...style }}>
      {renderProgressBar()}
    </div>
  );
};
