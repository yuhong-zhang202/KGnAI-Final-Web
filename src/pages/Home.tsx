import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Code, Database, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/lib/index";
import { IMAGES } from "@/assets/images";
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

/* SPARQL built from detection label red_light (per pipeline) */
const REAL_SPARQL = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/ontologies/2024/autonomous-driving#>

SELECT ?action WHERE {
  :TrafficLight_01 rdf:type :TrafficLight ;
                   :hasState :RedState ;
                   :requiresAction ?action .
}`;
/* 真实的 Fuseki JSON 响应 */
const FUSEKI_JSON_RESPONSE = `{
  "head": { "vars": [ "action" ] },
  "results": {
    "bindings": [
      {
        "action": { 
          "type": "uri", 
          "value": "...#StopAction" 
        }
      }
    ]
  }
}`;
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const [sparqlVisible, setSparqlVisible] = useState(0);
  const fusekiRef = useRef<HTMLDivElement>(null);
  const fusekiInView = useInView(fusekiRef, { once: true, amount: 0.3 });
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSparqlVisible(1), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!fusekiInView) return;
    const t = setTimeout(() => setShowResult(true), 600);
    return () => clearTimeout(t);
  }, [fusekiInView]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Hero — fix clipping: no overflow-hidden on content, safe padding, gradient not clipped */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center pt-24 pb-20"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={IMAGES.NEURAL_NETWORK_8}
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/75 to-background/95" />
        </div>
        <div className="absolute inset-0 particle-bg opacity-20 pointer-events-none" />

        <motion.div
          className="relative z-10 text-center max-w-5xl mx-auto px-6 overflow-visible"
          {...fadeInUp}
        >
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-neural-primary to-neural-secondary bg-clip-text text-transparent"
            style={{
              WebkitBackgroundClip: "text",
              lineHeight: 1.15,
              paddingTop: "0.08em",
              paddingBottom: "0.12em",
            }}
          >
            Cognitive Driving Engine
          </h1>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From perception to knowledge graph reasoning — one clear pipeline.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to={ROUTE_PATHS.DEMO}>
              <Button
                size="lg"
                className="text-base px-10 py-5 glow-primary hover:scale-[1.02] transition-all duration-300 group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Start Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-3 bg-primary/80 rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </motion.section>

      {/* Step 1 — Perception: BDD100K-style traffic image with traffic light bounding box */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            className="flex flex-col items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-mono tracking-widest text-primary/90 uppercase mb-3">
              Step 1
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Perception
            </h2>
            <p className="text-muted-foreground text-center max-w-xl">
              BDD100K-style frame: model input image with the traffic light annotated.
            </p>
          </motion.div>

          <motion.div
            className="relative rounded-2xl overflow-hidden glass glass-strong border-glow p-[1px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="rounded-2xl overflow-hidden bg-card/30">
              <div className="relative aspect-video max-h-[420px]">
                <img
                  src="/0.jpg"
                  alt="Traffic scene with red lights annotated"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* Left-turn red arrow (left): top 43.8%, left 43.3%, width 3.2%, height 4.8% */}
                <div
                  className="absolute border-2 border-destructive rounded pointer-events-none"
                  style={{
                    top: "43.8%",
                    left: "43.3%",
                    width: "3.2%",
                    height: "4.8%",
                    boxShadow: "0 0 12px var(--glow-destructive), 0 0 0 1px rgba(239,68,68,0.5)",
                  }}
                />
                <div
                  className="absolute text-[10px] font-mono font-medium bg-destructive/90 text-destructive-foreground rounded px-1.5 py-0.5 border border-destructive-foreground/20 shadow-lg whitespace-nowrap"
                  style={{ top: "38.8%", left: "43.3%" }}
                >
                  Red Light
                </div>
                {/* Main circular red light (right): top 44.8%, left 59.4%, width 2.8%, height 4.2% */}
                <div
                  className="absolute border-2 border-destructive rounded pointer-events-none"
                  style={{
                    top: "44.8%",
                    left: "59.4%",
                    width: "2.8%",
                    height: "4.2%",
                    boxShadow: "0 0 12px var(--glow-destructive), 0 0 0 1px rgba(239,68,68,0.5)",
                  }}
                />
                <div
                  className="absolute text-[10px] font-mono font-medium bg-destructive/90 text-destructive-foreground rounded px-1.5 py-0.5 border border-destructive-foreground/20 shadow-lg whitespace-nowrap"
                  style={{ top: "39.6%", left: "59.4%" }}
                >
                  Red Light
                </div>
                <div className="absolute bottom-4 left-4 text-xs font-mono text-white/80">
                  0.jpg
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Step 2 — Model recognition first, then SPARQL built from result (per pipeline) */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div className="flex flex-col items-center mb-12" {...fadeInUp}>
            <span className="text-xs font-mono tracking-widest text-primary/90 uppercase mb-3">Step 2</span>
            {/* 确保标题可见且居中 */}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
              Model Recognition → SPARQL Construction
            </h2>
            <p className="text-muted-foreground text-center max-w-xl">
              Transforming visual labels into semantic queries.
            </p>
          </motion.div>

          <motion.div className="glass glass-strong border-glow rounded-3xl p-8 md:p-10 mx-auto max-w-3xl">
            <div className="space-y-10">
              {/* 2a: Model recognition - 居中处理 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-5 w-5 text-primary" />
                  <span className="text-sm font-mono text-muted-foreground uppercase tracking-tight">Model Perception Output</span>
                </div>
                <motion.span 
                  className="px-6 py-3 rounded-xl bg-destructive/10 text-destructive font-mono text-xl border border-destructive/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                >
                  red_light
                </motion.span>
              </div>

              {/* 2b: SPARQL Query - 限制宽度并居中 */}
              <div className="w-full">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Code className="h-5 w-5 text-primary" />
                  <span className="text-sm font-mono text-muted-foreground uppercase tracking-tight">SPARQL Query Construction</span>
                </div>
                <div className="rounded-2xl bg-black/40 border border-white/10 p-6 font-mono text-sm shadow-inner overflow-x-auto">
                  <div className="inline-block text-left w-full">
                    {/* 这里的样式确保文本不会死贴左边 */}
                    <pre className="text-blue-400/90 leading-relaxed pl-4">
                      {REAL_SPARQL}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Step 3 — Fuseki Reasoning */}
      <section ref={fusekiRef} className="py-20 md:py-28 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div className="flex flex-col items-center mb-12" {...fadeInUp}>
            <span className="text-xs font-mono tracking-widest text-primary/90 uppercase mb-3">Step 3</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
              Fuseki Knowledge Reasoning
            </h2>
          </motion.div>

          <motion.div className="glass glass-strong border-glow rounded-3xl p-8 md:p-10 mx-auto max-w-3xl">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <Database className="h-6 w-6 text-primary" />
              <span className="text-sm font-mono text-muted-foreground uppercase">Apache Jena Fuseki Response</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 text-xs font-mono text-white/40">
                <span>ENDPOINT: /sparql</span>
                <span className="text-green-500">STATUS: 200 OK</span>
              </div>

              {/* 将 JSON 转化为可视化列表 */}
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: "Variable", value: "?action", color: "text-blue-400" },
                  { label: "Type", value: "URI", color: "text-purple-400" },
                  { label: "Value", value: "...#StopAction", color: "text-green-400" }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/5"
                  >
                    <span className="text-xs font-mono text-white/50">{item.label}</span>
                    <span className={`font-mono text-sm ${item.color}`}>{item.value}</span>
                  </motion.div>
                ))}
              </div>

              {/* 模拟推理成功的视觉提示 */}
              <div className="flex justify-center pt-4">
                <div className="px-4 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] text-green-500 font-mono animate-pulse">
                  REASONING COMPLETE: 1 MATCH FOUND
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Step 4 — Final System Decision */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div className="flex flex-col items-center mb-12" {...fadeInUp}>
            <span className="text-xs font-mono tracking-widest text-primary/90 uppercase mb-3">Step 4</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">System Feedback</h2>
            <p className="text-muted-foreground text-center">Closing the loop: Perception meets Reasoning.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* 左侧：视觉反馈 */}
            <motion.div className="glass glass-strong rounded-2xl p-4 border-glow">
              <div className="relative rounded-xl overflow-hidden aspect-video shadow-2xl">
                <img src="/0.jpg" alt="Final Decision" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
                {/* 精准红框 */}
                <div style={{ position: 'absolute', top: '44.8%', left: '59.4%', width: '3.2%', height: '4.8%', border: '2px solid red', boxShadow: '0 0 15px red' }} />
              </div>
              <p className="mt-4 text-center text-xs font-mono text-muted-foreground">LIVE SENSOR FEED [VERIFIED]</p>
            </motion.div>

            {/* 右侧：决策结果 */}
            <motion.div className="flex flex-col justify-center glass glass-strong rounded-2xl p-8 border-l-4 border-l-red-500">
              <h4 className="text-white/50 text-xs font-mono mb-2 uppercase tracking-tighter">Autonomous Action</h4>
              <div className="text-7xl font-black text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                STOP
              </div>
              <div className="space-y-4 bg-red-500/5 p-4 rounded-xl border border-red-500/20">
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="text-red-400 font-bold mr-2">Reasoning Result:</span>
                  Knowledge Graph inferred that entity <code className="text-primary">:TrafficLight_01</code> is in 
                  <code className="text-primary"> :RedState</code>, which mandates the execution of 
                  <code className="text-primary"> :StopAction</code>.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-20 md:py-24 relative">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Run the full pipeline with your own images in the interactive demo.
            </p>
            <Link to={ROUTE_PATHS.DEMO}>
              <Button
                size="lg"
                className="text-base px-10 py-5 glow-primary hover:scale-[1.02] transition-all duration-300 group"
              >
                Launch Interactive Demo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
