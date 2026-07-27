/* Binary QA for the team implementation. Run: node team.test.js */
const fs = require('fs');
const path = require('path');
const { TEAM, TEAM_TINTS, teamInitials } = require('./assets/team.js');

let pass = 0, fail = 0;
function ok(name, cond){ (cond ? (pass++, console.log('  PASS  '+name)) : (fail++, console.log('  FAIL  '+name))); }

const idx  = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const team = fs.readFileSync(path.join(__dirname,'team.html'),'utf8');
const css  = fs.readFileSync(path.join(__dirname,'assets/kirpa.css'),'utf8');
const premium = fs.readFileSync(path.join(__dirname,'assets/premium.js'),'utf8');
const experience = fs.readFileSync(path.join(__dirname,'assets/experience.js'),'utf8');
const listing = fs.readFileSync(path.join(__dirname,'properties/listing.html'),'utf8');

console.log('\n— roster data —');
ok('44 people total', TEAM.length === 44);
const by = g => TEAM.filter(p => p[2] === g).length;
ok('2 leadership',        by('lead') === 2);
ok('5 team leaders',      by('tl') === 5);
ok('2 senior consultants',by('senior') === 2);
ok('1 secondary',         by('secondary') === 1);
ok('25 off-plan',         by('offplan') === 25);
ok('9 support',           by('support') === 9);
ok('every row is [name,role,group] — no fabricated language field', TEAM.every(p => p.length === 3));
ok('no empty names/roles', TEAM.every(p => p[0].trim() && p[1].trim()));
ok('no duplicate names', new Set(TEAM.map(p=>p[0])).size === TEAM.length);
ok('initials handle "Dr." prefix', teamInitials('Dr. Jai Chatha') === 'JC');
ok('coral not used as an avatar tint', !TEAM_TINTS.some(t => /ff6633/i.test(t[0]) || /ff6633/i.test(t[1])));

console.log('\n— homepage (index.html) —');
ok('loads team.js', /assets\/team\.js/.test(idx));
ok('links to team.html', /href="team\.html"/.test(idx));
ok('leadership stage present', /class="advisor-stage/.test(idx));
ok('advisor accountability promise present', /class="advisor-promise/.test(idx));
ok('founders pinned (Manpreet)', /Manpreet Kaur/.test(idx));
ok('founders pinned (Dr. Jai Chatha)', /Dr\. Jai Chatha/.test(idx));
ok('inventory count mount point present', /id="inventoryCount"/.test(idx));
ok('inventory count derives from listing data', /inventory\.textContent=LISTINGS\.length/.test(premium));
ok('old "96 listings" removed', !/96 listings/.test(idx));
ok('old "11 agents" removed', !/11 agents/.test(idx));
ok('old 3-advisor language spans removed', !/adv\.l\.kp/.test(idx));
ok('CSS cache-busted to v=27', /kirpa\.css\?v=27/.test(idx));
ok('immersive experience layer loaded', /assets\/experience\.js/.test(idx));
ok('cinematic residence runway present', /class="residence-runway/.test(idx) && /data-runway-next/.test(idx));
ok('spatial atlas layers present', (idx.match(/data-atlas-layer=/g)||[]).length === 3);
ok('atlas renders recorded residence matches', /paintMatches/.test(premium) && /data-atlas-matches/.test(idx));

console.log('\n— team page (team.html) —');
ok('loads team.js', /assets\/team\.js/.test(team));
ok('has grid mount point', /id="teamGrid"/.test(team));
ok('has filter bar', /id="teamFilters"/.test(team));
ok('filter buttons wired', (team.match(/data-filter=/g)||[]).length >= 6);
ok('reuses site nav', /nav-links/.test(team) && /KIRPA/.test(team));
ok('canonical url set', /canonical" href="https:\/\/roshanalii\.github\.io\/Kirpa\/team\.html"/.test(team));

console.log('\n— premium styles (kirpa.css) —');
ok('quiet-future palette present', /--panel:#191915/.test(css) && /--champagne:#B99A69/.test(css));
ok('liquid-glass system present', /--glass-dark:rgba/.test(css) && /\.hero-segments\{/.test(css));
ok('luminous edit palette present', /--pool:#2CB7B0/.test(css) && /--sky:#5B7CFA/.test(css));
ok('advisor stage styles present', /\.advisor-stage\{/.test(css) && /\.advisor-promise\{/.test(css));
ok('reduced-motion override present', /prefers-reduced-motion:reduce/.test(css) && /animation-duration:\.01ms/.test(css));
ok('team grid + card styles', /\.team-grid\{/.test(css) && /\.tm-card\{/.test(css));
ok('spatial luxury styles present', /KIRPA SPATIAL LUXURY/.test(css) && /\.residence-runway/.test(css));
ok('navigation context and brand wipe wired', /nav-context/.test(experience) && /kr-star-wipe/.test(experience));
ok('concierge Command-K shortcut wired', /Meta\+K Control\+K/.test(experience));
ok('property gallery modes present', /data-gallery-mode="photography"/.test(listing) && /id="mediaLightbox"/.test(listing));
ok('property ownership context present', /class="ownership-brief"/.test(listing) && /id="communityContext"/.test(listing));

console.log('\n'+ (fail ? '❌ '+fail+' FAILED, '+pass+' passed' : '✅ ALL '+pass+' TESTS PASSED') +'\n');
process.exit(fail ? 1 : 0);
