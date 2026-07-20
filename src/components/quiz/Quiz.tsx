import { useState, useEffect, useMemo, useRef } from "react";
import maleImg from "@/assets/male.png";
import femaleImg from "@/assets/female.png";
import antesDepoisImg from "@/assets/antes-depois.jpg";
import {
  User, Cake, Ruler, Weight, Target, Dumbbell, UtensilsCrossed,
  Moon, GlassWater, Timer, CheckCircle2, Lock, Flame, TrendingDown,
  Trophy, ShieldCheck, Sparkles, Camera, Zap,
} from "lucide-react";

type Answers = Record<string, string>;

type Step = {
  key: string;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  options: { value: string; label: string; emoji?: string; image?: string }[];
};

const steps: Step[] = [
  {
    key: "age", title: "Qual é a sua idade, {name}?", icon: Cake,
    options: [
      { value: "18-29", label: "18 - 29 anos", emoji: "🧒" },
      { value: "30-39", label: "30 - 39 anos", emoji: "🙂" },
      { value: "40-49", label: "40 - 49 anos", emoji: "😊" },
      { value: "50+", label: "50+ anos", emoji: "👴" },
    ],
  },
  {
    key: "height", title: "{name}, qual é a sua altura?", icon: Ruler,
    options: [
      { value: "<160", label: "Menos de 1,60m" },
      { value: "160-170", label: "1,60m - 1,70m" },
      { value: "170-180", label: "1,70m - 1,80m" },
      { value: ">180", label: "Mais de 1,80m" },
    ],
  },
  {
    key: "weight", title: "Qual é o seu peso actual, {name}?", icon: Weight,
    options: [
      { value: "<60", label: "Menos de 60 kg" },
      { value: "60-75", label: "60 - 75 kg" },
      { value: "75-90", label: "75 - 90 kg" },
      { value: "90-110", label: "90 - 110 kg" },
      { value: ">110", label: "Mais de 110 kg" },
    ],
  },
  {
    key: "goal", title: "{name}, quanto peso deseja perder?", icon: Target,
    options: [
      { value: "5", label: "Até 5 kg", emoji: "🎯" },
      { value: "10", label: "5 - 10 kg", emoji: "🔥" },
      { value: "20", label: "10 - 20 kg", emoji: "💪" },
      { value: "20+", label: "Mais de 20 kg", emoji: "🚀" },
    ],
  },
  {
    key: "sport", title: "Pratica algum desporto ou vai ao ginásio, {name}?", icon: Dumbbell,
    options: [
      { value: "nunca", label: "Nunca pratiquei", emoji: "😅" },
      { value: "raro", label: "Raramente", emoji: "🚶" },
      { value: "1-2", label: "1 a 2x por semana", emoji: "🏃" },
      { value: "3+", label: "3x ou mais por semana", emoji: "🏋️" },
    ],
  },
  {
    key: "diet", title: "{name}, como descreveria a sua alimentação?", icon: UtensilsCrossed,
    options: [
      { value: "fast", label: "Muito fast food e doces", emoji: "🍔" },
      { value: "normal", label: "Normal, mas com excessos", emoji: "🍽️" },
      { value: "equil", label: "Equilibrada", emoji: "🥗" },
      { value: "saudavel", label: "Já como saudável", emoji: "🥑" },
    ],
  },
  {
    key: "water", title: "Quanta água bebe por dia, {name}?", icon: GlassWater,
    options: [
      { value: "<1", label: "Menos de 1 litro" },
      { value: "1-2", label: "1 - 2 litros" },
      { value: "2+", label: "Mais de 2 litros" },
    ],
  },
  {
    key: "sleep", title: "{name}, quantas horas dorme por noite?", icon: Moon,
    options: [
      { value: "<5", label: "Menos de 5h", emoji: "😴" },
      { value: "5-6", label: "5 - 6 horas", emoji: "🥱" },
      { value: "7-8", label: "7 - 8 horas", emoji: "😊" },
      { value: "8+", label: "Mais de 8h", emoji: "💤" },
    ],
  },
  {
    key: "time", title: "Em quanto tempo quer atingir o objectivo, {name}?", icon: Timer,
    options: [
      { value: "record", label: "Tempo recorde (14 dias)", emoji: "⚡️" },
      { value: "28", label: "28 dias", emoji: "🔥" },
      { value: "60", label: "60 dias", emoji: "💪" },
      { value: "90", label: "90 dias", emoji: "💎" },
    ],
  },
];

