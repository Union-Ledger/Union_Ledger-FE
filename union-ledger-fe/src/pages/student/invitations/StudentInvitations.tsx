import { useEffect, useState } from "react";
import useStudentApi, {
  type StudentInvitation,
  type StudentInvitationStatus,
} from "@/hooks/useStudentApi";
import { useConfirm, useToast } from "@shared/components/feedback";
import * as styles from "./StudentInvitations.css";

const completedStatusLabel = (status: StudentInvitationStatus) => {
  switch (status) {
    case "accepted":
      return "수락함";
    case "declined":
      return "거절함";
    case "expired":
      return "만료됨";
    case "revoked":
      return "회수됨";
    default:
      return status;
  }
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toISOString().slice(0, 10);
};

const getRoleLabel = (invitation: StudentInvitation) => {
  if (invitation.invitation_type === "treasurer_invite") {
    return "재정담당자";
  }

  if (invitation.invitation_type === "auditor_invite") {
    return "감사위원";
  }

  return invitation.role || "구성원";
};

const getDescription = (invitation: StudentInvitation) => {
  const roleLabel = getRoleLabel(invitation);

  return `${roleLabel}로 합류하면 해당 조직의 결산 업무에 참여할 수 있습니다.`;
};

const StudentInvitations = () => {
  const { getMyInvitations, postAcceptInvitation, postDeclineInvitation } =
    useStudentApi();
  const toast = useToast();
  const confirm = useConfirm();
  const [invitations, setInvitations] = useState<StudentInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [processingInvitationId, setProcessingInvitationId] = useState<
    string | null
  >(null);
  const [getMyInvitationsOnce] = useState(() => getMyInvitations);
  const [postAcceptInvitationOnce] = useState(() => postAcceptInvitation);
  const [postDeclineInvitationOnce] = useState(() => postDeclineInvitation);

  useEffect(() => {
    const loadInvitations = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getMyInvitationsOnce();
        setInvitations(data);
      } catch (error) {
        console.error("받은 초대 목록 조회 실패", error);
        setErrorMessage("받은 초대 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInvitations();
  }, [getMyInvitationsOnce]);

  const handleAccept = async (invitationId: string) => {
    try {
      setProcessingInvitationId(invitationId);
      const acceptedInvitation = await postAcceptInvitationOnce(invitationId);

      setInvitations((prev) =>
        prev.map((invitation) =>
          invitation.id === invitationId
            ? {
                ...invitation,
                status:
                  acceptedInvitation.status === "pending"
                    ? "accepted"
                    : acceptedInvitation.status,
              }
            : invitation,
        ),
      );
      toast.success("초대를 수락했습니다.");
    } catch (error) {
      console.error("초대 수락 실패", error);
      toast.error("초대 수락에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setProcessingInvitationId(null);
    }
  };

  const handleReject = async (invitationId: string) => {
    const ok = await confirm({
      title: "초대를 거절하시겠습니까?",
      description: "거절한 초대는 되돌릴 수 없습니다.",
      confirmLabel: "거절",
      tone: "danger",
    });

    if (!ok) return;

    try {
      setProcessingInvitationId(invitationId);
      const declined = await postDeclineInvitationOnce(invitationId);

      setInvitations((prev) =>
        prev.map((invitation) =>
          invitation.id === invitationId
            ? {
                ...invitation,
                status:
                  declined.status === "pending" ? "declined" : declined.status,
              }
            : invitation,
        ),
      );
      toast.success("초대를 거절했습니다.");
    } catch (error) {
      console.error("초대 거절 실패", error);
      toast.error("초대 거절에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setProcessingInvitationId(null);
    }
  };

  const pendingInvitations = invitations.filter(
    (invitation) => invitation.status === "pending",
  );
  const completedInvitations = invitations.filter(
    (invitation) => invitation.status !== "pending",
  );

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>받은 초대</span>
        <span className={styles.desc}>
          학생회로부터 받은 초대를 확인하고 수락하세요
        </span>
      </div>

      <div className={styles.noticeBox}>
        <span className={styles.noticeIcon}>□</span>
        <span>
          {pendingInvitations.length}건의 초대가 대기 중입니다. 초대는 7일 후
          만료됩니다.
        </span>
      </div>

      <section className={styles.card}>
        <div className={styles.sectionTitle}>대기 중인 초대</div>
        <div className={styles.sectionDesc}>
          아래 초대를 수락하거나 거절할 수 있습니다
        </div>

        <div className={styles.invitationList}>
          {isLoading ? (
            <div className={styles.emptyBox}>받은 초대를 불러오는 중입니다.</div>
          ) : errorMessage ? (
            <div className={styles.emptyBox}>{errorMessage}</div>
          ) : pendingInvitations.length === 0 ? (
            <div className={styles.emptyBox}>대기 중인 초대가 없습니다.</div>
          ) : (
            pendingInvitations.map((invitation) => (
              <div key={invitation.id} className={styles.invitationItem}>
                <div className={styles.invitationHeader}>
                  <div>
                    <span className={styles.invitationTitle}>
                      {invitation.organization_name}
                    </span>
                    <span className={styles.roleBadge}>
                      {getRoleLabel(invitation)}
                    </span>
                  </div>
                  <span className={styles.orgInfo}>
                    {invitation.college_name} {invitation.department_name}
                  </span>
                </div>

                <div className={styles.metaGrid}>
                  <span>초대일: {formatDate(invitation.created_at)}</span>
                  <span className={styles.expireText}>
                    만료일: {formatDate(invitation.expires_at)}
                  </span>
                </div>

                <div className={styles.descriptionBox}>
                  {getDescription(invitation)}
                </div>

                <div className={styles.actionRow}>
                  <button
                    type="button"
                    className={styles.acceptButton}
                    disabled={processingInvitationId === invitation.id}
                    onClick={() => handleAccept(invitation.id)}
                  >
                    {processingInvitationId === invitation.id
                      ? "수락 중..."
                      : "✓ 수락"}
                  </button>
                  <button
                    type="button"
                    className={styles.rejectButton}
                    disabled={processingInvitationId === invitation.id}
                    onClick={() => handleReject(invitation.id)}
                  >
                    {processingInvitationId === invitation.id
                      ? "처리 중..."
                      : "× 거절"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className={styles.completedCard}>
        <div className={styles.sectionTitle}>응답 완료</div>

        <div className={styles.completedList}>
          {completedInvitations.length === 0 ? (
            <div className={styles.emptyBox}>응답 완료된 초대가 없습니다.</div>
          ) : (
            completedInvitations.map((invitation) => {
              const status = invitation.status;

              return (
                <div
                  key={invitation.id}
                  className={styles.completedItem({
                    status: status === "accepted" ? "accepted" : "rejected",
                  })}
                >
                  <span className={styles.completedTitle}>
                    {invitation.organization_name}
                  </span>
                  <span className={styles.roleBadge}>
                    {getRoleLabel(invitation)}
                  </span>
                  <span className={styles.completedStatus}>
                    {completedStatusLabel(status)}
                  </span>
                  <span className={styles.completedMeta}>
                    {invitation.college_name} {invitation.department_name} |
                    초대일: {formatDate(invitation.created_at)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentInvitations;
