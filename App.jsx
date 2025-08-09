import React, { useMemo, useState, useEffect } from "react";

// ----------------------------------------------------
// Helpers
// ----------------------------------------------------
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (arr) => arr.map(v => [Math.random(), v]).sort((a,b) => a[0]-b[0]).map(([,v])=>v);
const vibrate = (ms=40) => { try { if (navigator?.vibrate) navigator.vibrate(ms); } catch {} };

// Build a unique options set that ALWAYS includes the target
function buildOptions(target, max, size = 4){
  const set = new Set([target]);
  while (set.size < size) set.add(rnd(1, max));
  return shuffle(Array.from(set));
}

// ----------------------------------------------------
// Data
// ----------------------------------------------------
// Emoji bank A–Z (3 items per letter so every round can build 4 options reliably)
const EMOJI_BANK = [
  // A
  { name: "Apple", emoji: "🍎", letter: "A" },
  { name: "Ant", emoji: "🐜", letter: "A" },
  { name: "Airplane", emoji: "✈️", letter: "A" },
  // B
  { name: "Ball", emoji: "🏀", letter: "B" },
  { name: "Bear", emoji: "🐻", letter: "B" },
  { name: "Bus", emoji: "🚌", letter: "B" },
  // C
  { name: "Cat", emoji: "🐱", letter: "C" },
  { name: "Car", emoji: "🚗", letter: "C" },
  { name: "Cake", emoji: "🍰", letter: "C" },
  // D
  { name: "Dog", emoji: "🐶", letter: "D" },
  { name: "Duck", emoji: "🦆", letter: "D" },
  { name: "Drum", emoji: "🥁", letter: "D" },
  // E
  { name: "Elephant", emoji: "🐘", letter: "E" },
  { name: "Egg", emoji: "🥚", letter: "E" },
  { name: "Envelope", emoji: "✉️", letter: "E" },
  // F
  { name: "Fox", emoji: "🦊", letter: "F" },
  { name: "Frog", emoji: "🐸", letter: "F" },
  { name: "Fire", emoji: "🔥", letter: "F" },
  // G
  { name: "Giraffe", emoji: "🦒", letter: "G" },
  { name: "Guitar", emoji: "🎸", letter: "G" },
  { name: "Grapes", emoji: "🍇", letter: "G" },
  // H
  { name: "House", emoji: "🏠", letter: "H" },
  { name: "Hat", emoji: "🎩", letter: "H" },
  { name: "Helicopter", emoji: "🚁", letter: "H" },
  // I
  { name: "Ice", emoji: "🧊", letter: "I" },
  { name: "Ice cream", emoji: "🍦", letter: "I" },
  { name: "Insect", emoji: "🐞", letter: "I" },
  // J
  { name: "Juice", emoji: "🧃", letter: "J" },
  { name: "Jellyfish", emoji: "🪼", letter: "J" },
  { name: "Jeep", emoji: "🚙", letter: "J" },
  // K
  { name: "Kite", emoji: "🪁", letter: "K" },
  { name: "Koala", emoji: "🐨", letter: "K" },
  { name: "Key", emoji: "🔑", letter: "K" },
  // L
  { name: "Lion", emoji: "🦁", letter: "L" },
  { name: "Leaf", emoji: "🍃", letter: "L" },
  { name: "Lemon", emoji: "🍋", letter: "L" },
  // M
  { name: "Monkey", emoji: "🐒", letter: "M" },
  { name: "Moon", emoji: "🌙", letter: "M" },
  { name: "Milk", emoji: "🥛", letter: "M" },
  // N
  { name: "Nose", emoji: "👃", letter: "N" },
  { name: "Nest", emoji: "🪹", letter: "N" },
  { name: "Notebook", emoji: "📓", letter: "N" },
  // O
  { name: "Octopus", emoji: "🐙", letter: "O" },
  { name: "Orange", emoji: "🍊", letter: "O" },
  { name: "Owl", emoji: "🦉", letter: "O" },
  // P
  { name: "Pig", emoji: "🐷", letter: "P" },
  { name: "Penguin", emoji: "🐧", letter: "P" },
  { name: "Pizza", emoji: "🍕", letter: "P" },
  // Q
  { name: "Queen", emoji: "👑", letter: "Q" },
  { name: "Quill", emoji: "🪶", letter: "Q" },
  { name: "Question", emoji: "❓", letter: "Q" },
  // R
  { name: "Rabbit", emoji: "🐰", letter: "R" },
  { name: "Rocket", emoji: "🚀", letter: "R" },
  { name: "Rainbow", emoji: "🌈", letter: "R" },
  // S
  { name: "Sun", emoji: "☀️", letter: "S" },
  { name: "Snake", emoji: "🐍", letter: "S" },
  { name: "Star", emoji: "⭐", letter: "S" },
  // T
  { name: "Tiger", emoji: "🐯", letter: "T" },
  { name: "Train", emoji: "🚆", letter: "T" },
  { name: "Turtle", emoji: "🐢", letter: "T" },
  // U
  { name: "Umbrella", emoji: "☔", letter: "U" },
  { name: "Unicorn", emoji: "🦄", letter: "U" },
  { name: "UFO", emoji: "🛸", letter: "U" },
  // V
  { name: "Violin", emoji: "🎻", letter: "V" },
  { name: "Van", emoji: "🚐", letter: "V" },
  { name: "Volcano", emoji: "🌋", letter: "V" },
  // W
  { name: "Whale", emoji: "🐋", letter: "W" },
  { name: "Watermelon", emoji: "🍉", letter: "W" },
  { name: "Watch", emoji: "⌚", letter: "W" },
  // X
  { name: "X-ray", emoji: "🩻", letter: "X" },
  { name: "Xylophone", emoji: "🎼", letter: "X" },
  { name: "X marks", emoji: "❌", letter: "X" },
  // Y
  { name: "Yarn", emoji: "🧶", letter: "Y" },
  { name: "Yacht", emoji: "⛵", letter: "Y" },
  { name: "Yo-yo", emoji: "🪀", letter: "Y" },
  // Z
  { name: "Zebra", emoji: "🦓", letter: "Z" },
  { name: "Zap", emoji: "⚡", letter: "Z" },
  { name: "Zigzag", emoji: "➿", letter: "Z" },
];

