import React, { useMemo } from "react";

interface MonsterProps {
    phase: "question" | "result";
    selected: number | null;
    answer: number;
    stars: number;
    monsterType: number;
}

import { MONSTER_PATHS, THRESHOLDS, CLEAR_SCORE } from "../constants";

export default function Monster({ phase, selected, answer, stars, monsterType }: MonsterProps) {
    // 진화 턱걸이 순간인지 확인
    const isLevelUpFrame = THRESHOLDS.includes(stars);
    // 정답 결과 화면이면서 + 레벨업 순간이라면 -> 이전 단계 모습을 보여줌
    const showPreviousStage = phase === "result" && selected === answer && isLevelUpFrame;

    // 몬스터 성장 단계 계산 (3단계)
    const { stageIndex, nextThreshold } = useMemo(() => {
        const calcStars = showPreviousStage ? stars - 1 : stars;

        if (calcStars < THRESHOLDS[0]) return { stageIndex: 0, nextThreshold: THRESHOLDS[0] };
        if (calcStars < THRESHOLDS[1]) return { stageIndex: 1, nextThreshold: THRESHOLDS[1] };
        return { stageIndex: 2, nextThreshold: CLEAR_SCORE }; // 마지막 단계도 목표(클리어)가 있음
    }, [stars, showPreviousStage]);

    // 선택된 테마와 현재 단계에 맞는 이모지 가져오기
    const currentPath = MONSTER_PATHS[monsterType % MONSTER_PATHS.length];
    const stage = currentPath[stageIndex];

    // XP 바 퍼센트 계산
    let percent = 0;
    if (showPreviousStage) {
        percent = 100;
    } else {
        if (stars < THRESHOLDS[0]) percent = (stars / THRESHOLDS[0]) * 100;
        else if (stars < THRESHOLDS[1]) percent = ((stars - THRESHOLDS[0]) / (THRESHOLDS[1] - THRESHOLDS[0])) * 100;
        else percent = ((stars - THRESHOLDS[1]) / (CLEAR_SCORE - THRESHOLDS[1])) * 100; // 마지막 구간 퍼센트
    }

    const monsterFace = useMemo(() => {
        return stage;
    }, [stage]);

    // 피드백 오버레이 내용
    const feedbackOverlay = useMemo(() => {
        if (phase !== "result") return null;
        if (selected === answer) return <div style={styles.overlayCorrect}>⭕</div>;
        return <div style={styles.overlayWrong}>❌</div>; // selected !== answer
    }, [phase, selected, answer]);

    // 단계별 크기 조절 (3단계)
    const scale = useMemo(() => {
        const scales = [0.6, 1.0, 1.5]; // 0.6배 -> 1.0배 -> 1.5배
        return scales[stageIndex] || 1;
    }, [stageIndex]);

    return (
        <div style={styles.container}>
            <div style={styles.monsterWrapper}>
                <div style={{
                    ...styles.monster,
                    transform: `scale(${scale})`,
                    transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}>
                    {monsterFace}
                </div>
                {feedbackOverlay}
            </div>

            {/* XP Bar (최종 단계에서는 숨김) */}
            {nextThreshold && (
                <div style={styles.xpTrack}>
                    <div className="xp-bar-animated" style={{ ...styles.xpFill, width: `${percent}%` }} />
                </div>
            )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        width: "100%", // 👈 좌우 꽉 채우기
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 20, // 간격 대폭 축소 (60 -> 20)
    },
    monsterWrapper: {
        position: "relative", // 오버레이 배치를 위해 relative
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        minHeight: "25vh", // 높이 축소 (30vh -> 25vh)
    },
    monster: {
        fontSize: "clamp(80px, 30vw, 160px)", // 이모지 크기 축소
        lineHeight: 1,
        textAlign: "center",
        userSelect: "none"
    },
    overlayCorrect: {
        position: "absolute",
        fontSize: "clamp(100px, 35vw, 200px)", // 오버레이도 같이 축소
        color: "#4caf50",     // 녹색
        opacity: 0.8,
        pointerEvents: "none", // 클릭 통과
        textShadow: "0 0 20px #fff" // 잘 보이게 테두리 느낌
    },
    overlayWrong: {
        position: "absolute",
        fontSize: "clamp(100px, 35vw, 200px)", // 오버레이도 같이 축소
        color: "#f44336",     // 빨간색
        opacity: 0.8,
        pointerEvents: "none",
        textShadow: "0 0 20px #fff"
    },
    xpTrack: {
        width: "100%",
        // maxWidth: 300, // 👈 제거: 모바일에서 꽉 차게
        height: 24, // 두껍게 (16 -> 24)
        background: "rgba(0,0,0,0.1)", // 트랙은 어둡게
        borderRadius: 12, // 둥글게
        overflow: "hidden",
        marginTop: 20,
        border: "3px solid #fff", // 흰색 테두리로 팝하게
        boxShadow: "0 4px 0 rgba(0,0,0,0.1)", // 그림자
    },
    xpFill: {
        height: "100%",
        background: "#00E676", // 기본 밝은 초록
        borderRadius: 10,
        transition: "width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)", // 팅~ 하는 느낌의 탄성 애니메이션
    }
};
