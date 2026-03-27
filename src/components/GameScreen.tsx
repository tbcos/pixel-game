import React, { useState, useEffect } from 'react';
import type { ScoreData, Question } from '../App';

interface Props {
  userId: string;
  onFinish: (result: ScoreData) => void;
}

const DICEBEAR_API = 'https://api.dicebear.com/7.x/pixel-art/svg?seed=';

const preloadImages = (urls: string[]) => {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

const generateSeeds = (count: number) => {
  return Array.from({ length: count }, (_, i) => `Boss_${Math.random().toString(36).substring(7)}_${i}`);
};

const MOCK_QUESTIONS = [
  { id: "1", question: "Nintendo Switch 的前一代家用主機是？", options: { A: "Wii U", B: "Wii", C: "GameCube", D: "N64" }, ans: "A" },
  { id: "2", question: "吃豆人 (Pac-Man) 中被吃掉會變藍色的鬼魂模式叫什麼？", options: { A: "藍鬼模式", B: "驚嚇模式", C: "無敵模式", D: "逃跑模式" }, ans: "B" },
  { id: "3", question: "薩爾達傳說的主角名字是？", options: { A: "薩爾達", B: "林克", C: "加儂", D: "馬利歐" }, ans: "B" },
  { id: "4", question: "哪一間公司創造了瑪利歐？", options: { A: "Sega", B: "任天堂", C: "Sony", D: "Capcom" }, ans: "B" },
  { id: "5", question: "世界上最暢銷的遊戲主機是？", options: { A: "Nintendo DS", B: "Game Boy", C: "PlayStation 2", D: "PlayStation 4" }, ans: "C" }
];

const GameScreen: React.FC<Props> = ({ userId, onFinish }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [bossSeeds, setBossSeeds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const GAS_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';
  const QUESTION_COUNT = parseInt(import.meta.env.VITE_QUESTION_COUNT || '5');
  const PASS_THRESHOLD = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3');

  useEffect(() => {
    // 預載 100 張關主圖片 (需求指定)
    const seeds = generateSeeds(100);
    setBossSeeds(seeds);
    preloadImages(seeds.map(seed => `${DICEBEAR_API}${seed}`));

    const fetchQuestions = async () => {
      try {
        if (!GAS_URL || GAS_URL.includes("YOUR_SCRIPT_ID")) throw new Error("Fallback Mock");
        
        const res = await fetch(`${GAS_URL}?count=${QUESTION_COUNT}`);
        if (!res.ok) throw new Error("Network response error");
        const data = await res.json();
        
        if (data.success && data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          throw new Error("No questions found in sheet.");
        }
      } catch (err: any) {
        console.warn("GAS URL 尚未設定，載入 Mock Demo 資料", err);
        const mockData = MOCK_QUESTIONS.slice(0, QUESTION_COUNT).map(q => ({
          id: q.id, question: q.question, options: q.options
        }));
        setQuestions(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [GAS_URL, QUESTION_COUNT]);

  const submitAnswers = async (finalAnswers: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      if (!GAS_URL || GAS_URL.includes("YOUR_SCRIPT_ID")) throw new Error("Fallback Mock");

      const payload = {
        userId,
        answers: finalAnswers,
        passThreshold: PASS_THRESHOLD
      };

      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' 
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        onFinish({
          score: data.score,
          isPass: data.isPass
        });
      } else {
        throw new Error(data.error);
      }
    } catch(err) {
      console.warn("GAS URL 尚未設定，載入 Mock 結算", err);
      setTimeout(() => {
        let score = 0;
        MOCK_QUESTIONS.forEach(q => {
          if (finalAnswers[q.id] === q.ans) score++;
        });
        onFinish({ score, isPass: score >= PASS_THRESHOLD });
      }, 1000);
    }
  };

  const handleSelect = (optionKey: string) => {
    const qId = questions[currentIdx].id;
    const newAnswers = { ...answers, [qId]: optionKey };
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      submitAnswers(newAnswers);
    }
  };

  if (isLoading) return <div className="loading-text">LOADING STAGE...</div>;
  if (error) return <div style={{ color: 'var(--error-color)', maxWidth: '600px', lineHeight: '1.5' }}>{error}</div>;
  if (isSubmitting) return <div className="loading-text">CALCULATING SCORE...</div>;
  if (questions.length === 0) return <div>NO QUESTIONS FOUND.</div>;

  const currentQ = questions[currentIdx];
  const currentBossSeed = bossSeeds[currentIdx];

  return (
    <div className="screen game-screen">
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px', borderBottom: '4px solid var(--text-color)', paddingBottom: '10px' }}>
        <span>P1: {userId}</span>
        <span>STAGE: {currentIdx + 1} / {questions.length}</span>
      </div>

      <div style={{ margin: '10px 0', border: '4px solid var(--highlight-color)', padding: '10px', backgroundColor: '#222' }}>
        <img 
          src={`${DICEBEAR_API}${currentBossSeed}`} 
          alt="Boss" 
          style={{ width: '200px', height: '200px', imageRendering: 'pixelated' }}
        />
      </div>
      <p style={{ color: 'var(--highlight-color)', margin: '0 0 20px 0', fontSize: '1.2rem', animation: 'blink 1.5s step-end infinite' }}>
        A WILD BOSS APPEARED!
      </p>

      <div style={{ border: '4px solid var(--border-color)', padding: '20px', width: '100%', textAlign: 'left', marginBottom: '20px', minHeight: '120px', backgroundColor: '#111' }}>
        <p style={{ margin: 0, lineHeight: '1.8' }}>{currentQ.question}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', width: '100%' }}>
        {Object.entries(currentQ.options).map(([key, text]) => (
          <button 
            key={key} 
            onClick={() => handleSelect(key)}
            style={{ textAlign: 'left', textTransform: 'none', display: 'flex', gap: '15px', alignItems: 'center' }}
          >
            <span style={{ color: 'var(--highlight-color)', fontSize: '1.2rem' }}>{key}</span> 
            <span>{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameScreen;
