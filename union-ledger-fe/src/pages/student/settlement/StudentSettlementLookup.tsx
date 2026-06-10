import { useEffect, useMemo, useState } from "react";
import { callender, eye, trendingUp } from "@assets/dashboard";
import usePublicSettlementApi, {
  type PublicSettlementArtifact,
  type PublicSettlementDetail,
  type PublicSettlementItem,
  type PublicSettlementListItem,
} from "@/hooks/usePublicSettlementApi";
import { useToast } from "@shared/components/feedback";
import * as styles from "./StudentSettlementLookup.css";

const ITEMS_PER_PAGE = 10;

type CategorySummary = {
  name: string;
  amount: number;
  displayAmount: string;
};

const getSemesterText = (academicYear: number, semester: string) => {
  const yearText = academicYear > 0 ? `${academicYear}` : "";
  const semesterText = semester || "학기 미정";

  if (!yearText) return semesterText;
  if (semesterText.includes("학기")) return `${yearText}-${semesterText}`;
  return `${yearText}-${semesterText}학기`;
};

const getSemesterOption = (academicYear: number, semester: string) => {
  const semesterText = semester || "학기 미정";

  if (academicYear <= 0) return semesterText;
  if (semesterText.includes("학기")) return `${academicYear}학년도 ${semesterText}`;
  return `${academicYear}학년도 ${semesterText}학기`;
};

const getDateText = (date: string | null) => {
  if (!date) return "-";
  return date.slice(0, 10);
};

const getNumericAmount = (amount: string | number | null | undefined) => {
  if (amount == null) return 0;
  const value = Number.parseFloat(String(amount).replace(/,/g, ""));
  return Number.isFinite(value) ? Math.abs(value) : 0;
};

