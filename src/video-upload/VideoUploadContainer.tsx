import React, { useCallback, useEffect, useState } from "react";
import { Upload } from "./VideoUpload";
import { VideoInput } from "./VideoInput";
import { VideoProgress } from "./VideoProgress";

export const VideoUploadContainer = () => {
  const [videoFile, setVideoFile] = useState<File | undefined>(undefined);
  const [progress, setProgress] = useState<number>(0);

  const [uploadCompleted, setUploadCompleted] = useState<boolean>(false);

  const addFile = (file: File) => {
    setVideoFile(file);
  };

  const setProgressCallback = useCallback(
    (progress: number) => setProgress(progress),
    [setProgress]
  );

  useEffect(() => {
    setProgress(0);
    setUploadCompleted(false);
  }, [videoFile]);

  const handleUploadSuccess = () => setUploadCompleted(true);
  return (
    <div style={{ padding: 24 }}>
      <h2>Video upload demo</h2>
      <VideoInput file={videoFile} handleFileChange={addFile}></VideoInput>
      <Upload
        file={videoFile}
        onProgressChange={setProgressCallback}
        onUploadSuccess={handleUploadSuccess}
        disabled={!videoFile}
      ></Upload>
      <VideoProgress
        completed={progress}
        style={{ marginTop: 24 }}
      ></VideoProgress>
      {uploadCompleted && (
        <h5 style={{ color: "green" }}>Video is uploaded sucessfully</h5>
      )}
    </div>
  );
};
