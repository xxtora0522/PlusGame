// Web Audio API를 사용하여 효과음을 생성하는 유틸리티
// 별도의 파일 다운로드 없이 브라우저 내장 기능으로 소리를 만듭니다.

class SoundManager {
    private ctx: AudioContext | null = null;
    private enabled: boolean = true;

    constructor() {
        // 브라우저 호환성 체크
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            this.ctx = new AudioContextClass();
        }
    }

    // 사용자 인터랙션 후 오디오 컨텍스트 재개 (브라우저 정책 대응)
    private resume() {
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    // 1. 클릭 (뽁!)
    playClick() {
        if (!this.ctx || !this.enabled) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    // 2. 정답 (띠로링~♬)
    playCorrect() {
        if (!this.ctx || !this.enabled) return;
        this.resume();

        const ctx = this.ctx; // 로컬 변수로 캡처 (타입 안전성)
        const now = ctx.currentTime;

        // 도, 미, 솔 (C Major Chord)
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.value = freq;

            const startTime = now + (i * 0.05);
            const duration = 0.3;

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
        });
    }

    // 3. 오답 (삐-!)
    playWrong() {
        if (!this.ctx || !this.enabled) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sawtooth"; // 톱니파 (약간 거친 소리)
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }
    // 4. 팡파레 (빰빰빰 빠밤~!)
    playFanfare() {
        if (!this.ctx || !this.enabled) return;
        this.resume();

        const ctx = this.ctx; // 로컬 변수로 캡처
        const now = ctx.currentTime;

        // C4, E4, G4, C5 (도, 미, 솔, 높은도)
        const melody = [
            { note: 523.25, time: 0, dur: 0.15 }, // 도
            { note: 523.25, time: 0.15, dur: 0.15 }, // 도
            { note: 523.25, time: 0.3, dur: 0.15 }, // 도
            { note: 659.25, time: 0.45, dur: 0.4 }, // 미 (길게)
            { note: 783.99, time: 0.85, dur: 0.15 }, // 솔
            { note: 1046.50, time: 1.0, dur: 0.6 }, // 높은 도 (짜잔~)
        ];

        melody.forEach(({ note, time, dur }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "square"; // 트럼펫 느낌
            osc.frequency.value = note;

            gain.gain.setValueAtTime(0.1, now + time);
            gain.gain.linearRampToValueAtTime(0.2, now + time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + time + dur);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + time);
            osc.stop(now + time + dur);
        });
    }
}

export const soundManager = new SoundManager();
