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
  kamalpreet:{name:'Kamalpreet Kaur',role:'Team Leader, Sales',langs:'EN, ਪੰਜਾਬੀ, हिन्दी',langs_pa:'ਅੰਗਰੇਜ਼ੀ, ਪੰਜਾਬੀ, ਹਿੰਦੀ',sky:'sky-b'},
  saloni:{name:'Saloni Bedi',role:'Team Leader, Sales',langs:'EN, हिन्दी',langs_pa:'ਅੰਗਰੇਜ਼ੀ, ਹਿੰਦੀ',sky:'sky-c'},
  sukhpreet:{name:'Sukhpreet Kaur',role:'Consultant, Off-Plan',langs:'EN, ਪੰਜਾਬੀ',langs_pa:'ਅੰਗਰੇਜ਼ੀ, ਪੰਜਾਬੀ',sky:'sky-d'}
};

const LISTINGS=[
  {
    ref:'KP-104',status:'sale',
    title:"A garden villa on Sidra's quietest street",title_pa:"ਸਿਦਰਾ ਦੀ ਸਭ ਤੋਂ ਸ਼ਾਂਤ ਗਲੀ ’ਤੇ ਇੱਕ ਬਾਗ਼ ਵਾਲਾ ਵਿਲਾ",community_pa:"ਦੁਬਈ ਹਿਲਜ਼ ਅਸਟੇਟ",building_pa:"ਸਿਦਰਾ",extra_pa:"ਤਬਾਦਲੇ ’ਤੇ ਖ਼ਾਲੀ",features_pa:["ਨਿੱਜੀ ਬਾਗ਼", "ਬੰਦ ਰਸੋਈ", "ਨੌਕਰ ਕਮਰਾ", "ਦੋ ਢਕੀਆਂ ਪਾਰਕਿੰਗ", "ਦੁਬਈ ਹਿਲਜ਼ ਪਾਰਕ ਤੱਕ ਪੈਦਲ", "ਤਬਾਦਲੇ ’ਤੇ ਖ਼ਾਲੀ"],desc_pa:["ਸਿਦਰਾ ਦੀਆਂ ਸਭ ਤੋਂ ਸ਼ਾਂਤ ਗਲੀਆਂ ’ਚੋਂ ਇੱਕ ’ਤੇ ਸਥਿਤ, ਇਹ ਤਿੰਨ-ਬੈੱਡਰੂਮ ਵਿਲਾ ਇੱਕ ਨਿੱਜੀ ਸਜਾਏ ਬਾਗ਼ ਵਿੱਚ ਖੁੱਲ੍ਹਦਾ ਹੈ, ਜਿੱਥੇ ਪੁਰਾਣੇ ਰੁੱਖ-ਬੂਟੇ ਅਤੇ ਪੂਲ ਲਈ ਥਾਂ ਹੈ। ਨਕਸ਼ਾ ਪਰਿਵਾਰਕ ਜੀਵਨ ਨੂੰ ਹੇਠਲੀ ਮੰਜ਼ਿਲ ’ਤੇ ਰੱਖਦਾ ਹੈ — ਇੱਕ ਖੁੱਲ੍ਹਾ ਲਿਵਿੰਗ ਰੂਮ, ਬੰਦ ਰਸੋਈ, ਅਤੇ ਨੌਕਰ ਕਮਰਾ — ਜਦਕਿ ਤਿੰਨੇ ਬੈੱਡਰੂਮ ਉੱਪਰ ਹਨ।", "ਦੁਬਈ ਹਿਲਜ਼ ਪਾਰਕ, ਕਮਿਊਨਿਟੀ ਪੂਲ, ਅਤੇ ਸਕੂਲ ਸਭ ਕੁਝ ਮਿੰਟਾਂ ਦੀ ਪੈਦਲ ਦੂਰੀ ’ਤੇ ਹਨ। ਇਹ ਵਿਲਾ ਤਬਾਦਲੇ ’ਤੇ ਖ਼ਾਲੀ ਦਿੱਤਾ ਜਾ ਰਿਹਾ ਹੈ, ਜੋ ਇਸ ਨੂੰ ਰਹਿਣ ਵਾਲਿਆਂ ਅਤੇ ਤੁਰੰਤ ਕਿਰਾਇਆ ਆਮਦਨ ਚਾਹੁਣ ਵਾਲੇ ਨਿਵੇਸ਼ਕਾਂ, ਦੋਵਾਂ ਲਈ ਢੁੱਕਵਾਂ ਬਣਾਉਂਦਾ ਹੈ।"],
    community:'Dubai Hills Estate',building:'Sidra',
    aed:4200000,per:'',
    beds:3,baths:4,sqft:3150,extra:'Vacant on transfer',
    permit:'7112345678',
    title_ar:"فيلا بحديقة في أهدأ شوارع سِدرة",community_ar:"دبي هيلز استيت",building_ar:"سِدرة",extra_ar:"شاغرة عند النقل",features_ar:["حديقة خاصة","مطبخ مغلق","غرفة خادمة","موقفان مغطّيان","على مقربة من حديقة دبي هيلز","شاغرة عند النقل"],agent:'kamalpreet',
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
    title:'Full-marina views from the 40th floor',title_pa:"40ਵੀਂ ਮੰਜ਼ਿਲ ਤੋਂ ਪੂਰੀ ਮਰੀਨਾ ਦਾ ਨਜ਼ਾਰਾ",community_pa:"ਦੁਬਈ ਮਰੀਨਾ",building_pa:"ਮਰੀਨਾ ਗੇਟ",extra_pa:"ਚਿੱਲਰ ਮੁਫ਼ਤ",features_pa:["ਪੂਰੀ ਮਰੀਨਾ ਦਾ ਨਜ਼ਾਰਾ", "ਚਿੱਲਰ ਮੁਫ਼ਤ", "ਇਨਫਿਨਿਟੀ ਪੂਲ", "ਸਕੁਐਸ਼ ਕੋਰਟ", "ਪ੍ਰੋਮੇਨੇਡ ਤੱਕ ਪਹੁੰਚ", "ਲਚਕਦਾਰ ਚੈੱਕ"],desc_pa:["ਮਰੀਨਾ ਗੇਟ ਦੀ 40ਵੀਂ ਮੰਜ਼ਿਲ ’ਤੇ ਇੱਕ ਦੋ-ਬੈੱਡਰੂਮ, ਜਿੱਥੋਂ ਪ੍ਰਿੰਸੀਪਲ ਸੂਟ ਅਤੇ ਲਿਵਿੰਗ ਰੂਮ ਤੋਂ ਪੂਰੀ ਮਰੀਨਾ ਦਾ ਬੇਰੋਕ ਨਜ਼ਾਰਾ ਦਿਖਦਾ ਹੈ। ਯੂਨਿਟ ਚਿੱਲਰ-ਮੁਫ਼ਤ ਹੈ, ਜੋ ਸਾਲਾਨਾ ਖ਼ਰਚ ਨੂੰ ਸਾਦਾ ਰੱਖਦਾ ਹੈ।", "ਇਮਾਰਤ ਵਿੱਚ ਇੱਕ ਇਨਫਿਨਿਟੀ ਪੂਲ, ਸਕੁਐਸ਼ ਕੋਰਟ, ਅਤੇ ਸਿੱਧੀ ਪ੍ਰੋਮੇਨੇਡ ਪਹੁੰਚ ਹੈ। ਯੂਨਿਟ ਵਧੀਆ ਕਿਰਾਇਆ ਤਰਲਤਾ ਵਾਲੀ ਇਮਾਰਤ ਵਿੱਚ ਹੈ।"],
    community:'Dubai Marina',building:'Marina Gate',
    aed:185000,per:'/yr',
    beds:2,baths:3,sqft:1420,extra:'Chiller free',
    permit:'7112345679',
    title_ar:"إطلالة كاملة على المرسى من الطابق الأربعين",community_ar:"دبي مارينا",building_ar:"بوابة المارينا",extra_ar:"بدون رسوم تبريد",features_ar:["إطلالة كاملة على المرسى","بدون رسوم تبريد","مسبح لا متناهٍ","ملاعب اسكواش","وصول إلى الممشى","شيكات مرنة"],agent:'saloni',
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
    title:'A penthouse facing the open Gulf',title_pa:"ਖੁੱਲ੍ਹੀ ਖਾੜੀ ਵੱਲ ਮੂੰਹ ਵਾਲਾ ਇੱਕ ਪੈਂਟਹਾਊਸ",community_pa:"ਪਾਮ ਜੁਮੇਰਾ",building_pa:"ਦ ਕ੍ਰੀਸੈਂਟ",extra_pa:"ਨਿੱਜੀ ਪੂਲ",features_pa:["ਨਿੱਜੀ ਪੂਲ", "ਖੁੱਲ੍ਹੀ ਖਾੜੀ ਦਾ ਨਜ਼ਾਰਾ", "ਨਿੱਜੀ ਬੀਚ ਪਹੁੰਚ", "ਕੁਦਰਤੀ ਪੱਥਰ ਦੀ ਫ਼ਿਨਿਸ਼", "3 ਪਾਰਕਿੰਗ ਥਾਂ", "ਹੋਟਲ-ਪੱਧਰੀ ਸੇਵਾਵਾਂ"],desc_pa:["ਕ੍ਰੀਸੈਂਟ ’ਤੇ ਇੱਕ ਚਾਰ-ਬੈੱਡਰੂਮ ਪੈਂਟਹਾਊਸ ਜਿਸ ਦਾ ਮੂੰਹ ਖੁੱਲ੍ਹੀ ਖਾੜੀ ਵੱਲ ਹੈ — ਪ੍ਰਿੰਸੀਪਲ ਸੂਟ, ਟੈਰੇਸ ਅਤੇ ਨਿੱਜੀ ਪੂਲ ਤੋਂ ਸੂਰਜ ਡੁੱਬਣ ਵੇਲੇ ਪਾਣੀ ਦੇ ਨਜ਼ਾਰੇ। ਅੰਦਰੂਨੀ ਹਿੱਸਾ ਕੁਦਰਤੀ ਪੱਥਰ ਅਤੇ ਪੂਰੀ-ਉਚਾਈ ਵਾਲੇ ਸ਼ੀਸ਼ਿਆਂ ਨਾਲ ਸਜਾਇਆ ਹੋਇਆ ਹੈ।", "ਇਸ ਆਵਾਸ ਵਿੱਚ ਨਿੱਜੀ ਬੀਚ ਪਹੁੰਚ, ਤਿੰਨ ਕਾਰਾਂ ਲਈ ਵੱਖਰੀ ਪਾਰਕਿੰਗ, ਅਤੇ ਹੋਟਲ-ਪੱਧਰੀ ਇਮਾਰਤ ਸੇਵਾਵਾਂ ਸ਼ਾਮਲ ਹਨ।"],
    community:'Palm Jumeirah',building:'The Crescent',
    aed:6750000,per:'',
    beds:4,baths:5,sqft:4900,extra:'Private pool',
    permit:'7112345681',
    title_ar:"بنتهاوس يطلّ على الخليج المفتوح",community_ar:"نخلة جميرا",building_ar:"الكريسنت",extra_ar:"مسبح خاص",features_ar:["مسبح خاص","إطلالة على الخليج المفتوح","وصول إلى شاطئ خاص","تشطيبات حجر طبيعي","٣ مواقف سيارات","خدمات فندقية"],agent:'kamalpreet',
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
    title:'A bright one-bed beside the park',title_pa:"ਪਾਰਕ ਦੇ ਕੋਲ ਇੱਕ ਰੌਸ਼ਨ ਵਨ-ਬੈੱਡ",community_pa:"ਜੁਮੇਰਾ ਵਿਲੇਜ ਸਰਕਲ",building_pa:"ਬੈਲਗ੍ਰੇਵੀਆ",extra_pa:"ਚਿੱਲਰ ਮੁਫ਼ਤ",features_pa:["ਕੋਨੇ ਵਾਲਾ ਯੂਨਿਟ", "ਪਾਰਕ ਦਾ ਨਜ਼ਾਰਾ", "ਲੈਪ ਪੂਲ ਤੇ ਜਿਮ", "ਚਿੱਲਰ ਮੁਫ਼ਤ", "ਢਕੀ ਪਾਰਕਿੰਗ"],desc_pa:["ਬੈਲਗ੍ਰੇਵੀਆ ਵਿੱਚ ਇੱਕ ਕੋਨੇ ਵਾਲਾ ਵਨ-ਬੈੱਡਰੂਮ, ਦੋ-ਪਾਸੇ ਦੀ ਰੌਸ਼ਨੀ ਅਤੇ ਇੱਕ ਕੰਮ-ਯੋਗ ਨਕਸ਼ੇ ਨਾਲ — ਸਹੀ ਰਸੋਈ, ਬਿਲਟ-ਇਨ ਅਲਮਾਰੀਆਂ, ਅਤੇ ਕਮਿਊਨਿਟੀ ਪਾਰਕ ਉੱਤੇ ਇੱਕ ਬਾਲਕੋਨੀ।", "ਬੈਲਗ੍ਰੇਵੀਆ ਜੇਵੀਸੀ ਦੀਆਂ ਸਭ ਤੋਂ ਵਧੀਆ ਪ੍ਰਬੰਧਿਤ ਇਮਾਰਤਾਂ ’ਚੋਂ ਇੱਕ ਹੈ, ਜਿੱਥੇ ਲੈਪ ਪੂਲ ਤੇ ਜਿਮ ਹੈ, ਅਤੇ ਨਵਾਂ ਮਾਲ ਪੰਜ ਮਿੰਟ ਦੀ ਡ੍ਰਾਈਵ ’ਤੇ ਹੈ।"],
    community:'Jumeirah Village Circle',building:'Belgravia',
    aed:68000,per:'/yr',
    beds:1,baths:2,sqft:780,extra:'Chiller free',
    permit:'7112345682',
    title_ar:"شقة بغرفة مضيئة بجوار الحديقة",community_ar:"قرية جميرا الدائرية",building_ar:"بلغرافيا",extra_ar:"بدون رسوم تبريد",features_ar:["وحدة زاوية","إطلالة على الحديقة","مسبح وصالة رياضية","بدون رسوم تبريد","موقف مغطّى"],agent:'saloni',
    imgs:['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&h=800&q=70&crop=entropy','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&h=800&q=70','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=800&q=70&crop=entropy'],
    skies:['sky-c','sky-d','sky-b'],
    desc:["A corner one-bedroom in Belgravia with dual-aspect light and a working layout — proper kitchen, built-in wardrobes, and a balcony over the community park.","Belgravia is one of JVC's best-managed buildings, with a lap pool and gym, and the new mall is a five-minute drive."],
    features:['Corner unit','Park view','Lap pool & gym','Chiller free','Covered parking']
  },
  {
    ref:'KP-133',status:'sale',
    title:'Two-bed with a straight Burj view',title_pa:"ਸਿੱਧੇ ਬੁਰਜ ਨਜ਼ਾਰੇ ਵਾਲਾ ਦੋ-ਬੈੱਡ",community_pa:"ਡਾਊਨਟਾਊਨ ਦੁਬਈ",building_pa:"ਬੁਰਜ ਵਿਸਟਾ",extra_pa:"Q2 2027 ਤੱਕ ਕਿਰਾਏ ’ਤੇ",features_pa:["ਸਿੱਧਾ ਬੁਰਜ ਨਜ਼ਾਰਾ", "ਕਿਰਾਏ ’ਤੇ — ਤੁਰੰਤ ਆਮਦਨ", "ਬੁਲੇਵਾਰਡ ਪਹੁੰਚ", "ਉੱਚੀ ਮੰਜ਼ਿਲ", "1 ਪਾਰਕਿੰਗ ਥਾਂ"],desc_pa:["ਬੁਰਜ ਵਿਸਟਾ ਵਿੱਚ ਇੱਕ ਉੱਚੀ-ਮੰਜ਼ਿਲ ਦੋ-ਬੈੱਡਰੂਮ, ਜਿੱਥੋਂ ਲਿਵਿੰਗ ਰੂਮ ਅਤੇ ਦੋਵਾਂ ਬੈੱਡਰੂਮਾਂ ਤੋਂ ਬੁਰਜ ਖ਼ਲੀਫ਼ਾ ਦਾ ਬੇਰੋਕ, ਸਿੱਧਾ ਨਜ਼ਾਰਾ ਦਿਖਦਾ ਹੈ।", "ਇਸ ਵੇਲੇ Q2 2027 ਤੱਕ ਵਧੀਆ ਰਿਟਰਨ ’ਤੇ ਕਿਰਾਏ ’ਤੇ ਹੈ — ਬੁਲੇਵਾਰਡ ਤੁਹਾਡੇ ਬੂਹੇ ’ਤੇ, ਇੱਕ ਸਾਫ਼-ਸੁਥਰਾ, ਆਮਦਨ ਦੇਣ ਵਾਲਾ ਨਿਵੇਸ਼।"],
    community:'Downtown Dubai',building:'Burj Vista',
    aed:3100000,per:'',
    beds:2,baths:3,sqft:1350,extra:'Tenanted until Q2 2027',
    permit:'7112345683',
    title_ar:"شقة بغرفتين بإطلالة مباشرة على برج خليفة",community_ar:"وسط مدينة دبي",building_ar:"برج فيستا",extra_ar:"مؤجّرة حتى الربع الثاني ٢٠٢٧",features_ar:["إطلالة مباشرة على البرج","مؤجّرة — دخل فوري","وصول إلى البوليفارد","طابق مرتفع","موقف سيارة"],agent:'kamalpreet',
    imgs:['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&h=800&q=70&crop=entropy','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&h=800&q=70','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&h=800&q=70'],
    skies:['sky-a','sky-c','sky-d'],
    desc:["A high-floor two-bedroom in Burj Vista with an unobstructed, head-on view of Burj Khalifa from the living room and both bedrooms.","Currently tenanted until Q2 2027 at a healthy yield — a clean, income-producing hold with the Boulevard on your doorstep."],
    features:['Direct Burj view','Tenanted — immediate income','Boulevard access','High floor','1 parking bay']
  },
  {
    ref:'KP-150',status:'rent',
    title:'A family townhouse near the schools',title_pa:"ਸਕੂਲਾਂ ਦੇ ਕੋਲ ਇੱਕ ਪਰਿਵਾਰਕ ਟਾਊਨਹਾਊਸ",community_pa:"ਦੁਬਈ ਹਿਲਜ਼ ਅਸਟੇਟ",building_pa:"ਮੇਪਲ",extra_pa:"ਸਜਾਇਆ ਬਾਗ਼",features_pa:["ਸਜਾਇਆ ਬਾਗ਼", "ਸਕੂਲਾਂ ਤੱਕ ਪੈਦਲ", "ਬਦਲਿਆ ਸਟੱਡੀ", "ਅੱਪਗ੍ਰੇਡ ਫ਼ਰਸ਼", "2 ਢਕੀਆਂ ਪਾਰਕਿੰਗ"],desc_pa:["ਇੱਕ ਚਾਰ-ਬੈੱਡਰੂਮ ਮੇਪਲ ਟਾਊਨਹਾਊਸ, ਜਿਸ ਦੇ ਪਿੱਛੇ ਸਜਾਇਆ ਬਾਗ਼, ਅੱਪਗ੍ਰੇਡ ਫ਼ਰਸ਼, ਅਤੇ ਹੇਠਲੀ ਮੰਜ਼ਿਲ ’ਤੇ ਇੱਕ ਬਦਲਿਆ ਸਟੱਡੀ ਹੈ।", "ਸਕੂਲ ਪੈਦਲ ਦੂਰੀ ’ਤੇ ਹਨ, ਡ੍ਰਾਈਵ ’ਤੇ ਨਹੀਂ — ਜੈਮਸ ਅਤੇ ਪਾਰਕ ਕੁਝ ਮਿੰਟਾਂ ਦੀ ਪੈਦਲ ਦੂਰੀ ’ਤੇ, ਇਸੇ ਲਈ ਮੇਪਲ ਬਹੁਤੀ ਦੇਰ ਸੂਚੀਬੱਧ ਨਹੀਂ ਰਹਿੰਦਾ।"],
    community:'Dubai Hills Estate',building:'Maple',
    aed:240000,per:'/yr',
    beds:4,baths:4,sqft:2400,extra:'Landscaped garden',
    permit:'7112345684',
    title_ar:"تاون هاوس عائلي قرب المدارس",community_ar:"دبي هيلز استيت",building_ar:"مابل",extra_ar:"حديقة منسّقة",features_ar:["حديقة منسّقة","على مسافة مشي من المدارس","مكتب مُحوّل","أرضيات مُحدّثة","موقفان مغطّيان"],agent:'saloni',
    imgs:['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800&q=70','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=800&q=70','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&h=800&q=70'],
    skies:['sky-b','sky-d','sky-a'],
    desc:["A four-bedroom Maple townhouse with a landscaped rear garden, upgraded flooring, and a converted study on the ground floor.","The school run is a walk, not a drive — GEMS and the park are minutes away on foot, which is why Maple rarely stays listed for long."],
    features:['Landscaped garden','Walk to schools','Converted study','Upgraded flooring','2 covered parking']
  }
];

