import React from "react";

interface EquationProps {
    a: number;
    b: number;
}

export default function Equation({ a, b }: EquationProps) {
    return (
        <div style={styles.visualArea}>
            <div style={styles.equation}>
                <span style={styles.number}>{a}</span>
                <span style={styles.operator}>+</span>
                <span style={styles.number}>{b}</span>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    visualArea: {
        background: "#ffffff",
        borderRadius: 60, // 알약 모양 (구름 느낌)
        padding: "clamp(20px, 6vw, 40px)",
        border: "4px solid #FF4081", // 진한 핫핑크 테두리
        boxShadow: "0 8px 0 #F50057", // 더 진한 그림자
        marginBottom: 60, // 간격 2배 (30 -> 60)
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%", // 👈 부모영역 꽉 채우기
        boxSizing: "border-box", // 패딩 포함 너비 계산
    },
    equation: {
        display: "flex",
        alignItems: "center",
        gap: 20,
    },
    number: {
        fontSize: "clamp(40px, 15vw, 80px)",
        fontWeight: 900,
        color: "#333",
        lineHeight: 1,
    },
    operator: {
        fontSize: "clamp(30px, 10vw, 60px)",
        fontWeight: 700,
        color: "#888",
        margin: "0 10px",
    },
};
