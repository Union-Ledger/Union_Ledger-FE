import { useEffect, useState } from "react";
import useAuthApi, { type MeResponse } from "@/hooks/useAuthApi";
import useOrganizationApi, {
  type OrganizationInvitation,
} from "@/hooks/useOrginizationApi";
import { useToast, useConfirm } from "@shared/components/feedback";
import * as styles from "./PresidentInvite.css";

type InviteRole = "재정담당자" | "감사위원";

const getInvitationType = (role: InviteRole) => {
  return role === "재정담당자" ? "treasurer_invite" : "auditor_invite";
};

const getInvitationRole = (role: InviteRole) => {
  return role === "재정담당자" ? "treasurer" : "auditor";
};

const getRoleLabel = (invitation: OrganizationInvitation) => {
  if (invitation.invitation_type === "treasurer_invite") {
    return "재정담당자";
  }

  if (invitation.invitation_type === "auditor_invite") {
    return "감사위원";
  }

  return invitation.role;
};

const getStatusLabel = (status: OrganizationInvitation["status"]) => {
  const statusMap: Record<OrganizationInvitation["status"], string> = {
    accepted: "수락됨",
    pending: "대기 중",
    rejected: "거절됨",
  };

  return statusMap[status] ?? status;
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toISOString().slice(0, 10);
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const getStringField = (value: unknown, key: string) => {
  if (!isRecord(value)) return null;

  const fieldValue = value[key];

  return typeof fieldValue === "string" && fieldValue.trim()
    ? fieldValue
    : null;
};

const getOrganizationIdFromMe = (me: MeResponse | null) => {
  if (!me) return null;

  if (me.organization_id) return me.organization_id;
  if (me.organization?.id) return me.organization.id;
  if (me.organizations?.[0]?.id) return me.organizations[0].id;

  const membership = me.memberships?.find(
    (item) => item.organization_id || item.organization?.id,
  );

  return membership?.organization_id ?? membership?.organization?.id ?? null;
};

const getOrganizationIdFromResponse = (response: unknown): string | null => {
  if (Array.isArray(response)) {
    return response.find((item) => getStringField(item, "id"))?.id ?? null;
  }

  if (isRecord(response)) {
    const directId = getStringField(response, "id");
    const organizationId = getStringField(response, "organization_id");

    if (directId) return directId;
    if (organizationId) return organizationId;

    const organization = response.organization;

    if (isRecord(organization)) {
      const nestedId = getStringField(organization, "id");

      if (nestedId) return nestedId;
    }

    const organizations = response.organizations;

    if (Array.isArray(organizations)) {
      return getOrganizationIdFromResponse(organizations);
    }
  }

  return null;
};

const PresidentInvite = () => {
  const {
    getOrganization,
    getInvitations,
    postInvitation,
    postRoleTransfer,
    deleteInvitation,
  } = useOrganizationApi();
  const { getMe } = useAuthApi();
  const toast = useToast();
  const confirm = useConfirm();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("재정담당자");
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [sentInvitations, setSentInvitations] = useState<
    OrganizationInvitation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [deletingInvitationId, setDeletingInvitationId] = useState<
    string | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [transferEmail, setTransferEmail] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferCode, setTransferCode] = useState<string | null>(null);
  const [transferMessage, setTransferMessage] = useState("");
  const [getOrganizationOnce] = useState(() => getOrganization);
  const [getInvitationsOnce] = useState(() => getInvitations);
  const [postInvitationOnce] = useState(() => postInvitation);
  const [postRoleTransferOnce] = useState(() => postRoleTransfer);
  const [deleteInvitationOnce] = useState(() => deleteInvitation);
  const [getMeOnce] = useState(() => getMe);

  useEffect(() => {
    const loadInvitations = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const me = await getMeOnce().catch((error) => {
          console.error("내 정보 조회 실패", error);
          return null;
        });

        let nextOrganizationId = getOrganizationIdFromMe(me);

        if (!nextOrganizationId) {
          const organizations = await getOrganizationOnce();
          nextOrganizationId = getOrganizationIdFromResponse(organizations);
        }

        if (!nextOrganizationId) {
          nextOrganizationId = localStorage.getItem("organizationId");
        }

        if (nextOrganizationId) {
          localStorage.setItem("organizationId", nextOrganizationId);
        }

        if (!nextOrganizationId) {
          setErrorMessage("조직 정보를 찾을 수 없습니다.");
          return;
        }

        setOrganizationId(nextOrganizationId);
        const invitations = await getInvitationsOnce(nextOrganizationId);
        setSentInvitations(invitations);
      } catch (error) {
        console.error("조직 초대 목록 조회 실패", error);
        setErrorMessage("발송한 초대 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInvitations();
  }, [getInvitationsOnce, getMeOnce, getOrganizationOnce]);

  const handleSendInvite = async () => {
    const trimmedEmail = email.trim();

    if (!organizationId) {
      toast.error("조직 정보를 찾을 수 없습니다.");
      return;
    }

    if (!trimmedEmail) {
      toast.error("초대할 이메일을 입력해주세요.");
      return;
    }

    if (!trimmedEmail.endsWith("@konkuk.ac.kr")) {
      toast.error("건국대학교 이메일(@konkuk.ac.kr)만 초대할 수 있습니다.");
      return;
    }

    const alreadyInvited = sentInvitations.some(
      (invitation) =>
        invitation.invited_email.toLowerCase() === trimmedEmail.toLowerCase() &&
        invitation.status === "pending",
    );
    if (alreadyInvited) {
      toast.error("이미 초대장을 보낸 이메일입니다. 발송 목록에서 확인하세요.");
      return;
    }

    try {
      setIsSending(true);
      const invitation = await postInvitationOnce({
        organizationId,
        invitedEmail: trimmedEmail,
        invitationType: getInvitationType(role),
        role: getInvitationRole(role),
      });

      setSentInvitations((prev) => [invitation, ...prev]);
      setEmail("");
      toast.success(`${trimmedEmail} 님에게 초대장을 발송했습니다.`);
    } catch (error) {
      console.error("조직 초대 발송 실패", error);
      toast.error("초대장 발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSending(false);
    }
  };

  const handleTransfer = async () => {
    const trimmedEmail = transferEmail.trim();

    if (!organizationId) {
      toast.error("조직 정보를 찾을 수 없습니다.");
      return;
    }
    if (!trimmedEmail) {
      toast.error("후임자 이메일을 입력해주세요.");
      return;
    }
    if (!trimmedEmail.endsWith("@konkuk.ac.kr")) {
      toast.error("건국대학교 이메일(@konkuk.ac.kr)만 입력할 수 있습니다.");
      return;
    }
    const ok = await confirm({
      title: `${trimmedEmail} 님에게 회장 권한을 이전할까요?`,
      description:
        "후임자가 수락하면 회장 권한이 상대에게 넘어가며, 본인의 회장 권한은 회수되어 되돌릴 수 없습니다.",
      confirmLabel: "권한 이전",
      tone: "danger",
    });
    if (!ok) return;

    try {
      setIsTransferring(true);
      setTransferMessage("");
      setTransferCode(null);
      const invitation = await postRoleTransferOnce(
        organizationId,
        trimmedEmail,
      );
      setTransferCode(invitation.code ?? null);
      setTransferMessage(
        `${trimmedEmail} 님에게 권한 이전 초대를 보냈습니다. 후임자가 수락하면 이전이 완료됩니다.`,
      );
      setTransferEmail("");
    } catch (error) {
      console.error("권한 이전 실패", error);
      toast.error("권한 이전에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsTransferring(false);
    }
  };

  const handleCancel = async (invitationId: string) => {
    if (!organizationId) {
      toast.error("조직 정보를 찾을 수 없습니다.");
      return;
    }

    const ok = await confirm({
      title: "초대를 회수할까요?",
      description: "회수하면 상대방은 더 이상 이 초대를 수락할 수 없습니다.",
      confirmLabel: "회수",
      tone: "danger",
    });

    if (!ok) return;

    try {
      setDeletingInvitationId(invitationId);
      await deleteInvitationOnce(organizationId, invitationId);
      setSentInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== invitationId),
      );
    } catch (error) {
      console.error("조직 초대 회수 실패", error);
      toast.error("초대 회수에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setDeletingInvitationId(null);
    }
  };

  const handleCopyTransferCode = async () => {
    if (!transferCode) return;

    try {
      await navigator.clipboard.writeText(transferCode);
      toast.success("인계 코드를 복사했습니다.");
    } catch {
      toast.error("복사에 실패했습니다. 코드를 길게 눌러 직접 복사해주세요.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>팀원 초대</span>
        <span className={styles.desc}>
          재정담당자와 감사위원을 초대하여 팀을 구성하세요
        </span>
      </div>

      <section className={styles.formCard}>
        <div className={styles.formHeader}>
          <span className={styles.formIcon}>♙</span>
          <div>
            <h2 className={styles.formTitle}>새 팀원 초대</h2>
            <p className={styles.formDesc}>
              팀원의 이메일과 역할을 선택하여 초대장을 발송하세요
            </p>
          </div>
        </div>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span className={styles.label}>이메일 주소 *</span>
            <input
              className={styles.input}
              value={email}
              placeholder="member@konkuk.ac.kr"
              onChange={(event) => setEmail(event.target.value)}
            />
            <span className={styles.helper}>
              건국대학교 이메일(@konkuk.ac.kr)만 초대 가능합니다
            </span>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>역할 *</span>
            <select
              className={styles.select}
              value={role}
              onChange={(event) => setRole(event.target.value as InviteRole)}
            >
              <option value="재정담당자">재정담당자</option>
              <option value="감사위원">감사위원</option>
            </select>
            <span className={styles.helper}>
              초대받은 사람은 이 역할로 합류하게 됩니다
            </span>
          </label>
        </div>

        <button
          type="button"
          className={styles.sendButton}
          disabled={isSending}
          onClick={handleSendInvite}
        >
          {isSending ? "발송 중..." : "✈ 초대장 발송"}
        </button>
      </section>

      <section className={styles.formCard}>
        <div className={styles.formHeader}>
          <span className={styles.formIcon}>⇄</span>
          <div>
            <h2 className={styles.formTitle}>권한 이전 (인수인계)</h2>
            <p className={styles.formDesc}>
              후임 회장에게 권한을 넘깁니다. 후임자가 초대를 수락하면 본인의 회장
              권한은 자동으로 회수됩니다.
            </p>
          </div>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>후임자 이메일 *</span>
          <input
            className={styles.input}
            value={transferEmail}
            placeholder="successor@konkuk.ac.kr"
            onChange={(event) => setTransferEmail(event.target.value)}
          />
          <span className={styles.helper}>
            건국대학교 이메일(@konkuk.ac.kr)만 입력 가능합니다
          </span>
        </label>

        <button
          type="button"
          className={styles.sendButton}
          disabled={isTransferring}
          onClick={handleTransfer}
        >
          {isTransferring ? "이전 처리 중..." : "⇄ 권한 이전"}
        </button>

        {transferMessage && (
          <p className={styles.helper} style={{ marginTop: 12 }}>
            {transferMessage}
          </p>
        )}
        {transferCode && (
          <div
            style={{
              marginTop: 8,
              padding: "10px 12px",
              borderRadius: 8,
              background: "#F5F3FF",
              border: "1px solid #DDD6FE",
              fontSize: 13,
              wordBreak: "break-all",
            }}
          >
            인계 코드: <strong>{transferCode}</strong>{" "}
            <button
              type="button"
              onClick={handleCopyTransferCode}
              style={{
                marginLeft: 8,
                padding: "2px 10px",
                borderRadius: 6,
                border: "1px solid #C4B5FD",
                background: "#FFFFFF",
                color: "#6D28D9",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              복사
            </button>
            <br />
            후임자에게 이 코드를 전달하면 코드로도 수락할 수 있습니다.
          </div>
        )}
      </section>

      <section className={styles.listCard}>
        <h2 className={styles.listTitle}>발송한 초대</h2>
        <p className={styles.listDesc}>
          팀원에게 보낸 초대장 상태를 확인하세요
        </p>

        <div className={styles.invitationList}>
          {isLoading ? (
            <div className={styles.emptyBox}>초대 목록을 불러오는 중입니다.</div>
          ) : errorMessage ? (
            <div className={styles.emptyBox}>{errorMessage}</div>
          ) : sentInvitations.length === 0 ? (
            <div className={styles.emptyBox}>발송한 초대가 없습니다.</div>
          ) : (
            sentInvitations.map((invitation) => (
              <div key={invitation.id} className={styles.invitationItem}>
                <div>
                  <span className={styles.email}>
                    {invitation.invited_email}
                  </span>
                  <span
                    className={styles.statusBadge({
                      status:
                        invitation.status === "accepted"
                          ? "accepted"
                          : "pending",
                    })}
                  >
                    {getStatusLabel(invitation.status)}
                  </span>
                  <p className={styles.meta}>
                    역할: {getRoleLabel(invitation)} 발송일:{" "}
                    {formatDate(invitation.created_at)}
                  </p>
                </div>

                {invitation.status === "pending" && (
                  <button
                    type="button"
                    className={styles.cancelButton}
                    disabled={deletingInvitationId === invitation.id}
                    onClick={() => handleCancel(invitation.id)}
                  >
                    {deletingInvitationId === invitation.id
                      ? "회수 중"
                      : "⌫ 취소"}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PresidentInvite;