const formatAmount = (amount: string | number | null | undefined) => {
  if (amount == null) return "₩0";

  const rawValue = String(amount).replace(/,/g, "").trim();
  const isNegative = rawValue.startsWith("-");
  const unsignedValue = rawValue.replace(/^[+-]/, "");
  const [integerPart] = unsignedValue.split(".");
  const normalizedInteger = integerPart.replace(/^0+(?=\d)/, "") || "0";
  const groupedInteger = normalizedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${isNegative ? "-" : ""}₩${groupedInteger}`;
};

const getTitle = (settlement: Pick<PublicSettlementListItem, "organization_name" | "department_name" | "title">) => {
  if (settlement.organization_name && settlement.organization_name !== "string") {
    return settlement.organization_name;
  }
  if (settlement.department_name && settlement.department_name !== "string") {
    return `${settlement.department_name} 학생회`;
  }
  return settlement.title || "공개 결산안";
};

const createCategorySummary = (items: PublicSettlementItem[]) => {
  const summary = new Map<string, number>();

  items.forEach((item) => {
    // 구분(행사/용도) 기준 분포 — 카테고리는 배경 데이터로만 유지.
    const category = item.group_name || "미분류";
    summary.set(category, (summary.get(category) || 0) + getNumericAmount(item.amount));
  });

  return Array.from(summary.entries())
    .map<CategorySummary>(([name, amount]) => ({
      name,
      amount,
      displayAmount: formatAmount(amount),
    }))
    .sort((a, b) => b.amount - a.amount);
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

const openBlob = (blob: Blob) => {
  const url = URL.createObjectURL(blob);

  window.open(url, "_blank", "noopener,noreferrer");
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

const getArtifactByType = (
  artifacts: PublicSettlementArtifact[] | undefined,
  type: "excel" | "pdf",
) => {
  const candidates = artifacts || [];

  return candidates.find((artifact) =>
    artifact.artifact_type.toLowerCase().includes(type),
  );
};

const StudentSettlementLookup = () => {
  const {
    getPublicSettlements,
    getPublicSettlementDetail,
    getPublicSettlementItems,
    getPublicEvidence,
    downloadPublicEvidenceFile,
    downloadPublicSettlementArtifact,
  } = usePublicSettlementApi();
  const [settlements, setSettlements] = useState<PublicSettlementListItem[]>([]);
  const [selectedSemester, setSelectedSemester] = useState("전체");
  const [selectedSettlement, setSelectedSettlement] =
    useState<PublicSettlementListItem | null>(null);
  const [detail, setDetail] = useState<PublicSettlementDetail | null>(null);
  const [items, setItems] = useState<PublicSettlementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailErrorMessage, setDetailErrorMessage] = useState("");
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null);
  // 모달 내 거래 내역 검색·페이지네이션 (전체 내역 열람용)
  const [itemSearch, setItemSearch] = useState("");
  const [itemsPage, setItemsPage] = useState(1);
  const toast = useToast();

  useEffect(() => {
    let ignore = false;

    const fetchSettlements = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await getPublicSettlements();

        if (ignore) return;
        setSettlements(response);
      } catch {
        if (!ignore) {
          setErrorMessage("공개된 결산안 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchSettlements();

    return () => {
      ignore = true;
    };
  }, [getPublicSettlements]);

  useEffect(() => {
    if (!selectedSettlement) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedSettlement(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedSettlement]);

  useEffect(() => {
    if (!selectedSettlement) {
      setDetail(null);
      setItems([]);
      setDetailErrorMessage("");
      return;
    }

    let ignore = false;

    const fetchDetail = async () => {
      try {
        setIsDetailLoading(true);
        setDetailErrorMessage("");

        const [detailResponse, itemsResponse] = await Promise.all([
          getPublicSettlementDetail(selectedSettlement.id),
          getPublicSettlementItems(selectedSettlement.id),
        ]);

        if (ignore) return;
        setDetail(detailResponse);
        setItems(itemsResponse);
      } catch {
        if (!ignore) {
          setDetailErrorMessage("결산안 상세 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setIsDetailLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      ignore = true;
    };
  }, [getPublicSettlementDetail, getPublicSettlementItems, selectedSettlement]);

  const semesterOptions = useMemo(() => {
    const options = settlements.map((settlement) =>
      getSemesterOption(settlement.academic_year, settlement.semester),
    );

    return ["전체", ...Array.from(new Set(options))];
  }, [settlements]);

  const filteredSettlements = useMemo(() => {
    if (selectedSemester === "전체") return settlements;

    return settlements.filter(
      (settlement) =>
        getSemesterOption(settlement.academic_year, settlement.semester) ===
        selectedSemester,
    );
  }, [selectedSemester, settlements]);

  const categorySummary = useMemo(() => createCategorySummary(items), [items]);
  const categoryTotal = useMemo(
    () => categorySummary.reduce((sum, category) => sum + category.amount, 0),
    [categorySummary],
  );

  const filteredItems = useMemo(() => {
    const query = itemSearch.trim().toLowerCase();
    if (!query) return items;

    return items.filter(
      (item) =>
        (item.merchant_name ?? "").toLowerCase().includes(query) ||
        (item.group_name ?? "").toLowerCase().includes(query),
    );
  }, [items, itemSearch]);

  const totalItemPages = Math.max(
    1,
    Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
  );
  const currentItemPage = Math.min(itemsPage, totalItemPages);
  const pagedItems = useMemo(
    () =>
      filteredItems.slice(
        (currentItemPage - 1) * ITEMS_PER_PAGE,
        currentItemPage * ITEMS_PER_PAGE,
      ),
    [filteredItems, currentItemPage],
  );

  const handleEvidenceFileOpen = async (item: PublicSettlementItem) => {
    if (!item.has_evidence_file) {
      toast.info("공개된 증빙 원본 파일이 없습니다.");
      return;
    }

    try {
      setActiveEvidenceId(item.evidence_id);
      const metadata = await getPublicEvidence(item.evidence_id);
      const blob = await downloadPublicEvidenceFile(item.evidence_id);

      if (!metadata.has_evidence_file) {
        toast.info("공개된 증빙 원본 파일이 없습니다.");
        return;
      }

      openBlob(blob);
    } catch {
      toast.error("증빙 원본 파일을 열지 못했습니다.");
    } finally {
      setActiveEvidenceId(null);
    }
  };

  const handleArtifactDownload = async (
    settlement: PublicSettlementListItem,
    type: "excel" | "pdf",
  ) => {
    try {
      setActiveArtifactId(`${settlement.id}-${type}`);

      const settlementDetail =
        detail?.id === settlement.id
          ? detail
          : await getPublicSettlementDetail(settlement.id);
      const artifact = getArtifactByType(settlementDetail.artifacts, type);

      if (!artifact) {
        toast.info(`${type === "excel" ? "엑셀" : "PDF"} 산출물이 아직 없습니다.`);
        return;
      }

      const blob = await downloadPublicSettlementArtifact(settlement.id, artifact.id);
      const extension = type === "excel" ? "xlsx" : "pdf";
      const title = getTitle(settlement).replace(/[\\/:*?"<>|]/g, "_");

      saveBlob(blob, `${title}_${getSemesterText(settlement.academic_year, settlement.semester)}.${extension}`);
      toast.success(`${type === "excel" ? "엑셀" : "PDF"} 다운로드를 시작했습니다.`);
    } catch {
      toast.error(`${type === "excel" ? "엑셀" : "PDF"} 산출물 다운로드에 실패했습니다.`);
    } finally {
      setActiveArtifactId(null);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.titleGroup}>
        <h1 className={styles.title}>결산안 조회</h1>
        <p className={styles.description}>감사가 완료된 결산안을 투명하게 조회할 수 있습니다</p>
      </section>

      <section className={styles.filterPanel} aria-label="결산안 필터">
        <img className={styles.filterIcon} src={callender} alt="" />
        <label className={styles.filterControl}>
          <span className={styles.label}>학기 선택</span>
          <select
            className={styles.select}
            value={selectedSemester}
            onChange={(event) => setSelectedSemester(event.target.value)}
          >
            {semesterOptions.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>
        </label>
      </section>

      {isLoading && <p className={styles.stateMessage}>공개 결산안을 불러오는 중입니다.</p>}
      {!isLoading && errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      {!isLoading && !errorMessage && filteredSettlements.length === 0 && (
        <p className={styles.stateMessage}>선택한 학기에 공개된 결산안이 없습니다.</p>
      )}

      {!isLoading && !errorMessage && filteredSettlements.length > 0 && (
        <section className={styles.cardGrid} aria-label="승인된 결산안 목록">
          {filteredSettlements.map((settlement) => (
            <article className={styles.card} key={settlement.id}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleGroup}>
                  <h2 className={styles.cardTitle}>{getTitle(settlement)}</h2>
                  <span className={styles.semester}>
                    {getSemesterText(settlement.academic_year, settlement.semester)}
                  </span>
                </div>
                <span className={styles.approvedBadge}>감사 승인</span>
              </div>

              <div className={styles.statGrid}>
                <div className={styles.amountBox}>
                  <span className={`${styles.statLabel} ${styles.amountLabel}`}>총 지출액</span>
                  <strong className={styles.statValue}>{formatAmount(settlement.total_amount)}</strong>
                </div>
                <div className={styles.countBox}>
                  <span className={`${styles.statLabel} ${styles.countLabel}`}>증빙 건수</span>
                  <strong className={styles.statValue}>{settlement.item_count}건</strong>
                </div>
              </div>

              <div className={styles.cardMeta}>
                <img className={styles.metaIcon} src={callender} alt="" />
                <span>승인일: {getDateText(settlement.published_at)}</span>
              </div>

              <div className={styles.actionRow}>
                <button
                  className={styles.detailButton}
                  type="button"
                  onClick={() => {
                    setSelectedSettlement(settlement);
                    setItemSearch("");
                    setItemsPage(1);
                  }}
                >
                  <img className={styles.buttonIcon} src={eye} alt="" />
                  상세 보기
                </button>
                <button
                  className={styles.downloadButton}
                  type="button"
                  aria-label={`${getTitle(settlement)} 결산안 다운로드`}
                  disabled={activeArtifactId === `${settlement.id}-excel`}
                  onClick={() => handleArtifactDownload(settlement, "excel")}
                >
                  ↓
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      <aside className={styles.infoBanner}>
        <span className={styles.infoIcon}>
          <img className={styles.buttonIcon} src={trendingUp} alt="" />
        </span>
        <div>
          <p className={styles.infoTitle}>회계 투명성 보장</p>
          <p className={styles.infoText}>
            모든 결산안은 감사위원의 승인을 거쳐 공개됩니다. 학생회비의 지출 내역을 투명하게 확인하실 수
            있습니다.
          </p>
        </div>
      </aside>

      {selectedSettlement && (
        <div className={styles.overlay} role="presentation" onMouseDown={() => setSelectedSettlement(null)}>
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settlement-detail-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 id="settlement-detail-title" className={styles.modalTitle}>
                항목별 지출 현황
              </h2>
              <button className={styles.closeButton} type="button" onClick={() => setSelectedSettlement(null)}>
                ×
              </button>
            </div>

            {isDetailLoading && <p className={styles.stateMessage}>결산안 상세 정보를 불러오는 중입니다.</p>}
            {!isDetailLoading && detailErrorMessage && (
              <p className={styles.errorMessage}>{detailErrorMessage}</p>
            )}

            {!isDetailLoading && !detailErrorMessage && (
              <>
                <div className={styles.categoryList}>
                  {categorySummary.length === 0 && (
                    <p className={styles.stateMessage}>공개된 지출 항목이 없습니다.</p>
                  )}
                  {categorySummary.map((category) => {
                    const percentage =
                      categoryTotal > 0 ? Math.round((category.amount / categoryTotal) * 100) : 0;

                    return (
                      <div className={styles.categoryRow} key={category.name}>
                        <div className={styles.categoryMeta}>
                          <span>{category.name}</span>
                          <span className={styles.categoryAmount}>
                            {category.displayAmount} ({percentage}%)
                          </span>
                        </div>
                        <div className={styles.progressTrack}>
                          <div className={styles.progressBar} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <section>
                  <div className={styles.tableToolbar}>
                    <h3 className={styles.sectionTitle}>
                      거래 내역 ({filteredItems.length}건)
                    </h3>
                    <input
                      className={styles.tableSearchInput}
                      type="search"
                      placeholder="적요·구분 검색"
                      aria-label="거래 내역 검색"
                      value={itemSearch}
                      onChange={(event) => {
                        setItemSearch(event.target.value);
                        setItemsPage(1);
                      }}
                    />
                  </div>
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead className={styles.tableHeader}>
                        <tr>
                          <th className={styles.tableHeadCell}>날짜</th>
                          <th className={styles.tableHeadCell}>적요</th>
                          <th className={styles.tableHeadCell}>항목</th>
                          <th className={styles.tableHeadCell}>증빙</th>
                          <th className={`${styles.tableHeadCell} ${styles.tableAmount}`}>금액</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagedItems.length === 0 && (
                          <tr>
                            <td className={styles.tableCell} colSpan={5}>
                              {itemSearch.trim()
                                ? "검색 결과가 없습니다."
                                : "거래 내역이 없습니다."}
                            </td>
                          </tr>
                        )}
                        {pagedItems.map((item) => (
                          <tr key={item.evidence_id}>
                            <td className={styles.tableCell}>{getDateText(item.evidence_date)}</td>
                            <td className={styles.tableCell}>{item.merchant_name || "-"}</td>
                            <td className={styles.tableCell}>
                              <span className={styles.categoryChip}>{item.group_name || "미분류"}</span>
                            </td>
                            <td className={styles.tableCell}>
                              <button
                                className={styles.evidenceButton}
                                type="button"
                                disabled={!item.has_evidence_file || activeEvidenceId === item.evidence_id}
                                onClick={() => handleEvidenceFileOpen(item)}
                              >
                                {activeEvidenceId === item.evidence_id ? "여는 중" : "보기"}
                              </button>
                            </td>
                            <td className={`${styles.tableCell} ${styles.tableAmount}`}>
                              {formatAmount(item.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalItemPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        className={styles.pageButton}
                        type="button"
                        disabled={currentItemPage <= 1}
                        onClick={() => setItemsPage(currentItemPage - 1)}
                      >
                        이전
                      </button>
                      <span className={styles.pageInfo}>
                        {currentItemPage} / {totalItemPages}
                      </span>
                      <button
                        className={styles.pageButton}
                        type="button"
                        disabled={currentItemPage >= totalItemPages}
                        onClick={() => setItemsPage(currentItemPage + 1)}
                      >
                        다음
                      </button>
                    </div>
                  )}
                </section>

                <div className={styles.modalActions}>
                  <button
                    className={styles.outlineButton}
                    type="button"
                    onClick={() =>
                      handleArtifactDownload(detail || selectedSettlement, "excel")
                    }
                    disabled={activeArtifactId === `${selectedSettlement.id}-excel`}
                  >
                    ▦ 결산안 엑셀 다운로드
                  </button>
                  <button
                    className={styles.outlineButton}
                    type="button"
                    onClick={() =>
                      handleArtifactDownload(detail || selectedSettlement, "pdf")
                    }
                    disabled={activeArtifactId === `${selectedSettlement.id}-pdf`}
                  >
                    ▦ 증빙 PDF 다운로드
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
};

export default StudentSettlementLookup;
