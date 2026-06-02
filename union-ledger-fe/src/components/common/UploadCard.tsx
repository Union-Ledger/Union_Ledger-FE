import { useRef } from "react";
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

  const handleClickCard = () => {
    if (disabled) return;

    inputRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFile?.(e.target.files);
    e.target.value = "";
  };

  return (
    <>
      <div
        className={styles.container}
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
      >
        <div
          className={`${styles.iconContainer} ${styles.iconContainerVariant[iconBackground]}`}
        >
          <img src={bigUpload} alt="파일 업로드 아이콘" />
        </div>
        <span className={styles.title}>{title}</span>
        <span className={styles.desc}>{desc}</span>
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
