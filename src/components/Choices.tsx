import React from "react";

interface ChoicesProps {
    choices: number[];
    selected: number | null;
    answer: number;
    phase: "question" | "result";
    onSelect: (n: number) => void;
}

export default function Choices({ choices, selected, answer, phase, onSelect }: ChoicesProps) {
    return (
        <div style={styles.choices}>
            {choices.map((c) => {
                const isCorrect = c === answer;
                const isSelected = c === selected;

                let btnStyle = { ...styles.choiceBtn };
                if (phase === "result" && isSelected && isCorrect) btnStyle = { ...btnStyle, ...styles.correct };
                if (phase === "result" && isSelected && !isCorrect) btnStyle = { ...btnStyle, ...styles.wrong };

                return (
                    <button key={c} style={btnStyle} onClick={() => onSelect(c)}>
                        {c}
                    </button>
                );
            })}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    choices: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 16,
        marginBottom: 24,
    },
    choiceBtn: {
        width: "100%",
        height: "clamp(80px, 20vw, 120px)",
        fontSize: "clamp(40px, 10vw, 60px)",
        fontWeight: 900,
        borderRadius: 40, // 젤리빈 모양
        border: "none",
        background: "#fff",
        boxShadow: "0 6px 0 #ced4da, 0 10px 10px rgba(0,0,0,0.05)", // 부드러운 3D
        transform: "translateY(0)",
        transition: "all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)", // 팅~ 하는 느낌의 애니메이션
        cursor: "pointer",
        userSelect: "none",
        color: "#555",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        marginBottom: 8,
    },
    correct: {
        background: "#FFF176", // 진한 노랑
        color: "#F57F17",      // 진한 오렌지 텍스트
        boxShadow: "0 6px 0 #FBC02D, 0 10px 10px rgba(0,0,0,0.1)",
    },
    wrong: {
        background: "#E57373", // 진한 빨강 (Salmon)
        color: "#FFFFFF",      // 흰색 텍스트로 변경 (가독성)
        boxShadow: "0 6px 0 #D32F2F, 0 10px 10px rgba(0,0,0,0.1)",
    },
};
