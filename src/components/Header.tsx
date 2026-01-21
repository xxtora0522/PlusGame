import React from "react";

const Sticker = () => <span style={{ fontSize: 28 }}>⭐</span>;

interface HeaderProps {
    stickers: number;
    stars: number;
}

export default function Header({ stickers, stars }: HeaderProps) {
    return (
        <header style={styles.header}>
            <div style={styles.score}>
                <div style={styles.badge}>
                    <Sticker /> <span style={{ marginLeft: 4 }}>{stickers}</span>
                </div>
                <div style={styles.badge}>
                    <span style={{ fontSize: 24 }}>⭐</span> <span style={{ marginLeft: 4 }}>{stars}</span>
                </div>
            </div>
        </header>
    );
}

const styles: Record<string, React.CSSProperties> = {
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: 20,
    },
    score: { display: "flex", gap: 12, alignItems: "center" },
    badge: {
        background: "#f1f3f8",
        padding: "8px 16px",
        borderRadius: 20,
        fontWeight: 800,
        fontSize: 24,
        display: "flex",
        alignItems: "center",
    },
};