/* ---------- off-plan projects ---------- */
const PROJECTS=[
  {id:'orchard-place',name:'The Orchard Place',name_pa:"ਦ ਆਰਚਰਡ ਪਲੇਸ",community_pa:"ਜੁਮੇਰਾ ਵਿਲੇਜ ਸਰਕਲ",blurb_pa:"ਇੱਕ ਕੇਂਦਰੀ ਬਾਗ਼ ਵਾਲੇ ਵਿਹੜੇ ਦੁਆਲੇ ਇੱਕ ਤੋਂ ਤਿੰਨ ਬੈੱਡਰੂਮ ਆਵਾਸ, ਹੈਂਡਓਵਰ ਤੱਕ 60/40 ਭੁਗਤਾਨ ਯੋਜਨਾ ਨਾਲ।",name_ar:'ذا أورشارد بليس',blurb_ar:'مساكن من غرفة إلى ثلاث غرف حول فناء بستان مركزي، بخطة سداد ٦٠/٤٠ حتى التسليم.',community:'Jumeirah Village Circle',
   dev:'Developer name — track record on request',fromAed:1900000,plan:'60 / 40',handover:'Q4 2027',
   yieldEst:'7.1%',sky:'sky-d',img:'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&h=900&q=70&crop=entropy',
   blurb:'One-to-three-bedroom residences around a central orchard courtyard, with a 60/40 payment plan through handover.'},
  {id:'creek-terraces',name:'Creek Terraces II',name_pa:"ਕ੍ਰੀਕ ਟੈਰੇਸਿਜ਼ 2",community_pa:"ਦੁਬਈ ਕ੍ਰੀਕ ਹਾਰਬਰ",blurb_pa:"ਕ੍ਰੀਕ ਪ੍ਰੋਮੇਨੇਡ ’ਤੇ ਵਾਟਰਫ੍ਰੰਟ ਟੈਰੇਸ — ਪੂਰੀ ਤਰ੍ਹਾਂ ਵਿਕ ਚੁੱਕੇ ਪਹਿਲੇ ਰਿਲੀਜ਼ ਦਾ ਦੂਜਾ ਪੜਾਅ, 70/30 ਯੋਜਨਾ ਨਾਲ।",name_ar:'كريك تراسيس ٢',blurb_ar:'شرفات على واجهة الخور — المرحلة الثانية من إطلاق أول نفدت بالكامل، بخطة ٧٠/٣٠.',community:'Dubai Creek Harbour',
   dev:'Developer name — track record on request',fromAed:1450000,plan:'70 / 30',handover:'Q2 2028',
   yieldEst:'6.4%',sky:'sky-a',img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&h=900&q=70',
   blurb:'Waterfront terraces on the creek promenade — the second phase of a sold-out first release, with a 70/30 plan.'}
];

