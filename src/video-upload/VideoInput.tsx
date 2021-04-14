import React, { FC, useRef, useState } from "react";
import "../video-upload/VideoUpload.css";

interface VideoInputProps {
  file: File | undefined;
  handleFileChange: (file: File) => void;
}
export const VideoInput: FC<VideoInputProps> = ({ file, handleFileChange }) => {
  const videoInput = useRef<HTMLInputElement>(null);
  const [durationLabel, setDurationLabel] = useState<string>("");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("onFileChange");
    const { files } = e.target;
    const file: File | null = files?.length ? files[0] : null;
    if (file) {
      handleFileChange(file);
    }
  };

  const triggerInputFile = () => {
    console.log("Triggered");
    videoInput.current?.click();
  };

  const handleDurationInfo = (e: any) => {
    const duration = e.target.duration;
    if (duration < 60) {
      setDurationLabel(`00:${Math.ceil(duration)}`);
    } else {
      setDurationLabel(
        `${Math.floor(duration / 60)}:${
          Math.floor(duration) - Math.floor(duration / 60) * 60
        }`
      );
    }
  };

  return (
    <>
      <div className="center">
        <div className="choose-file-container" onClick={triggerInputFile}>
          <div className="choose-file-text">Choose file to upload</div>
        </div>
        <input
          type="file"
          id="video-demo-example"
          ref={videoInput}
          accept=".mp4,.mov"
          value=""
          onChange={onFileChange}
          hidden
        />

        <div className="file-info">
          <div className="mb-8">File name: {file?.name || "-"}</div>

          <div>
            Total duration:{" "}
            {file && durationLabel ? `${durationLabel} min` : "-"}
          </div>
        </div>
      </div>
      {file && (
        <video
          hidden
          controls={true}
          width="250"
          onLoadedMetadata={handleDurationInfo}
        >
          <source src={URL.createObjectURL(file)} type="video/mp4" />
        </video>
      )}
    </>
  );
};
