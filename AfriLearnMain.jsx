import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────── */
const C = {
  bg:       "#07090F",
  surface:  "#0E1118",
  card:     "#131720",
  border:   "#1C2333",
  accent:   "#F6A732",
  accentDim:"#F6A73220",
  green:    "#00C97A",
  greenDim: "#00C97A20",
  blue:     "#4F8EF7",
  blueDim:  "#4F8EF720",
  red:      "#F05C5C",
  redDim:   "#F05C5C20",
  purple:   "#9B72F8",
  purpleDim:"#9B72F820",
  text:     "#ECF0FA",
  sub:      "#8896B3",
  muted:    "#4A5568",
};

/* ─── TINY COMPONENTS ────────────────────────────────────────── */
const Dot = ({ color = C.green, size = 7 }) => (
  <span style={{ display:"inline-block", width:size, height:size, borderRadius:"50%", background:color, flexShrink:0 }} />
);

const Badge = ({ label, color = C.accent }) => (
  <span style={{ background:`${color}22`, color, border:`1px solid ${color}44`, borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700, letterSpacing:.5 }}>{label}</span>
);

const Pill = ({ label, active, onClick, color = C.accent }) => (
  <button onClick={onClick} style={{ background: active ? color : C.card, color: active ? "#07090F" : C.sub, border:`1px solid ${active ? color : C.border}`, borderRadius:20, padding:"6px 14px", fontSize:12, cursor:"pointer", whiteSpace:"nowrap", fontWeight: active ? 700 : 400 }}>{label}</button>
);

const Avatar = ({ name="?", size=38, color=C.blue }) => (
  <div style={{ width:size, height:size, borderRadius:size/3, background:`${color}33`, color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:size*.38, flexShrink:0, border:`2px solid ${color}44` }}>
    {name[0].toUpperCase()}
  </div>
);

const Input = ({ label, placeholder, value, onChange, type="text", style:sx={} }) => (
  <div style={{ marginBottom:14 }}>
    {label && <label style={{ display:"block", color:C.sub, fontSize:11, letterSpacing:.8, marginBottom:6, textTransform:"uppercase" }}>{label}</label>}
    <input type={type} placeholder={placeholder} value={value} onChange={onChange}
      style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 14px", color:C.text, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", ...sx }} />
  </div>
);

const Btn = ({ children, onClick, variant="primary", disabled, full, style:sx={} }) => {
  const base = { border:"none", borderRadius:11, padding:"12px 20px", fontWeight:700, fontSize:14, cursor: disabled?"not-allowed":"pointer", width: full?"100%":"auto", opacity: disabled?.6:1, transition:"all .15s", fontFamily:"inherit", ...sx };
  const styles = {
    primary: { background: C.accent, color:"#07090F" },
    secondary: { background: C.card, color: C.sub, border:`1px solid ${C.border}` },
    danger: { background: C.red, color:"#fff" },
    ghost: { background:"transparent", color: C.sub, border:`1px solid ${C.border}` },
  };
  return <button onClick={!disabled?onClick:undefined} style={{...base,...styles[variant]}}>{children}</button>;
};

const UploadBox = ({ label, hint, icon="📎", onFile }) => {
  const ref = useRef();
  const [name, setName] = useState("");
  return (
    <div onClick={() => ref.current.click()} style={{ border:`2px dashed ${C.border}`, borderRadius:12, padding:"18px", textAlign:"center", cursor:"pointer", background:C.surface, marginBottom:12 }}>
      <input ref={ref} type="file" style={{ display:"none" }} accept="image/*,.pdf" onChange={e=>{ if(e.target.files[0]){ setName(e.target.files[0].name); onFile&&onFile(e.target.files[0]); }}} />
      <div style={{ fontSize:28, marginBottom:6 }}>{name ? "✅" : icon}</div>
      <div style={{ color: name?C.green:C.text, fontSize:13, fontWeight:700 }}>{name || label}</div>
      <div style={{ color:C.muted, fontSize:11, marginTop:3 }}>{name ? "Fichier sélectionné" : hint}</div>
    </div>
  );
};

