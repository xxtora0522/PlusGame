import React, { useEffect, useState } from "react";

interface CollectionProps {
    items: string[];
}

export default function Collection({ items }: CollectionProps) {
    const [startIndex, setStartIndex] = useState(0);

    // 5개 이상일 때 자동 슬라이드 (3초마다)
    useEffect(() => {
        if (items.length <= 5) {
            setStartIndex(0); // 5개 이하면 초기화
            return;
        }

        const interval = setInterval(() => {
            setStartIndex((prev) => (prev + 1) % items.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [items.length]);

    // 표시할 아이템 목록 생성
    const displayItems = React.useMemo(() => {
        const visibleCount = 5;

        // 1. 5개 미만인 경우: 수집된 것 + 물음표 채우기
        if (items.length < visibleCount) {
            const placeholders = Array(visibleCount - items.length).fill("?");
            return [...items, ...placeholders];
        }

        // 2. 5개 이상인 경우: 물음표 없이 순환해서 보여주기
        // 원형 큐처럼 끝에서 다시 처음으로 이어지게 처리
        const combined = [...items, ...items]; // 배열을 두 번 이어붙여서 슬라이스 편하게
        return combined.slice(startIndex, startIndex + visibleCount);
    }, [items, startIndex]);

    return (
        <div style={styles.container}>
            <div style={styles.title}>MONSTER COLLECTION</div>
            <div style={styles.list}>
                {displayItems.map((item, index) => {
                    // 키 값은 인덱스와 아이템 조합으로 유니크하게 (애니메이션 시 리렌더링 이슈 방지)
                    // 여기서는 단순 인덱스 사용
                    const isPlaceholder = item === "?";
                    return (
                        <div key={`${index}-${item}`} style={styles.item}>
                            {!isPlaceholder ? (
                                <span style={styles.emoji}>{item}</span>
                            ) : (
                                <span style={styles.placeholder}>?</span>
                            )}
                        </div>
                    );
                })}
            </div>
            {items.length > 5 && (
                <div style={styles.indicator}>
                    {items.length}마리 수집 중! (자동 슬라이드)
                </div>
            )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        width: "100%",
        background: "rgba(255, 255, 255, 0.6)",
        borderRadius: 20,
        padding: "15px 10px", // 좌우 패딩 줄임
        marginBottom: 20,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "2px solid rgba(255,255,255,0.8)",
        overflow: "hidden", // 넘치는 내용 숨김
    },
    title: {
        fontSize: 16,
        fontWeight: "900",
        color: "#FF4081",
        marginBottom: 12,
        letterSpacing: 1,
        textShadow: "1px 1px 0px white",
        fontFamily: '"Jua", sans-serif',
    },
    list: {
        display: "flex",
        flexDirection: "row", // 가로 일렬 배치
        gap: 10,
        justifyContent: "center",
        width: "100%",
    },
    item: {
        background: "#fff",
        borderRadius: "50%",
        width: "clamp(48px, 13vw, 60px)", // 조금 키움
        height: "clamp(48px, 13vw, 60px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        userSelect: "none",
        flexShrink: 0, // 찌그러짐 방지
        animation: "fadeIn 0.5s", // 등장 애니메이션 효과
    },
    emoji: {
        fontSize: "clamp(30px, 8vw, 40px)",
        filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
    },
    placeholder: {
        fontSize: "clamp(24px, 6vw, 30px)",
        color: "#E0E0E0",
        fontWeight: "bold",
    },
    indicator: {
        marginTop: 10,
        fontSize: 12,
        color: "#888",
        fontWeight: "bold",
        animation: "pulse 2s infinite",
    }
};
