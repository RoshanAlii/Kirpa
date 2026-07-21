/* Kirpa Properties — canonical TEAM roster (single source of truth).
   Homepage advisor marquee AND the /team page both render from this array.
   Data confirmed from kirpaproperties.com → "Our Team" (Jul 2026).
   NOTE: per-person languages are NOT stored here because they are not
   published on the source — we do not fabricate them. Add per person only
   when confirmed. */

const TEAM = [
  /* group codes: lead | tl | senior | secondary | offplan | support
     [name, role, group] */
  ['Manpreet Kaur',        'Founder / CEO',                'lead'],
  ['Dr. Jai Chatha',       'Founder / Managing Director',  'lead'],

  ['Kamalpreet Kaur',      'Team Leader · Sales',          'tl'],
  ['Saloni Bedi',          'Team Leader · Sales',          'tl'],
  ['Lipika Madan',         'Team Leader · Sales',          'tl'],
  ['Priyanka Jayanna',     'Team Leader · Sales',          'tl'],
  ['Mohammad Mubeen',      'Team Leader · Sales',          'tl'],

  ['Preety Vijayvargiya',  'Senior Consultant · Commercial','senior'],
  ['Puja Maheshwari',      'Senior Consultant · Secondary', 'senior'],

  ['Kavita Choudhary',     'Consultant · Secondary Sales', 'secondary'],

  ['Vaishali Arora',       'Consultant · Off-Plan',        'offplan'],
  ['Sukhpreet Kaur',       'Consultant · Off-Plan',        'offplan'],
  ['Barkha Kalia',         'Consultant · Off-Plan',        'offplan'],
  ['Kirti Anil Walke',     'Consultant · Off-Plan',        'offplan'],
  ['Sahil Bedi',           'Consultant · Off-Plan',        'offplan'],
  ['Riya Bhardwaj',        'Consultant · Off-Plan',        'offplan'],
  ['Geethika Sri Vyshnavi','Consultant · Off-Plan',        'offplan'],
  ['Sarvnihal Singh',      'Consultant · Off-Plan',        'offplan'],
  ['Aasfa Wahab Shaikh',   'Consultant · Off-Plan',        'offplan'],
  ['Jagraaj Singh',        'Consultant · Off-Plan',        'offplan'],
  ['Akshay Rajendra',      'Consultant · Off-Plan',        'offplan'],
  ['Kirat Singh Sapra',    'Consultant · Off-Plan',        'offplan'],
  ['Sara Banu',            'Consultant · Off-Plan',        'offplan'],
  ['Ritika Kodwani',       'Consultant · Off-Plan',        'offplan'],
  ['Jitendra Makhija',     'Consultant · Off-Plan',        'offplan'],
  ['Arbaaz Ali Khan',      'Consultant · Off-Plan',        'offplan'],
  ['Sahil Mendiratta',     'Consultant · Off-Plan',        'offplan'],
  ['Nikita Lal Tekwani',   'Consultant · Off-Plan',        'offplan'],
  ['Sleeja Misra',         'Consultant · Off-Plan',        'offplan'],
  ['Lovepreet Singh',      'Consultant · Off-Plan',        'offplan'],
  ['Mona Shah',            'Consultant · Off-Plan',        'offplan'],
  ['Spoorthi Hassan',      'Consultant · Off-Plan',        'offplan'],
  ['Faiyaz Mohmedfaruk',   'Consultant · Off-Plan',        'offplan'],
  ['Ameer Agha Shirazi',   'Consultant · Off-Plan',        'offplan'],
  ['Samaksh Malhotra',     'Consultant · Off-Plan',        'offplan'],

  ['Janisha Puri',         'HR Executive',                 'support'],
  ['Inderjeet Kaur',       'Accountant',                   'support'],
  ['Urvashi Karnani',      'Administrator',                'support'],
  ['Param Singh',          'Head of Content',              'support'],
  ['Anmol Singh',          'Content Executive',            'support'],
  ['Amandeep Singh',       'Content Executive',            'support'],
  ['Navjot Kaur',          'Operations Coordinator',       'support'],
  ['Sukhpreet Singh',      'Pilot',                        'support'],
  ['Farheen',              'Front Desk Executive',         'support']
];

/* Six muted tints tuned to the cream canvas. Coral (--coral) is deliberately
   NOT in this palette — it stays reserved for brand/interactive elements. */
