/* Kirpa Properties — canonical listing data (demo inventory, clearly sample)
   One source of truth: home cards, listing pages, indexes all render from here. */
/* Demo imagery: Unsplash (free license) — replace URLs with Kirpa's own photography per listing. Gradient fallback renders if any URL is unavailable. */
const HERO_IMG='https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&h=1200&q=70';
const RATES={AED:[1,'AED'],USD:[0.2723,'$'],GBP:[0.215,'£'],EUR:[0.252,'€']};
const CURS=Object.keys(RATES);

const LENSES={
  comm:[['Dubai Hills Estate','Guide & live homes','sky-b','dubai-hills','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&h=1100&q=70'],['Dubai Marina','Guide & live homes','sky-a','dubai-marina','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&h=1100&q=70&crop=entropy'],['Palm Jumeirah','Guide & live homes','sky-d','palm-jumeirah','https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=900&h=1100&q=70'],['Downtown Dubai','Guide & live homes','sky-c','downtown','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&h=1100&q=70&crop=entropy']],
  budget:[['Under AED 1M','JVC · Sports City · 214 live','sky-c','','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&h=1100&q=70'],['AED 1–3M','Hills · Creek · 388 live','sky-b','','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&h=1100&q=70'],['AED 3–8M','Marina · Downtown · 245 live','sky-a','','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&h=1100&q=70'],['AED 8M+','Palm · Emirates Hills · 87 live','sky-d','','https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&h=1100&q=70']],
  life:[['Waterfront','Marina · Palm · Creek','sky-a','','https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=900&h=1100&q=70&crop=entropy'],['Golf communities','Hills · Emirates Hills','sky-b','','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&h=1100&q=70&crop=entropy'],['Branded residences','Downtown · Palm','sky-d','','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&h=1100&q=70'],['Family villas','Hills · Arabian Ranches','sky-c','','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&h=1100&q=70&crop=entropy']]
};

const AGENTS={
  kamalpreet:{name:'Kamalpreet Kaur',role:'Team Leader, Sales',langs:'EN, ਪੰਜਾਬੀ, हिन्दी',sky:'sky-b'},
  saloni:{name:'Saloni Bedi',role:'Team Leader, Sales',langs:'EN, हिन्दी',sky:'sky-c'},
  sukhpreet:{name:'Sukhpreet Kaur',role:'Consultant, Off-Plan',langs:'EN, ਪੰਜਾਬੀ',sky:'sky-d'}
};

