"use strict";
/* ===== Studio v2 : bibliothèque d'éléments étendue (+50) ===== */
(function(){
  if(typeof EL==="undefined")return;
  var S='#5a4a52'; // trait
  function P(d,fill,extra){return '<path d="'+d+'" fill="'+(fill||"none")+'" stroke="'+S+'" stroke-width="2"'+(extra||"")+'/>';}
  function svg(vb,inner){return '<svg viewBox="'+vb+'">'+inner+'</svg>';}

  EL["Hauts"]=[
    {n:"T-shirt",w:150,svg:svg("0 0 130 120",P("M40 12 L52 8 Q65 18 78 8 L90 12 L118 34 L106 52 L96 44 L96 112 L34 112 L34 44 L24 52 L12 34 Z","#5b7591"))},
    {n:"Chemise",w:150,svg:svg("0 0 130 140",P("M42 10 L58 6 L65 18 L72 6 L88 10 L118 34 L106 54 L96 46 L96 132 L34 132 L34 46 L24 54 L12 34 Z","#f3efe7")+'<line x1="65" y1="20" x2="65" y2="130" stroke="'+S+'" stroke-width="1.5"/><g fill="'+S+'"><circle cx="65" cy="40" r="2.2"/><circle cx="65" cy="62" r="2.2"/><circle cx="65" cy="84" r="2.2"/><circle cx="65" cy="106" r="2.2"/></g>'+P("M58 6 L52 20 L65 26 L78 20 L72 6","#f3efe7"))},
    {n:"Débardeur",w:120,svg:svg("0 0 110 120",P("M30 8 L44 8 Q44 30 55 34 Q66 30 66 8 L80 8 L84 40 L82 112 L28 112 L26 40 Z","#d4537e"))},
    {n:"Crop top",w:140,svg:svg("0 0 130 80",P("M40 10 L52 6 Q65 16 78 6 L90 10 L118 30 L106 46 L96 38 L96 72 L34 72 L34 38 L24 46 L12 30 Z","#bd8a3e"))},
    {n:"Blouse bouffante",w:170,svg:svg("0 0 160 130",P("M58 10 Q80 20 102 10 L110 16 L136 40 Q150 70 128 90 L114 84 L110 124 L50 124 L46 84 L32 90 Q10 70 24 40 L50 16 Z","#d9b8a3")+'<path d="M32 88 Q46 82 46 84 M128 88 Q114 82 114 84" stroke="'+S+'" stroke-width="1.5" fill="none"/>')},
    {n:"Kimono / veste",w:180,svg:svg("0 0 170 150",P("M60 8 L85 30 L110 8 L124 12 L164 44 L150 66 L128 56 L126 142 L44 142 L42 56 L20 66 L6 44 L46 12 Z","#7a6a86")+'<path d="M60 8 L85 30 L110 8" fill="none" stroke="'+S+'" stroke-width="2"/><line x1="85" y1="30" x2="85" y2="142" stroke="'+S+'" stroke-width="1.5"/>')},
    {n:"Blazer",w:160,svg:svg("0 0 150 160",P("M48 10 L75 40 L102 10 L116 14 L142 42 L132 60 L118 52 L118 152 L32 152 L32 52 L18 60 L8 42 L34 14 Z","#3c3f4a")+P("M48 10 L60 30 L75 60 L90 30 L102 10","#3c3f4a")+'<line x1="75" y1="60" x2="75" y2="150" stroke="'+S+'" stroke-width="1.5"/><circle cx="75" cy="90" r="2.5" fill="'+S+'"/><circle cx="75" cy="116" r="2.5" fill="'+S+'"/><rect x="40" y="110" width="22" height="16" rx="2" fill="none" stroke="'+S+'" stroke-width="1.5"/><rect x="88" y="110" width="22" height="16" rx="2" fill="none" stroke="'+S+'" stroke-width="1.5"/>')},
    {n:"Gilet sans manches",w:120,svg:svg("0 0 110 140",P("M30 8 L46 8 Q55 26 64 8 L80 8 L84 30 L86 132 L24 132 L26 30 Z","#c08552")+'<line x1="55" y1="30" x2="55" y2="132" stroke="'+S+'" stroke-width="1.5"/><circle cx="55" cy="60" r="2.4" fill="'+S+'"/><circle cx="55" cy="84" r="2.4" fill="'+S+'"/><circle cx="55" cy="108" r="2.4" fill="'+S+'"/>')},
    {n:"Cardigan",w:160,svg:svg("0 0 150 150",P("M44 10 L60 6 Q75 40 90 6 L106 10 L142 40 L130 58 L118 50 L118 142 L32 142 L32 50 L20 58 L8 40 Z","#9c5d7c")+'<g stroke="'+S+'" stroke-width="1.5" fill="none"><path d="M60 6 L64 142 M90 6 L86 142"/><line x1="32" y1="126" x2="118" y2="126"/></g><g fill="'+S+'"><circle cx="75" cy="58" r="2.4"/><circle cx="75" cy="80" r="2.4"/><circle cx="75" cy="102" r="2.4"/></g>')},
    {n:"Sweat à capuche",w:160,svg:svg("0 0 150 160",P("M44 30 Q75 0 106 30 L142 48 L134 68 L118 60 L118 150 L32 150 L32 60 L16 68 L8 48 Z","#5b7152")+P("M52 30 Q75 14 98 30 Q90 48 75 50 Q60 48 52 30","#4c6244")+'<path d="M50 96 L100 96 L104 122 L46 122 Z" fill="none" stroke="'+S+'" stroke-width="1.5"/><line x1="32" y1="136" x2="118" y2="136" stroke="'+S+'" stroke-width="1.5"/>')}
  ];

  EL["Bas"]=[
    {n:"Short",w:130,svg:svg("0 0 120 90",P("M30 8 L90 8 L96 80 L64 80 L60 46 L56 80 L24 80 Z","#5b7591")+'<rect x="30" y="4" width="60" height="8" rx="2" fill="#5b7591" stroke="'+S+'" stroke-width="2"/>')},
    {n:"Pantalon large",w:150,svg:svg("0 0 140 170",P("M38 8 L102 8 L128 162 L76 162 L70 70 L64 162 L12 162 Z","#e8d9c0")+'<rect x="38" y="4" width="64" height="8" rx="2" fill="#e8d9c0" stroke="'+S+'" stroke-width="2"/>')},
    {n:"Jogging",w:130,svg:svg("0 0 120 165",P("M34 8 L86 8 L86 148 L68 148 L60 66 L52 148 L34 148 Z","#8c8278")+'<rect x="34" y="2" width="52" height="12" rx="4" fill="#8c8278" stroke="'+S+'" stroke-width="2"/><g stroke="'+S+'" stroke-width="1.5" fill="none"><path d="M54 8 Q60 30 66 8"/><rect x="34" y="146" width="18" height="12" rx="3"/><rect x="68" y="146" width="18" height="12" rx="3"/></g>')},
    {n:"Pantalon cigarette",w:120,svg:svg("0 0 110 165",P("M32 8 L78 8 L80 156 L62 156 L55 64 L48 156 L30 156 Z","#2e2a28")+'<rect x="32" y="4" width="46" height="8" rx="2" fill="#2e2a28" stroke="'+S+'" stroke-width="2"/>')},
    {n:"Jupe portefeuille",w:150,svg:svg("0 0 130 120",P("M34 10 L96 10 L118 112 L12 112 Z","#c08552")+P("M60 10 L96 112","none")+'<circle cx="86" cy="18" r="4" fill="'+S+'"/>')},
    {n:"Jupe tulipe",w:140,svg:svg("0 0 130 115",P("M36 10 L94 10 Q116 60 96 108 L34 108 Q14 60 36 10 Z","#d4537e")+P("M65 12 Q84 60 70 108","none"))},
    {n:"Jupe boule",w:150,svg:svg("0 0 140 120",P("M40 10 L100 10 Q136 50 116 100 Q70 118 24 100 Q4 50 40 10 Z","#9c5d7c")+'<path d="M24 100 Q70 90 116 100" fill="none" stroke="'+S+'" stroke-width="1.5"/>')},
    {n:"Jupe trapèze courte",w:140,svg:svg("0 0 120 90",P("M34 10 L86 10 L106 84 L14 84 Z","#bd8a3e")+'<rect x="34" y="4" width="52" height="8" rx="2" fill="#bd8a3e" stroke="'+S+'" stroke-width="2"/><g fill="'+S+'"><circle cx="60" cy="26" r="2.4"/><circle cx="60" cy="46" r="2.4"/><circle cx="60" cy="66" r="2.4"/></g>')}
  ];

  EL["Manches +"]=[
    {n:"Manche raglan",w:80,svg:svg("0 0 90 120",P("M60 6 L86 20 L70 112 L30 112 L10 30 Z","#9c5d7c")+P("M60 6 L10 30","none"))},
    {n:"Mancheron",w:60,svg:svg("0 0 70 50",P("M10 12 L60 20 L52 44 L8 38 Z","#9c5d7c"))},
    {n:"Manche kimono",w:100,svg:svg("0 0 110 110",P("M8 8 L102 8 L102 100 L54 100 Q28 70 8 8 Z","#9c5d7c"))},
    {n:"Manche gigot",w:80,svg:svg("0 0 90 130",P("M46 8 Q4 28 14 70 Q30 82 44 70 L36 122 L64 122 L60 40 Z","#9c5d7c"))},
    {n:"Manche cape",w:110,svg:svg("0 0 120 90",P("M60 6 L112 82 Q60 92 8 82 Z","#d9b8a3"))},
    {n:"Manche 3/4",w:55,svg:svg("0 0 60 100",P("M16 8 L46 16 L40 94 L10 94 Z","#9c5d7c")+'<line x1="10" y1="88" x2="40" y2="88" stroke="'+S+'" stroke-width="1.5"/>')},
    {n:"Manche trompette",w:80,svg:svg("0 0 90 130",P("M28 8 L58 14 L54 70 Q84 100 78 124 L6 124 Q0 100 30 70 Z","#9c5d7c"))}
  ];

  EL["Cols +"]=[
    {n:"Col rond",w:80,svg:svg("0 0 100 40",P("M14 8 Q50 50 86 8","none",' stroke-width="6"'))},
    {n:"Col carré",w:80,svg:svg("0 0 100 44",P("M14 6 L14 36 L86 36 L86 6","none",' stroke-width="6"'))},
    {n:"Col bénitier",w:90,svg:svg("0 0 100 50",P("M10 6 Q50 60 90 6","none",' stroke-width="5"')+P("M22 6 Q50 42 78 6","none",' stroke-width="3" opacity="0.6"')+P("M34 6 Q50 28 66 6","none",' stroke-width="2" opacity="0.4"'))},
    {n:"Col châle",w:90,svg:svg("0 0 100 70",P("M30 4 Q50 40 50 66 Q50 40 70 4 L84 8 Q64 40 50 68 Q36 40 16 8 Z","#f3efe7"))},
    {n:"Col mao",w:70,svg:svg("0 0 100 36",P("M26 8 L74 8 Q78 20 74 30 L52 30 L50 24 L48 30 L26 30 Q22 20 26 8 Z","#9c5d7c"))},
    {n:"Une épaule",w:110,svg:svg("0 0 120 60",P("M8 40 Q50 4 112 34","none",' stroke-width="6"')+P("M8 40 L8 54","none",' stroke-width="6"'))},
    {n:"Dos nu",w:90,svg:svg("0 0 100 80",P("M20 6 Q50 100 80 6","none",' stroke-width="5"')+'<line x1="20" y1="6" x2="80" y2="6" stroke="'+S+'" stroke-width="3" stroke-dasharray="4 3"/>')},
    {n:"Col halter",w:90,svg:svg("0 0 100 70",P("M50 6 Q30 40 14 64 M50 6 Q70 40 86 64","none",' stroke-width="6"')+'<circle cx="50" cy="6" r="5" fill="'+S+'"/>')}
  ];

  EL["Détails +"]=[
    {n:"Fermeture éclair",w:26,svg:svg("0 0 24 120",'<rect x="8" y="4" width="8" height="112" fill="#8c8278"/><g stroke="#f3efe7" stroke-width="1.5">'+(function(){var s="";for(var y=8;y<114;y+=6)s+='<line x1="8" y1="'+y+'" x2="16" y2="'+(y+3)+'"/>';return s;})()+'</g><rect x="5" y="20" width="14" height="12" rx="3" fill="'+S+'"/>')},
    {n:"Boutons pression",w:26,svg:svg("0 0 24 100",'<g fill="none" stroke="'+S+'" stroke-width="2.5"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="42" r="6"/><circle cx="12" cy="72" r="6"/></g><g fill="'+S+'"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="42" r="2"/><circle cx="12" cy="72" r="2"/></g>')},
    {n:"Passepoil",w:140,svg:svg("0 0 140 16",'<rect x="4" y="5" width="132" height="6" rx="3" fill="#bd8a3e"/><rect x="4" y="3" width="132" height="2" fill="'+S+'" opacity="0.5"/>')},
    {n:"Pinces",w:90,svg:svg("0 0 100 80",'<g fill="none" stroke="'+S+'" stroke-width="2"><path d="M30 6 L24 74 L36 74 Z"/><path d="M70 6 L64 74 L76 74 Z"/></g>')},
    {n:"Surpiqûres",w:120,svg:svg("0 0 140 20",'<g stroke="'+S+'" stroke-width="2" stroke-dasharray="6 4"><line x1="4" y1="6" x2="136" y2="6"/><line x1="4" y1="14" x2="136" y2="14"/></g>')},
    {n:"Découpes princesse",w:110,svg:svg("0 0 120 140",'<g fill="none" stroke="'+S+'" stroke-width="2"><path d="M34 4 Q20 70 38 136"/><path d="M86 4 Q100 70 82 136"/></g>')},
    {n:"Bretelles",w:70,svg:svg("0 0 80 100",'<g stroke="'+S+'" stroke-width="7"><line x1="18" y1="4" x2="14" y2="96"/><line x1="62" y1="4" x2="66" y2="96"/></g>')},
    {n:"Bretelles spaghetti",w:70,svg:svg("0 0 80 100",'<g stroke="'+S+'" stroke-width="2.5"><line x1="18" y1="4" x2="14" y2="96"/><line x1="62" y1="4" x2="66" y2="96"/></g>')},
    {n:"Fente",w:40,svg:svg("0 0 40 90",'<line x1="20" y1="4" x2="20" y2="86" stroke="'+S+'" stroke-width="3"/><path d="M14 6 L20 0 L26 6" fill="none" stroke="'+S+'" stroke-width="2"/>')},
    {n:"Taille élastiquée",w:140,svg:svg("0 0 140 30",'<rect x="4" y="6" width="132" height="18" rx="4" fill="#f3efe7" stroke="'+S+'" stroke-width="2"/><g stroke="'+S+'" stroke-width="1.5" fill="none">'+(function(){var s="";for(var x=10;x<134;x+=8)s+='<path d="M'+x+' 8 Q'+(x+4)+' 15 '+x+' 22"/>';return s;})()+'</g>')},
    {n:"Broderie fleur",w:60,svg:svg("0 0 60 60",'<g fill="#d4537e" stroke="'+S+'" stroke-width="1">'+(function(){var s="";for(var k=0;k<6;k++){var a=k/6*Math.PI*2;s+='<ellipse cx="'+(30+Math.cos(a)*13).toFixed(1)+'" cy="'+(30+Math.sin(a)*13).toFixed(1)+'" rx="6" ry="9" transform="rotate('+(k*60+90)+' '+(30+Math.cos(a)*13).toFixed(1)+' '+(30+Math.sin(a)*13).toFixed(1)+')"/>';}return s;})()+'</g><circle cx="30" cy="30" r="6" fill="#ffd86b" stroke="'+S+'"/><path d="M30 44 Q28 56 22 58" fill="none" stroke="#5b7152" stroke-width="2.5"/>')},
    {n:"Patch / appliqué",w:60,svg:svg("0 0 70 60",'<rect x="6" y="6" width="58" height="48" rx="10" fill="#5b7152" stroke="'+S+'" stroke-width="2" stroke-dasharray="4 3"/><path d="M22 36 L30 22 L38 34 L46 20 L52 36 Z" fill="#ffd86b"/>')}
  ];

  EL["Technique"]=[
    {n:"Droit-fil",w:100,svg:svg("0 0 120 24",'<line x1="12" y1="12" x2="108" y2="12" stroke="'+S+'" stroke-width="2.5"/><path d="M4 12 L14 6 L14 18 Z M116 12 L106 6 L106 18 Z" fill="'+S+'"/>')},
    {n:"Ligne de coupe",w:120,svg:svg("0 0 140 16",'<line x1="4" y1="8" x2="136" y2="8" stroke="'+S+'" stroke-width="2"/><g fill="none" stroke="'+S+'" stroke-width="1.5"><circle cx="16" cy="8" r="3"/><circle cx="16" cy="8" r="3"/></g><path d="M20 8 L34 2 M20 8 L34 14" stroke="'+S+'" stroke-width="1.5"/>')},
    {n:"Ligne de pliure",w:120,svg:svg("0 0 140 16",'<line x1="4" y1="8" x2="136" y2="8" stroke="'+S+'" stroke-width="2" stroke-dasharray="12 4 3 4"/>')},
    {n:"Cran de montage",w:30,svg:svg("0 0 30 30",'<path d="M15 2 L9 16 L21 16 Z" fill="'+S+'"/>')},
    {n:"Cote / mesure",w:120,svg:svg("0 0 140 30",'<line x1="8" y1="18" x2="132" y2="18" stroke="'+S+'" stroke-width="1.5"/><line x1="8" y1="8" x2="8" y2="28" stroke="'+S+'" stroke-width="1.5"/><line x1="132" y1="8" x2="132" y2="28" stroke="'+S+'" stroke-width="1.5"/><text x="70" y="12" font-size="11" text-anchor="middle" fill="'+S+'" font-family="sans-serif">cm</text>')}
  ];

  if(typeof cmpBuildCats==="function" && document.getElementById("cmpCat")) cmpBuildCats();
})();