/* ─── ONBOARDING ─────────────────────────────────────────────── */
function Onboarding({ onDone }) {
  const [step, setStep] = useState("splash");          // splash → type → form → verify → done
  const [userType, setUserType] = useState(null);      // "student" | "company"
  const [form, setForm] = useState({ name:"", email:"", password:"", field:"", university:"", companyName:"", sector:"", website:"" });
  const [docs, setDocs] = useState({ id:null, selfie:null, kbis:null, logo:null });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const submitVerify = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("done"); }, 2200);
  };

  /* Splash */
  if(step==="splash") return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-80, right:-80, width:280, height:280, borderRadius:"50%", background:`radial-gradient(circle, ${C.accentDim}, transparent 70%)` }}/>
      <div style={{ position:"absolute", bottom:-60, left:-60, width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle, ${C.blueDim}, transparent 70%)` }}/>
      <div style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:340 }}>
        <div style={{ width:72, height:72, borderRadius:20, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 24px", boxShadow:`0 0 40px ${C.accentDim}` }}>🎓</div>
        <h1 style={{ fontSize:38, fontWeight:900, color:C.text, letterSpacing:-1.5, marginBottom:8, lineHeight:1.1 }}>Afri<span style={{ color:C.accent }}>Learn</span></h1>
        <p style={{ color:C.sub, fontSize:15, lineHeight:1.6, marginBottom:10 }}>L'écosystème numérique conçu pour les étudiants et entreprises d'Afrique francophone.</p>
        <div style={{ display:"flex", justifyContent:"center", gap:16, marginBottom:36 }}>
          {[["12k+","Étudiants"],[" 28","Pays"],["800+","Entreprises"]].map(([v,l],i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ color:C.accent, fontWeight:900, fontSize:18 }}>{v}</div>
              <div style={{ color:C.muted, fontSize:11 }}>{l}</div>
            </div>
          ))}
        </div>
        <Btn full onClick={()=>setStep("type")} style={{ fontSize:16, padding:"14px" }}>Commencer →</Btn>
        <p style={{ color:C.muted, fontSize:12, marginTop:14 }}>Déjà un compte ? <span style={{ color:C.accent, cursor:"pointer" }} onClick={()=>onDone({type:"student",name:"Thomas",email:"thomas@mail.com"})}>Se connecter</span></p>
      </div>
    </div>
  );

  /* Type selection */
  if(step==="type") return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", padding:24 }}>
      <div style={{ marginTop:48, marginBottom:32 }}>
        <h2 style={{ color:C.text, fontSize:26, fontWeight:900, marginBottom:8 }}>Qui êtes-vous ?</h2>
        <p style={{ color:C.sub, fontSize:14 }}>Votre espace sera personnalisé selon votre profil.</p>
      </div>
      {[
        { type:"student", icon:"🎓", title:"Je suis Étudiant(e)", desc:"Accède à l'IA, la communauté, les stages et les ressources académiques.", color:C.blue },
        { type:"company", icon:"🏢", title:"Je représente une Entreprise", desc:"Publiez vos offres de stage/emploi et accédez à des milliers de talents.", color:C.green },
      ].map(o=>(
        <div key={o.type} onClick={()=>{ setUserType(o.type); setStep("form"); }} style={{ background:userType===o.type?`${o.color}22`:C.card, border:`2px solid ${userType===o.type?o.color:C.border}`, borderRadius:16, padding:20, marginBottom:14, cursor:"pointer", display:"flex", gap:14, alignItems:"center" }}>
          <div style={{ width:52, height:52, borderRadius:14, background:`${o.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{o.icon}</div>
          <div>
            <div style={{ color:C.text, fontWeight:700, fontSize:16, marginBottom:4 }}>{o.title}</div>
            <div style={{ color:C.sub, fontSize:13, lineHeight:1.4 }}>{o.desc}</div>
          </div>
        </div>
      ))}
      <p style={{ color:C.muted, fontSize:11, marginTop:8, textAlign:"center", lineHeight:1.5 }}>En créant un compte, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.</p>
    </div>
  );

  /* Registration form */
  if(step==="form") return (
    <div style={{ minHeight:"100vh", background:C.bg, padding:"24px 20px 40px", overflowY:"auto" }}>
      <button onClick={()=>setStep("type")} style={{ background:"none", border:"none", color:C.sub, fontSize:14, cursor:"pointer", marginBottom:24 }}>← Retour</button>
      <h2 style={{ color:C.text, fontSize:22, fontWeight:900, marginBottom:4 }}>{userType==="student"?"Créer mon compte étudiant":"Créer mon espace entreprise"}</h2>
      <p style={{ color:C.sub, fontSize:13, marginBottom:24 }}>Toutes les informations sont vérifiées pour la sécurité de la communauté.</p>

      <Input label="Nom complet" placeholder={userType==="student"?"Votre nom et prénom":"Nom du responsable"} value={form.name} onChange={e=>set("name",e.target.value)} />
      <Input label="Email" placeholder="votre@email.com" value={form.email} onChange={e=>set("email",e.target.value)} type="email" />
      <Input label="Mot de passe" placeholder="Min. 8 caractères" value={form.password} onChange={e=>set("password",e.target.value)} type="password" />

      {userType==="student" && <>
        <Input label="Filière / Domaine d'études" placeholder="Ex: Droit, Informatique, Médecine..." value={form.field} onChange={e=>set("field",e.target.value)} />
        <Input label="Université / École" placeholder="Ex: UAC Cotonou, UCAD Dakar..." value={form.university} onChange={e=>set("university",e.target.value)} />
      </>}

      {userType==="company" && <>
        <Input label="Nom de l'entreprise" placeholder="Nom légal de votre société" value={form.companyName} onChange={e=>set("companyName",e.target.value)} />
        <Input label="Secteur d'activité" placeholder="Ex: Finance, Tech, Agriculture..." value={form.sector} onChange={e=>set("sector",e.target.value)} />
        <Input label="Site web (optionnel)" placeholder="https://..." value={form.website} onChange={e=>set("website",e.target.value)} />
      </>}

      <Btn full onClick={()=>{ if(form.name&&form.email&&form.password) setStep("verify"); }} disabled={!form.name||!form.email||!form.password} style={{ marginTop:8 }}>
        Continuer → Vérification
      </Btn>
    </div>
  );

  /* Document verification */
  if(step==="verify") return (
    <div style={{ minHeight:"100vh", background:C.bg, padding:"24px 20px 40px", overflowY:"auto" }}>
      <button onClick={()=>setStep("form")} style={{ background:"none", border:"none", color:C.sub, fontSize:14, cursor:"pointer", marginBottom:24 }}>← Retour</button>
      <div style={{ background:C.accentDim, border:`1px solid ${C.accent}44`, borderRadius:12, padding:"12px 16px", marginBottom:24, display:"flex", gap:10, alignItems:"flex-start" }}>
        <span style={{ fontSize:18 }}>🔒</span>
        <div>
          <div style={{ color:C.accent, fontWeight:700, fontSize:13 }}>Vérification d'identité obligatoire</div>
          <div style={{ color:C.sub, fontSize:12, marginTop:2, lineHeight:1.5 }}>Pour garantir la sécurité de tous les membres, nous vérifions chaque compte. Vos documents sont chiffrés et ne sont jamais partagés.</div>
        </div>
      </div>

      {userType==="student" && <>
        <h3 style={{ color:C.text, fontSize:16, fontWeight:700, marginBottom:4 }}>Documents requis — Étudiant</h3>
        <p style={{ color:C.sub, fontSize:12, marginBottom:16, lineHeight:1.5 }}>Fournissez l'un des justificatifs suivants prouvant votre statut étudiant.</p>
        <UploadBox label="Carte d'étudiant ou préinscription" hint="JPG, PNG ou PDF • Max 5MB" icon="🪪" onFile={f=>setDocs(d=>({...d,id:f}))} />
        <UploadBox label="Selfie avec votre pièce d'identité" hint="Tenez votre carte visible devant votre visage" icon="🤳" onFile={f=>setDocs(d=>({...d,selfie:f}))} />
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", marginBottom:16 }}>
          <div style={{ color:C.sub, fontSize:11, lineHeight:1.6 }}>
            ✅ Carte d'étudiant valide<br/>
            ✅ Fiche de préinscription officielle<br/>
            ✅ Attestation de scolarité<br/>
            ✅ CNI + selfie (si aucun doc étudiant disponible)
          </div>
        </div>
      </>}

      {userType==="company" && <>
        <h3 style={{ color:C.text, fontSize:16, fontWeight:700, marginBottom:4 }}>Documents requis — Entreprise</h3>
        <p style={{ color:C.sub, fontSize:12, marginBottom:16, lineHeight:1.5 }}>Justifiez l'existence légale de votre organisation.</p>
        <UploadBox label="Registre de Commerce (RCCM)" hint="Document officiel d'immatriculation" icon="📄" onFile={f=>setDocs(d=>({...d,kbis:f}))} />
        <UploadBox label="Logo de l'entreprise" hint="PNG ou JPG haute qualité" icon="🏢" onFile={f=>setDocs(d=>({...d,logo:f}))} />
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", marginBottom:16 }}>
          <div style={{ color:C.sub, fontSize:11, lineHeight:1.6 }}>
            ✅ RCCM (Registre du Commerce et du Crédit Mobilier)<br/>
            ✅ IFU / NIF (Identifiant Fiscal Unique)<br/>
            ✅ Statuts de la société signés<br/>
            ✅ Lettre officielle sur en-tête de l'entreprise
          </div>
        </div>
      </>}

      <div onClick={()=>setAgree(a=>!a)} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:20, cursor:"pointer" }}>
        <div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${agree?C.accent:C.border}`, background:agree?C.accent:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
          {agree && <span style={{ color:"#07090F", fontSize:12, fontWeight:900 }}>✓</span>}
        </div>
        <p style={{ color:C.sub, fontSize:12, lineHeight:1.5, margin:0 }}>J'atteste que les informations fournies sont exactes. Toute fausse déclaration entraîne la suspension immédiate du compte.</p>
      </div>

      <Btn full onClick={submitVerify} disabled={!agree||loading}>
        {loading ? "Vérification en cours..." : "Soumettre & Créer mon compte →"}
      </Btn>
    </div>
  );

  /* Done */
  if(step==="done") return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, textAlign:"center" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:C.greenDim, border:`3px solid ${C.green}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:24 }}>✅</div>
      <h2 style={{ color:C.text, fontSize:24, fontWeight:900, marginBottom:8 }}>Compte créé !</h2>
      <p style={{ color:C.sub, fontSize:14, lineHeight:1.6, marginBottom:8 }}>Votre dossier est en cours de vérification par notre équipe.</p>
      <p style={{ color:C.muted, fontSize:12, lineHeight:1.6, marginBottom:32 }}>Délai habituel : <strong style={{ color:C.accent }}>2–24h ouvrées</strong>. Vous recevrez un email de confirmation.</p>
      <Btn onClick={()=>onDone({ type:userType, name:form.name||form.companyName, email:form.email })}>
        Accéder à mon tableau de bord →
      </Btn>
    </div>
  );
}