const TEAM_TINTS = [
  ['#F5D9CC','#A8431F'], ['#F3E2BE','#8A5E12'], ['#DCE6C8','#556B24'],
  ['#CDE3DC','#2E6E5B'], ['#EBD3DC','#8A3B58'], ['#D3DEEA','#3C5A7A']
];

const TEAM_GROUPS = [
  ['lead',      'Leadership'],
  ['tl',        'Team Leaders · Sales'],
  ['senior',    'Senior Consultants'],
  ['secondary', 'Secondary Sales'],
  ['offplan',   'Off-Plan Sales'],
  ['support',   'Operations & Support']
];

function teamInitials(name){
  var p = name.replace(/^Dr\.\s*/, '').split(' ');
  return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase();
}
function teamEsc(s){ return String(s).replace(/[&<>"]/g, function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

/* small card used in the homepage marquee */
function teamMqCard(person, i){
  var t = TEAM_TINTS[i % TEAM_TINTS.length];
  return '<div class="mq-card">'
       +   '<div class="mq-av" style="background:'+t[0]+';color:'+t[1]+'">'+teamInitials(person[0])+'</div>'
       +   '<div><b>'+teamEsc(person[0])+'</b><span>'+teamEsc(person[1])+'</span></div>'
       + '</div>';
}

/* HOMEPAGE: fill the two marquee tracks. Content is duplicated so the CSS
   loop wraps seamlessly with no visible jump. Leadership is shown separately
   (pinned), so it is excluded here. */
function renderAdvisorMarquee(){
  var a = document.getElementById('advMarqueeA');
  var b = document.getElementById('advMarqueeB');
  if(!a || !b) return;
  var pool = TEAM.filter(function(p){ return p[2] !== 'lead'; });
  var half = Math.ceil(pool.length / 2);
  var rowA = pool.slice(0, half), rowB = pool.slice(half);
  function build(list, off){ return list.map(function(p,i){ return teamMqCard(p, i+off); }).join(''); }
  a.innerHTML = build(rowA, 0) + build(rowA, 0);
  b.innerHTML = build(rowB, 3) + build(rowB, 3);
}

/* /team PAGE: grouped, filterable grid. */
function renderTeamPage(){
  var host = document.getElementById('teamGrid');
  if(!host) return;
  var idx = 0, html = '';
  TEAM_GROUPS.forEach(function(g){
    var people = TEAM.filter(function(p){ return p[2] === g[0]; });
    if(!people.length) return;
    html += '<div class="team-group" data-group="'+g[0]+'">'
          +   '<h3>'+g[1]+' <em>('+people.length+')</em></h3>'
          +   '<div class="team-grid">';
    people.forEach(function(p){
      var t = TEAM_TINTS[idx % TEAM_TINTS.length]; idx++;
      var sales = (g[0] !== 'support');
      html += '<div class="tm-card" data-group="'+g[0]+'">'
            +   '<div class="tm-av" style="background:'+t[0]+';color:'+t[1]+'">'+teamInitials(p[0])+'</div>'
            +   '<b>'+teamEsc(p[0])+'</b><span>'+teamEsc(p[1])+'</span>'
            +   (sales ? '<button class="link tm-book" onclick="if(window.openSheet)openSheet(\'call\',\'\',\'a call with '+teamEsc(p[0])+' ('+teamEsc(p[1])+')\')">Book a call</button>' : '')
            + '</div>';
    });
    html += '</div></div>';
  });
  host.innerHTML = html;
  wireTeamFilters();
}

function wireTeamFilters(){
  var bar = document.getElementById('teamFilters');
  if(!bar) return;
  bar.addEventListener('click', function(e){
    var btn = e.target.closest('[data-filter]'); if(!btn) return;
    var f = btn.getAttribute('data-filter');
    bar.querySelectorAll('[data-filter]').forEach(function(x){ x.classList.toggle('on', x === btn); });
    document.querySelectorAll('.tm-card').forEach(function(c){
      c.style.display = (f === 'all' || c.getAttribute('data-group') === f) ? '' : 'none';
    });
    document.querySelectorAll('.team-group').forEach(function(grp){
      var vis = grp.querySelectorAll('.tm-card:not([style*="display: none"])').length;
      grp.style.display = vis ? '' : 'none';
    });
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function(){
    renderAdvisorMarquee();
    renderTeamPage();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TEAM, TEAM_TINTS, TEAM_GROUPS, teamInitials, renderAdvisorMarquee, renderTeamPage };
}
