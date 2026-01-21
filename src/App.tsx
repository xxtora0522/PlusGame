import React, { useEffect, useState } from "react";
import Monster from "./components/Monster";
import Equation from "./components/Equation";
import Choices from "./components/Choices";
import { randInt, makeChoices } from "./utils/math";

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

  // 초기 로딩 시 랜덤 몬스터 선택
  useEffect(() => {
    setMonsterType(Math.floor(Math.random() * 5));
  }, []);

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
    // 이미 정답을 맞춘 상태라면 추가 입력 방지 (다음 문제 대기 중)
    if (phase === "result" && selected === answer) return;

    setSelected(n);

    const isCorrect = n === answer;
    setPhase("result");

    if (isCorrect) {
      setStars((prev) => prev + 1);
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);



      let nextMaxN = maxN;
      if (correctStreak + 1 >= 6) {
        nextMaxN = Math.min(10, maxN + 1);
        setMaxN(nextMaxN);
        setCorrectStreak(0);
      }

      // 정답이면 1.5초 후 다음 문제로 자동 이동
      setTimeout(() => {
        newQuestion(nextMaxN);
      }, 1500);

    } else {
      setWrongStreak((prev) => prev + 1);
      setCorrectStreak(0);

      if (wrongStreak + 1 >= 2) {
        const next = Math.max(3, maxN - 1);
        setMaxN(next);
        setWrongStreak(0);
      }
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

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
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    background: "#f6f7fb",
    fontFamily:
      'system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", sans-serif',
  },
  card: {
    width: "min(720px, 90vw)", // 화면이 작을 땐 90vw로 줄어듬 (좌우 여백 보장)
    maxWidth: "100%",
    boxSizing: "border-box",
    background: "#fff",
    borderRadius: 20,
    padding: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
};