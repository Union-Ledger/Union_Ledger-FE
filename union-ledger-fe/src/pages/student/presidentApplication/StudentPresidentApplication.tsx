import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStudentApi from "@/hooks/useStudentApi";
import { ROUTES } from "@/router/constant/router";
import * as styles from "./StudentPresidentApplication.css";

const StudentPresidentApplication = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { postAdminApplication } = useStudentApi();

  const [postAdminApplicationOnce] = useState(() => postAdminApplication);
  const [organizationName, setOrganizationName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedOrganizationName = organizationName.trim();
    const trimmedCollegeName = collegeName.trim();
    const trimmedDepartmentName = departmentName.trim();

    if (!trimmedOrganizationName || !trimmedCollegeName || !trimmedDepartmentName) {
      alert("조직 이름, 단과대학, 학과를 입력해주세요.");
      return;
    }

    if (documents.length === 0) {
      alert("증빙 서류를 업로드해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const application = await postAdminApplicationOnce({
        organizationName: trimmedOrganizationName,
        collegeName: trimmedCollegeName,
        departmentName: trimmedDepartmentName,
        documents,
      });

      sessionStorage.setItem("studentPresidentApplicationSubmitted", "true");
      sessionStorage.setItem("studentPresidentApplicationId", application.id);
      navigate(ROUTES.STUDENT_DASHBOARD);
    } catch (error) {
      console.error("회장 신청 실패", error);
      alert("회장 신청에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>회장 신청</span>
        <span className={styles.desc}>
          학생회장 권한을 신청하고 조직을 관리하세요
        </span>
      </div>

      <div className={styles.noticeBox}>
        <strong>안내:</strong>
        <span>
          회장 신청 시 재학증명서 또는 학생증 사본 등 신분 확인 서류가
          필요합니다. 운영자 검토 후 1~2일 내 승인됩니다.
        </span>
      </div>

      <section className={styles.formCard}>
        <div className={styles.formHeader}>
          <span className={styles.formIcon}>□</span>
          <div>
            <h2 className={styles.formTitle}>학생회 정보</h2>
            <p className={styles.formDesc}>
              관리하려는 학생회의 정보를 입력해주세요
            </p>
          </div>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>조직 이름 *</span>
          <input
            className={styles.input}
            value={organizationName}
            placeholder="예: 컴퓨터공학과 학생회"
            onChange={(event) => setOrganizationName(event.target.value)}
          />
          <span className={styles.helperText}>
            관리하려는 학생회의 공식 명칭을 입력해주세요
          </span>
        </label>

        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.label}>단과대학 *</span>
            <input
              className={styles.input}
              value={collegeName}
              placeholder="예: 공과대학"
              onChange={(event) => setCollegeName(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>학과 *</span>
            <input
              className={styles.input}
              value={departmentName}
              placeholder="예: 컴퓨터공학과"
              onChange={(event) => setDepartmentName(event.target.value)}
            />
          </label>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>증빙 서류 업로드 *</span>
          <button
            type="button"
            className={styles.uploadBox}
            onClick={() => fileInputRef.current?.click()}
          >
            <span className={styles.uploadIcon}>⇧</span>
            <span className={styles.uploadTitle}>
              {fileName || "재학증명서 또는 학생증을 업로드하세요"}
            </span>
            <span className={styles.uploadDesc}>
              PDF, JPG, PNG (최대 10MB)
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className={styles.hiddenInput}
            multiple
            onChange={(event) => {
              const selectedFiles = Array.from(event.target.files ?? []);

              setDocuments(selectedFiles);
              setFileName(selectedFiles.map((file) => file.name).join(", "));
            }}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}
          >
            취소
          </button>
          <button
            type="button"
            className={styles.submitButton}
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "신청 중..." : "신청하기"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default StudentPresidentApplication;
