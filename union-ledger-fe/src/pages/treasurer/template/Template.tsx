import { useEffect, useState } from "react";
import UploadCard from "@/components/common/UploadCard";
import useOrganizationApi from "@/hooks/useOrginizationApi";
import * as styles from "@/pages/treasurer/template/Template.css";

const Template = () => {
  const { getOrganization, postTemplate } = useOrganizationApi();

  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const organizations = await getOrganization();

        if (!organizations || organizations.length === 0) {
          alert("소속된 조직이 없습니다.");
          return;
        }

        const firstOrganization = organizations[0];

        setOrganizationId(firstOrganization.id);
        localStorage.setItem("organizationId", firstOrganization.id);
      } catch (error) {
        console.error("조직 조회 실패", error);
      } finally {
        setIsLoadingOrganization(false);
      }
    };

    loadOrganization();
  }, []);

  const handleChangeFile = async (files: FileList | null) => {
    const file = files?.[0];

    if (!file) return;

    if (!organizationId) {
      alert("조직 정보를 불러온 후 다시 시도해주세요.");
      return;
    }

    try {
      setIsUploading(true);

      const data = await postTemplate({
        organizationId,
        name: file.name.replace(/\.[^/.]+$/, ""),
        file,
        mappingSchema: {},
      });

      console.log("업로드 성공", data);
    } catch (error) {
      console.error("업로드 실패", error);
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
          onChangeFile={handleChangeFile}
        />

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
