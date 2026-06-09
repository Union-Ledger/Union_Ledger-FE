import useApi from "./useApi";
import { ENDPOINTS } from "../../config";

interface PatchEvidenceData {
  evidenceId: string;
  evidenceDate: string;
  merchantName: string;
  amount: number;
  paymentMethod: string;
  budgetCategory: string;
  isRefund?: boolean;
  status?: string;
  extractedPayload?: Record<string, unknown>;
}

const useCommonApi = () => {
  const { api } = useApi();

  // 증빙 OCR/PDF 추출 실행
  const postEvidenceExtract = (
    evidenceId: string,
    signal?: AbortSignal,
  ) => {
    return api
      .post(ENDPOINTS.BASE.EVIDENCE_EXTRACT(evidenceId), undefined, { signal })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("OCR/PDF 추출 실패 status:", error.response?.status);
        console.log(
          "OCR/PDF 추출 실패 detail:",
          JSON.stringify(error.response?.data, null, 2),
        );
        throw error;
      });
  };

  // 증빙 삭제
  const deleteEvidence = (evidenceId: string) => {
    return api
      .delete(ENDPOINTS.BASE.EVIDENCE(evidenceId))
      .then(() => undefined)
      .catch((error) => {
        console.log("증빙 삭제 실패 status:", error.response?.status);
        console.log(
          "증빙 삭제 실패 detail:",
          JSON.stringify(error.response?.data, null, 2),
        );
        throw error;
      });
  };

  // 증빙 추출 필드 수정
  const patchEvidence = (data: PatchEvidenceData) => {
    return api
      .patch(ENDPOINTS.BASE.EVIDENCE(data.evidenceId), {
        evidence_date: data.evidenceDate,
        merchant_name: data.merchantName,
        amount: data.amount,
        payment_method: data.paymentMethod,
        budget_category: data.budgetCategory,
        is_refund: data.isRefund ?? false,
        status: data.status ?? "uploaded",
        extracted_payload: data.extractedPayload ?? {},
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("증빙 수정 실패 status:", error.response?.status);
        console.log(
          "증빙 수정 실패 detail:",
          JSON.stringify(error.response?.data, null, 2),
        );
        throw error;
      });
  };

  return { postEvidenceExtract, patchEvidence, deleteEvidence };
};

export default useCommonApi;