/* ─── STUDENT APP ────────────────────────────────────────────── */
const STUDENT_NAV = [
  { id:"home", icon:"🏠", label:"Accueil" },
  { id:"community", icon:"💬", label:"Communauté" },
  { id:"messages", icon:"✉️", label:"Messages" },
  { id:"internships", icon:"💼", label:"Stages" },
  { id:"ai", icon:"🤖", label:"IA" },
];

const MOCK_POSTS = [
  { id:1, user:"Aminata D.", uni:"UCAD Dakar", field:"Économie", time:"il y a 2h", content:"Je partage mon résumé complet sur la macroéconomie keynésienne — 48 pages structurées avec schémas 📚", likes:87, comments:23, avatar:"A", color:C.blue, attachments:[{name:"Macro_keynésienne.pdf",type:"pdf"}] },
  { id:2, user:"Kofi A.", uni:"UAC Cotonou", field:"Droit OHADA", time:"il y a 4h", content:"Quelqu'un a les arrêts CCJA 2024 sur les sûretés mobilières ? Exam dans 48h 😭", likes:14, comments:8, avatar:"K", color:C.purple, attachments:[] },
  { id:3, user:"Fatou C.", uni:"UASZ Ziguinchor", field:"Médecine", time:"hier", content:"Protocole de révision que j'utilise depuis 2 ans : Pomodoro 45/10, fiches Anki le soir, QCMs le matin. Mon taux de réussite : 94% ✅", likes:203, comments:67, avatar:"F", color:C.green, attachments:[] },
];

const MOCK_COMPANIES = [
  { id:1, name:"Orange Digital Center", sector:"Tech / Numérique", country:"Bénin / Sénégal", logo:"🟠", offers:3, verified:true },
  { id:2, name:"Ecobank Group", sector:"Finance / Banque", country:"Panafricain", logo:"🟢", offers:5, verified:true },
  { id:3, name:"MTN Africa", sector:"Télécommunications", country:"Multi-pays", logo:"🔵", offers:2, verified:true },
  { id:4, name:"Cabinet OHADA Lex", sector:"Droit / Conseil", country:"Bénin", logo:"⚖️", offers:1, verified:true },
  { id:5, name:"Africa Agri Tech", sector:"Agriculture / Tech", country:"Côte d'Ivoire", logo:"🌱", offers:4, verified:false },
];

const MOCK_INTERNSHIPS = [
  { id:1, company:"Orange Digital Center", role:"Développeur Web Frontend", field:"Informatique", duration:"3 mois", location:"Cotonou, Bénin", deadline:"15 Juin 2026", salary:"Indemnisé", match:97 },
  { id:2, company:"Ecobank Group", role:"Analyste Financier Junior", field:"Finance / Économie", duration:"6 mois", location:"Lomé, Togo", deadline:"30 Juin 2026", salary:"Indemnisé", match:91 },
  { id:3, company:"Cabinet OHADA Lex", role:"Juriste Stagiaire", field:"Droit", duration:"4 mois", location:"Cotonou, Bénin", deadline:"20 Juin 2026", salary:"Gratifié", match:88 },
  { id:4, company:"MTN Africa", role:"Assistant Marketing Digital", field:"Marketing / Comm.", duration:"3 mois", location:"Abidjan, CI", deadline:"1 Juil 2026", salary:"Indemnisé", match:76 },
];

const MOCK_CONVERSATIONS = [
  { id:1, user:"Seydou T.", preview:"Tu peux m'envoyer ton cours sur les algo ?", time:"10:34", unread:2, avatar:"S", color:C.blue },
  { id:2, user:"Aminata D.", preview:"Merci pour le partage 🙏", time:"hier", unread:0, avatar:"A", color:C.purple },
  { id:3, user:"Support AfriLearn", preview:"Votre compte a été vérifié ✅", time:"hier", unread:1, avatar:"AL", color:C.green },
];

