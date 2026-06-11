import { useEffect, useState } from "react";
import UploadCard from "@/components/common/UploadCard";
import useOrganizationApi, { type TemplateData } from "@/hooks/useOrginizationApi";
import { useConfirm, useToast } from "@shared/components/feedback";
import * as styles from "@/pages/treasurer/template/Template.css";

const Template = () => {
  const { getOrganization, getTemplate, postTemplate, patchTemplate, deleteTemplate } =
    useOrganizationApi();
  const toast = useToast();
  const confirm = useConfirm();

  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<TemplateData | null>(null);
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [getOrganizationOnce] = useState(() => getOrganization);
  const [getTemplateOnce] = useState(() => getTemplate);
  const [postTemplateOnce] = useState(() => postTemplate);
  const [patchTemplateOnce] = useState(() => patchTemplate);
  const [deleteTemplateOnce] = useState(() => deleteTemplate);

  const applyTemplateToForm = (template: TemplateData) => {
    setCurrentTemplate(template);
  };

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const organizations = await getOrganizationOnce();

        if (!organizations || organizations.length === 0) {
          toast.error("소속된 조직이 없습니다.");
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
  }, [getOrganizationOnce, getTemplateOnce, toast]);

  const handleChangeFile = async (files: FileList | null) => {
    const file = files?.[0];

    if (!file) return;

    if (!organizationId) {
      toast.error("조직 정보를 불러온 후 다시 시도해주세요.");
      return;
    }

    const previousTemplate = currentTemplate;

    try {
      setIsUploading(true);
      setStatusMessage("");

      const data = await postTemplateOnce({
        organizationId,
        name: file.name.replace(/\.[^/.]+$/, ""),
        file,
        mappingSchema: previousTemplate?.mapping_schema ?? {},
      });

      // 새 양식이 활성화되면 이전 활성 양식은 비활성화한다.
      // (예전엔 매번 새 row 만 만들어 활성 양식이 중복으로 쌓였음)
      if (previousTemplate && previousTemplate.id !== data.id) {
        try {
          await patchTemplateOnce({
            templateId: previousTemplate.id,
            name: previousTemplate.name,
            mappingSchema: previousTemplate.mapping_schema,
            isActive: false,
          });
        } catch (deactivateError) {
          console.error("이전 양식 비활성화 실패", deactivateError);
        }
      }

      applyTemplateToForm(data);
      setStatusMessage(
        previousTemplate
          ? "양식이 수정되었습니다. 이전 양식은 보관 처리되었습니다."
          : "양식 업로드가 완료되었습니다. 이제 등록된 양식을 수정할 수 있습니다.",
      );
      toast.success(
        previousTemplate
          ? "양식이 수정되었습니다."
          : "양식 업로드가 완료되었습니다.",
      );
    } catch (error) {
      console.error("업로드 실패", error);
      toast.error("양식 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!currentTemplate) return;

    const ok = await confirm({
      title: "등록된 양식을 삭제할까요?",
      description: "이미 생성된 결산안에는 영향을 주지 않습니다.",
      confirmLabel: "삭제",
      tone: "danger",
    });

    if (!ok) return;

    try {
      setIsDeleting(true);
      setStatusMessage("");
      await deleteTemplateOnce(currentTemplate.id);
      setCurrentTemplate(null);
      setStatusMessage("양식이 삭제되었습니다. 새 양식을 업로드할 수 있습니다.");
      toast.success("양식이 삭제되었습니다.");
    } catch (error) {
      console.error("양식 삭제 실패", error);
      toast.error("양식 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
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

      <div className={styles.layoutGrid}>
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
              disabled={isLoadingOrganization || isUploading || isDeleting}
              onChangeFile={handleChangeFile}
            />

            <button
              type="button"
              className={styles.deleteTemplateButton}
              disabled={isUploading || isDeleting}
              onClick={handleDeleteTemplate}
            >
              {isDeleting ? "삭제 중..." : "양식 삭제"}
            </button>
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
      </div>

      <aside className={styles.guideCard}>
        <h2 className={styles.guideTitle}>이렇게 등록하세요</h2>
        <ol className={styles.guideSteps}>
          <li className={styles.guideStep}>
            <span className={styles.guideStepNum}>1</span>
            <div className={styles.guideStepBody}>
              <strong className={styles.guideStepTitle}>양식 준비</strong>
              <span className={styles.guideStepDesc}>
                학교·학과 결산안 엑셀 양식을 준비합니다.
              </span>
            </div>
          </li>
          <li className={styles.guideStep}>
            <span className={styles.guideStepNum}>2</span>
            <div className={styles.guideStepBody}>
              <strong className={styles.guideStepTitle}>업로드</strong>
              <span className={styles.guideStepDesc}>
                파일을 끌어다 놓거나 클릭해 선택합니다.
              </span>
            </div>
          </li>
          <li className={styles.guideStep}>
            <span className={styles.guideStepNum}>3</span>
            <div className={styles.guideStepBody}>
              <strong className={styles.guideStepTitle}>재사용</strong>
              <span className={styles.guideStepDesc}>
                최초 1회 등록 후 결산안 생성에 계속 재사용됩니다.
              </span>
            </div>
          </li>
        </ol>
        <div className={styles.guideFormats}>
          <span className={styles.guideFormatBadge}>.xlsx</span>
          <span className={styles.guideFormatBadge}>.xls</span>
        </div>
      </aside>
      </div>
    </div>
  );
};

export default Template;