const CRITTERS = ["🦆","🐱","🐶","🐸","🐼","🦊","🐰","🐷","🦄","🦖","🐠","🦋","🐞","🐙"]; 

// ----------------------------------------------------
// UI Primitives
// ----------------------------------------------------
function Card({ children, className = "" }) {
  return <div className={`rounded-2xl shadow-lg bg-white p-4 ${className}`}>{children}</div>;
}

function BigButton({ children, onClick, className = "", disabled=false }){
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`active:scale-[0.98] transition-transform text-center rounded-2xl px-4 py-3 shadow-md bg-sky-100 disabled:opacity-50 ${className}`}
    >
      <span className="text-2xl leading-none">{children}</span>
    </button>
  );
}

function Pill({ children, className = "" }){
  return <span className={`inline-block px-3 py-1 text-sm rounded-full bg-slate-100 ${className}`}>{children}</span>;
}

// ----------------------------------------------------
// Shared feedback overlay
// ----------------------------------------------------
function FeedbackOverlay({ type }){
  if (!type) return null;
  const icon = type === "correct" ? "✅" : "✖️";
  const color = type === "correct" ? "text-emerald-600" : "text-rose-600";
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className={`text-6xl drop-shadow-lg ${color} animate-pulse`}>{icon}</div>
    </div>
  );
}

