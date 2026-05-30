import { useState } from "react";

/* ── TOKENS ── */
const C = {
  bg:       "#050709",
  surface:  "#0A0D12",
  card:     "#0F1318",
  border:   "#181E2A",
  border2:  "#1E2736",
  accent:   "#F6A732",
  accentDim:"#F6A73218",
  green:    "#00C97A",
  greenDim: "#00C97A18",
  blue:     "#4A8FF5",
  blueDim:  "#4A8FF518",
  red:      "#F0485A",
  redDim:   "#F0485A18",
  yellow:   "#F5C518",
  yellowDim:"#F5C51818",
  purple:   "#9B72F8",
  purpleDim:"#9B72F818",
  text:     "#E8EDF8",
  sub:      "#7A8BA8",
  muted:    "#3D4D63",
};

/* ── MICRO COMPONENTS ── */
const Tag = ({ label, color=C.accent }) => (
  <span style={{ background:`${color}22`, color, border:`1px solid ${color}33`, borderRadius:5, padding:"2px 8px", fontSize:10, fontWeight:700, letterSpacing:.5, whiteSpace:"nowrap" }}>{label}</span>
);

const Stat = ({ icon, value, label, color=C.accent, delta }) => (
  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 14px", borderTop:`3px solid ${color}` }}>
    <div style={{ fontSize:20, marginBottom:8 }}>{icon}</div>
    <div style={{ color, fontSize:24, fontWeight:900, letterSpacing:-1 }}>{value}</div>
    <div style={{ color:C.sub, fontSize:11, marginTop:3 }}>{label}</div>
    {delta && <div style={{ color:delta>0?C.green:C.red, fontSize:10, marginTop:4 }}>{delta>0?"↑":"↓"} {Math.abs(delta)}% ce mois</div>}
  </div>
);

const Avatar = ({ name="?", size=36, color=C.blue }) => (
  <div style={{ width:size, height:size, borderRadius:size*.28, background:`${color}25`, color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:size*.4, flexShrink:0, border:`1.5px solid ${color}40` }}>
    {name[0].toUpperCase()}
  </div>
);

const Btn = ({ children, onClick, color=C.accent, bg, small, danger, ghost }) => (
  <button onClick={onClick} style={{
    background: danger?C.red : ghost?"transparent" : bg||color,
    color: ghost?C.sub : danger?"#fff" : "#050709",
    border: ghost?`1px solid ${C.border}`:"none",
    borderRadius:9, padding: small?"5px 12px":"9px 16px",
    fontSize: small?11:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
    whiteSpace:"nowrap",
  }}>{children}</button>
);

