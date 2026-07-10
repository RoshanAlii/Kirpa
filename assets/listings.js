/* Kirpa Properties — canonical listing data (demo inventory, clearly sample)
   One source of truth: home cards, listing pages, indexes all render from here. */
const RATES={AED:[1,'AED'],USD:[0.2723,'$'],GBP:[0.215,'£'],EUR:[0.252,'€']};
const CURS=Object.keys(RATES);

const LENSES={
  comm:[['Dubai Hills Estate','142 live · Guide','sky-b'],['Dubai Marina','218 live · Guide','sky-a'],['Palm Jumeirah','96 live · Guide','sky-d'],['Downtown Dubai','171 live · Guide','sky-c']],
  budget:[['Under AED 1M','JVC · Sports City · 214 live','sky-c'],['AED 1–3M','Hills · Creek · 388 live','sky-b'],['AED 3–8M','Marina · Downtown · 245 live','sky-a'],['AED 8M+','Palm · Emirates Hills · 87 live','sky-d']],
  life:[['Waterfront','Marina · Palm · Creek','sky-a'],['Golf communities','Hills · Emirates Hills','sky-b'],['Branded residences','Downtown · Palm','sky-d'],['Family villas','Hills · Arabian Ranches','sky-c']]
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
    skies:['sky-d','sky-b','sky-a'],
    desc:[
      "A four-bedroom penthouse on the Crescent with an open-Gulf orientation — sunset water views from the principal suite, the terrace, and a private pool. Interiors are finished in natural stone with full-height glazing throughout.",
      "The residence includes private beach access, dedicated parking for three cars, and hotel-grade building services."
    ],
    features:['Private pool','Open-Gulf view','Private beach access','Natural stone finishes','3 parking bays','Hotel-grade services']
  }
];