// ----------------------------------------------------
// Game 1: Count Critters (visual quantity → pick correct number)
// ----------------------------------------------------
function CountCritters({ maxNumber=10, onWin }){
  const [round, setRound] = useState(0);
  const target = useMemo(() => rnd(1, maxNumber), [round, maxNumber]);
  const [feedback, setFeedback] = useState("");

  // Render exactly `target` critters, placed in a tidy grid so nothing overlaps
  const critters = useMemo(() => {
    const c = CRITTERS[rnd(0, CRITTERS.length-1)];
    return Array.from({length: target}, (_, i) => ({ id: i, emoji: c }));
  }, [target]);

  const options = useMemo(() => buildOptions(target, maxNumber, 4), [target, maxNumber]);

  const choose = (n) => {
    const ok = n === target;
    setFeedback(ok ? "correct" : "wrong");
    vibrate(ok ? 20 : 60);
    if (ok){
      onWin?.();
      setTimeout(()=>{ setFeedback(""); setRound(r=>r+1); }, 700);
    } else {
      // BUGFIX: removed stray semicolon inside arrow fn
      setTimeout(()=> setFeedback(""), 500);
    }
  };

  return (
    <div className="w-full">
      <Card className="text-center relative">
        <div className="text-slate-500 text-sm">How many do you see?</div>
        {/* Grid layout to avoid overlap */}
        <div className="mt-2 grid grid-cols-5 sm:grid-cols-6 gap-2 place-items-center">
          {critters.map(c => (
            <div key={c.id} className="w-14 h-14 flex items-center justify-center">
              <span className="text-5xl leading-none" aria-hidden>{c.emoji}</span>
            </div>
          ))}
        </div>
        <FeedbackOverlay type={feedback} />
      </Card>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {options.map(n => (
          <BigButton key={n} onClick={()=>choose(n)} data-qa="count-option" className={feedback==="wrong"?"":feedback==="correct"?"bg-emerald-100":""}>{n}</BigButton>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Game 2: Letter Safari (A–Z)
// ----------------------------------------------------
function makeRound(letter){
  const correct = EMOJI_BANK.filter(x => x.letter === letter);
  const wrong = EMOJI_BANK.filter(x => x.letter !== letter);
  const picks = shuffle([correct[rnd(0, correct.length-1)], ...shuffle(wrong).slice(0,3)]);
  return { letter, options: picks };
}

function LetterSafari({ letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), onWin }){
  const [idx, setIdx] = useState(0);
  const [round, setRound] = useState(()=> makeRound(letters[0]));
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(""); // "correct" | "wrong" | ""
  const [pressed, setPressed] = useState(null);

  useEffect(()=>{ setRound(makeRound(letters[idx])); setFeedback(""); setPressed(null); }, [idx, letters]);

  const choose = (o, i) => {
    const ok = o.letter === round.letter;
    setPressed(i);
    setFeedback(ok ? "correct" : "wrong");
    vibrate(ok ? 20 : 60);
    if (ok){
      setCorrectCount(c => c+1);
      const t = setTimeout(()=>{
        setFeedback(""); setPressed(null);
        if (idx < letters.length - 1) setIdx(idx+1); else onWin?.();
      }, 700);
      return () => clearTimeout(t);
    } else {
      // allow try again without advancing
      setTimeout(()=>{ setFeedback(""); setPressed(null); }, 550);
    }
  };

  return (
    <div className="w-full">
      <Card className="flex-1 text-center relative">
        <div className="text-slate-500 text-sm">Find things starting with</div>
        <div className="text-5xl font-extrabold" aria-live="polite">{round.letter}</div>
        <FeedbackOverlay type={feedback} />
      </Card>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {round.options.map((o, i) => {
          const isPressed = i === pressed;
          const pressedStyle = feedback === "correct" && isPressed ? "ring-4 ring-emerald-300 scale-[0.98]" : feedback === "wrong" && isPressed ? "ring-4 ring-rose-300 scale-[0.98]" : "";
          return (
            <button key={i} onClick={()=>choose(o,i)} className={`rounded-2xl bg-white p-4 shadow-md active:scale-[0.98] transition-transform ${pressedStyle}`} data-qa="letter-option">
              <div className="text-5xl leading-none" aria-hidden>{o.emoji}</div>
              <div className="mt-2 text-center text-xl">{o.name}</div>
            </button>
          );
        })}
      </div>
      <div className="mt-3 h-10 flex items-center justify-center text-2xl" aria-live="polite">{feedback === "correct" ? "✅ Nice!" : feedback === "wrong" ? "✖️ Try again" : ""}</div>
    </div>
  );
}

// ----------------------------------------------------
// Game 3: Number Match (show a number → pick that number)
// ----------------------------------------------------
function NumberMatch({ maxNumber=10, onWin }){
  const [round, setRound] = useState(0);
  const target = useMemo(() => rnd(1, maxNumber), [round, maxNumber]);
  const [feedback, setFeedback] = useState("");
  const [pressed, setPressed] = useState(null);
  const options = useMemo(() => buildOptions(target, maxNumber, 4), [target, maxNumber]);

  const choose = (n, i) => {
    const ok = n === target;
    setPressed(i);
    setFeedback(ok ? "correct" : "wrong");
    vibrate(ok ? 20 : 60);
    if (ok) {
      onWin?.();
      setTimeout(()=>{ setFeedback(""); setPressed(null); setRound(r=>r+1); }, 700);
    } else {
      setTimeout(()=>{ setFeedback(""); setPressed(null); }, 550);
    }
  };

  return (
    <div className="w-full">
      <Card className="text-center relative">
        <div className="text-slate-500 text-sm">Find this number</div>
        <div className="text-6xl font-extrabold mt-1" aria-live="polite">{target}</div>
        <FeedbackOverlay type={feedback} />
      </Card>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {options.map((n,i) => (
          <BigButton key={n} onClick={() => choose(n,i)} data-qa="numbermatch-option" className={feedback==="correct" && i===pressed ? "bg-emerald-100" : feedback==="wrong" && i===pressed ? "bg-rose-100" : ""}>{n}</BigButton>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Parent Panel
// ----------------------------------------------------
function ParentPanel({ settings, setSettings, progress, resetProgress }){
  return (
    <div className="space-y-3">
      <Card>
        <h3 className="text-xl font-semibold mb-2">Settings</h3>
        <label className="flex items-center justify-between gap-3">
          <span>Max number</span>
          <input type="range" min={5} max={20} value={settings.maxNumber} onChange={e=>setSettings(s=>({...s, maxNumber: +e.target.value}))}/>
          <Pill>{settings.maxNumber}</Pill>
        </label>
      </Card>
      <Card>
        <h3 className="text-xl font-semibold mb-2">Progress</h3>
        <div className="flex items-center gap-3 flex-wrap">
          <Pill>Stars: {progress.stars}</Pill>
          <Pill>Rounds: {progress.rounds}</Pill>
          <BigButton onClick={resetProgress}>Reset</BigButton>
        </div>
      </Card>
    </div>
  );
}

// ----------------------------------------------------
// Self-tests (basic runtime checks) – logs to console
// ----------------------------------------------------
function runSelfTests(){
  const tests = [];
  function assert(name, cond){ tests.push({ name, pass: !!cond }); }

  // rnd boundaries
  for (let i=0;i<20;i++){
    const x = rnd(1,5); assert("rnd within 1..5", x>=1 && x<=5);
  }

  // shuffle keeps contents (multiset equality check by sort)
  const arr = [1,2,3,4,5];
  const sh = shuffle(arr);
  assert("shuffle same length", sh.length === arr.length);
  assert("shuffle same members", sh.slice().sort().join(",") === arr.slice().sort().join(","));

  // buildOptions basic
  const target = 3; const opts = buildOptions(target, 10, 4);
  assert("buildOptions size 4", opts.length === 4);
  assert("buildOptions includes target", opts.includes(target));
  assert("buildOptions unique", new Set(opts).size === 4);

  // buildOptions robustness over many runs
  let robust = true;
  for (let i=0;i<50;i++){
    const t = rnd(1,10);
    const o = buildOptions(t, 10, 4);
    if (o.length !== 4 || !o.includes(t) || new Set(o).size !== 4 || o.some(v => v<1 || v>10)) robust = false;
  }
  assert("buildOptions robust 50x", robust);

  // makeRound
  const r = makeRound("A");
  assert("makeRound 4 options", r.options.length === 4);
  assert("makeRound has correct letter", r.options.some(o => o.letter === "A"));

  // emoji bank sanity across alphabet
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  assert("emoji bank covers A-Z", letters.every(L => EMOJI_BANK.some(e => e.letter === L)));

  const passed = tests.every(t => t.pass);
  if (passed) console.log("[Learn&Play] Self-tests passed", tests);
  else console.warn("[Learn&Play] Self-tests failures", tests.filter(t=>!t.pass));
}

try { runSelfTests(); } catch (e) { console.warn("[Learn&Play] Self-tests threw", e); }

// ----------------------------------------------------
// App Shell
// ----------------------------------------------------
export default function LearningGame(){
  const [tab, setTab] = useState("count");
  const [settings, setSettings] = useState({ maxNumber: 10, letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") });
  const [progress, setProgress] = useState({ stars: 0, rounds: 0 });

  const awardStar = () => setProgress(p => ({ stars: p.stars + 1, rounds: p.rounds + 1 }));
  const resetProgress = () => setProgress({ stars: 0, rounds: 0 });

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 to-sky-50 flex flex-col items-center">
      <header className="w-full max-w-xl px-4 pt-6 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🌟</div>
          <div>
            <h1 className="text-2xl font-extrabold">Learn & Play</h1>
            <div className="text-slate-600 text-sm">Counting + Letters (ages 3–5)</div>
          </div>
        </div>
        <Pill>⭐ {progress.stars}</Pill>
      </header>

      <nav className="w-full max-w-xl px-4">
        <div className="grid grid-cols-4 gap-2">
          <BigButton onClick={()=>setTab("count")} className={tab==="count"?"bg-emerald-100":""}>Count</BigButton>
          <BigButton onClick={()=>setTab("number")} className={tab==="number"?"bg-emerald-100":""}>Numbers</BigButton>
          <BigButton onClick={()=>setTab("letters")} className={tab==="letters"?"bg-emerald-100":""}>Letters</BigButton>
          <BigButton onClick={()=>setTab("parents")} className={tab==="parents"?"bg-emerald-100":""}>Parents</BigButton>
        </div>
      </nav>

      <main className="w-full max-w-xl px-4 py-4">
        {tab === "count" && <CountCritters maxNumber={settings.maxNumber} onWin={awardStar} />}
        {tab === "number" && <NumberMatch maxNumber={settings.maxNumber} onWin={awardStar} />}
        {tab === "letters" && <LetterSafari letters={settings.letters} onWin={awardStar} />}
        {tab === "parents" && <ParentPanel settings={settings} setSettings={setSettings} progress={progress} resetProgress={resetProgress} />}
      </main>

      <footer className="pb-8 text-center text-slate-500 text-xs">
        <div>Touch‑first · Works offline (once loaded) via browser cache · No data leaves the device</div>
      </footer>
    </div>
  );
}
