import { useEffect, useState } from "react";
import UploadCard from "@/components/common/UploadCard";
import useOrganizationApi, { type TemplateData } from "@/hooks/useOrginizationApi";
import * as styles from "@/pages/treasurer/template/Template.css";

const Template = () => {
  const { getOrganization, getTemplate, postTemplate } = useOrganizationApi();

  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<TemplateData | null>(null);
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [getOrganizationOnce] = useState(() => getOrganization);
  const [getTemplateOnce] = useState(() => getTemplate);
  const [postTemplateOnce] = useState(() => postTemplate);

  const applyTemplateToForm = (template: TemplateData) => {
    setCurrentTemplate(template);
  };

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const organizations = await getOrganizationOnce();

        if (!organizations || organizations.length === 0) {
          alert("소속된 조직이 없습니다.");
          return;
        }

        const firstOrganization = organizations[0];

        setOrganizationId(firstOrganization.id);
        localStorage.setItem("organizationId", firstOrganization.id);

        const templates = await getTemplateOnce(firstOrganization.id);
        const activeTemplate =
          templates?.find((template) => template.is_active) ?? templates?.[0];

        if (activeTemplate) {
          applyTemplateToForm(activeTemplate);
        }
      } catch (error) {
        console.error("조직 조회 실패", error);
      } finally {
        setIsLoadingOrganization(false);
      }
    };

    loadOrganization();
  }, [getOrganizationOnce, getTemplateOnce]);

  const handleChangeFile = async (files: FileList | null) => {
    const file = files?.[0];

    if (!file) return;

    if (!organizationId) {
      alert("조직 정보를 불러온 후 다시 시도해주세요.");
      return;
    }

    try {
      setIsUploading(true);
      setStatusMessage("");

      const data = await postTemplateOnce({
        organizationId,
        name: file.name.replace(/\.[^/.]+$/, ""),
        file,
        mappingSchema: currentTemplate?.mapping_schema ?? {},
      });

      applyTemplateToForm(data);
      setStatusMessage(
        currentTemplate
          ? "양식 수정이 완료되었습니다."
          : "양식 업로드가 완료되었습니다. 이제 등록된 양식을 수정할 수 있습니다.",
      );
      console.log("업로드 성공", data);
    } catch (error) {
      console.error("업로드 실패", error);
      alert("양식 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>결산안 양식 등록</span>
        <span className={styles.desc}>
          학교/학과별 결산안 엑셀 양식 업로드 (최초 1회)
        </span>
      </div>

      <div className={styles.contentContainer}>
        {currentTemplate ? (
          <>
            <span className={styles.uploadTitle}>등록된 양식 수정</span>
            <div className={styles.currentTemplateBox}>
              <span className={styles.currentTemplateLabel}>현재 파일</span>
              <strong className={styles.currentTemplateName}>
                {currentTemplate.original_filename}
              </strong>
            </div>

            <UploadCard
              iconBackground="green"
              title={isUploading ? "수정 중..." : "수정하기"}
              desc=".xlsx, .xls"
              accept=".xls,.xlsx"
              disabled={isLoadingOrganization || isUploading}
              onChangeFile={handleChangeFile}
            />
          </>
        ) : (
          <>
            <span className={styles.uploadTitle}>엑셀 양식 파일</span>

            <UploadCard
              iconBackground="green"
              title={
                isLoadingOrganization
                  ? "조직 정보 불러오는 중..."
                  : isUploading
                    ? "업로드 중..."
                    : "파일 선택"
              }
              desc=".xlsx, .xls"
              accept=".xls,.xlsx"
              disabled={isLoadingOrganization || isUploading}
              onChangeFile={handleChangeFile}
            />
          </>
        )}

        {statusMessage && (
          <div className={styles.statusMessage}>{statusMessage}</div>
        )}

        <div className={styles.uploadInfoContainer}>
          <span className={styles.uploadInfoTitle}>자동 인식 항목:</span>
          <ul className={styles.uploadInfoDescContainer}>
            <li className={styles.uploadInfoDesc}>
              날짜, 적요, 입금, 출금, 잔액, 비고
            </li>
            <li className={styles.uploadInfoDesc}>
              한 번 등록하면 재사용 가능
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Template;
