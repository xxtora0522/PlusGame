import React, { useEffect, useState } from "react";
import Monster from "./components/Monster";
import Equation from "./components/Equation";
import Choices from "./components/Choices";
import Collection from "./components/Collection";
import ClearModal from "./components/ClearModal";
import { randInt, makeChoices } from "./utils/math";
import { MONSTER_PATHS, CLEAR_SCORE } from "./constants";
import { soundManager } from "./utils/sound";

type Phase = "question" | "result";

export default function AdditionMonsterGame() {
  const [maxN, setMaxN] = useState(5);

  const [phase, setPhase] = useState<Phase>("question");
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const answer = a + b;

  const [choices, setChoices] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);

  const [stars, setStars] = useState(0);

  // 랜덤 몬스터 타입 (0~4)
  const [monsterType, setMonsterType] = useState(0);

  // 수집된 몬스터 리스트 (저장 안함: 새로고침 시 초기화)
  const [collected, setCollected] = useState<string[]>([]);

  // 모달 상태관리
  const [showClearModal, setShowClearModal] = useState(false);
  const [justCollectedMonster, setJustCollectedMonster] = useState("");

  // 수집되지 않은 몬스터 중에서 랜덤 선택
  function getNextMonsterType(currentCollected: string[]) {
    // 모든 타입 인덱스 생성 (0 ~ MONSTER_PATHS.length - 1)
    const allTypes = Array.from({ length: MONSTER_PATHS.length }, (_, i) => i);

    // 수집되지 않은 타입만 필터링
    const availableTypes = allTypes.filter(type => {
      const finalForm = MONSTER_PATHS[type][2];
      return !currentCollected.includes(finalForm);
    });

    if (availableTypes.length > 0) {
      // 남은 것 중 랜덤
      const randIndex = Math.floor(Math.random() * availableTypes.length);
      return availableTypes[randIndex];
    } else {
      // 다 모았으면 전체 중 랜덤 (이미 다 깼으므로 자유롭게)
      return Math.floor(Math.random() * MONSTER_PATHS.length);
    }
  }

  // 초기 로딩 시 랜덤 몬스터 선택 (수집 안 된 것 우선)
  useEffect(() => {
    // collected 상태는 초기값으로 localStorage에서 불러와져 있음
    setMonsterType(getNextMonsterType(collected));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 처음에만 실행 (주의: collected가 바뀌어도 실행 안 됨, 의도된 바임)

  function newQuestion(nextMaxN = maxN) {
    const na = randInt(0, nextMaxN);
    const nb = randInt(0, nextMaxN);
    setA(na);
    setB(nb);

    const ans = na + nb;
    setChoices(makeChoices(ans, 0, nextMaxN * 2));
    setSelected(null);
    setPhase("question");
  }

  useEffect(() => {
    newQuestion(5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(n: number) {
    // 정답/오답 판정 후 대기시간 동안 클릭 방지
    if (phase === "result") return;

    soundManager.playClick(); // 클릭음
    setSelected(n);

    const isCorrect = n === answer;
    setPhase("result");

    if (isCorrect) {
      soundManager.playCorrect(); // 정답음
      const nextStars = stars + 1;
      setStars(nextStars);
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);

      // 난이도 상승 체크
      let nextMaxN = maxN;
      if (correctStreak + 1 >= 6) {
        nextMaxN = Math.min(10, maxN + 1);
        setMaxN(nextMaxN);
        setCorrectStreak(0);
      }

      // 정답이면 1초 후 다음 문제로 자동 이동
      setTimeout(() => {
        // ★ 만렙 달성!
        if (nextStars >= CLEAR_SCORE) {
          const finalForm = MONSTER_PATHS[monsterType][2];
          setJustCollectedMonster(finalForm);

          // 컬렉션 추가
          if (!collected.includes(finalForm)) {
            setCollected(prev => [...prev, finalForm]);
          }

          // 팡파레 & 모달 표시
          soundManager.playFanfare();
          setShowClearModal(true);
        } else {
          newQuestion(nextMaxN);
        }
      }, 1000);

    } else {
      // 오답 처리
      soundManager.playWrong(); // 오답음
      setStars((prev) => Math.max(0, prev - 1)); // 경험치 감소 (진화 퇴행)
      setWrongStreak((prev) => prev + 1);
      setCorrectStreak(0);

      // 난이도 하락 체크
      let nextMaxN = maxN;
      if (wrongStreak + 1 >= 2) {
        nextMaxN = Math.max(3, maxN - 1);
        setMaxN(nextMaxN);
        setWrongStreak(0);
      }

      // 오답이어도 1초 후 다음 문제로 자동 이동 (새로운 기회)
      setTimeout(() => {
        newQuestion(nextMaxN);
      }, 1000);
    }
  }

  // 모달에서 '알 부화시키기' 클릭 시 실행
  function handleReset() {
    setShowClearModal(false);
    setStars(0);

    // 새로운 몬스터로 변경 (수집 안 된 것 중에서)
    // 방금 수집한 것도 collected에 포함되어 있으므로 제외됨
    // collected 상태는 handleSelect에서 setCollected로 업데이트 예약됨 -> re-render 발생
    // 하지만 handleReset은 모달이 떠있는 상태(이미 re-render됨)에서 호출되므로 최신 collected 사용 가능
    setMonsterType(getNextMonsterType(collected));

    newQuestion(maxN);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* 컬렉션 영역 */}
        <Collection items={collected} />

        <Monster
          phase={phase}
          selected={selected}
          answer={answer}
          stars={stars}
          monsterType={monsterType}
        />

        <Equation a={a} b={b} />

        <Choices
          choices={choices}
          selected={selected}
          answer={answer}
          phase={phase}
          onSelect={handleSelect}
        />

        {/* 클리어 모달 */}
        {showClearModal && (
          <ClearModal
            monsterEmoji={justCollectedMonster}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center", // 가로 중앙 정렬
    // 솜사탕 그라데이션 + 귀여운 도트 패턴 🍬
    backgroundColor: "#fff12cff",
    backgroundImage: `
      radial-gradient(#ffffff 2px, transparent 2px), 
      radial-gradient(#ffffff 2px, transparent 2px),
      linear-gradient(135deg, #FFDEE9 0%, #9fa100ff 100%)
    `,
    backgroundSize: "40px 40px, 40px 40px, 100% 100%",
    backgroundPosition: "0 0, 20px 20px, 0 0",

    fontFamily:
      '"Nunito", "Jua", system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  },
  card: {
    width: "100%",
    maxWidth: 720,
    minHeight: "100vh",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.85)", // 더 투명하게
    backdropFilter: "blur(10px)", // 유리기판 효과
    padding: "60px 20px 30px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    boxShadow: "none", // 그림자 제거하고 깔끔하게
  },
};