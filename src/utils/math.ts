export function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle<T>(arr: T[]) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function makeChoices(answer: number, min = 0, max = 10) {
    const set = new Set<number>([answer]);

    // 2개의 오답 생성 (근처 숫자 위주로)
    while (set.size < 3) {
        const delta = randInt(-2, 2);
        const cand = Math.min(max, Math.max(min, answer + delta));
        if (cand !== answer) set.add(cand);
    }
    return shuffle(Array.from(set));
}
