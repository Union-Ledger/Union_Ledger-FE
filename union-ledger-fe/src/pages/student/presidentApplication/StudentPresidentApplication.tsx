import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStudentApi, { type AdminApplication } from "@/hooks/useStudentApi";
import { ROUTES } from "@/router/constant/router";
import { Spinner, useToast } from "@shared/components/feedback";
import { getApiErrorMessage } from "@/utils/apiError";
import * as styles from "./StudentPresidentApplication.css";

// BE의 반려 후 재신청 대기 기간과 동일하게 유지
const REAPPLY_COOLDOWN_DAYS = 7;
const DAY_MS = 86_400_000;

const formatDate = (value: string | null | undefined) =>
  value ? value.slice(0, 10) : "-";

const StudentPresidentApplication = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { postAdminApplication, getMyAdminApplications } = useStudentApi();
  const toast = useToast();

  const [postAdminApplicationOnce] = useState(() => postAdminApplication);
  const [getMyAdminApplicationsOnce] = useState(() => getMyAdminApplications);
  const [organizationName, setOrganizationName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myApplications, setMyApplications] = useState<AdminApplication[]>([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  useEffect(() => {
    let active = true;

    getMyAdminApplicationsOnce()
      .then((items) => {
        if (active) setMyApplications(items);
      })
      .catch(() => {
        // 현황 조회 실패는 폼 사용을 막지 않는다 (제출 시 서버가 다시 검증)
      })
      .finally(() => {
        if (active) setIsLoadingStatus(false);
      });

    return () => {
      active = false;
    };
  }, [getMyAdminApplicationsOnce]);

  const pendingApplication = myApplications.find(
    (application) => application.status === "pending",
  );
  const approvedApplication = myApplications.find(
    (application) => application.status === "approved",
  );
  // 목록은 최신순 — 가장 최근 반려 건 기준으로 쿨다운 계산
  const latestRejected = myApplications.find(
    (application) => application.status === "rejected" && application.reviewed_at,
  );
  const cooldownDaysLeft = (() => {
    if (!latestRejected?.reviewed_at) return 0;
    const reapplyAt =
      new Date(latestRejected.reviewed_at).getTime() +
      REAPPLY_COOLDOWN_DAYS * DAY_MS;
    const remaining = reapplyAt - Date.now();
    return remaining > 0 ? Math.ceil(remaining / DAY_MS) : 0;
  })();

  const canShowForm =
    !isLoadingStatus &&
    !pendingApplication &&
    !approvedApplication &&
    cooldownDaysLeft === 0;

  const handleSubmit = async () => {
    const trimmedOrganizationName = organizationName.trim();
    const trimmedCollegeName = collegeName.trim();
    const trimmedDepartmentName = departmentName.trim();

    if (!trimmedOrganizationName || !trimmedCollegeName || !trimmedDepartmentName) {
      toast.error("조직 이름, 단과대학, 학과를 입력해주세요.");
      return;
    }

    if (documents.length === 0) {
      toast.error("증빙 서류를 업로드해주세요.");
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
      toast.success("회장 신청이 제출되었습니다.");
      navigate(ROUTES.STUDENT_DASHBOARD);
    } catch (error) {
      console.error("회장 신청 실패", error);
      toast.error(
        getApiErrorMessage(
          error,
          "회장 신청에 실패했습니다. 잠시 후 다시 시도해주세요.",
        ),
      );
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

      {isLoadingStatus && (
        <div className={styles.statusCard}>
          <Spinner size="sm" />
          <span>신청 현황을 확인하는 중입니다.</span>
        </div>
      )}

      {!isLoadingStatus && pendingApplication && (
        <section className={styles.statusCard}>
          <span className={`${styles.statusBadge} ${styles.statusBadgePending}`}>
            심사 중
          </span>
          <div className={styles.statusBody}>
            <strong className={styles.statusTitle}>
              {pendingApplication.organization_name}
            </strong>
            <span className={styles.statusMeta}>
              제출일: {formatDate(pendingApplication.created_at)} · 운영자
              검토가 끝나면 알림으로 결과를 알려드립니다.
            </span>
            <span className={styles.statusNote}>
              심사 중에는 새 신청을 제출할 수 없습니다.
            </span>
          </div>
        </section>
      )}

      {!isLoadingStatus && !pendingApplication && approvedApplication && (
        <section className={styles.statusCard}>
          <span className={`${styles.statusBadge} ${styles.statusBadgeApproved}`}>
            승인 완료
          </span>
          <div className={styles.statusBody}>
            <strong className={styles.statusTitle}>
              {approvedApplication.organization_name}
            </strong>
            <span className={styles.statusMeta}>
              승인일: {formatDate(approvedApplication.reviewed_at)} — 이미 회장
              권한이 부여되었습니다.
            </span>
          </div>
          <button
            type="button"
            className={styles.statusActionButton}
            onClick={() => navigate(ROUTES.PRESIDENT_DASHBOARD)}
          >
            회장 대시보드로 이동 →
          </button>
        </section>
      )}

      {!isLoadingStatus &&
        !pendingApplication &&
        !approvedApplication &&
        latestRejected && (
          <section className={styles.statusCard}>
            <span
              className={`${styles.statusBadge} ${styles.statusBadgeRejected}`}
            >
              반려됨
            </span>
            <div className={styles.statusBody}>
              <strong className={styles.statusTitle}>
                {latestRejected.organization_name}
              </strong>
              <span className={styles.statusMeta}>
                반려일: {formatDate(latestRejected.reviewed_at)}
                {latestRejected.review_note &&
                  ` · 사유: ${latestRejected.review_note}`}
              </span>
              <span className={styles.statusNote}>
                {cooldownDaysLeft > 0
                  ? `반려 후 ${REAPPLY_COOLDOWN_DAYS}일이 지나야 재신청할 수 있습니다. (약 ${cooldownDaysLeft}일 남음)`
                  : "재신청 대기 기간이 지났습니다. 아래에서 다시 신청할 수 있습니다."}
              </span>
            </div>
          </section>
        )}

      {canShowForm && (
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

          <p className={styles.warningText} role="note">
            신청 이력은 실명으로 기록되며, 허위 신청 시 서비스 이용이 제한될
            수 있습니다.
          </p>

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
      )}
    </div>
  );
};

export default StudentPresidentApplication;