function StudentApp({ user }) {
  const [page, setPage] = useState("home");
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPost, setNewPost] = useState("");
  const [postFile, setPostFile] = useState(null);
  const [chatOpen, setChatOpen] = useState(null);
  const [chatMsg, setChatMsg] = useState("");
  const [convMessages, setConvMessages] = useState({ 1:[{ from:"them", text:"Salut ! Tu as les cours d'algo de L3 ?", time:"10:30"},{ from:"them", text:"Tu peux m'envoyer ton cours sur les algo ?", time:"10:34"}], 2:[{ from:"them", text:"Merci pour le partage 🙏", time:"hier"}], 3:[{ from:"them", text:"Votre compte a été vérifié ✅", time:"hier"}] });
  const [aiMessages, setAiMessages] = useState([{ role:"assistant", content:"Bonjour ! Je suis l'IA AfriLearn 🎓\nJe t'aide avec tes cours, devoirs, révisions et projets. Pose-moi n'importe quelle question !"}]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [applyModal, setApplyModal] = useState(null);
  const [appliedIds, setAppliedIds] = useState([]);
  const [applyStep, setApplyStep] = useState(0);
  const [applyForm, setApplyForm] = useState({ motivation:"", cv:null, letter:null });
  const aiBottom = useRef();
  const chatBottom = useRef();

  useEffect(() => { aiBottom.current?.scrollIntoView({ behavior:"smooth"}); }, [aiMessages]);
  useEffect(() => { chatBottom.current?.scrollIntoView({ behavior:"smooth"}); }, [convMessages, chatOpen]);

  const sendAI = async () => {
    if(!aiInput.trim()||aiLoading) return;
    const q = aiInput.trim(); setAiInput(""); setAiLoading(true);
    const history = [...aiMessages, { role:"user", content:q }];
    setAiMessages(history);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:"Tu es l'IA AfriLearn, assistant académique et entrepreneurial pour étudiants africains francophones. Tu connais les systèmes éducatifs africains, le droit OHADA, les universités d'Afrique de l'Ouest. Tu parles en français courant, tu es chaleureux, direct, motivant. Max 300 mots par réponse.",
          messages: history.map(m=>({role:m.role,content:m.content})) }) });
      const data = await res.json();
      setAiMessages(p=>[...p, { role:"assistant", content:data.content?.[0]?.text||"Erreur." }]);
    } catch { setAiMessages(p=>[...p,{role:"assistant",content:"Erreur de connexion."}]); }
    setAiLoading(false);
  };

  const sendChat = (convId) => {
    if(!chatMsg.trim()) return;
    setConvMessages(prev=>({ ...prev, [convId]: [...(prev[convId]||[]), { from:"me", text:chatMsg, time: new Date().toLocaleTimeString("fr",{hour:"2-digit",minute:"2-digit"})}] }));
    setChatMsg("");
  };

  const publishPost = () => {
    if(!newPost.trim()) return;
    setPosts(p=>[{ id:Date.now(), user:user.name, uni:"AfriLearn", field:"Général", time:"à l'instant", content:newPost, likes:0, comments:0, avatar:user.name[0], color:C.accent, attachments: postFile?[{name:postFile.name,type:postFile.name.endsWith(".pdf")?"pdf":"image"}]:[] }, ...p]);
    setNewPost(""); setPostFile(null);
  };

  const submitApplication = (internship) => {
    setAppliedIds(p=>[...p, internship.id]);
    setApplyModal(null); setApplyStep(0);
    setApplyForm({ motivation:"", cv:null, letter:null });
  };

  const FIELDS = ["Tous","Informatique","Droit","Finance","Médecine","Marketing","Agriculture"];

  /* ── MODALS ── */
  const ApplyModal = ({ job }) => (
    <div style={{ position:"fixed", inset:0, background:"#000000CC", zIndex:999, display:"flex", alignItems:"flex-end" }}>
      <div style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:"24px 20px 40px", width:"100%", maxWidth:430, margin:"0 auto", maxHeight:"85vh", overflowY:"auto" }}>
        {applyStep===0 && <>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ color:C.text, fontSize:17, fontWeight:900 }}>Postuler</h3>
            <button onClick={()=>setApplyModal(null)} style={{ background:"none", border:"none", color:C.sub, fontSize:20, cursor:"pointer" }}>✕</button>
          </div>
          <div style={{ background:C.surface, borderRadius:10, padding:"12px 14px", marginBottom:18, borderLeft:`3px solid ${C.accent}` }}>
            <div style={{ color:C.text, fontWeight:700, fontSize:14 }}>{job.role}</div>
            <div style={{ color:C.sub, fontSize:12 }}>{job.company} · {job.location}</div>
          </div>
          <label style={{ display:"block", color:C.sub, fontSize:11, letterSpacing:.8, marginBottom:6, textTransform:"uppercase" }}>Lettre de motivation</label>
          <textarea value={applyForm.motivation} onChange={e=>setApplyForm(f=>({...f,motivation:e.target.value}))} placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce stage..." style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 14px", color:C.text, fontSize:13, outline:"none", resize:"none", minHeight:90, boxSizing:"border-box", fontFamily:"inherit", marginBottom:14 }} rows={4} />
          <UploadBox label="CV (PDF)" hint="Votre CV à jour, max 5MB" icon="📄" onFile={f=>setApplyForm(p=>({...p,cv:f}))} />
          <UploadBox label="Lettre officielle (optionnel)" hint="Lettre de recommandation ou relevé de notes" icon="📎" onFile={f=>setApplyForm(p=>({...p,letter:f}))} />
          <Btn full onClick={()=>setApplyStep(1)} disabled={!applyForm.motivation.trim()||!applyForm.cv} style={{ marginTop:8 }}>Envoyer ma candidature →</Btn>
        </>}
        {applyStep===1 && (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
            <h3 style={{ color:C.text, fontSize:20, fontWeight:900, marginBottom:8 }}>Candidature envoyée !</h3>
            <p style={{ color:C.sub, fontSize:13, lineHeight:1.6, marginBottom:24 }}>
              {job.company} a reçu votre dossier. Vous serez notifié(e) par email et dans l'application dès qu'ils examinent votre candidature.
            </p>
            <Btn onClick={()=>submitApplication(job)}>Fermer</Btn>
          </div>
        )}
      </div>
    </div>
  );

  /* ── CHAT VIEW ── */
  if(chatOpen!==null) {
    const conv = MOCK_CONVERSATIONS.find(c=>c.id===chatOpen);
    const msgs = convMessages[chatOpen]||[];
    return (
      <div style={{ background:C.bg, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
        <div style={{ background:C.card, borderBottom:`1px solid ${C.border}`, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:10 }}>
          <button onClick={()=>setChatOpen(null)} style={{ background:"none", border:"none", color:C.sub, fontSize:18, cursor:"pointer" }}>←</button>
          <Avatar name={conv.user} color={conv.color} />
          <div style={{ flex:1 }}>
            <div style={{ color:C.text, fontWeight:700, fontSize:15 }}>{conv.user}</div>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}><Dot size={6} /><span style={{ color:C.green, fontSize:11 }}>En ligne</span></div>
          </div>
          <button style={{ background:"none", border:"none", color:C.sub, fontSize:18, cursor:"pointer" }}>📞</button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 14px 80px" }}>
          <div style={{ textAlign:"center", marginBottom:16 }}><span style={{ background:C.surface, color:C.muted, borderRadius:20, padding:"4px 14px", fontSize:11 }}>Aujourd'hui</span></div>
          {msgs.map((m,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:m.from==="me"?"flex-end":"flex-start", marginBottom:8 }}>
              {m.from!=="me" && <Avatar name={conv.user} size={30} color={conv.color} style={{ marginRight:8 }} />}
              <div style={{ maxWidth:"75%", background:m.from==="me"?C.accent:C.card, color:m.from==="me"?"#07090F":C.text, borderRadius:m.from==="me"?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 13px", fontSize:13, lineHeight:1.5, border:m.from!=="me"?`1px solid ${C.border}`:"none" }}>
                {m.text}
                <div style={{ fontSize:10, color:m.from==="me"?"#07090F88":C.muted, marginTop:3, textAlign:"right" }}>{m.time}</div>
              </div>
            </div>
          ))}
          <div ref={chatBottom} />
        </div>
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:C.card, borderTop:`1px solid ${C.border}`, padding:"10px 14px 20px", display:"flex", gap:8, alignItems:"center" }}>
          <label style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, fontSize:16 }}>
            📎<input type="file" style={{ display:"none" }} />
          </label>
          <label style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, fontSize:16 }}>
            📷<input type="file" accept="image/*" style={{ display:"none" }} />
          </label>
          <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") sendChat(chatOpen); }} placeholder="Message..." style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"9px 12px", color:C.text, fontSize:14, outline:"none", fontFamily:"inherit" }} />
          <button onClick={()=>sendChat(chatOpen)} style={{ background:C.accent, border:"none", borderRadius:10, width:38, height:38, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>➤</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background:C.bg, minHeight:"100vh", maxWidth:430, margin:"0 auto", fontFamily:"'Georgia', serif", overflowX:"hidden" }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { display:none; }
        textarea::placeholder, input::placeholder { color:${C.muted}; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
      `}</style>

      {applyModal && <ApplyModal job={applyModal} />}

      {/* TOP BAR */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"13px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:7, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🎓</div>
          <span style={{ color:C.text, fontWeight:900, fontSize:18, letterSpacing:-0.5 }}>Afri<span style={{ color:C.accent }}>Learn</span></span>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ position:"relative", cursor:"pointer" }}>
            <div style={{ width:32, height:32, borderRadius:8, background:C.card, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🔔</div>
            <div style={{ position:"absolute", top:-2, right:-2, width:8, height:8, borderRadius:"50%", background:C.red }} />
          </div>
          <Avatar name={user.name} size={32} color={C.accent} />
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{ paddingBottom:72, minHeight:"calc(100vh - 112px)", overflowY:"auto" }}>

        {/* ── HOME ── */}
        {page==="home" && (
          <div style={{ padding:"0 0 16px" }}>
            <div style={{ background:`linear-gradient(135deg, #07090F, #0D1520)`, padding:"28px 18px 24px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-50, right:-50, width:180, height:180, borderRadius:"50%", background:`radial-gradient(${C.accentDim},transparent 70%)` }} />
              <p style={{ color:C.sub, fontSize:13, marginBottom:4 }}>Bonjour 👋</p>
              <h2 style={{ color:C.text, fontSize:24, fontWeight:900, marginBottom:4 }}>{user.name.split(" ")[0]}</h2>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <Badge label="Étudiant vérifié ✓" color={C.green} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginTop:20 }}>
                {[["📚","Cours partagés","2,847"],["💼","Offres actives","134"],["🏆","Ton rang","#142"]].map(([i,l,v],idx)=>(
                  <div key={idx} style={{ background:"#ffffff0A", borderRadius:12, padding:"12px 10px", textAlign:"center" }}>
                    <div style={{ fontSize:20, marginBottom:4 }}>{i}</div>
                    <div style={{ color:C.accent, fontWeight:900, fontSize:16 }}>{v}</div>
                    <div style={{ color:C.muted, fontSize:10, marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding:"18px 16px 0" }}>
              <h3 style={{ color:C.text, fontSize:16, fontWeight:700, marginBottom:12 }}>Accès rapide</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                {[
                  { icon:"🤖", title:"Demander à l'IA", desc:"Aide aux devoirs", page:"ai", color:C.accent },
                  { icon:"💬", title:"Communauté", desc:"Partage & discussions", page:"community", color:C.blue },
                  { icon:"💼", title:"Stages & Emplois", desc:"134 offres actives", page:"internships", color:C.green },
                  { icon:"✉️", title:"Messages", desc:"3 non lus", page:"messages", color:C.purple },
                ].map((f,i)=>(
                  <div key={i} onClick={()=>setPage(f.page)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 12px", cursor:"pointer", borderTop:`3px solid ${f.color}` }}>
                    <div style={{ fontSize:22, marginBottom:8 }}>{f.icon}</div>
                    <div style={{ color:C.text, fontSize:13, fontWeight:700, marginBottom:2 }}>{f.title}</div>
                    <div style={{ color:C.muted, fontSize:11 }}>{f.desc}</div>
                  </div>
                ))}
              </div>

              <h3 style={{ color:C.text, fontSize:16, fontWeight:700, marginBottom:12 }}>Offres recommandées pour toi</h3>
              {MOCK_INTERNSHIPS.slice(0,2).map(j=>(
                <div key={j.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px", marginBottom:10, borderLeft:`3px solid ${j.match>90?C.green:C.accent}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                    <div style={{ color:C.text, fontWeight:700, fontSize:14 }}>{j.role}</div>
                    <Badge label={`${j.match}% match`} color={j.match>90?C.green:C.accent} />
                  </div>
                  <div style={{ color:C.sub, fontSize:12, marginBottom:10 }}>{j.company} · {j.location}</div>
                  <Btn onClick={()=>{ if(!appliedIds.includes(j.id)) setApplyModal(j); }} variant={appliedIds.includes(j.id)?"secondary":"primary"} style={{ fontSize:12, padding:"7px 14px" }}>
                    {appliedIds.includes(j.id)?"✅ Candidature envoyée":"Postuler →"}
                  </Btn>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── COMMUNITY ── */}
        {page==="community" && (
          <div style={{ padding:"14px 14px 0" }}>
            {/* Composer */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px", marginBottom:14 }}>
              <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                <Avatar name={user.name} size={36} color={C.accent} />
                <textarea value={newPost} onChange={e=>setNewPost(e.target.value)} placeholder="Partage un cours, pose une question, aide la communauté..." style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"9px 12px", color:C.text, fontSize:13, resize:"none", outline:"none", fontFamily:"inherit", minHeight:60 }} rows={2} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", gap:8 }}>
                  <label style={{ display:"flex", alignItems:"center", gap:5, color:C.sub, fontSize:12, cursor:"pointer" }}>
                    <span style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:7, padding:"5px 10px", fontSize:13 }}>📎</span>
                    <input type="file" style={{ display:"none" }} onChange={e=>setPostFile(e.target.files[0])} />
                    {postFile ? <span style={{ color:C.green, fontSize:11 }}>{postFile.name}</span> : "Fichier"}
                  </label>
                  <label style={{ display:"flex", alignItems:"center", gap:5, color:C.sub, fontSize:12, cursor:"pointer" }}>
                    <span style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:7, padding:"5px 10px", fontSize:13 }}>📷</span>
                    <input type="file" accept="image/*" style={{ display:"none" }} />Photo
                  </label>
                </div>
                <Btn onClick={publishPost} disabled={!newPost.trim()} style={{ fontSize:12, padding:"7px 16px" }}>Publier</Btn>
              </div>
            </div>

            {/* Filter pills */}
            <div style={{ display:"flex", gap:7, overflowX:"auto", marginBottom:14, paddingBottom:4 }}>
              {["Tout","Cours","Questions","Ressources","Discussions"].map(f=>(
                <Pill key={f} label={f} active={activeFilter===f} onClick={()=>setActiveFilter(f)} />
              ))}
            </div>

            {/* Posts */}
            {posts.map(p=>(
              <div key={p.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px", marginBottom:12, animation:"fadeUp .3s ease" }}>
                <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                  <Avatar name={p.avatar} size={38} color={p.color} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div style={{ color:C.text, fontWeight:700, fontSize:13 }}>{p.user}</div>
                      <span style={{ color:C.muted, fontSize:11 }}>{p.time}</span>
                    </div>
                    <div style={{ color:C.muted, fontSize:11 }}>{p.uni} · <span style={{ color:p.color }}>{p.field}</span></div>
                  </div>
                </div>
                <p style={{ color:C.text, fontSize:13, lineHeight:1.6, marginBottom:10 }}>{p.content}</p>
                {p.attachments?.length>0 && (
                  <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                    {p.attachments.map((a,i)=>(
                      <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 10px", display:"flex", gap:6, alignItems:"center" }}>
                        <span>{a.type==="pdf"?"📄":"🖼️"}</span>
                        <span style={{ color:C.sub, fontSize:11 }}>{a.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display:"flex", gap:16, borderTop:`1px solid ${C.border}`, paddingTop:10 }}>
                  <button style={{ background:"none", border:"none", color:C.sub, fontSize:12, cursor:"pointer", display:"flex", gap:4, alignItems:"center" }}>❤️ {p.likes}</button>
                  <button style={{ background:"none", border:"none", color:C.sub, fontSize:12, cursor:"pointer", display:"flex", gap:4, alignItems:"center" }}>💬 {p.comments}</button>
                  <button style={{ background:"none", border:"none", color:C.sub, fontSize:12, cursor:"pointer" }}>↗️ Partager</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── MESSAGES ── */}
        {page==="messages" && (
          <div style={{ padding:"14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h3 style={{ color:C.text, fontSize:18, fontWeight:900 }}>Messages</h3>
              <button style={{ background:C.accentDim, color:C.accent, border:`1px solid ${C.accent}44`, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:700 }}>+ Nouveau</button>
            </div>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"9px 12px", marginBottom:14, display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ color:C.muted }}>🔍</span>
              <input placeholder="Rechercher une conversation..." style={{ flex:1, background:"transparent", border:"none", color:C.text, fontSize:13, outline:"none", fontFamily:"inherit" }} />
            </div>
            {MOCK_CONVERSATIONS.map(conv=>(
              <div key={conv.id} onClick={()=>setChatOpen(conv.id)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"13px 14px", marginBottom:8, display:"flex", gap:12, alignItems:"center", cursor:"pointer" }}>
                <div style={{ position:"relative" }}>
                  <Avatar name={conv.avatar} size={42} color={conv.color} />
                  <div style={{ position:"absolute", bottom:0, right:0, width:11, height:11, borderRadius:"50%", background:C.green, border:`2px solid ${C.card}` }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ color:C.text, fontWeight:700, fontSize:14 }}>{conv.user}</span>
                    <span style={{ color:C.muted, fontSize:11 }}>{conv.time}</span>
                  </div>
                  <div style={{ color:C.sub, fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:2 }}>{conv.preview}</div>
                </div>
                {conv.unread>0 && <div style={{ background:C.accent, color:"#07090F", borderRadius:"50%", width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, flexShrink:0 }}>{conv.unread}</div>}
              </div>
            ))}
            <div style={{ background:C.accentDim, border:`1px solid ${C.accent}33`, borderRadius:12, padding:"14px", marginTop:8, textAlign:"center" }}>
              <div style={{ fontSize:20, marginBottom:6 }}>🔒</div>
              <div style={{ color:C.accent, fontSize:13, fontWeight:700, marginBottom:3 }}>Messages chiffrés de bout en bout</div>
              <div style={{ color:C.sub, fontSize:11 }}>Vos conversations sont privées et sécurisées</div>
            </div>
          </div>
        )}

        {/* ── INTERNSHIPS ── */}
        {page==="internships" && (
          <div style={{ padding:"14px" }}>
            <h3 style={{ color:C.text, fontSize:18, fontWeight:900, marginBottom:4 }}>Stages & Emplois</h3>
            <p style={{ color:C.sub, fontSize:12, marginBottom:16 }}>Offres filtrées par l'IA selon ton profil et ta filière</p>

            {/* Search */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"9px 12px", marginBottom:12, display:"flex", gap:8 }}>
              <span style={{ color:C.muted }}>🔍</span>
              <input placeholder="Poste, entreprise, ville..." style={{ flex:1, background:"transparent", border:"none", color:C.text, fontSize:13, outline:"none", fontFamily:"inherit" }} />
            </div>

            {/* Field filters */}
            <div style={{ display:"flex", gap:7, overflowX:"auto", marginBottom:16, paddingBottom:4 }}>
              {FIELDS.map(f=>(
                <Pill key={f} label={f} active={activeFilter===f} onClick={()=>setActiveFilter(f)} />
              ))}
            </div>

            {/* Entreprises partenaires */}
            <div style={{ marginBottom:18 }}>
              <h4 style={{ color:C.sub, fontSize:11, letterSpacing:.8, textTransform:"uppercase", marginBottom:10 }}>Entreprises partenaires</h4>
              <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
                {MOCK_COMPANIES.map(c=>(
                  <div key={c.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px", flexShrink:0, width:130, textAlign:"center" }}>
                    <div style={{ fontSize:24, marginBottom:6 }}>{c.logo}</div>
                    <div style={{ color:C.text, fontSize:12, fontWeight:700, marginBottom:2, lineHeight:1.2 }}>{c.name}</div>
                    <div style={{ color:C.muted, fontSize:10, marginBottom:6 }}>{c.sector}</div>
                    {c.verified && <Badge label="✓ Vérifié" color={C.green} />}
                    <div style={{ color:C.accent, fontSize:11, marginTop:6 }}>{c.offers} offre{c.offers>1?"s":""}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offers list */}
            <h4 style={{ color:C.sub, fontSize:11, letterSpacing:.8, textTransform:"uppercase", marginBottom:10 }}>Toutes les offres ({MOCK_INTERNSHIPS.length})</h4>
            {MOCK_INTERNSHIPS.map(j=>(
              <div key={j.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px", marginBottom:12, animation:"fadeUp .3s ease" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ color:C.text, fontWeight:900, fontSize:15, marginBottom:3 }}>{j.role}</div>
                    <div style={{ color:C.sub, fontSize:12 }}>{j.company}</div>
                  </div>
                  <Badge label={`${j.match}%`} color={j.match>90?C.green:j.match>80?C.accent:C.blue} />
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
                  {[["📍",j.location],["⏱️",j.duration],["💰",j.salary],["⏰",j.deadline]].map(([i,v],idx)=>(
                    <span key={idx} style={{ background:C.surface, borderRadius:6, padding:"3px 8px", fontSize:11, color:C.sub, display:"flex", gap:4, alignItems:"center" }}>{i} {v}</span>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn onClick={()=>{ if(!appliedIds.includes(j.id)) setApplyModal(j); }} variant={appliedIds.includes(j.id)?"secondary":"primary"} style={{ flex:1, fontSize:13, padding:"10px" }}>
                    {appliedIds.includes(j.id)?"✅ Candidature envoyée":"Postuler maintenant"}
                  </Btn>
                  <Btn variant="ghost" style={{ padding:"10px 14px", fontSize:13 }}>🔖</Btn>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── AI ── */}
        {page==="ai" && (
          <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 112px)" }}>
            <div style={{ background:C.card, borderBottom:`1px solid ${C.border}`, padding:"12px 16px", display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ width:36, height:36, borderRadius:10, background:C.accentDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🤖</div>
              <div>
                <div style={{ color:C.text, fontWeight:700, fontSize:14 }}>Assistant IA AfriLearn</div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}><Dot size={6} /><span style={{ color:C.green, fontSize:11 }}>Prêt · Contexte africain</span></div>
              </div>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"16px 14px 10px" }}>
              {aiMessages.map((m,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:12 }}>
                  {m.role==="assistant" && <div style={{ width:30, height:30, borderRadius:8, background:C.accentDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, marginRight:8, flexShrink:0, marginTop:2 }}>🤖</div>}
                  <div style={{ maxWidth:"78%", background:m.role==="user"?C.accent:C.card, color:m.role==="user"?"#07090F":C.text, borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px", padding:"11px 13px", fontSize:13, lineHeight:1.6, border:m.role==="assistant"?`1px solid ${C.border}`:"none", whiteSpace:"pre-wrap" }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:C.accentDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🤖</div>
                  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:"14px 14px 14px 4px", padding:"12px 14px", display:"flex", gap:4 }}>
                    {[0,1,2].map(i=><div key={i} style={{ width:6, height:6, borderRadius:"50%", background:C.accent, animation:`bounce 1.2s ${i*.2}s infinite` }} />)}
                  </div>
                </div>
              )}
              {aiMessages.length===1 && (
                <div style={{ marginTop:10 }}>
                  <div style={{ color:C.muted, fontSize:12, marginBottom:10, textAlign:"center" }}>Suggestions</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:7, justifyContent:"center" }}>
                    {["Explique-moi le droit OHADA","Aide-moi à résumer un cours","Comment faire un business plan ?","Prépare-moi pour un entretien"].map((s,i)=>(
                      <button key={i} onClick={()=>setAiInput(s)} style={{ background:C.blueDim, border:`1px solid ${C.blue}44`, color:C.text, borderRadius:20, padding:"6px 12px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={aiBottom} />
            </div>
            <div style={{ padding:"10px 14px 14px", background:C.card, borderTop:`1px solid ${C.border}`, display:"flex", gap:8 }}>
              <textarea value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendAI(); }}} placeholder="Pose ta question..." style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"9px 12px", color:C.text, fontSize:13, resize:"none", outline:"none", fontFamily:"inherit", minHeight:40, maxHeight:90 }} rows={1} />
              <button onClick={sendAI} disabled={!aiInput.trim()||aiLoading} style={{ width:40, height:40, borderRadius:10, background:aiInput.trim()?C.accent:C.border, border:"none", cursor:aiInput.trim()?"pointer":"default", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>➤</button>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", padding:"8px 0 14px", zIndex:50 }}>
        {STUDENT_NAV.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <span style={{ fontSize:19, filter:page===n.id?"none":"grayscale(1) opacity(.45)", transform:page===n.id?"scale(1.1)":"scale(1)", transition:"all .15s", display:"block" }}>{n.icon}</span>
            <span style={{ fontSize:9, color:page===n.id?C.accent:C.muted, transition:"color .15s", fontFamily:"inherit" }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── COMPANY APP ────────────────────────────────────────────── */
const MOCK_APPLICATIONS = [
  { id:1, name:"Kofi Asante", field:"Droit", uni:"UAC Cotonou", role:"Juriste Stagiaire", date:"28 Mai 2026", status:"pending", score:94, avatar:"K", color:C.blue },
  { id:2, name:"Aminata Diallo", field:"Finance", uni:"UCAD Dakar", role:"Analyste Junior", date:"27 Mai 2026", status:"reviewed", score:91, avatar:"A", color:C.purple },
  { id:3, name:"Seydou Traoré", field:"Informatique", uni:"USTTB Bamako", role:"Dev Frontend", date:"26 Mai 2026", status:"accepted", score:97, avatar:"S", color:C.green },
  { id:4, name:"Fatou Camara", field:"Marketing", uni:"UASZ Ziguinchor", role:"Assistant Marketing", date:"25 Mai 2026", status:"pending", score:83, avatar:"F", color:C.accent },
];

const COMP_NAV = [
  { id:"dashboard", icon:"📊", label:"Dashboard" },
  { id:"offers", icon:"📋", label:"Offres" },
  { id:"applications", icon:"👥", label:"Candidatures" },
  { id:"profile", icon:"🏢", label:"Profil" },
];

function CompanyApp({ user }) {
  const [page, setPage] = useState("dashboard");
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [offers, setOffers] = useState([
    { id:1, role:"Développeur Web Frontend", field:"Informatique", type:"Stage", duration:"3 mois", location:"Cotonou", salary:"Indemnisé", deadline:"15 Juin 2026", active:true, applicants:12 },
    { id:2, role:"Analyste Financier Junior", field:"Finance", type:"Stage", duration:"6 mois", location:"Lomé", salary:"Indemnisé", deadline:"30 Juin 2026", active:true, applicants:8 },
  ]);
  const [showNewOffer, setShowNewOffer] = useState(false);
  const [newOffer, setNewOffer] = useState({ role:"", field:"", type:"Stage", duration:"", location:"", salary:"", deadline:"", description:"" });
  const setO = (k,v) => setNewOffer(f=>({...f,[k]:v}));
  const publishOffer = () => {
    if(!newOffer.role) return;
    setOffers(p=>[...p, { id:Date.now(), ...newOffer, active:true, applicants:0 }]);
    setNewOffer({ role:"", field:"", type:"Stage", duration:"", location:"", salary:"", deadline:"", description:"" });
    setShowNewOffer(false);
  };
  const updateStatus = (id, status) => setApplications(p=>p.map(a=>a.id===id?{...a,status}:a));

  const statusColor = { pending:C.accent, reviewed:C.blue, accepted:C.green, rejected:C.red };
  const statusLabel = { pending:"En attente", reviewed:"Examinée", accepted:"Acceptée", rejected:"Refusée" };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", maxWidth:430, margin:"0 auto", fontFamily:"Georgia, serif", overflowX:"hidden" }}>
      <style>{`* { box-sizing:border-box; margin:0; padding:0; } ::-webkit-scrollbar { display:none; } textarea::placeholder, input::placeholder { color:${C.muted}; } @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* New Offer Modal */}
      {showNewOffer && (
        <div style={{ position:"fixed", inset:0, background:"#000000CC", zIndex:999, display:"flex", alignItems:"flex-end" }}>
          <div style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:"24px 20px 40px", width:"100%", maxWidth:430, margin:"0 auto", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
              <h3 style={{ color:C.text, fontSize:17, fontWeight:900 }}>Nouvelle offre</h3>
              <button onClick={()=>setShowNewOffer(false)} style={{ background:"none", border:"none", color:C.sub, fontSize:20, cursor:"pointer" }}>✕</button>
            </div>
            <Input label="Intitulé du poste" placeholder="Ex: Développeur Mobile" value={newOffer.role} onChange={e=>setO("role",e.target.value)} />
            <Input label="Domaine / Filière ciblée" placeholder="Ex: Informatique, Droit, Finance..." value={newOffer.field} onChange={e=>setO("field",e.target.value)} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div>
                <label style={{ display:"block", color:C.sub, fontSize:11, letterSpacing:.8, marginBottom:6, textTransform:"uppercase" }}>Type</label>
                <select value={newOffer.type} onChange={e=>setO("type",e.target.value)} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 14px", color:C.text, fontSize:14, outline:"none", fontFamily:"inherit" }}>
                  <option>Stage</option><option>Emploi</option><option>Alternance</option>
                </select>
              </div>
              <Input label="Durée" placeholder="Ex: 3 mois" value={newOffer.duration} onChange={e=>setO("duration",e.target.value)} />
            </div>
            <Input label="Ville / Pays" placeholder="Ex: Cotonou, Bénin" value={newOffer.location} onChange={e=>setO("location",e.target.value)} />
            <Input label="Rémunération" placeholder="Ex: Indemnisé, 80 000 FCFA..." value={newOffer.salary} onChange={e=>setO("salary",e.target.value)} />
            <Input label="Date limite de candidature" placeholder="JJ/MM/AAAA" value={newOffer.deadline} onChange={e=>setO("deadline",e.target.value)} />
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", color:C.sub, fontSize:11, letterSpacing:.8, marginBottom:6, textTransform:"uppercase" }}>Description du poste</label>
              <textarea value={newOffer.description} onChange={e=>setO("description",e.target.value)} placeholder="Missions, profil recherché, compétences requises..." style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 14px", color:C.text, fontSize:13, resize:"none", outline:"none", fontFamily:"inherit", minHeight:80 }} rows={3} />
            </div>
            <Btn full onClick={publishOffer} disabled={!newOffer.role}>Publier l'offre →</Btn>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"13px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:7, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🎓</div>
          <span style={{ color:C.text, fontWeight:900, fontSize:18, letterSpacing:-0.5 }}>Afri<span style={{ color:C.accent }}>Learn</span> <span style={{ color:C.green, fontSize:12, fontWeight:400 }}>Entreprise</span></span>
        </div>
        <Badge label="✓ Vérifié" color={C.green} />
      </div>

      <div style={{ paddingBottom:72, overflowY:"auto" }}>

        {/* ── DASHBOARD ── */}
        {page==="dashboard" && (
          <div style={{ padding:"16px" }}>
            <div style={{ background:`linear-gradient(135deg, #07090F, #0D1520)`, borderRadius:16, padding:"20px", marginBottom:18, position:"relative", overflow:"hidden", border:`1px solid ${C.border}` }}>
              <div style={{ position:"absolute", top:-40, right:-40, width:130, height:130, borderRadius:"50%", background:`radial-gradient(${C.greenDim},transparent 70%)` }} />
              <div style={{ fontSize:10, color:C.muted, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Bienvenue</div>
              <h2 style={{ color:C.text, fontSize:20, fontWeight:900, marginBottom:4 }}>{user.name}</h2>
              <div style={{ display:"flex", gap:6 }}>
                <Badge label="Entreprise vérifiée ✓" color={C.green} />
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
              {[
                { icon:"📋", val:offers.length, label:"Offres actives", color:C.accent },
                { icon:"👥", val:applications.length, label:"Candidatures", color:C.blue },
                { icon:"⏳", val:applications.filter(a=>a.status==="pending").length, label:"En attente", color:C.purple },
                { icon:"✅", val:applications.filter(a=>a.status==="accepted").length, label:"Acceptées", color:C.green },
              ].map((s,i)=>(
                <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 12px", borderTop:`3px solid ${s.color}` }}>
                  <div style={{ fontSize:20, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ color:s.color, fontSize:22, fontWeight:900 }}>{s.val}</div>
                  <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <h3 style={{ color:C.text, fontSize:15, fontWeight:700, marginBottom:12 }}>Candidatures récentes</h3>
            {applications.slice(0,3).map(a=>(
              <div key={a.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"13px", marginBottom:8, display:"flex", gap:10, alignItems:"center" }}>
                <Avatar name={a.avatar} size={38} color={a.color} />
                <div style={{ flex:1 }}>
                  <div style={{ color:C.text, fontSize:13, fontWeight:700 }}>{a.name}</div>
                  <div style={{ color:C.sub, fontSize:11 }}>{a.field} · {a.uni}</div>
                </div>
                <Badge label={statusLabel[a.status]} color={statusColor[a.status]} />
              </div>
            ))}
            <Btn variant="ghost" full onClick={()=>setPage("applications")} style={{ marginTop:8, fontSize:13 }}>Voir toutes les candidatures →</Btn>
          </div>
        )}

        {/* ── OFFERS ── */}
        {page==="offers" && (
          <div style={{ padding:"16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h3 style={{ color:C.text, fontSize:18, fontWeight:900 }}>Mes offres</h3>
              <Btn onClick={()=>setShowNewOffer(true)} style={{ fontSize:12, padding:"8px 14px" }}>+ Publier</Btn>
            </div>
            {offers.map(o=>(
              <div key={o.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px", marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <div>
                    <div style={{ color:C.text, fontWeight:900, fontSize:15 }}>{o.role}</div>
                    <div style={{ color:C.sub, fontSize:12, marginTop:2 }}>{o.field} · {o.location}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <Badge label={o.active?"Active":"Inactive"} color={o.active?C.green:C.muted} />
                    <div style={{ color:C.accent, fontSize:13, fontWeight:700, marginTop:6 }}>{o.applicants} candidat{o.applicants>1?"s":""}</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                  {[["⏱️",o.duration],["💰",o.salary],["⏰",o.deadline]].map(([i,v],idx)=>(
                    <span key={idx} style={{ background:C.surface, borderRadius:6, padding:"3px 8px", fontSize:11, color:C.sub }}>{i} {v}</span>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn variant="secondary" style={{ flex:1, fontSize:12, padding:"9px" }} onClick={()=>setPage("applications")}>Voir candidatures</Btn>
                  <Btn variant="ghost" style={{ fontSize:12, padding:"9px 12px" }}>✏️</Btn>
                  <Btn variant="danger" style={{ fontSize:12, padding:"9px 12px" }}>🗑️</Btn>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── APPLICATIONS ── */}
        {page==="applications" && (
          <div style={{ padding:"16px" }}>
            <h3 style={{ color:C.text, fontSize:18, fontWeight:900, marginBottom:6 }}>Candidatures reçues</h3>
            <p style={{ color:C.sub, fontSize:12, marginBottom:14 }}>Score IA basé sur l'adéquation profil/poste</p>
            <div style={{ display:"flex", gap:7, overflowX:"auto", marginBottom:16, paddingBottom:4 }}>
              {["Toutes","En attente","Examinées","Acceptées"].map(f=>(
                <Pill key={f} label={f} active={activeFilter===f} onClick={()=>setActiveFilter(f)} />
              ))}
            </div>
            {applications.map(a=>(
              <div key={a.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px", marginBottom:12, animation:"fadeUp .3s ease" }}>
                <div style={{ display:"flex", gap:10, marginBottom:12, alignItems:"center" }}>
                  <Avatar name={a.avatar} size={44} color={a.color} />
                  <div style={{ flex:1 }}>
                    <div style={{ color:C.text, fontWeight:900, fontSize:15 }}>{a.name}</div>
                    <div style={{ color:C.sub, fontSize:12 }}>{a.field} · {a.uni}</div>
                    <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>Pour : {a.role} · {a.date}</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ color:a.score>90?C.green:C.accent, fontWeight:900, fontSize:18 }}>{a.score}</div>
                    <div style={{ color:C.muted, fontSize:9 }}>score IA</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:7, marginBottom:10 }}>
                  <span style={{ background:`${statusColor[a.status]}22`, color:statusColor[a.status], border:`1px solid ${statusColor[a.status]}44`, borderRadius:6, padding:"3px 8px", fontSize:11, fontWeight:700 }}>{statusLabel[a.status]}</span>
                </div>
                <div style={{ display:"flex", gap:7 }}>
                  <Btn onClick={()=>updateStatus(a.id,"accepted")} style={{ flex:1, background:C.greenDim, color:C.green, fontSize:12, padding:"8px" }}>✅ Accepter</Btn>
                  <Btn onClick={()=>updateStatus(a.id,"reviewed")} variant="secondary" style={{ flex:1, fontSize:12, padding:"8px" }}>👁️ Examiner</Btn>
                  <Btn onClick={()=>updateStatus(a.id,"rejected")} style={{ background:C.redDim, color:C.red, border:"none", fontSize:12, padding:"8px 12px", borderRadius:11, cursor:"pointer" }}>✕</Btn>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PROFILE ── */}
        {page==="profile" && (
          <div style={{ padding:"16px" }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px", marginBottom:16, textAlign:"center" }}>
              <div style={{ width:60, height:60, borderRadius:16, background:C.greenDim, border:`2px solid ${C.green}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 12px" }}>🏢</div>
              <h3 style={{ color:C.text, fontSize:18, fontWeight:900, marginBottom:4 }}>{user.name}</h3>
              <Badge label="✓ Entreprise vérifiée" color={C.green} />
              <div style={{ color:C.sub, fontSize:12, marginTop:8 }}>Membre depuis Mai 2026</div>
            </div>
            {[
              { icon:"📊", label:"Statistiques détaillées", arrow:true },
              { icon:"🔔", label:"Notifications", arrow:true },
              { icon:"🔒", label:"Sécurité du compte", arrow:true },
              { icon:"💳", label:"Abonnement & Facturation", arrow:true },
              { icon:"🤝", label:"Partenariat AfriLearn", arrow:true },
              { icon:"📞", label:"Support", arrow:true },
            ].map((item,i)=>(
              <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", marginBottom:8, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
                <span style={{ fontSize:18 }}>{item.icon}</span>
                <span style={{ flex:1, color:C.text, fontSize:14 }}>{item.label}</span>
                {item.arrow && <span style={{ color:C.muted }}>›</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", padding:"8px 0 14px", zIndex:50 }}>
        {COMP_NAV.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <span style={{ fontSize:19, filter:page===n.id?"none":"grayscale(1) opacity(.45)", transition:"all .15s" }}>{n.icon}</span>
            <span style={{ fontSize:9, color:page===n.id?C.accent:C.muted, transition:"color .15s", fontFamily:"inherit" }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────── */
export default function AfriLearnMain() {
  const [user, setUser] = useState(null);
  if(!user) return <Onboarding onDone={setUser} />;
  if(user.type==="company") return <CompanyApp user={user} />;
  return <StudentApp user={user} />;
}
