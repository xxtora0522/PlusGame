import React, { useMemo } from "react";

interface MonsterProps {
    phase: "question" | "result";
    selected: number | null;
    answer: number;
    stars: number;
    monsterType: number;
}

// 5가지 진화 테마 정의
const MONSTER_PATHS = [
    ["🥚", "🦎", "🐊", "🦖", "🐲"], // 공룡/드래곤
    ["🥚", "🐣", "🐥", "🦉", "🦅"], // 새
    ["🫧", "🦐", "🐠", "🐬", "🐳"], // 바다
    ["🍼", "🐕", "🐺", "🐻", "🦁"], // 맹수
    ["🥚", "🐛", "🐜", "🐞", "🦋"], // 곤충
];

export default function Monster({ phase, selected, answer, stars, monsterType }: MonsterProps) {
    // 진화 턱걸이 순간인지 확인 (5, 10, 20, 30...)
    const isLevelUpFrame = [5, 10, 20, 30].includes(stars);
    // 정답 결과 화면이면서 + 레벨업 순간이라면 -> 이전 단계 모습을 보여줌
    const showPreviousStage = phase === "result" && selected === answer && isLevelUpFrame;

    // 몬스터 성장 단계 계산
    const { stageIndex, nextThreshold } = useMemo(() => {
        // 이전 단계를 보여줘야 한다면 별 개수를 하나 줄여서 계산
        const calcStars = showPreviousStage ? stars - 1 : stars;

        if (calcStars < 5) return { stageIndex: 0, nextThreshold: 5 };
        if (calcStars < 10) return { stageIndex: 1, nextThreshold: 10 };
        if (calcStars < 20) return { stageIndex: 2, nextThreshold: 20 };
        if (calcStars < 30) return { stageIndex: 3, nextThreshold: 30 };
        return { stageIndex: 4, nextThreshold: null };
    }, [stars, showPreviousStage]);

    // 선택된 테마와 현재 단계에 맞는 이모지 가져오기 (범위 보호)
    const currentPath = MONSTER_PATHS[monsterType % MONSTER_PATHS.length];
    const stage = currentPath[stageIndex];

    // 실제 퍼센트 계산 로직 보정
    let percent = 0;
    if (showPreviousStage) {
        percent = 100; // 레벨업 순간에는 이전 게이지 100%로 표시
    } else {
        if (stars < 5) percent = (stars / 5) * 100;
        else if (stars < 10) percent = ((stars - 5) / 5) * 100;
        else if (stars < 20) percent = ((stars - 10) / 10) * 100;
        else if (stars < 30) percent = ((stars - 20) / 10) * 100;
        else percent = 100;
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

    return (
        <div style={styles.container}>
            <div style={styles.monsterWrapper}>
                <div style={styles.monster}>{monsterFace}</div>
                {feedbackOverlay}
            </div>

            {/* XP Bar */}
            {nextThreshold && (
                <div style={styles.xpTrack}>
                    <div style={{ ...styles.xpFill, width: `${percent}%` }} />
                </div>
            )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 30,
    },
    monsterWrapper: {
        position: "relative", // 오버레이 배치를 위해 relative
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    monster: {
        fontSize: "clamp(120px, 40vw, 240px)",
        lineHeight: 1,
        textAlign: "center",
        userSelect: "none"
    },
    overlayCorrect: {
        position: "absolute",
        fontSize: "clamp(100px, 30vw, 180px)",
        color: "#4caf50",     // 녹색
        opacity: 0.8,
        pointerEvents: "none", // 클릭 통과
        textShadow: "0 0 20px #fff" // 잘 보이게 테두리 느낌
    },
    overlayWrong: {
        position: "absolute",
        fontSize: "clamp(100px, 30vw, 180px)",
        color: "#f44336",     // 빨간색
        opacity: 0.8,
        pointerEvents: "none",
        textShadow: "0 0 20px #fff"
    },
    xpTrack: {
        width: "100%",
        maxWidth: 300,
        height: 16,
        background: "#eee",
        borderRadius: 8,
        overflow: "hidden",
        marginTop: 20
    },
    xpFill: {
        height: "100%",
        background: "#4caf50",
        transition: "width 0.3s ease",
    }
};
