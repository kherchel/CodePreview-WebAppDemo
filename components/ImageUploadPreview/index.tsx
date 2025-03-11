import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import AddIcon from "../../assets/addCircle.svg";
import RemoveIcon from "../../assets/removeCircle.svg";

import "./styles.scss";

const MAX_SIZE = 1024 * 1024 * 2; // 2MB

interface ImageUploadPreviewProps {
  imageUri?: string;
  image?: string;
  onChange?: (image: string, error?: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const ImageUploadPreview = ({
  imageUri,
  image,
  onChange,
  onRemove,
  disabled,
  style,
  className,
}: ImageUploadPreviewProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log(acceptedFiles);
      if (acceptedFiles.length > 0) {
        // onChange?.(URL.createObjectURL(acceptedFiles[0]));
        if (acceptedFiles[0].size > MAX_SIZE) {
          onChange?.("", "Image size must be less than 2MB");
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(acceptedFiles[0]);
        reader.onload = () => {
          // console.log("reader.result", reader.result);
          onChange?.(reader.result as string);
        };
      }
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [onChange]
  );

  useEffect(() => {
    return () =>
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpg": [],
      "image/jpeg": [],
    },
    multiple: false,
    noClick: true,
  });

  const onClickRemove = () => {
    setFiles([]);
    onRemove?.();
  };

  return (
    <div
      className={`image-upload-preview ${isDragActive ?? "drag"}`}
      style={{
        ...style,
        backgroundImage: `url(${
          (files[0] as any)?.preview || imageUri || image
        })`,
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {!image && !imageUri && files.length === 0 && (
        <img className="icon" src={AddIcon} alt="Add" onClick={open} />
      )}
      {(image || imageUri || files.length > 0) && (
        <img
          className="icon"
          src={RemoveIcon}
          alt="Remove"
          onClick={onClickRemove}
        />
      )}
    </div>
  );
};

export default ImageUploadPreview;
