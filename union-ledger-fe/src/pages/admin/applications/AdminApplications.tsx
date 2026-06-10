import { useEffect, useMemo, useState } from "react";
import useAdminApplicationApi from "@/hooks/useAdminApplicationApi";
import type { AdminApplication } from "@/hooks/useStudentApi";
import { useConfirm, useToast } from "@shared/components/feedback";
import * as styles from "./AdminApplications.css";

type ApplicationStatus = "pending" | "approved" | "rejected";

const getStatusText = (status: ApplicationStatus) => {
  if (status === "approved") return "승인됨";
  if (status === "rejected") return "반려됨";
  return "검토 대기";
};

const normalizeStatus = (status: string): ApplicationStatus => {
  if (status === "approved" || status === "rejected") {
    return status;
  }

  return "pending";
};

const formatDate = (date: string | null) => {
  if (!date) return "-";

  return date.slice(0, 10);
};

const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const AdminApplications = () => {
  const {
    getAdminApplications,
    downloadAdminApplicationDocument,
    approveAdminApplication,
    rejectAdminApplication,
  } = useAdminApplicationApi();
  const toast = useToast();
  const confirm = useConfirm();
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [processingApplicationId, setProcessingApplicationId] = useState<string | null>(null);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const applicationList = await getAdminApplications();
        setApplications(applicationList);
      } catch (error) {
        console.error("회장 신청 목록 조회 실패", error);
        setErrorMessage("회장 신청 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, [getAdminApplications]);

  const pendingApplications = useMemo(
    () =>
      applications.filter(
        (application) => normalizeStatus(application.status) === "pending",
      ),
    [applications],
  );
  const completedApplications = useMemo(
    () =>
      applications.filter(
        (application) => normalizeStatus(application.status) !== "pending",
      ),
    [applications],
  );

  const replaceApplication = (nextApplication: AdminApplication) => {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === nextApplication.id ? nextApplication : application,
      ),
    );
  };

  const handleDecision = async (
    applicationId: string,
    status: Exclude<ApplicationStatus, "pending">,
  ) => {
    const defaultNote =
      status === "approved"
        ? "회장 신청을 승인했습니다."
        : "회장 신청을 반려했습니다.";

    if (status === "rejected") {
      const ok = await confirm({
        title: "이 신청을 반려하시겠습니까?",
        description: "신청자가 다시 제출해야 합니다.",
        confirmLabel: "반려",
        tone: "danger",
      });

      if (!ok) return;
    }

    try {
      setProcessingApplicationId(applicationId);

      if (status === "approved") {
        const response = await approveAdminApplication(applicationId, defaultNote);
        replaceApplication(response.application);
        toast.success("회장 신청을 승인했습니다.");
        return;
      }

      const response = await rejectAdminApplication(applicationId, defaultNote);
      replaceApplication(response);
      toast.success("회장 신청을 반려했습니다.");
    } catch (error) {
      console.error("회장 신청 검토 처리 실패", error);
      toast.error("회장 신청 처리에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setProcessingApplicationId(null);
    }
  };

  const handleDownload = async (
    applicationId: string,
    documentIndex: number,
    documentName: string,
  ) => {
    const downloadKey = `${applicationId}-${documentIndex}`;

    try {
      setDownloadingKey(downloadKey);
      const blob = await downloadAdminApplicationDocument(applicationId, documentIndex);
      saveBlob(blob, documentName);
    } catch (error) {
      console.error("회장 신청 서류 다운로드 실패", error);
      toast.error("증빙 서류 다운로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setDownloadingKey(null);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.titleContainer}>
        <h1 className={styles.title}>회장 신청 관리</h1>
        <p className={styles.description}>회장 권한 신청을 검토하고 승인/반려하세요</p>
      </header>

      <section className={styles.panel}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>검토 대기 중인 신청</h2>
          <span className={styles.countBadge}>{pendingApplications.length}건</span>
        </div>

        <div className={styles.applicationList}>
          {isLoading && (
            <div className={styles.emptyBox}>회장 신청 목록을 불러오는 중입니다.</div>
          )}

          {!isLoading && errorMessage && (
            <div className={styles.errorBox}>{errorMessage}</div>
          )}

          {pendingApplications.map((application) => (
            <article className={styles.pendingCard} key={application.id}>
              <div className={styles.cardTop}>
                <div>
                  <div className={styles.nameRow}>
                    <strong className={styles.applicantName}>
                      {application.applicant_name}
                    </strong>
                    <span className={styles.pendingBadge}>
                      {getStatusText(normalizeStatus(application.status))}
                    </span>
                  </div>
                  <p className={styles.email}>{application.applicant_email}</p>
                </div>
                <span className={styles.appliedAt}>
                  신청일: {formatDate(application.created_at)}
                </span>
              </div>

              <div className={styles.organizationBlock}>
                <div>
                  <div className={styles.metaLabel}>조직 이름</div>
                  <div className={styles.organizationName}>
                    {application.organization_name}
                  </div>
                </div>
              </div>

              <div className={styles.metaGrid}>
                <div>
                  <div className={styles.metaLabel}>단과대학</div>
                  <div className={styles.metaValue}>
                    {application.college_name}
                  </div>
                </div>
                <div>
                  <div className={styles.metaLabel}>학과</div>
                  <div className={styles.metaValue}>{application.department_name}</div>
                </div>
              </div>

              <div className={styles.documentList}>
                {application.documents.map((document, index) => {
                  const downloadKey = `${application.id}-${index}`;

                  return (
                    <div className={styles.documentRow} key={downloadKey}>
                      <span className={styles.documentName}>□ {document.file_name}</span>
                      <button
                        className={styles.downloadButton}
                        type="button"
                        disabled={downloadingKey === downloadKey}
                        onClick={() =>
                          handleDownload(application.id, index, document.file_name)
                        }
                      >
                        {downloadingKey === downloadKey ? "다운로드 중" : "다운로드"}
                      </button>
                    </div>
                  );
                })}

                {application.documents.length === 0 && (
                  <div className={styles.documentEmpty}>첨부된 증빙 서류가 없습니다.</div>
                )}
              </div>

              <div className={styles.actionRow}>
                <button
                  className={styles.approveButton}
                  type="button"
                  disabled={processingApplicationId === application.id}
                  onClick={() => handleDecision(application.id, "approved")}
                >
                  승인
                </button>
                <button
                  className={styles.rejectButton}
                  type="button"
                  disabled={processingApplicationId === application.id}
                  onClick={() => handleDecision(application.id, "rejected")}
                >
                  반려
                </button>
              </div>
            </article>
          ))}

          {!isLoading && !errorMessage && pendingApplications.length === 0 && (
            <div className={styles.emptyBox}>검토 대기 중인 신청이 없습니다.</div>
          )}
        </div>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.sectionTitle}>검토 완료</h2>

        <div className={styles.completedList}>
          {completedApplications.map((application) => (
            <article
              className={styles.completedItem({
                status: normalizeStatus(application.status),
              })}
              key={application.id}
            >
              <div className={styles.completedInfo}>
                <strong className={styles.completedName}>
                  {application.applicant_name}
                </strong>
                <span
                  className={styles.completedBadge({
                    status: normalizeStatus(application.status),
                  })}
                >
                  {getStatusText(normalizeStatus(application.status))}
                </span>
                <p className={styles.completedMeta}>
                  {application.college_name} {application.department_name} |{" "}
                  {application.applicant_email}
                </p>
              </div>
              <span className={styles.appliedAt}>
                {formatDate(application.reviewed_at ?? application.created_at)}
              </span>
            </article>
          ))}

          {!isLoading && completedApplications.length === 0 && (
            <div className={styles.emptyBox}>검토 완료된 신청이 없습니다.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminApplications;
