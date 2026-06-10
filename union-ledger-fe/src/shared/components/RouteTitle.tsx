import { useEffect } from "react";
import { useMatches } from "react-router-dom";

const DEFAULT_TITLE = "Union-Ledger | 학생회 결산 시스템";

interface TitleHandle {
  title?: string;
}

// 라우트 정의의 handle.title을 읽어 브라우저 탭 제목을 갱신한다.
const RouteTitle = () => {
  const matches = useMatches();

  useEffect(() => {
    const matched = [...matches]
      .reverse()
      .find((match) => Boolean((match.handle as TitleHandle | undefined)?.title));
    const title = (matched?.handle as TitleHandle | undefined)?.title;

    document.title = title ? `${title} | Union-Ledger` : DEFAULT_TITLE;
  }, [matches]);

  return null;
};

export default RouteTitle;
