import createIcon from "@assets/layout/create.svg";
import templateIcon from "@assets/layout/template.svg";

export type FileDataItem = {
  color: "green" | "red";
  icon: string;
  title: string;
  description: string;
  bulletPoints: string[];
};

export const fileData: FileDataItem[] = [
  {
    color: "green",
    icon: createIcon,
    title: "결산안 엑셀 파일",
    description: "등록된 양식에 데이터를 자동 기입",
    bulletPoints: [
      "Step 1에서 등록한 양식 사용",
      "모든 거래 내역 자동 기입",
      "항목별 합계 자동 계산",
      ".xlsx 형식으로 생성",
    ],
  },
  {
    color: "red",
    icon: templateIcon,
    title: "증빙 PDF 파일",
    description: "모든 증빙을 하나의 PDF로 통합",
    bulletPoints: [
      "날짜순으로 자동 정렬",
      "증빙 유형에 따른 최적 레이아웃",
      "가상 품질 방식 적용",
      "감사 제출용 표준 형식",
    ],
  },
];
