import { useRef, useState } from "react";
import bigUpload from "@assets/bigUpload.svg";
import * as styles from "@/components/common/UploadCard.css";

interface UploadCardProps {
  iconBackground: "purple" | "green";
  title: string;
  desc: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onChangeFile?: (files: FileList | null) => void;
}

const UploadCard = ({
  iconBackground,
  title,
  desc,
  accept,
  multiple = false,
  disabled = false,
  onChangeFile,
}: UploadCardProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // 드래그가 자식 요소를 지날 때의 깜빡임을 막기 위한 카운터
  const dragDepth = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleClickCard = () => {
    if (disabled) return;

    inputRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFile?.(e.target.files);
    e.target.value = "";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // drop을 허용하려면 dragover에서 기본 동작을 막아야 한다.
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onChangeFile?.(files);
    }
  };

  return (
    <>
      <div
        className={`${styles.container} ${isDragging ? styles.containerDragging : ""}`}
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        onClick={handleClickCard}
        onKeyDown={(e) => {
          if (disabled) return;

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClickCard();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className={`${styles.iconContainer} ${styles.iconContainerVariant[iconBackground]}`}
        >
          <img src={bigUpload} alt="파일 업로드 아이콘" />
        </div>
        <span className={styles.title}>
          {isDragging ? "여기에 놓아 업로드" : title}
        </span>
        <span className={styles.desc}>
          {isDragging ? "파일을 놓으세요" : `${desc} · 끌어다 놓거나 클릭`}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        style={{ display: "none" }}
        onChange={handleChangeFile}
      />
    </>
  );
};

export default UploadCard;
