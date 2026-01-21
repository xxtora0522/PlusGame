import React from "react";

interface ClearModalProps {
    monsterEmoji: string;
    onReset: () => void;
}

export default function ClearModal({ monsterEmoji, onReset }: ClearModalProps) {
    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.icon}>🎉</div>
                <div style={styles.title}>축하합니다!</div>
                <div style={styles.content}>
                    <div style={styles.monsterBadge}>
                        {monsterEmoji}
                    </div>
                    <p style={styles.message}>
                        새로운 몬스터를 수집했어요!<br />
                        수집함에 넣어둘게요.
                    </p>
                </div>
                <button style={styles.button} onClick={onReset}>
                    새로운 알 부화시키기 🥚
                </button>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(5px)",
    },
    modal: {
        backgroundColor: "#fff",
        padding: "40px 30px",
        borderRadius: 30,
        textAlign: "center",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        width: "85%", // 90% -> 85%
        maxWidth: 320, // 360 -> 320
        animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        transform: "scale(1)",
    },
    icon: {
        fontSize: 60,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "900",
        color: "#FF4081",
        marginBottom: 20,
        fontFamily: '"Jua", sans-serif',
    },
    content: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 30,
    },
    monsterBadge: {
        fontSize: 80,
        background: "#FFF9C4",
        width: 120,
        height: 120,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 0 #FBC02D",
        marginBottom: 20,
        animation: "bounce 1s infinite alternate",
    },
    message: {
        fontSize: 18,
        lineHeight: 1.5,
        color: "#555",
        margin: 0,
        fontWeight: "bold",
    },
    button: {
        background: "linear-gradient(to right, #FF758C, #FF7EB3)",
        border: "none",
        padding: "16px 32px",
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        borderRadius: 50,
        cursor: "pointer",
        width: "100%",
        boxShadow: "0 5px 15px rgba(255, 117, 140, 0.4)",
        transition: "transform 0.1s",
    },
};
