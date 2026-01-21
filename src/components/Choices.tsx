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
        height: 100,
        fontSize: 48,
        fontWeight: 900,
        borderRadius: 24,
        border: "3px solid #e8eaf4",
        background: "#ffffff",
        cursor: "pointer",
        userSelect: "none",
        color: "#333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
    },
    correct: {
        border: "3px solid #bfe8c3",
        background: "#eaf8ec",
        color: "#2e7d32",
    },
    wrong: {
        border: "3px solid #f2c1c1",
        background: "#fdecec",
        color: "#c62828",
    },
};
