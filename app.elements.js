"use strict";
/* ===== Studio : bibliothèque d'éléments enrichie (plus de latitude) ===== */
(function(){
  if(typeof EL==="undefined")return;
  EL["Robes & jupes"]=[
    {n:"Robe portefeuille",w:180,svg:'<svg viewBox="0 0 120 170"><path d="M40 14 L80 14 L88 56 L104 162 L16 162 L32 56 Z" fill="#9c5d7c"/><path d="M52 16 L70 162" fill="none" stroke="#5a4a52" stroke-width="2"/></svg>'},
    {n:"Robe bustier",w:160,svg:'<svg viewBox="0 0 120 170"><path d="M38 40 L82 40 L86 70 L98 162 L22 162 L34 70 Z" fill="#d4537e"/><path d="M38 40 Q60 30 82 40" fill="none" stroke="#5a4a52" stroke-width="2"/></svg>'},
    {n:"Jupe crayon",w:120,svg:'<svg viewBox="0 0 100 120"><path d="M30 12 L70 12 L66 112 L34 112 Z" fill="#c08552"/><rect x="30" y="6" width="40" height="8" rx="2" fill="#c08552"/></svg>'},
    {n:"Jupe plissée",w:160,svg:'<svg viewBox="0 0 140 110"><path d="M40 14 L100 14 L120 104 L20 104 Z" fill="#bd8a3e"/><g stroke="#8a6420" stroke-width="1.5" opacity="0.6"><line x1="48" y1="20" x2="36" y2="100"/><line x1="62" y1="18" x2="58" y2="100"/><line x1="78" y1="18" x2="82" y2="100"/><line x1="92" y1="20" x2="104" y2="100"/></g></svg>'},
    {n:"Jupe longue",w:170,svg:'<svg viewBox="0 0 130 150"><path d="M40 12 L90 12 L112 142 L18 142 Z" fill="#5b7591"/></svg>'},
    {n:"Combinaison",w:150,svg:'<svg viewBox="0 0 120 175"><path d="M40 14 L80 14 L84 70 L80 165 L66 165 L60 90 L54 165 L40 165 L36 70 Z" fill="#5b7152"/></svg>'}
  ];
  EL["Accessoires"]=[
    {n:"Sac",w:80,svg:'<svg viewBox="0 0 100 100"><path d="M22 40 L78 40 L84 92 L16 92 Z" fill="#9c5d7c" stroke="#5a4a52" stroke-width="2"/><path d="M34 40 Q34 20 50 20 Q66 20 66 40" fill="none" stroke="#5a4a52" stroke-width="4"/></svg>'},
    {n:"Chapeau",w:100,svg:'<svg viewBox="0 0 120 70"><ellipse cx="60" cy="54" rx="54" ry="12" fill="#3c342a"/><path d="M36 54 Q36 14 60 14 Q84 14 84 54 Z" fill="#3c342a"/><rect x="36" y="44" width="48" height="6" fill="#bd8a3e"/></svg>'},
    {n:"Talons",w:90,svg:'<svg viewBox="0 0 120 60"><path d="M10 20 L80 20 Q100 22 104 40 L104 48 L96 48 L92 40 L70 40 L66 50 L14 50 Q8 36 10 20 Z" fill="#7a2a40"/></svg>'},
    {n:"Bottes",w:60,svg:'<svg viewBox="0 0 70 110"><path d="M22 8 L46 8 L46 76 L62 96 L62 104 L18 104 L18 30 Z" fill="#4a3b32"/></svg>'},
    {n:"Lunettes",w:90,svg:'<svg viewBox="0 0 120 40"><circle cx="30" cy="22" r="16" fill="none" stroke="#2e2a28" stroke-width="4"/><circle cx="90" cy="22" r="16" fill="none" stroke="#2e2a28" stroke-width="4"/><line x1="46" y1="20" x2="74" y2="20" stroke="#2e2a28" stroke-width="4"/></svg>'},
    {n:"Collier",w:80,svg:'<svg viewBox="0 0 100 70"><path d="M20 6 Q50 70 80 6" fill="none" stroke="#bd8a3e" stroke-width="3"/><circle cx="50" cy="52" r="7" fill="#9c5d7c" stroke="#bd8a3e" stroke-width="2"/></svg>'},
    {n:"Foulard",w:90,svg:'<svg viewBox="0 0 110 90"><path d="M20 10 Q55 30 90 10 L80 40 Q55 56 30 40 Z" fill="#d4537e"/><path d="M48 44 L40 84 L70 84 L62 44 Z" fill="#d4537e"/></svg>'},
    {n:"Capuche",w:110,svg:'<svg viewBox="0 0 120 90"><path d="M16 84 Q16 8 60 8 Q104 8 104 84 L84 84 Q84 36 60 36 Q36 36 36 84 Z" fill="#5b7152" stroke="#5a4a52" stroke-width="2"/></svg>'}
  ];
  EL["Cols & finitions"]=[
    {n:"Col roulé",w:80,svg:'<svg viewBox="0 0 100 50"><path d="M30 8 Q50 0 70 8 L70 42 Q50 50 30 42 Z" fill="#9c5d7c" stroke="#5a4a52" stroke-width="2"/><line x1="30" y1="20" x2="70" y2="20" stroke="#5a4a52" stroke-width="1.5" opacity="0.6"/></svg>'},
    {n:"Volant col",w:110,svg:'<svg viewBox="0 0 120 50"><path d="M10 14 Q22 44 34 14 Q46 44 58 14 Q70 44 82 14 Q94 44 110 16 L110 40 L10 40 Z" fill="#d9b8a3" stroke="#5a4a52" stroke-width="1.5"/></svg>'},
    {n:"Poche plaquée",w:60,svg:'<svg viewBox="0 0 80 80"><path d="M14 20 L66 20 L66 60 L40 72 L14 60 Z" fill="none" stroke="#5a4a52" stroke-width="3"/></svg>'},
    {n:"Empiècement",w:120,svg:'<svg viewBox="0 0 120 60"><path d="M10 50 Q60 10 110 50" fill="none" stroke="#5a4a52" stroke-width="3"/><path d="M10 56 Q60 16 110 56" fill="none" stroke="#5a4a52" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.6"/></svg>'}
  ];
  if(typeof cmpBuildCats==="function" && document.getElementById("cmpCat")) cmpBuildCats();
})();
