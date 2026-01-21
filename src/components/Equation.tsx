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
        background: "#fbfbff",
        borderRadius: 24,
        padding: "clamp(16px, 5vw, 30px)",
        border: "2px solid #eef0ff",
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