const LISTINGS=[
  {
    ref:'KP-104',status:'sale',
    title:"A garden villa on Sidra's quietest street",
    community:'Dubai Hills Estate',building:'Sidra',
    aed:4200000,per:'',
    beds:3,baths:4,sqft:3150,extra:'Vacant on transfer',
    permit:'7112345678',agent:'kamalpreet',
    imgs:['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=800&q=70','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&h=800&q=70','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800&q=70&crop=entropy'],
    skies:['sky-b','sky-a','sky-c'],
    desc:[
      "Set on one of Sidra's quietest streets, this three-bedroom villa opens onto a private landscaped garden with mature planting and space for a pool. The layout keeps family living on the ground floor — a broad living room, closed kitchen, and a maid's room — with all three bedrooms upstairs.",
      "Dubai Hills Park, the community pool, and the school run are all within a few minutes' walk. The villa is offered vacant on transfer, making it equally suited to end-users and investors seeking immediate rental income."
    ],
    features:['Private garden','Closed kitchen',"Maid's room",'Two covered parking','Walk to Dubai Hills Park','Vacant on transfer']
  },
  {
    ref:'KP-117',status:'rent',
    title:'Full-marina views from the 40th floor',
    community:'Dubai Marina',building:'Marina Gate',
    aed:185000,per:'/yr',
    beds:2,baths:3,sqft:1420,extra:'Chiller free',
    permit:'7112345679',agent:'saloni',
    imgs:['https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&h=800&q=70&crop=entropy','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&h=800&q=70','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&h=800&q=70&crop=entropy'],
    skies:['sky-c','sky-a','sky-b'],
    desc:[
      "A high-floor two-bedroom in Marina Gate with an uninterrupted, full-length view of the marina — every principal room faces the water. The tower's amenities include an infinity pool, squash courts, and direct promenade access.",
      "Offered chiller-free with flexible cheque options. Marina Walk restaurants, the tram, and JBR beach are all within a ten-minute walk."
    ],
    features:['Full marina view','Chiller free','Infinity pool','Squash courts','Promenade access','Flexible cheques']
  },
  {
    ref:'KP-142',status:'sale',
    title:'A penthouse facing the open Gulf',
    community:'Palm Jumeirah',building:'The Crescent',
    aed:6750000,per:'',
    beds:4,baths:5,sqft:4900,extra:'Private pool',
    permit:'7112345681',agent:'kamalpreet',
    imgs:['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&h=800&q=70','https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1200&h=800&q=70','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&h=800&q=70'],
    skies:['sky-d','sky-b','sky-a'],
    desc:[
      "A four-bedroom penthouse on the Crescent with an open-Gulf orientation — sunset water views from the principal suite, the terrace, and a private pool. Interiors are finished in natural stone with full-height glazing throughout.",
      "The residence includes private beach access, dedicated parking for three cars, and hotel-grade building services."
    ],
    features:['Private pool','Open-Gulf view','Private beach access','Natural stone finishes','3 parking bays','Hotel-grade services']
  }
  ,{
    ref:'KP-121',status:'rent',
    title:'A bright one-bed beside the park',
    community:'Jumeirah Village Circle',building:'Belgravia',
    aed:68000,per:'/yr',
    beds:1,baths:2,sqft:780,extra:'Chiller free',
    permit:'7112345682',agent:'saloni',
    imgs:['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&h=800&q=70&crop=entropy','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&h=800&q=70','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=800&q=70&crop=entropy'],
    skies:['sky-c','sky-d','sky-b'],
    desc:["A corner one-bedroom in Belgravia with dual-aspect light and a working layout — proper kitchen, built-in wardrobes, and a balcony over the community park.","Belgravia is one of JVC's best-managed buildings, with a lap pool and gym, and the new mall is a five-minute drive."],
    features:['Corner unit','Park view','Lap pool & gym','Chiller free','Covered parking']
  },
  {
    ref:'KP-133',status:'sale',
    title:'Two-bed with a straight Burj view',
    community:'Downtown Dubai',building:'Burj Vista',
    aed:3100000,per:'',
    beds:2,baths:3,sqft:1350,extra:'Tenanted until Q2 2027',
    permit:'7112345683',agent:'kamalpreet',
    imgs:['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&h=800&q=70&crop=entropy','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&h=800&q=70','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&h=800&q=70'],
    skies:['sky-a','sky-c','sky-d'],
    desc:["A high-floor two-bedroom in Burj Vista with an unobstructed, head-on view of Burj Khalifa from the living room and both bedrooms.","Currently tenanted until Q2 2027 at a healthy yield — a clean, income-producing hold with the Boulevard on your doorstep."],
    features:['Direct Burj view','Tenanted — immediate income','Boulevard access','High floor','1 parking bay']
  },
  {
    ref:'KP-150',status:'rent',
    title:'A family townhouse near the schools',
    community:'Dubai Hills Estate',building:'Maple',
    aed:240000,per:'/yr',
    beds:4,baths:4,sqft:2400,extra:'Landscaped garden',
    permit:'7112345684',agent:'saloni',
    imgs:['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800&q=70','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=800&q=70','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&h=800&q=70'],
    skies:['sky-b','sky-d','sky-a'],
    desc:["A four-bedroom Maple townhouse with a landscaped rear garden, upgraded flooring, and a converted study on the ground floor.","The school run is a walk, not a drive — GEMS and the park are minutes away on foot, which is why Maple rarely stays listed for long."],
    features:['Landscaped garden','Walk to schools','Converted study','Upgraded flooring','2 covered parking']
  }
];

