"use strict";
/* ===== Catalogue FreeSewing (open-source, patrons libres) + ajouts gratuits ===== */
/* FreeSewing : chaque design se génère sur mesure dans le navigateur, gratuit et open-source. */
var FREESEWING=[
  {name:"Teagan — t-shirt",type:"top",level:"Débutant",slug:"teagan"},
  {name:"Aaron — débardeur",type:"top",level:"Intermédiaire",slug:"aaron"},
  {name:"Sven — sweat-shirt",type:"top",level:"Intermédiaire",slug:"sven"},
  {name:"Hugo — sweat à capuche",type:"top",level:"Intermédiaire",slug:"hugo"},
  {name:"Simone — chemise femme",type:"top",level:"Avancé",slug:"simone"},
  {name:"Simon — chemise homme",type:"top",level:"Avancé",slug:"simon"},
  {name:"Cathrin — corset / bustier",type:"top",level:"Avancé",slug:"cathrin"},
  {name:"Breanna — bloc robe",type:"robe",level:"Avancé",slug:"breanna"},
  {name:"Bella — robe",type:"robe",level:"Intermédiaire",slug:"bella"},
  {name:"Sandy — jupe cercle",type:"jupe",level:"Débutant",slug:"sandy"},
  {name:"Penelope — pantalon tailleur",type:"pantalon",level:"Avancé",slug:"penelope"},
  {name:"Paco — pantalon workwear",type:"pantalon",level:"Intermédiaire",slug:"paco"},
  {name:"Titan — bloc pantalon",type:"pantalon",level:"Avancé",slug:"titan"},
  {name:"Waralee — pantalon portefeuille",type:"pantalon",level:"Intermédiaire",slug:"waralee"},
  {name:"Shin — short",type:"pantalon",level:"Débutant",slug:"shin"},
  {name:"Carlton — manteau",type:"manteau",level:"Avancé",slug:"carlton"},
  {name:"Wahid — gilet sans manche",type:"manteau",level:"Intermédiaire",slug:"wahid"},
  {name:"Diana — maillot de bain",type:"accessoire",level:"Avancé",slug:"diana"},
  {name:"Hortensia — sac banane",type:"accessoire",level:"Débutant",slug:"hortensia"},
  {name:"Holmes — cagoule",type:"accessoire",level:"Intermédiaire",slug:"holmes"},
  {name:"Benjamin — nœud papillon",type:"accessoire",level:"Débutant",slug:"benjamin"},
  {name:"Trayvon — cravate",type:"accessoire",level:"Débutant",slug:"trayvon"},
  {name:"Florence — masque",type:"accessoire",level:"Débutant",slug:"florence"}
];
(function(){
  if(typeof PATLIB==="undefined")return;
  var fs=FREESEWING.map(function(d){
    return {name:d.name,brand:"FreeSewing · open-source",type:d.type,level:d.level,
      desc:"Patron sur mesure, généré gratuitement dans le navigateur à partir de tes mesures.",
      url:"https://freesewing.org/designs/"+d.slug+"/"};
  });
  /* on place les patrons open-source FreeSewing en tête de la bibliothèque */
  PATLIB=fs.concat(PATLIB);
  if(typeof renderPatList==="function")renderPatList();
})();