type View = "intro" | "gender" | "name" | "photo" | "quiz" | "processing" | "result";

export function Quiz() {
  const [view, setView] = useState<View>("intro");
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    const step = steps[stepIdx];
    const next = { ...answers, [step.key]: value };
    setAnswers(next);
    if (stepIdx + 1 >= steps.length) {
      setView("processing");
    } else {
      setStepIdx(stepIdx + 1);
    }
  };

  if (view === "intro") return <Intro onStart={() => setView("gender")} />;
  if (view === "gender")
    return (
      <GenderStep
        onNext={(gender) => {
          setAnswers((prev) => ({ ...prev, gender }));
          setView("name");
        }}
      />
    );
  if (view === "name")
    return (
      <NameStep
        onNext={(n) => {
          setName(n);
          setView("photo");
        }}
      />
    );
  if (view === "photo")
    return (
      <PhotoStep
        name={name}
        onNext={(p) => {
          setPhoto(p);
          setView("quiz");
        }}
      />
    );
  if (view === "processing")
    return <Processing onDone={() => setView("result")} answers={answers} photo={photo} />;
  if (view === "result") return <Result answers={answers} name={name} photo={photo} />;

  const step = steps[stepIdx];
  const progress = ((stepIdx) / steps.length) * 100;
  const title = step.title.replace("{name}", name || "amigo");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary grid place-items-center">
                <Flame className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">FitPlan</span>
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              {stepIdx + 1} / {steps.length}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-primary rounded-full"
              style={{ width: `${progress + 100 / steps.length}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 md:py-12">
        <div key={step.key}>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary grid place-items-center shadow-elegant">
              <step.icon className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
            {title}
          </h1>
          {step.subtitle && (
            <p className="text-center text-muted-foreground mb-8">{step.subtitle}</p>
          )}

          <div
            className={
              step.key === "gender"
                ? "grid grid-cols-2 gap-4 mt-8"
                : "grid grid-cols-1 gap-3 mt-8"
            }
          >
            {step.options.map((opt) =>
              step.key === "gender" ? (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className="bg-card border-2 border-border rounded-3xl p-4"
                >
                  <div className="h-40 rounded-2xl bg-muted overflow-hidden mb-3 grid place-items-center">
                    <img
                      src={opt.image}
                      alt={opt.label}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-center font-bold text-foreground text-lg">
                    {opt.label}
                  </div>
                </button>
              ) : (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className="flex items-center gap-4 bg-card border-2 border-border rounded-2xl p-4 text-left"
                >
                  {opt.emoji && <span className="text-3xl">{opt.emoji}</span>}
                  <span className="font-semibold text-foreground flex-1">
                    {opt.label}
                  </span>
                  <span className="w-6 h-6 rounded-full border-2 border-border grid place-items-center" />
                </button>
              )
            )}
          </div>

          {stepIdx > 0 && (
            <button
              onClick={() => setStepIdx(stepIdx - 1)}
              className="mt-8 text-sm text-muted-foreground mx-auto block"
            >
              ← Voltar
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-hero px-4 py-8 flex justify-center">
      <div className="max-w-xl w-full bg-card rounded-3xl shadow-elegant p-8 md:p-10">
        <div className="flex justify-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-muted text-primary text-xs font-bold uppercase tracking-wide">
            +12.400 pessoas já fizeram
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-center text-foreground leading-tight">
          Descubra o seu <span className="text-primary">Plano de Emagrecimento</span> Personalizado
        </h1>
        <div className="mt-6 rounded-2xl border border-primary bg-muted p-4">
          <p className="text-center text-sm font-medium text-foreground leading-relaxed">
            Responda algumas perguntas rápidas e a nossa inteligência artificial cuidará de criar um
            <span className="text-primary font-bold"> Plano de Emagrecimento Personalizado</span> para
            atingires o teu resultado.
          </p>
        </div>

        <div className="my-6 rounded-2xl overflow-hidden shadow-elegant">
          <img
            src={antesDepoisImg}
            alt="Resultado antes e depois"
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>

        <ul className="space-y-2 mb-6">
          {["100% personalizado às suas respostas", "Sem dietas radicais", "Resultados visíveis em semanas"].map((t) => (
            <li key={t} className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              <span className="font-medium">{t}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onStart}
          className="w-full bg-gradient-primary text-primary-foreground font-bold py-4 rounded-2xl text-lg shadow-elegant"
        >
          Começar Quiz Gratuito →
        </button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Leva menos de 1 minuto ⚡
        </p>
      </div>
    </div>
  );
}

function GenderStep({ onNext }: { onNext: (gender: string) => void }) {
  return (
    <div className="min-h-screen bg-gradient-hero px-4 py-8 flex justify-center">
      <div className="max-w-md w-full bg-card rounded-3xl shadow-elegant p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary grid place-items-center shadow-elegant">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
          Qual é o seu gênero?
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Vamos personalizar o seu plano
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { value: "masculino", label: "Masculino", image: maleImg },
            { value: "feminino", label: "Feminino", image: femaleImg },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onNext(opt.value)}
              className="bg-card border-2 border-border rounded-3xl p-4"
            >
              <div className="h-40 rounded-2xl bg-muted overflow-hidden mb-3 grid place-items-center">
                <img
                  src={opt.image}
                  alt={opt.label}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="text-center font-bold text-foreground text-lg">
                {opt.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NameStep({ onNext }: { onNext: (name: string) => void }) {
  const [value, setValue] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length < 2) return;
    onNext(trimmed.split(" ")[0]);
  };
  return (
    <div className="min-h-screen bg-gradient-hero px-4 py-8 flex justify-center">
      <form
        onSubmit={submit}
        className="max-w-md w-full bg-card rounded-3xl shadow-elegant p-8"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary grid place-items-center shadow-elegant">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
          Como se chama?
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Vamos personalizar tudo com o seu nome
        </p>
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Digite o seu nome"
          className="w-full bg-muted border-2 border-border focus:border-primary outline-none rounded-2xl px-4 py-4 text-lg font-semibold text-foreground text-center"
        />
        <button
          type="submit"
          disabled={value.trim().length < 2}
          className="mt-6 w-full bg-gradient-primary text-primary-foreground font-bold py-4 rounded-2xl text-lg shadow-elegant"
        >
          Continuar →
        </button>
      </form>
    </div>
  );
}

function PhotoStep({ name, onNext }: { name: string; onNext: (photo: string | null) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | null | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <div className="min-h-screen bg-gradient-hero px-4 py-8 flex justify-center">
      <div className="max-w-md w-full bg-card rounded-3xl shadow-elegant p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary grid place-items-center shadow-elegant">
            <Camera className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
          {name}, envie a sua foto actual
        </h1>
        <p className="text-center text-muted-foreground mb-6 text-sm">
          Precisamos ver o seu físico actual para personalizar o plano. A foto fica <b>apenas no seu dispositivo</b>.
        </p>

        <div className="h-64 rounded-2xl bg-muted border-2 border-dashed border-border overflow-hidden grid place-items-center mb-4">
          {preview ? (
            <img src={preview} alt="Sua foto" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-muted-foreground text-sm px-6">
              <Camera className="w-10 h-10 mx-auto mb-2" />
              Nenhuma foto seleccionada
            </div>
          )}
        </div>

        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => cameraRef.current?.click()}
            className="bg-card border-2 border-border rounded-2xl py-3 font-semibold text-foreground flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" /> Tirar
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="bg-card border-2 border-border rounded-2xl py-3 font-semibold text-foreground"
          >
            📁 Carregar foto da galeria
          </button>
        </div>

        <button
          onClick={() => onNext(preview)}
          disabled={!preview}
          className="mt-4 w-full bg-gradient-primary text-primary-foreground font-bold py-4 rounded-2xl text-lg shadow-elegant"
        >
          Continuar →
        </button>
        <button
          onClick={() => onNext(null)}
          className="mt-3 text-sm text-muted-foreground mx-auto block"
        >
          Saltar por agora
        </button>
      </div>
    </div>
  );
}

function Processing({
  onDone, answers, photo,
}: { onDone: () => void; answers: Answers; photo: string | null }) {
  const [progress, setProgress] = useState(0);
  const [stepI, setStepI] = useState(0);
  const messages = [
    "A analisar as suas respostas...",
    "A analisar a sua foto...",
    "A calcular metabolismo basal...",
    "A ajustar o plano nutricional...",
    "A preparar rotina de exercícios...",
    "A finalizar o seu plano personalizado...",
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        const n = p + 2;
        if (n >= 100) {
          clearInterval(t);
          setTimeout(onDone, 400);
          return 100;
        }
        return n;
      });
    }, 90);
    return () => clearInterval(t);
  }, [onDone]);

  useEffect(() => {
    setStepI(Math.min(messages.length - 1, Math.floor(progress / (100 / messages.length))));
  }, [progress]);

  const gender = answers.gender;
  const avatar = photo || (gender === "feminino" ? femaleImg : maleImg);

  return (
    <div className="min-h-screen bg-gradient-hero px-4 py-8 flex justify-center">
      <div className="max-w-md w-full bg-card rounded-3xl shadow-elegant p-8 text-center">
        <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-card border-4 border-primary overflow-hidden">
          <img
            src={avatar}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          A processar os seus dados
        </h2>
        <p className="text-muted-foreground mb-6 min-h-[1.5rem]">
          {messages[stepI]}
        </p>
        <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm font-bold text-primary">{progress}%</div>
      </div>
    </div>
  );
}

function Result({
  answers, name, photo,
}: { answers: Answers; name: string; photo: string | null }) {
  const rawDays = answers.time || "60";
  const days = rawDays === "record" ? "14" : rawDays;
  const gender = answers.gender;
  const isFem = gender === "feminino";

  const kgTarget = useMemo(() => {
    const map: Record<string, string> = { "5": "5", "10": "8", "20": "15", "20+": "22" };
    return map[answers.goal || "10"] || "8";
  }, [answers.goal]);

  const calories = useMemo(() => {
    const base = isFem ? 1400 : 1700;
    const sport = answers.sport === "3+" ? 300 : answers.sport === "1-2" ? 150 : 0;
    return base + sport;
  }, [isFem, answers.sport]);

  const avatar = photo || (isFem ? femaleImg : maleImg);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-hero text-primary-foreground py-10 px-4 text-center">
        <Sparkles className="w-8 h-8 mx-auto mb-3" />
        <p className="uppercase text-xs font-bold tracking-widest">
          Plano Personalizado Pronto
        </p>
        <h1 className="text-3xl md:text-4xl font-black mt-2 max-w-2xl mx-auto leading-tight">
          PLANO DE EMAGRECIMENTO PARA {name?.toUpperCase() || "SI"} — {days} DIAS
        </h1>
        <p className="mt-3">Feito à medida das suas respostas</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6">
        <div className="bg-card rounded-3xl shadow-elegant p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-border">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-muted grid place-items-center flex-shrink-0">
              <img
                src={avatar}
                alt=""
                className={photo ? "w-full h-full object-cover" : "w-full h-full object-contain"}
                loading="lazy"
              />
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xs font-bold text-primary uppercase">Perfil de {name}</div>
              <div className="font-bold text-foreground text-lg">
                {isFem ? "Feminino" : "Masculino"}, {answers.age}
              </div>
              <div className="text-sm text-muted-foreground">
                Objectivo: perder {answers.goal} kg em {days} dias
              </div>
            </div>
          </div>

          {rawDays === "record" && (
            <div className="mt-6 flex items-center gap-3 bg-muted border border-primary rounded-2xl p-4">
              <Zap className="w-6 h-6 text-primary flex-shrink-0" />
              <div className="text-sm text-foreground font-semibold">
                Modo <b>Tempo Recorde</b> activado — plano intensivo de 14 dias.
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
            <StatCard icon={TrendingDown} value={`-${kgTarget}kg`} label="Meta estimada" />
            <StatCard icon={Flame} value={`${calories}`} label="Kcal / dia" />
            <StatCard icon={Trophy} value={`${days}d`} label="Duração" />
          </div>

          <div className="mt-8 rounded-3xl overflow-hidden bg-card shadow-elegant">
            <div className="px-6 py-5 border-b border-border text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Resultado antes e depois
              </p>
              <h2 className="mt-3 text-xl sm:text-2xl font-black text-foreground">
                Veja a transformação real
              </h2>
            </div>
            <div className="w-full bg-muted">
              <img
                src={antesDepoisImg}
                alt="Resultado antes e depois"
                className="w-full h-auto block object-cover"
                loading="lazy"
              />
            </div>
            <div className="px-6 py-5 text-sm text-muted-foreground text-center">
              Um exemplo do tipo de resultado que você pode alcançar com um plano personalizado e compromisso.
            </div>
          </div>

          <div className="mt-8 rounded-2xl border-2 border-dashed border-border p-4 text-center">
            <div className="bg-card px-4 py-2 rounded-full shadow-elegant inline-flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Conteúdo bloqueado</span>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              O plano completo será liberado após desbloquear.
            </p>
          </div>

          <div className="mt-8 bg-gradient-hero rounded-2xl p-6 text-primary-foreground">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Oferta especial - Apenas hoje
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm line-through">15.000 Kz</span>
              <span className="text-xs bg-card text-primary px-2 py-0.5 rounded-full font-bold">
                -60%
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-black">5.900 Kz</span>
              <span className="text-sm">pagamento único</span>
            </div>
            <a
              href="https://pay.kursinha.com/c/6a5bff66f871aef03e5b2b99"
              className="w-full bg-white text-primary font-bold py-4 rounded-2xl text-lg shadow-glow flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Desbloquear o Plano por 5.900 Kz
            </a>
            <div className="flex items-center justify-center gap-2 mt-3 text-xs">
              <ShieldCheck className="w-4 h-4" />
              Garantia de 7 dias ou o seu dinheiro de volta
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { name: "Maria S.", text: "Perdi 6kg em 30 dias seguindo o plano. Recomendo!", stars: 5 },
              { name: "João P.", text: "Nunca pensei que ia ser tão fácil. Vale cada Kwanza.", stars: 5 },
            ].map((r) => (
              <div key={r.name} className="bg-muted rounded-xl p-3">
                <div className="text-yellow-500 text-sm">{"★".repeat(r.stars)}</div>
                <p className="text-sm text-foreground mt-1">"{r.text}"</p>
                <p className="text-xs text-muted-foreground mt-1">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground py-8">
          © FitPlan · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon, value, label,
}: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="bg-muted rounded-2xl p-3 text-center">
      <Icon className="w-5 h-5 mx-auto text-primary mb-1" />
      <div className="font-black text-foreground text-lg">{value}</div>
      <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