/* ---------- off-plan projects ---------- */
const PROJECTS=[
  {id:'orchard-place',name:'The Orchard Place',community:'Jumeirah Village Circle',
   dev:'Developer name — track record on request',fromAed:1900000,plan:'60 / 40',handover:'Q4 2027',
   yieldEst:'7.1%',sky:'sky-d',img:'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&h=900&q=70&crop=entropy',
   blurb:'One-to-three-bedroom residences around a central orchard courtyard, with a 60/40 payment plan through handover.'},
  {id:'creek-terraces',name:'Creek Terraces II',community:'Dubai Creek Harbour',
   dev:'Developer name — track record on request',fromAed:1450000,plan:'70 / 30',handover:'Q2 2028',
   yieldEst:'6.4%',sky:'sky-a',img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&h=900&q=70',
   blurb:'Waterfront terraces on the creek promenade — the second phase of a sold-out first release, with a 70/30 plan.'}
];

/* ---------- community guides ---------- */
const COMMUNITIES={
  'jvc':{name:'Jumeirah Village Circle',sky:'sky-c',img:'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&h=900&q=70',
    stats:['Best-value entry point','Typically 7%+ gross yields','Circle Mall & new schools','Strong tenant demand'],
    blurb:["JVC is where Dubai's rental math works hardest — entry prices among the lowest in new Dubai, tenant demand among the steadiest. It's the default first purchase for yield-focused investors, and increasingly a community families choose on purpose.","Stock quality varies more here than anywhere else in the city, which is exactly why building-level advice matters: the right tower in JVC outperforms; the wrong one disappoints."]},
  'dubai-hills':{name:'Dubai Hills Estate',sky:'sky-b',img:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&h=900&q=70',
    stats:['18-hole championship golf','Dubai Hills Mall','GEMS schools in-community','Central park & trails'],
    blurb:["Dubai Hills Estate is the family heart of new Dubai — a masterplanned green district built around an 18-hole course, a regional mall, and schools you can walk to. Villas and townhouses dominate, with apartment districts at the edges.","For investors, Hills offers the steadiest end-user demand in the city: families rent long and buy eventually, which keeps both yields and resale liquidity healthy."]},
  'dubai-marina':{name:'Dubai Marina',sky:'sky-a',img:'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1400&h=900&crop=entropy&q=70',
    stats:['Marina promenade','Tram & Metro','JBR beach walkable','Highest rental liquidity'],
    blurb:["The Marina is Dubai's most liquid rental market — high-rise living on the water with the tram, the promenade, and the beach in walking distance.","Units here turn over fast: one-beds and two-beds with a marina view rarely sit vacant, which is why the Marina anchors most income-focused portfolios."]},
  'palm-jumeirah':{name:'Palm Jumeirah',sky:'sky-d',img:'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1400&h=900&q=70',
    stats:['Private beach access','Trophy-asset market','Hotel-grade services','Strong USD-buyer demand'],
    blurb:["The Palm is Dubai's trophy address — beachfront villas and branded residences that trade in a market of their own, largely driven by international wealth.","Supply is fixed by geography; there is no second Palm. That scarcity underwrites long-term value in a way few Dubai districts can match."]},
  'downtown':{name:'Downtown Dubai',sky:'sky-c',img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&h=900&crop=entropy&q=70',
    stats:['Burj Khalifa district','Dubai Mall','Opera & Boulevard','Short-stay friendly'],
    blurb:["Downtown is the postcard — Burj views, the Boulevard, and the strongest short-stay demand in the city, which supports premium rents on well-positioned units.","Buyers here trade some yield for liquidity and prestige: Downtown stock is the easiest in Dubai to exit when you need to."]}
};