const Modal = ({ title, children, onClose }) => (
  <div style={{ position:"fixed", inset:0, background:"#000000DD", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
    <div style={{ background:C.card, border:`1px solid ${C.border2}`, borderRadius:18, padding:"22px 20px", width:"100%", maxWidth:420, maxHeight:"85vh", overflowY:"auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <h3 style={{ color:C.text, fontSize:16, fontWeight:900 }}>{title}</h3>
        <button onClick={onClose} style={{ background:"none", border:"none", color:C.sub, fontSize:22, cursor:"pointer", lineHeight:1 }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

/* ── MOCK DATA ── */
const MOCK_USERS = [
  { id:1, name:"Kofi Asante", email:"kofi@mail.com", type:"student", status:"active", joined:"12 Mai 2026", country:"Bénin", field:"Droit", reports:0, verified:true },
  { id:2, name:"Aminata Diallo", email:"aminata@mail.com", type:"student", status:"active", joined:"10 Mai 2026", country:"Sénégal", field:"Économie", reports:0, verified:true },
  { id:3, name:"Orange Digital Center", email:"rh@orange.bj", type:"company", status:"active", joined:"5 Mai 2026", country:"Bénin", field:"Tech", reports:0, verified:true },
  { id:4, name:"Seydou Traoré", email:"seydou@mail.com", type:"student", status:"suspended", joined:"8 Mai 2026", country:"Mali", field:"Informatique", reports:3, verified:true },
  { id:5, name:"Global Fake Corp", email:"fake@corp.com", type:"company", status:"pending", joined:"29 Mai 2026", country:"Inconnu", field:"Inconnu", reports:5, verified:false },
  { id:6, name:"Fatou Camara", email:"fatou@mail.com", type:"student", status:"pending_verification", joined:"30 Mai 2026", country:"Sénégal", field:"Médecine", reports:0, verified:false },
];

const MOCK_COMPLAINTS = [
  { id:1, from:"Kofi A.", against:"Seydou T.", type:"Contenu inapproprié", date:"28 Mai 2026", status:"open", desc:"Publication d'un contenu trompeur sur les cours.", priority:"high" },
  { id:2, from:"Aminata D.", against:"Global Fake Corp", type:"Fausse offre de stage", date:"29 Mai 2026", status:"open", desc:"Cette entreprise demande de l'argent aux candidats.", priority:"critical" },
  { id:3, from:"Système", against:"Seydou T.", type:"Spam détecté", date:"27 Mai 2026", status:"resolved", desc:"Envoi massif de messages privés non sollicités.", priority:"medium" },
  { id:4, from:"Support auto", against:"Global Fake Corp", type:"Document falsifié", date:"30 Mai 2026", status:"open", desc:"RCCM soumis ne correspond pas à une entreprise réelle.", priority:"critical" },
];

const MOCK_VERIF = [
  { id:1, name:"Fatou Camara", type:"student", docs:["Carte étudiant","Selfie CNI"], submitted:"30 Mai 2026", status:"pending" },
  { id:2, name:"Africa Agri Tech", type:"company", docs:["RCCM","Logo"], submitted:"29 Mai 2026", status:"pending" },
  { id:3, name:"Luc Mensah", type:"student", docs:["Fiche préinscription","Selfie CNI"], submitted:"28 Mai 2026", status:"pending" },
];

const MOCK_UPDATES = [
  { id:1, version:"v1.2.0", title:"Amélioration messagerie", desc:"Chiffrement renforcé, envoi vidéos jusqu'à 50MB", date:"25 Mai 2026", status:"deployed" },
  { id:2, version:"v1.3.0", title:"Nouveau module Entrepreneur", desc:"Business plan IA + mise en relation investisseurs", date:"—", status:"draft" },
  { id:3, version:"v1.4.0", title:"Mode hors-ligne", desc:"Accès aux cours téléchargés sans connexion internet", date:"—", status:"planned" },
];

const MOCK_REVENUE = [
  { month:"Jan", amount:0 },{ month:"Fév", amount:0 },{ month:"Mar", amount:120000 },
  { month:"Avr", amount:340000 },{ month:"Mai", amount:780000 },
];

/* ── SECTIONS ── */
function Overview() {
  return (
    <div style={{ padding:"0 0 20px" }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg, #050709 0%, #0A1020 100%)`, padding:"24px 18px 20px", position:"relative", overflow:"hidden", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle, ${C.accentDim}, transparent 70%)` }} />
        <div style={{ position:"absolute", bottom:-40, left:-40, width:140, height:140, borderRadius:"50%", background:`radial-gradient(circle, ${C.blueDim}, transparent 70%)` }} />
        <div style={{ position:"relative" }}>
          <div style={{ display:"inline-flex", gap:6, alignItems:"center", background:C.accentDim, border:`1px solid ${C.accent}33`, borderRadius:20, padding:"3px 12px", marginBottom:14 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:C.green, display:"inline-block" }} />
            <span style={{ color:C.accent, fontSize:11, fontWeight:700, letterSpacing:.8 }}>PANNEAU FONDATEUR · ACCÈS TOTAL</span>
          </div>
          <h1 style={{ color:C.text, fontSize:26, fontWeight:900, letterSpacing:-1, marginBottom:4 }}>Bonjour, Thomas 👑</h1>
          <p style={{ color:C.sub, fontSize:13 }}>AfriLearn est <span style={{ color:C.green, fontWeight:700 }}>en ligne</span> · 30 Mai 2026 · 14:32</p>
        </div>
      </div>

      <div style={{ padding:"18px 16px 0" }}>
        {/* KPI Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          <Stat icon="🎓" value="12,847" label="Étudiants inscrits" color={C.blue} delta={18} />
          <Stat icon="🏢" value="213" label="Entreprises" color={C.green} delta={9} />
          <Stat icon="💼" value="1,204" label="Candidatures" color={C.accent} delta={31} />
          <Stat icon="💰" value="780K" label="FCFA ce mois" color={C.purple} delta={129} />
        </div>

        {/* Revenue mini chart */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div>
              <div style={{ color:C.text, fontWeight:700, fontSize:14 }}>Revenus mensuels</div>
              <div style={{ color:C.sub, fontSize:11 }}>Abonnements + Offres entreprises</div>
            </div>
            <Tag label="+129% MoM" color={C.green} />
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:60 }}>
            {MOCK_REVENUE.map((r,i)=>{
              const max = Math.max(...MOCK_REVENUE.map(x=>x.amount))||1;
              const h = r.amount ? Math.max(6, (r.amount/max)*54) : 4;
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ width:"100%", height:h, borderRadius:4, background: i===MOCK_REVENUE.length-1?C.accent:`${C.accent}44`, transition:"height .3s" }} />
                  <div style={{ color:C.muted, fontSize:9 }}>{r.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts */}
        <div style={{ background:C.redDim, border:`1px solid ${C.red}33`, borderRadius:12, padding:"12px 14px", marginBottom:10, display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ fontSize:16 }}>🚨</span>
          <div>
            <div style={{ color:C.red, fontWeight:700, fontSize:13 }}>2 plaintes critiques en attente</div>
            <div style={{ color:C.sub, fontSize:11, marginTop:2 }}>Fausse entreprise détectée + document falsifié</div>
          </div>
        </div>
        <div style={{ background:C.yellowDim, border:`1px solid ${C.yellow}33`, borderRadius:12, padding:"12px 14px", marginBottom:10, display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ fontSize:16 }}>⏳</span>
          <div>
            <div style={{ color:C.yellow, fontWeight:700, fontSize:13 }}>3 vérifications en attente</div>
            <div style={{ color:C.sub, fontSize:11, marginTop:2 }}>Nouveaux comptes à valider</div>
          </div>
        </div>
        <div style={{ background:C.greenDim, border:`1px solid ${C.green}33`, borderRadius:12, padding:"12px 14px", marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ fontSize:16 }}>✅</span>
          <div>
            <div style={{ color:C.green, fontWeight:700, fontSize:13 }}>Serveurs opérationnels à 99.8%</div>
            <div style={{ color:C.sub, fontSize:11, marginTop:2 }}>Uptime ce mois · 0 incident majeur</div>
          </div>
        </div>

        {/* Quick actions */}
        <h3 style={{ color:C.sub, fontSize:11, letterSpacing:.8, textTransform:"uppercase", marginBottom:10 }}>Actions rapides</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[
            { icon:"🔔", label:"Envoyer une notif globale", color:C.blue },
            { icon:"📢", label:"Publier une annonce", color:C.purple },
            { icon:"🛠️", label:"Mode maintenance", color:C.yellow },
            { icon:"📊", label:"Export rapport PDF", color:C.green },
          ].map((a,i)=>(
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"13px 12px", cursor:"pointer", display:"flex", gap:10, alignItems:"center" }}>
              <span style={{ fontSize:20 }}>{a.icon}</span>
              <span style={{ color:C.text, fontSize:12, fontWeight:600, lineHeight:1.3 }}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersSection() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [filter, setFilter] = useState("Tous");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // {user, action}

  const statusColor = { active:C.green, suspended:C.red, pending:C.yellow, pending_verification:C.blue };
  const statusLabel = { active:"Actif", suspended:"Suspendu", pending:"En attente", pending_verification:"Vérif. en cours" };

  const filtered = users.filter(u => {
    if(filter==="Étudiants") return u.type==="student";
    if(filter==="Entreprises") return u.type==="company";
    if(filter==="Suspendus") return u.status==="suspended";
    if(filter==="En attente") return u.status==="pending"||u.status==="pending_verification";
    return true;
  }).filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const doAction = (userId, action) => {
    setUsers(prev => prev.map(u => u.id===userId ? {
      ...u,
      status: action==="suspend" ? "suspended" : action==="activate" ? "active" : u.status,
      verified: action==="verify" ? true : action==="ban" ? false : u.verified,
    } : u));
    setModal(null);
  };

  return (
    <div style={{ padding:"14px" }}>
      {modal && (
        <Modal title={`${modal.action==="suspend"?"Suspendre":modal.action==="ban"?"Bannir":modal.action==="activate"?"Réactiver":"Vérifier"} ce compte`} onClose={()=>setModal(null)}>
          <div style={{ background:C.surface, borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
            <div style={{ color:C.text, fontWeight:700 }}>{modal.user.name}</div>
            <div style={{ color:C.sub, fontSize:12 }}>{modal.user.email} · {modal.user.type==="student"?"Étudiant":"Entreprise"}</div>
          </div>
          {modal.action==="suspend" && <>
            <label style={{ color:C.sub, fontSize:11, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:.8 }}>Raison de la suspension</label>
            <select style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 12px", color:C.text, fontSize:13, outline:"none", fontFamily:"inherit", marginBottom:14 }}>
              <option>Violation des CGU</option>
              <option>Contenu inapproprié</option>
              <option>Faux documents</option>
              <option>Spam / Arnaque</option>
              <option>Plaintes multiples</option>
            </select>
            <label style={{ color:C.sub, fontSize:11, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:.8 }}>Durée</label>
            <select style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 12px", color:C.text, fontSize:13, outline:"none", fontFamily:"inherit", marginBottom:16 }}>
              <option>7 jours</option><option>30 jours</option><option>90 jours</option><option>Permanente</option>
            </select>
          </>}
          {modal.action==="ban" && <p style={{ color:C.red, fontSize:13, lineHeight:1.6, marginBottom:16 }}>⚠️ Cette action est irréversible. Le compte sera définitivement supprimé et l'email blacklisté.</p>}
          {modal.action==="activate" && <p style={{ color:C.green, fontSize:13, lineHeight:1.6, marginBottom:16 }}>Le compte sera réactivé et l'utilisateur pourra se reconnecter immédiatement.</p>}
          {modal.action==="verify" && <p style={{ color:C.blue, fontSize:13, lineHeight:1.6, marginBottom:16 }}>Vous confirmez avoir vérifié manuellement les documents de cet utilisateur.</p>}
          <div style={{ display:"flex", gap:8 }}>
            <Btn onClick={()=>doAction(modal.user.id, modal.action)} color={modal.action==="ban"?C.red:modal.action==="suspend"?C.yellow:modal.action==="verify"?C.blue:C.green} bg={modal.action==="ban"?C.red:modal.action==="suspend"?C.yellow:modal.action==="verify"?C.blue:C.green}>
              {modal.action==="suspend"?"Suspendre":modal.action==="ban"?"Bannir définitivement":modal.action==="activate"?"Réactiver":"Valider"}
            </Btn>
            <Btn ghost onClick={()=>setModal(null)}>Annuler</Btn>
          </div>
        </Modal>
      )}

      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <div style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:9, padding:"8px 12px", display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ color:C.muted }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{ flex:1, background:"transparent", border:"none", color:C.text, fontSize:13, outline:"none", fontFamily:"inherit" }} />
        </div>
      </div>

      <div style={{ display:"flex", gap:7, overflowX:"auto", marginBottom:14, paddingBottom:4 }}>
        {["Tous","Étudiants","Entreprises","Suspendus","En attente"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ background:filter===f?C.accent:C.card, color:filter===f?"#050709":C.sub, border:`1px solid ${filter===f?C.accent:C.border}`, borderRadius:20, padding:"5px 13px", fontSize:11, cursor:"pointer", whiteSpace:"nowrap", fontWeight:filter===f?700:400, fontFamily:"inherit" }}>{f}</button>
        ))}
      </div>

      <div style={{ color:C.muted, fontSize:11, marginBottom:10 }}>{filtered.length} résultat{filtered.length>1?"s":""}</div>

      {filtered.map(u=>(
        <div key={u.id} style={{ background:C.card, border:`1px solid ${selected===u.id?C.accent:C.border}`, borderRadius:13, padding:"13px", marginBottom:9, cursor:"pointer" }} onClick={()=>setSelected(selected===u.id?null:u.id)}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <Avatar name={u.name[0]} size={40} color={u.type==="company"?C.green:C.blue} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                <span style={{ color:C.text, fontWeight:700, fontSize:14 }}>{u.name}</span>
                {u.verified && <Tag label="✓ Vérifié" color={C.green} />}
                {u.reports>0 && <Tag label={`${u.reports} signalement${u.reports>1?"s":""}`} color={C.red} />}
              </div>
              <div style={{ color:C.sub, fontSize:11, marginTop:2 }}>{u.email} · {u.country}</div>
              <div style={{ display:"flex", gap:6, marginTop:4, alignItems:"center" }}>
                <Tag label={u.type==="student"?"Étudiant":"Entreprise"} color={u.type==="company"?C.green:C.blue} />
                <Tag label={statusLabel[u.status]} color={statusColor[u.status]} />
              </div>
            </div>
            <span style={{ color:C.muted, fontSize:16 }}>{selected===u.id?"▲":"▼"}</span>
          </div>

          {selected===u.id && (
            <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:12 }}>
                {[["📅 Inscrit",u.joined],["🌍 Pays",u.country],["📚 Domaine",u.field],["🆔 ID",`#${u.id.toString().padStart(5,"0")}`]].map(([k,v],i)=>(
                  <div key={i} style={{ background:C.surface, borderRadius:8, padding:"8px 10px" }}>
                    <div style={{ color:C.muted, fontSize:10 }}>{k}</div>
                    <div style={{ color:C.text, fontSize:12, fontWeight:600 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                {u.status==="active" && <Btn small onClick={()=>setModal({user:u,action:"suspend"})} color={C.yellow} bg={C.yellow}>⏸ Suspendre</Btn>}
                {u.status==="suspended" && <Btn small onClick={()=>setModal({user:u,action:"activate"})} color={C.green} bg={C.green}>▶ Réactiver</Btn>}
                {!u.verified && <Btn small onClick={()=>setModal({user:u,action:"verify"})} color={C.blue} bg={C.blue}>✓ Valider</Btn>}
                <Btn small ghost onClick={()=>alert("Message envoyé à "+u.name)}>✉ Contacter</Btn>
                <Btn small danger onClick={()=>setModal({user:u,action:"ban"})}>🚫 Bannir</Btn>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ComplaintsSection() {
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [filter, setFilter] = useState("Toutes");

  const priorityColor = { critical:C.red, high:C.yellow, medium:C.blue };
  const filtered = complaints.filter(c => filter==="Toutes" ? true : filter==="Ouvertes" ? c.status==="open" : c.status==="resolved");

  const resolve = (id) => setComplaints(p=>p.map(c=>c.id===id?{...c,status:"resolved"}:c));

  return (
    <div style={{ padding:"14px" }}>
      <div style={{ display:"flex", gap:7, marginBottom:14 }}>
        {["Toutes","Ouvertes","Résolues"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ background:filter===f?C.accent:C.card, color:filter===f?"#050709":C.sub, border:`1px solid ${filter===f?C.accent:C.border}`, borderRadius:20, padding:"5px 13px", fontSize:11, cursor:"pointer", fontWeight:filter===f?700:400, fontFamily:"inherit" }}>{f}</button>
        ))}
      </div>

      {filtered.map(c=>(
        <div key={c.id} style={{ background:C.card, border:`1px solid ${c.status==="open"&&c.priority==="critical"?C.red:C.border}`, borderRadius:13, padding:"14px", marginBottom:10, borderLeft:`4px solid ${priorityColor[c.priority]}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", gap:6, marginBottom:5, flexWrap:"wrap" }}>
                <Tag label={c.priority==="critical"?"🚨 CRITIQUE":c.priority==="high"?"⚠️ Haute":"📋 Normale"} color={priorityColor[c.priority]} />
                <Tag label={c.status==="open"?"Ouvert":"Résolu"} color={c.status==="open"?C.red:C.green} />
              </div>
              <div style={{ color:C.text, fontWeight:700, fontSize:14 }}>{c.type}</div>
              <div style={{ color:C.sub, fontSize:11, marginTop:2 }}>De : {c.from} → Contre : <span style={{ color:C.red }}>{c.against}</span></div>
            </div>
            <span style={{ color:C.muted, fontSize:10, marginLeft:8, whiteSpace:"nowrap" }}>{c.date}</span>
          </div>
          <p style={{ color:C.sub, fontSize:12, lineHeight:1.5, marginBottom:12 }}>{c.desc}</p>
          {c.status==="open" && (
            <div style={{ display:"flex", gap:7 }}>
              <Btn small color={C.green} bg={C.green} onClick={()=>resolve(c.id)}>✅ Résoudre</Btn>
              <Btn small color={C.red} bg={C.red} onClick={()=>alert("Action de sanction lancée")}>🚫 Sanctionner</Btn>
              <Btn small ghost onClick={()=>alert("Dossier transmis")}>📁 Voir dossier</Btn>
            </div>
          )}
          {c.status==="resolved" && <Tag label="✓ Traitée" color={C.green} />}
        </div>
      ))}
    </div>
  );
}

function VerificationSection() {
  const [items, setItems] = useState(MOCK_VERIF);
  const [viewing, setViewing] = useState(null);

  const approve = (id) => { setItems(p=>p.filter(x=>x.id!==id)); setViewing(null); };
  const reject = (id) => { setItems(p=>p.filter(x=>x.id!==id)); setViewing(null); };

  return (
    <div style={{ padding:"14px" }}>
      {viewing && (
        <Modal title="Vérification de compte" onClose={()=>setViewing(null)}>
          <div style={{ background:C.surface, borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
            <div style={{ color:C.text, fontWeight:700 }}>{viewing.name}</div>
            <div style={{ color:C.sub, fontSize:12 }}>{viewing.type==="student"?"Étudiant":"Entreprise"} · Soumis le {viewing.submitted}</div>
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ color:C.sub, fontSize:11, textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Documents soumis</div>
            {viewing.docs.map((d,i)=>(
              <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 12px", marginBottom:7, display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ fontSize:18 }}>📄</span>
                <span style={{ color:C.text, fontSize:13, flex:1 }}>{d}</span>
                <Btn small ghost onClick={()=>alert("Visualisation du document : "+d)}>Voir</Btn>
              </div>
            ))}
          </div>
          <div style={{ background:C.yellowDim, border:`1px solid ${C.yellow}33`, borderRadius:9, padding:"10px 12px", marginBottom:16 }}>
            <div style={{ color:C.yellow, fontSize:12, fontWeight:700 }}>⚠️ Vérifiez soigneusement</div>
            <div style={{ color:C.sub, fontSize:11, marginTop:3, lineHeight:1.5 }}>Comparez le document avec le selfie. Vérifiez la validité et l'authenticité. En cas de doute, refusez.</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn color={C.green} bg={C.green} onClick={()=>approve(viewing.id)}>✅ Approuver</Btn>
            <Btn danger onClick={()=>reject(viewing.id)}>❌ Refuser</Btn>
            <Btn ghost onClick={()=>setViewing(null)}>Plus tard</Btn>
          </div>
        </Modal>
      )}

      <div style={{ background:C.yellowDim, border:`1px solid ${C.yellow}33`, borderRadius:11, padding:"11px 14px", marginBottom:16, display:"flex", gap:10 }}>
        <span>⏳</span>
        <div style={{ color:C.yellow, fontSize:13, fontWeight:700 }}>{items.length} vérification{items.length>1?"s":""} en attente</div>
      </div>

      {items.length===0 && (
        <div style={{ textAlign:"center", padding:"40px 20px", color:C.sub }}>
          <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
          <div style={{ fontSize:14 }}>Aucune vérification en attente</div>
        </div>
      )}

      {items.map(item=>(
        <div key={item.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:13, padding:"14px", marginBottom:10 }}>
          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
            <Avatar name={item.name[0]} size={42} color={item.type==="company"?C.green:C.blue} />
            <div style={{ flex:1 }}>
              <div style={{ color:C.text, fontWeight:700, fontSize:14 }}>{item.name}</div>
              <div style={{ color:C.sub, fontSize:11 }}>{item.type==="student"?"Étudiant":"Entreprise"} · {item.submitted}</div>
              <div style={{ color:C.muted, fontSize:11, marginTop:3 }}>{item.docs.length} document{item.docs.length>1?"s":""} : {item.docs.join(", ")}</div>
            </div>
          </div>
          <Btn color={C.blue} bg={C.blue} small onClick={()=>setViewing(item)}>🔍 Examiner les documents</Btn>
        </div>
      ))}
    </div>
  );
}

function UpdatesSection() {
  const [updates, setUpdates] = useState(MOCK_UPDATES);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ version:"", title:"", desc:"" });

  const statusColor = { deployed:C.green, draft:C.yellow, planned:C.blue };
  const statusLabel = { deployed:"Déployée", draft:"Brouillon", planned:"Planifiée" };

  const add = () => {
    if(!form.version||!form.title) return;
    setUpdates(p=>[...p, { id:Date.now(), ...form, date:"—", status:"draft" }]);
    setForm({ version:"", title:"", desc:"" });
    setShowNew(false);
  };

  return (
    <div style={{ padding:"14px" }}>
      {showNew && (
        <Modal title="Nouvelle mise à jour" onClose={()=>setShowNew(false)}>
          {[["Version","v1.5.0","version"],["Titre","Intitulé de la mise à jour","title"],["Description","Détails des changements...","desc"]].map(([l,p,k])=>(
            <div key={k} style={{ marginBottom:12 }}>
              <label style={{ color:C.sub, fontSize:11, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:.8 }}>{l}</label>
              <input placeholder={p} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 12px", color:C.text, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
            </div>
          ))}
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <Btn onClick={add} disabled={!form.version||!form.title}>Créer</Btn>
            <Btn ghost onClick={()=>setShowNew(false)}>Annuler</Btn>
          </div>
        </Modal>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <h3 style={{ color:C.text, fontSize:16, fontWeight:900 }}>Mises à jour</h3>
        <Btn small onClick={()=>setShowNew(true)}>+ Nouvelle</Btn>
      </div>

      {/* Version actuelle */}
      <div style={{ background:`linear-gradient(135deg, ${C.greenDim}, ${C.blueDim})`, border:`1px solid ${C.green}33`, borderRadius:13, padding:"14px", marginBottom:16 }}>
        <div style={{ color:C.sub, fontSize:11, marginBottom:3 }}>VERSION EN PRODUCTION</div>
        <div style={{ color:C.text, fontWeight:900, fontSize:20 }}>v1.2.0</div>
        <div style={{ color:C.sub, fontSize:12, marginTop:2 }}>Déployée le 25 Mai 2026 · Stable</div>
        <div style={{ display:"flex", gap:6, marginTop:10 }}>
          {[["🕐 Uptime","99.8%"],["👥 Utilisateurs actifs","847"],["⚡ Latence moy.","142ms"]].map(([l,v],i)=>(
            <div key={i} style={{ flex:1, background:"#ffffff0A", borderRadius:8, padding:"7px 8px", textAlign:"center" }}>
              <div style={{ color:C.text, fontWeight:700, fontSize:13 }}>{v}</div>
              <div style={{ color:C.muted, fontSize:9, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {updates.map(u=>(
        <div key={u.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:13, padding:"14px", marginBottom:9 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
            <div>
              <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4 }}>
                <span style={{ color:C.accent, fontWeight:900, fontSize:13 }}>{u.version}</span>
                <Tag label={statusLabel[u.status]} color={statusColor[u.status]} />
              </div>
              <div style={{ color:C.text, fontWeight:700, fontSize:14 }}>{u.title}</div>
            </div>
            {u.date!=="—" && <span style={{ color:C.muted, fontSize:10 }}>{u.date}</span>}
          </div>
          <p style={{ color:C.sub, fontSize:12, lineHeight:1.5, marginBottom:12 }}>{u.desc}</p>
          <div style={{ display:"flex", gap:7 }}>
            {u.status==="draft" && <Btn small color={C.green} bg={C.green} onClick={()=>setUpdates(p=>p.map(x=>x.id===u.id?{...x,status:"deployed",date:"30 Mai 2026"}:x))}>🚀 Déployer</Btn>}
            {u.status==="planned" && <Btn small color={C.accent} bg={C.accent} onClick={()=>setUpdates(p=>p.map(x=>x.id===u.id?{...x,status:"draft"}:x))}>✏️ Rédiger</Btn>}
            <Btn small ghost onClick={()=>alert("Notes de version éditées")}>📝 Éditer</Btn>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsSection() {
  const metrics = [
    { label:"Taux de rétention", value:"73%", color:C.green, desc:"Utilisateurs actifs après 30j" },
    { label:"Conversion freemium→premium", value:"8.4%", color:C.accent, desc:"Objectif : 12%" },
    { label:"Candidatures déposées", value:"1,204", color:C.blue, desc:"Ce mois" },
    { label:"Stages pourvus", value:"87", color:C.purple, desc:"Via AfriLearn" },
    { label:"Taux de comptes validés", value:"91%", color:C.green, desc:"Sur les demandes reçues" },
    { label:"Plaintes résolues", value:"94%", color:C.green, desc:"Taux de résolution" },
  ];

  const countries = [
    { name:"Bénin", users:3841, pct:30 },
    { name:"Sénégal", users:2905, pct:22 },
    { name:"Côte d'Ivoire", users:2318, pct:18 },
    { name:"Mali", users:1669, pct:13 },
    { name:"Togo", users:1155, pct:9 },
    { name:"Autres", users:959, pct:8 },
  ];

  return (
    <div style={{ padding:"14px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
        {metrics.map((m,i)=>(
          <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:13, padding:"14px 12px" }}>
            <div style={{ color:m.color, fontSize:22, fontWeight:900, letterSpacing:-1 }}>{m.value}</div>
            <div style={{ color:C.text, fontSize:12, fontWeight:700, marginTop:3 }}>{m.label}</div>
            <div style={{ color:C.muted, fontSize:10, marginTop:3 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <h3 style={{ color:C.text, fontSize:15, fontWeight:700, marginBottom:12 }}>Répartition par pays</h3>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:13, padding:"14px", marginBottom:18 }}>
        {countries.map((c,i)=>(
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ color:C.text, fontSize:13 }}>🌍 {c.name}</span>
              <span style={{ color:C.sub, fontSize:12 }}>{c.users.toLocaleString()} · {c.pct}%</span>
            </div>
            <div style={{ background:C.surface, borderRadius:4, height:6, overflow:"hidden" }}>
              <div style={{ width:`${c.pct}%`, height:"100%", background:`linear-gradient(90deg, ${C.accent}, ${C.blue})`, borderRadius:4 }} />
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ color:C.text, fontSize:15, fontWeight:700, marginBottom:12 }}>Revenus par source</h3>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:13, padding:"14px" }}>
        {[
          { src:"Abonnements Premium étudiants", amount:"312 000", pct:40, color:C.accent },
          { src:"Publication offres entreprises", amount:"234 000", pct:30, color:C.green },
          { src:"Pub & partenariats", amount:"156 000", pct:20, color:C.blue },
          { src:"Certifications IA", amount:"78 000", pct:10, color:C.purple },
        ].map((r,i)=>(
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ color:C.text, fontSize:12 }}>{r.src}</span>
              <span style={{ color:r.color, fontWeight:700, fontSize:12 }}>{r.amount} FCFA</span>
            </div>
            <div style={{ background:C.surface, borderRadius:4, height:6 }}>
              <div style={{ width:`${r.pct}%`, height:"100%", background:r.color, borderRadius:4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ROOT ── */
const NAV = [
  { id:"overview", icon:"📊", label:"Vue d'ensemble" },
  { id:"users", icon:"👥", label:"Utilisateurs" },
  { id:"complaints", icon:"🚨", label:"Plaintes" },
  { id:"verification", icon:"🔍", label:"Vérifs" },
  { id:"updates", icon:"🚀", label:"Updates" },
  { id:"analytics", icon:"📈", label:"Analytics" },
];

export default function AdminPanel() {
  const [page, setPage] = useState("overview");
  const [locked, setLocked] = useState(true);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const CORRECT_PIN = "1234"; // In production: real auth

  const tryUnlock = () => {
    if(pin===CORRECT_PIN) { setLocked(false); setError(false); }
    else { setError(true); setPin(""); setTimeout(()=>setError(false),2000); }
  };

  if(locked) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, fontFamily:"Georgia, serif" }}>
      <style>{`* { box-sizing:border-box; margin:0; padding:0; } ::-webkit-scrollbar { display:none; }`}</style>
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle, ${C.accentDim}, transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:320 }}>
        <div style={{ width:64, height:64, borderRadius:18, background:`linear-gradient(135deg, ${C.accent}, #E8921A)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, margin:"0 auto 20px", boxShadow:`0 0 40px ${C.accentDim}` }}>👑</div>
        <h1 style={{ color:C.text, fontSize:26, fontWeight:900, letterSpacing:-1, marginBottom:6 }}>Panel Fondateur</h1>
        <p style={{ color:C.sub, fontSize:13, marginBottom:28, lineHeight:1.5 }}>Accès restreint.<br/>Entrez votre code PIN pour continuer.</p>

        {/* PIN display */}
        <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:24 }}>
          {[0,1,2,3].map(i=>(
            <div key={i} style={{ width:14, height:14, borderRadius:"50%", background: i<pin.length ? C.accent : C.border, transition:"background .15s", border:`2px solid ${i<pin.length?C.accent:C.muted}` }} />
          ))}
        </div>

        {/* Numpad */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, maxWidth:220, margin:"0 auto 16px" }}>
          {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k,i)=>(
            <button key={i} onClick={()=>{
              if(k==="⌫") setPin(p=>p.slice(0,-1));
              else if(k!==""&&pin.length<4) { const np=pin+k; setPin(np); if(np.length===4) setTimeout(()=>{ if(np===CORRECT_PIN){setLocked(false);}else{setError(true);setPin("");setTimeout(()=>setError(false),1500);}},200); }
            }} style={{ background:k===""?"transparent":C.card, border:k===""?"none":`1px solid ${C.border}`, borderRadius:12, height:52, fontSize:k==="⌫"?18:18, fontWeight:700, color:k===""?"transparent":C.text, cursor:k===""?"default":"pointer", fontFamily:"inherit", transition:"background .1s" }}>
              {k}
            </button>
          ))}
        </div>
        {error && <p style={{ color:C.red, fontSize:12, marginTop:4 }}>Code incorrect. Réessayez. <span style={{ color:C.muted }}>(demo: 1234)</span></p>}
        {!error && <p style={{ color:C.muted, fontSize:11 }}>Code demo : 1234</p>}
      </div>
    </div>
  );

  return (
    <div style={{ background:C.bg, minHeight:"100vh", maxWidth:430, margin:"0 auto", fontFamily:"Georgia, serif", overflowX:"hidden" }}>
      <style>{`* { box-sizing:border-box; margin:0; padding:0; } ::-webkit-scrollbar { display:none; } @keyframes fadeUp { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} } input::placeholder,textarea::placeholder{color:${C.muted}}`}</style>

      {/* TOP BAR */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:26, height:26, borderRadius:7, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🎓</div>
          <span style={{ color:C.text, fontWeight:900, fontSize:16 }}>Afri<span style={{ color:C.accent }}>Learn</span></span>
          <span style={{ background:C.accentDim, color:C.accent, border:`1px solid ${C.accent}33`, borderRadius:5, padding:"1px 7px", fontSize:9, fontWeight:700, letterSpacing:.8 }}>ADMIN</span>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:C.green }} />
          <span style={{ color:C.green, fontSize:10, fontWeight:700 }}>Système OK</span>
          <button onClick={()=>setLocked(true)} style={{ background:C.redDim, border:`1px solid ${C.red}33`, color:C.red, borderRadius:7, padding:"4px 10px", fontSize:11, cursor:"pointer", fontFamily:"inherit", marginLeft:4 }}>🔒 Verrouiller</button>
        </div>
      </div>

      {/* PAGE */}
      <div style={{ paddingBottom:72, overflowY:"auto" }}>
        {page==="overview" && <Overview />}
        {page==="users" && <UsersSection />}
        {page==="complaints" && <ComplaintsSection />}
        {page==="verification" && <VerificationSection />}
        {page==="updates" && <UpdatesSection />}
        {page==="analytics" && <AnalyticsSection />}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", padding:"7px 0 13px", zIndex:50, overflowX:"auto" }}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, minWidth:0 }}>
            <span style={{ fontSize:17, filter:page===n.id?"none":"grayscale(1) opacity(.4)", transition:"all .15s" }}>{n.icon}</span>
            <span style={{ fontSize:8, color:page===n.id?C.accent:C.muted, fontFamily:"inherit", whiteSpace:"nowrap" }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
