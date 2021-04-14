import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import "../video-upload/VideoUpload.css";

interface UploadProps {
  file: File | undefined;
  chunkSize?: number;
  disabled?: boolean;
  uploadUrl?: string;
  onProgressChange?: (progress: number) => void;
  onUploadSuccess?: () => void;
}

interface ChunkInfo {
  chunkForm: FormData;
  contentRange: string;
}

const defaultUrl =
  "https://sandbox.api.video/upload?token=to2HqDq9BLpJ8teTi7vFvzjw";

const defaultChunkSize = 2000000;

export const Upload: FC<UploadProps> = ({
  file,
  disabled,
  chunkSize = defaultChunkSize,
  uploadUrl = defaultUrl,
  onProgressChange,
  onUploadSuccess,
  ...props
}) => {
  const [numberOfChunks, setNumberOfChunks] = useState<number>(0);
  const [chunkCounter, setChunkCounter] = useState<number>(0);
  const [chunkProgress, setChunkProgress] = useState<number>(0);

  const cancelSource = axios.CancelToken.source();

  useEffect(() => {
    if (file) {
      setNumberOfChunks(Math.ceil(file.size / chunkSize));
    }

    return () => {
      setChunkCounter(0);
      setChunkProgress(0);
      setNumberOfChunks(0);
    };
  }, [file, chunkSize]);

  useEffect(() => {
    let calculatedProgress = 0;
    if (numberOfChunks && chunkCounter) {
      calculatedProgress = Math.round(
        ((chunkCounter - 1) / numberOfChunks) * 100 +
          chunkProgress / numberOfChunks
      );
    }
    onProgressChange && onProgressChange(calculatedProgress);
  }, [chunkCounter, numberOfChunks, chunkProgress, onProgressChange]);

  const uploadVideo = async () => {
    if (file) {
      const chunks = getArrayOfFileChunks(file);

      let videoId = null;

      for (let chunk of chunks) {
        const { chunkForm, contentRange } = chunk;
        if (videoId) {
          chunkForm.append("videoId", videoId);
        }
        setChunkProgress(0);
        setChunkCounter((chunkCounter) => chunkCounter + 1);
        try {
          const response: any = await getChunkRequest(chunkForm, contentRange);
          videoId = response?.videoId;
          console.log({ videoId });
        } catch (e) {
          console.log(e);
          return;
        }
      }
    }
  };

  const getArrayOfFileChunks: (file: File) => ChunkInfo[] = (file: File) => {
    const size = file.size;

    const chunksToUpload = [];

    let chunkStart = 0;

    while (chunkStart < size) {
      const chunkEnd = Math.min(chunkStart + chunkSize, size);

      const chunk = file.slice(chunkStart, chunkEnd);
      const contentRange = `bytes ${chunkStart}-${chunkEnd - 1}/${size}`;

      const chunkForm = new FormData();
      chunkForm.append("file", chunk, file.name);
      chunksToUpload.push({ chunkForm, contentRange });

      chunkStart += chunkSize;
    }

    return chunksToUpload;
  };

  const onUploadProgress = (p: any) => {
    const { loaded, total } = p;
    setChunkProgress(Math.round((loaded / total) * 100));
  };

  const getChunkRequest = async (data: FormData, contentRange: string) => {
    return axios
      .request({
        method: "post",
        url: uploadUrl,
        data,
        headers: {
          "Content-Type": "multipart/form-data",
          "Content-Range": contentRange,
        },
        onUploadProgress,
      })
      .then((res) => {
        const data = res.data;
        if (data && data?.assets?.player) {
          console.log("Uploaded sucessfully!");
          console.log(data.assets.player);
          onUploadSuccess && onUploadSuccess();
        }
        return data;
      });
  };

  return (
    <>
      <button
        onClick={uploadVideo}
        className="upload-btn"
        disabled={disabled}
        {...props}
      >
        Upload video
      </button>
    </>
  );
};