/* ---------- community guides ---------- */
const COMMUNITIES={
  'jvc':{name_pa:"ਜੁਮੇਰਾ ਵਿਲੇਜ ਸਰਕਲ",stats_pa:["ਸਭ ਤੋਂ ਵਧੀਆ ਕੀਮਤ ਵਾਲਾ ਦਾਖ਼ਲਾ", "ਆਮ ਤੌਰ ’ਤੇ 7% ਤੋਂ ਵੱਧ ਕੁੱਲ ਰਿਟਰਨ", "ਸਰਕਲ ਮਾਲ ਤੇ ਨਵੇਂ ਸਕੂਲ", "ਕਿਰਾਏਦਾਰਾਂ ਦੀ ਮਜ਼ਬੂਤ ਮੰਗ"],blurb_pa:["ਜੇਵੀਸੀ ਉਹ ਥਾਂ ਹੈ ਜਿੱਥੇ ਦੁਬਈ ਦਾ ਕਿਰਾਇਆ ਗਣਿਤ ਸਭ ਤੋਂ ਵੱਧ ਕੰਮ ਕਰਦਾ ਹੈ — ਨਵੇਂ ਦੁਬਈ ’ਚੋਂ ਸਭ ਤੋਂ ਘੱਟ ਦਾਖ਼ਲਾ ਕੀਮਤਾਂ, ਅਤੇ ਸਭ ਤੋਂ ਸਥਿਰ ਕਿਰਾਏਦਾਰ ਮੰਗ। ਇਹ ਰਿਟਰਨ-ਕੇਂਦਰਿਤ ਨਿਵੇਸ਼ਕਾਂ ਲਈ ਪਹਿਲੀ ਪਸੰਦ ਹੈ, ਅਤੇ ਵਧਦੇ ਹੋਏ ਪਰਿਵਾਰ ਵੀ ਇਸ ਨੂੰ ਸੋਚ-ਸਮਝ ਕੇ ਚੁਣਦੇ ਹਨ।", "ਸਟਾਕ ਦੀ ਗੁਣਵੱਤਾ ਇੱਥੇ ਸ਼ਹਿਰ ਦੀ ਕਿਸੇ ਵੀ ਹੋਰ ਥਾਂ ਨਾਲੋਂ ਵੱਧ ਬਦਲਦੀ ਹੈ, ਇਸੇ ਲਈ ਇਮਾਰਤ-ਪੱਧਰੀ ਸਲਾਹ ਮਾਇਨੇ ਰੱਖਦੀ ਹੈ: ਜੇਵੀਸੀ ਵਿੱਚ ਸਹੀ ਟਾਵਰ ਵਧੀਆ ਪ੍ਰਦਰਸ਼ਨ ਕਰਦਾ ਹੈ; ਗ਼ਲਤ ਨਿਰਾਸ਼ ਕਰਦਾ ਹੈ।"],name_ar:'قرية جميرا الدائرية',stats_ar:['أفضل نقطة دخول من حيث القيمة','عوائد إجمالية تتجاوز ٧٪ عادةً','سيركل مول ومدارس جديدة','طلب قوي من المستأجرين'],name:'Jumeirah Village Circle',sky:'sky-c',img:'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&h=900&q=70',
    stats:['Best-value entry point','Typically 7%+ gross yields','Circle Mall & new schools','Strong tenant demand'],
    blurb:["JVC is where Dubai's rental math works hardest — entry prices among the lowest in new Dubai, tenant demand among the steadiest. It's the default first purchase for yield-focused investors, and increasingly a community families choose on purpose.","Stock quality varies more here than anywhere else in the city, which is exactly why building-level advice matters: the right tower in JVC outperforms; the wrong one disappoints."]},
  'dubai-hills':{name_pa:"ਦੁਬਈ ਹਿਲਜ਼ ਅਸਟੇਟ",stats_pa:["18-ਹੋਲ ਚੈਂਪੀਅਨਸ਼ਿਪ ਗੋਲਫ਼ ਕੋਰਸ", "ਦੁਬਈ ਹਿਲਜ਼ ਮਾਲ", "ਕਮਿਊਨਿਟੀ ਅੰਦਰ ਜੈਮਸ ਸਕੂਲ", "ਕੇਂਦਰੀ ਪਾਰਕ ਤੇ ਰਾਹ"],blurb_pa:["ਦੁਬਈ ਹਿਲਜ਼ ਅਸਟੇਟ ਨਵੇਂ ਦੁਬਈ ਦਾ ਪਰਿਵਾਰਕ ਦਿਲ ਹੈ — ਇੱਕ 18-ਹੋਲ ਕੋਰਸ, ਇੱਕ ਖੇਤਰੀ ਮਾਲ, ਅਤੇ ਪੈਦਲ ਪਹੁੰਚ ਵਾਲੇ ਸਕੂਲਾਂ ਦੁਆਲੇ ਬਣਿਆ ਇੱਕ ਯੋਜਨਾਬੱਧ ਹਰਿਆ ਜ਼ਿਲ੍ਹਾ। ਇੱਥੇ ਵਿਲਾ ਤੇ ਟਾਊਨਹਾਊਸ ਭਾਰੂ ਹਨ, ਕਿਨਾਰਿਆਂ ’ਤੇ ਅਪਾਰਟਮੈਂਟ ਜ਼ਿਲ੍ਹਿਆਂ ਨਾਲ।", "ਨਿਵੇਸ਼ਕਾਂ ਲਈ, ਹਿਲਜ਼ ਸ਼ਹਿਰ ਦੀ ਸਭ ਤੋਂ ਸਥਿਰ ਅੰਤ-ਉਪਭੋਗਤਾ ਮੰਗ ਦਿੰਦਾ ਹੈ: ਪਰਿਵਾਰ ਲੰਬਾ ਕਿਰਾਏ ’ਤੇ ਰਹਿੰਦੇ ਹਨ ਤੇ ਆਖ਼ਰ ਖਰੀਦ ਲੈਂਦੇ ਹਨ, ਜੋ ਰਿਟਰਨ ਤੇ ਮੁੜ-ਵਿਕਰੀ ਦੋਵੇਂ ਸਿਹਤਮੰਦ ਰੱਖਦਾ ਹੈ।"],name_ar:'دبي هيلز استيت',stats_ar:['ملعب غولف بطولات ١٨ حفرة','دبي هيلز مول','مدارس جيمس داخل المجتمع','حديقة ومسارات مركزية'],name:'Dubai Hills Estate',sky:'sky-b',img:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&h=900&q=70',
    stats:['18-hole championship golf','Dubai Hills Mall','GEMS schools in-community','Central park & trails'],
    blurb:["Dubai Hills Estate is the family heart of new Dubai — a masterplanned green district built around an 18-hole course, a regional mall, and schools you can walk to. Villas and townhouses dominate, with apartment districts at the edges.","For investors, Hills offers the steadiest end-user demand in the city: families rent long and buy eventually, which keeps both yields and resale liquidity healthy."]},
  'dubai-marina':{name_pa:"ਦੁਬਈ ਮਰੀਨਾ",stats_pa:["ਮਰੀਨਾ ਪ੍ਰੋਮੇਨੇਡ", "ਟਰਾਮ ਤੇ ਮੈਟਰੋ", "JBR ਬੀਚ ਪੈਦਲ ਦੂਰੀ ’ਤੇ", "ਸਭ ਤੋਂ ਵੱਧ ਕਿਰਾਇਆ ਤਰਲਤਾ"],blurb_pa:["ਮਰੀਨਾ ਦੁਬਈ ਦਾ ਸਭ ਤੋਂ ਤਰਲ ਕਿਰਾਇਆ ਬਜ਼ਾਰ ਹੈ — ਪਾਣੀ ’ਤੇ ਉੱਚੀਆਂ ਇਮਾਰਤਾਂ, ਟਰਾਮ, ਪ੍ਰੋਮੇਨੇਡ, ਅਤੇ ਬੀਚ ਪੈਦਲ ਦੂਰੀ ’ਤੇ।", "ਇੱਥੇ ਯੂਨਿਟ ਤੇਜ਼ੀ ਨਾਲ ਹੱਥ ਬਦਲਦੇ ਹਨ: ਮਰੀਨਾ ਨਜ਼ਾਰੇ ਵਾਲੇ ਵਨ-ਬੈੱਡ ਤੇ ਟੂ-ਬੈੱਡ ਘੱਟ ਹੀ ਖ਼ਾਲੀ ਰਹਿੰਦੇ ਹਨ, ਇਸੇ ਲਈ ਮਰੀਨਾ ਬਹੁਤੇ ਆਮਦਨ-ਕੇਂਦਰਿਤ ਪੋਰਟਫੋਲੀਓ ਦਾ ਅਧਾਰ ਹੈ।"],name_ar:'دبي مارينا',stats_ar:['ممشى المارينا','ترام ومترو','شاطئ JBR على مسافة مشي','أعلى سيولة إيجارية'],name:'Dubai Marina',sky:'sky-a',img:'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1400&h=900&crop=entropy&q=70',
    stats:['Marina promenade','Tram & Metro','JBR beach walkable','Highest rental liquidity'],
    blurb:["The Marina is Dubai's most liquid rental market — high-rise living on the water with the tram, the promenade, and the beach in walking distance.","Units here turn over fast: one-beds and two-beds with a marina view rarely sit vacant, which is why the Marina anchors most income-focused portfolios."]},
  'palm-jumeirah':{name_pa:"ਪਾਮ ਜੁਮੇਰਾ",stats_pa:["ਨਿੱਜੀ ਬੀਚ ਪਹੁੰਚ", "ਟਰਾਫ਼ੀ ਸੰਪਤੀ ਬਜ਼ਾਰ", "ਹੋਟਲ-ਪੱਧਰੀ ਸੇਵਾਵਾਂ", "ਡਾਲਰ ਖਰੀਦਦਾਰਾਂ ਦੀ ਮਜ਼ਬੂਤ ਮੰਗ"],blurb_pa:["ਪਾਮ ਦੁਬਈ ਦਾ ਟਰਾਫ਼ੀ ਪਤਾ ਹੈ — ਬੀਚਫ੍ਰੰਟ ਵਿਲਾ ਤੇ ਬ੍ਰਾਂਡਿਡ ਆਵਾਸ ਜੋ ਆਪਣੇ ਵੱਖਰੇ ਬਜ਼ਾਰ ਵਿੱਚ ਵਿਕਦੇ ਹਨ, ਵੱਡੇ ਪੱਧਰ ’ਤੇ ਅੰਤਰਰਾਸ਼ਟਰੀ ਦੌਲਤ ਨਾਲ ਚੱਲਦੇ।", "ਸਪਲਾਈ ਭੂਗੋਲ ਨਾਲ ਤੈਅ ਹੈ; ਕੋਈ ਦੂਜਾ ਪਾਮ ਨਹੀਂ। ਇਹ ਦੁਰਲੱਭਤਾ ਲੰਬੇ ਸਮੇਂ ਦੀ ਕੀਮਤ ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਸਹਾਰਾ ਦਿੰਦੀ ਹੈ ਜਿਵੇਂ ਦੁਬਈ ਦੇ ਬਹੁਤ ਘੱਟ ਜ਼ਿਲ੍ਹੇ ਕਰ ਸਕਦੇ ਹਨ।"],name_ar:'نخلة جميرا',stats_ar:['وصول إلى شاطئ خاص','سوق الأصول النفيسة','خدمات فندقية','طلب قوي من مشترين بالدولار'],name:'Palm Jumeirah',sky:'sky-d',img:'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1400&h=900&q=70',
    stats:['Private beach access','Trophy-asset market','Hotel-grade services','Strong USD-buyer demand'],
    blurb:["The Palm is Dubai's trophy address — beachfront villas and branded residences that trade in a market of their own, largely driven by international wealth.","Supply is fixed by geography; there is no second Palm. That scarcity underwrites long-term value in a way few Dubai districts can match."]},
  'downtown':{name_pa:"ਡਾਊਨਟਾਊਨ ਦੁਬਈ",stats_pa:["ਬੁਰਜ ਖ਼ਲੀਫ਼ਾ ਜ਼ਿਲ੍ਹਾ", "ਦੁਬਈ ਮਾਲ", "ਓਪੇਰਾ ਤੇ ਬੁਲੇਵਾਰਡ", "ਛੋਟੇ ਠਹਿਰਾਅ ਲਈ ਢੁੱਕਵਾਂ"],blurb_pa:["ਡਾਊਨਟਾਊਨ ਪੋਸਟਕਾਰਡ ਹੈ — ਬੁਰਜ ਨਜ਼ਾਰੇ, ਬੁਲੇਵਾਰਡ, ਅਤੇ ਸ਼ਹਿਰ ਦੀ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਛੋਟੇ-ਠਹਿਰਾਅ ਮੰਗ, ਜੋ ਵਧੀਆ ਥਾਂ ਵਾਲੇ ਯੂਨਿਟਾਂ ’ਤੇ ਪ੍ਰੀਮੀਅਮ ਕਿਰਾਏ ਦਾ ਸਹਾਰਾ ਦਿੰਦੀ ਹੈ।", "ਖਰੀਦਦਾਰ ਇੱਥੇ ਕੁਝ ਰਿਟਰਨ ਨੂੰ ਤਰਲਤਾ ਤੇ ਵੱਕਾਰ ਨਾਲ ਬਦਲਦੇ ਹਨ: ਲੋੜ ਪੈਣ ’ਤੇ ਡਾਊਨਟਾਊਨ ਸਟਾਕ ਦੁਬਈ ਵਿੱਚ ਸਭ ਤੋਂ ਸੌਖਾ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ।"],name_ar:'وسط مدينة دبي',stats_ar:['منطقة برج خليفة','دبي مول','الأوبرا والبوليفارد','مناسب للإقامة القصيرة'],name:'Downtown Dubai',sky:'sky-c',img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&h=900&crop=entropy&q=70',
    stats:['Burj Khalifa district','Dubai Mall','Opera & Boulevard','Short-stay friendly'],
    blurb:["Downtown is the postcard — Burj views, the Boulevard, and the strongest short-stay demand in the city, which supports premium rents on well-positioned units.","Buyers here trade some yield for liquidity and prestige: Downtown stock is the easiest in Dubai to exit when you need to."]}
};

