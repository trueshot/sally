#!/usr/bin/env node
// readme.js — Consumer interface for sally repo
// Author: sally gen-1 (2026-05-25)
// Domain: salespeople expertise in ProduceFlow

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

// ===================================================================
// FACETS — domain-knowledge flags. Single source of truth.
// States: (tbd) named, no answer | (unverified) I wrote it, George hasn't
// reviewed | (verified) George confirmed. A specialist CANNOT self-verify.
// Sync contract (facets.js): `--facets` prints one line per facet matching
//   /(--facet-\S+)\s+\((\w+)\)\s*(.*)/  → name, state, description.
//   Then `readme.js <facet-name>` is run to capture the body. Keep (state) tight.
// ===================================================================
const DOMAIN = 'Salespeople expertise — how salespeople work in ProduceFlow';
const FACETS = [
  {
    name: '--facet-salesperson-role',
    state: 'unverified',
    description: 'The salesperson IS the load coordinator — what the role does end to end',
    content: `The salesperson is the human who owns a Load from order to execution.
Canonical narrative (BUSINESS_CONTEXT, Willis/Publix example):

  1. Order receipt   — buyer (e.g. Publix) places an order
  2. Load planning   — set delivery date + destination city
  3. Sourcing        — find a shipper (e.g. Farmwey, Arcadia FL)
  4. Logistics       — compute freight time to destination
  5. Scheduling      — work BACKWARD from delivery to ship date
  6. Booking         — book the shipper purchase + freight (e.g. Acme)
  7. Execution       — track on PowerFLOW boards, hand off to dispatch

So a salesperson assembles a multi-party Load: one buyer, one+ shipper(s),
freight, sometimes a broker. Their accountability lands in ORDHEAD.SALESMAN.
Their editing surface is sload (tordhead); see gainesville:--facet-sales-vs-accounting.`
  },
  {
    name: '--facet-data-anchor',
    state: 'unverified',
    description: 'SALESMAN.DBF to ORDHEAD/TORDHEAD.SALESMAN — how a salesperson is identified in data',
    content: `SALESMAN.DBF is the master list of salespeople (master lookup):
    SALESMAN  c(8)   primary key (short code)
    NAME      c(30)  display name
    CRLF      c(2)   legacy trailing line break

Every Load and every Deal (ORDHEAD / TORDHEAD row) carries:
    SALESMAN  c(8)   FK -> SALESMAN.SALESMAN   (the attribution link)
    TERR      c(5)   territory code (e.g. "BM2")

So "which salesperson owns this load?" = ORDHEAD.SALESMAN joined to SALESMAN.DBF.
In willdev dev fixtures SALESMAN is often blank while TERR is set — territory is
populated independently of salesman there. Read live data with desoto:
    node c:/clients/desoto/tools/dbf-schema.js <path.DBF>
REFERENCES gainesville:--facet-sales-vs-accounting (plan vs posted).`
  },
  {
    name: '--facet-deal-assembly',
    state: 'unverified',
    description: 'The six deal types a salesperson assembles into a Load (color, headpos, financial)',
    content: `A Load (ORDHEAD blank-ABC) is assembled from Deals (ORDHEAD with ABC letter).
The salesperson builds it from six deal types:

  COLOR   TYPE       HEADPOS  FINANCIAL?  ROLE
  Green   Buyer      b        yes         who is buying
  Red     Shipper    s        yes         who supplies (farm/packer)
  Blue    Freight    f        yes         who transports
  Gray    Broker     k        yes         commission party
  Purple  Inventory  i        no          LOT receiving — in BOTH books early
  Orange  StoreReq   q        no          LOAD releasing from storage

  Purple XOR Orange (mutually exclusive). HEADPOS = type letter + index ("b1","s2").
Line items live in ORDTAIL (one ORDHEAD -> many ORDTAIL).
Financial deals are PLANS in sload until pre-post; inventory is the exception
(hits aload early). See gainesville:--facet-sales-vs-accounting.`
  },
  {
    name: '--facet-territory-model',
    state: 'tbd',
    description: 'What the TERR territory code means and what it drives',
    content: `(tbd) ORDHEAD/TORDHEAD/SALESMAN-adjacent records carry TERR c(5)
(observed values like "BM2"). UNANSWERED: what defines a territory, is there a
master territory table, how does TERR relate to SALESMAN, and what does it drive
(routing? reporting? commission splits?). No specialist in the facet graph owns
this. Candidate Sally domain — flagged for George.`
  },
  {
    name: '--facet-rep-commission',
    state: 'tbd',
    description: 'How a sales rep is paid commission on a posted load (NOT liquidation commission)',
    content: `(tbd) gainesville's lifecycle notes only that "accounting adds commissions
after Post" (ordhead-side). UNANSWERED: rate tables, per-salesman payout, where
rep commission is computed/stored. Distinct from detroit:--facet-route-liqcomm
(GET /api/liqcomm = grower LIQUIDATION commission, cf. Core LincolnPark).
No facet covers sales-REP commission. Candidate Sally domain — flagged for George.`
  }
];

// ---------- FACETS index / individual / --json ----------
const facetArg = args.find(a => a.startsWith('--facet-'));
if (args.includes('--facets') || facetArg) {
  if (args.includes('--json')) {
    console.log(JSON.stringify(
      FACETS.map(f => ({ name: f.name, domain: DOMAIN, state: f.state, description: f.description, content: f.content })),
      null, 2));
    process.exit(0);
  }
  if (facetArg) {
    const f = FACETS.find(x => x.name === facetArg);
    if (f) { console.log(`(${f.state}) ${f.description}\n\n${f.content}\n\n— sally gen-1`); }
    else { console.log(`Unknown facet: ${facetArg}\nRun: node readme.js --facets`); }
    process.exit(0);
  }
  // Plain index — one line per facet. (state) kept TIGHT for the sync regex.
  console.log(`\nsally — ${DOMAIN}\n\nFacets (domain-knowledge flags):\n`);
  for (const f of FACETS) {
    console.log(`  ${f.name.padEnd(26)} (${f.state})${' '.repeat(Math.max(1, 13 - f.state.length))}${f.description}`);
  }
  console.log(`\n  Read one:  node readme.js <facet-name>`);
  console.log(`  Built ON the verified gold facet gainesville:--facet-sales-vs-accounting —`);
  console.log(`  Sally references it rather than restating it.\n`);
  process.exit(0);
}

// ---------- JSON ----------
if (args.includes('--json')) {
  console.log(JSON.stringify({
    repo: 'sally',
    corporal: 'sally',
    billet: 'sallySalespeople',
    island: 'core-sallisaw',
    domain: 'Salespeople expertise — how salespeople work in ProduceFlow',
    tools: [
      { name: 'readme.js', purpose: 'This file. Consumer interface.' }
    ],
    docs: [
      { name: 'library/research/research-2026-05-25.md',
        purpose: 'Initial sweep: SALESMAN.DBF, ordhead/tordhead, deal types, surfaces, gaps' },
      { name: 'library/INDEX.md',
        purpose: 'Library contents index' }
    ],
    key_facts: {
      data_anchor: 'SALESMAN.DBF (c:/clients/willdev/dbf/SALESMAN.DBF) → ORDHEAD.SALESMAN FK',
      critical_distinction: 'Salespeople work in tordhead.dbf (sales workspace), NOT ordhead.dbf (accounting books)',
      lifecycle: 'Create → Sales works in tordhead → Pre-Post → Post',
      deal_types: ['green:buyer', 'red:shipper', 'blue:freight', 'gray:broker', 'purple:inventory', 'orange:storereq']
    },
    unowned_areas: [
      '/api/v1/data/salespeople (detroit route i_salesmen.js)',
      'amarillo Sales Module',
      'commission calculation',
      'sales performance metrics',
      'territory (TERR) model'
    ],
    status: 'modest scope at birth — fleshing out'
  }, null, 2));
  process.exit(0);
}

// ---------- LIFECYCLE ----------
if (args.includes('--lifecycle')) {
  console.log(`
# Load Lifecycle — where the salesperson lives

THE CRITICAL FACT: two filing systems, salespeople work in the second one.

  ordhead.dbf  (in .\\dbf\\)               = ACCOUNTING'S BOOKS  (GL/AR/AP)
  tordhead.dbf (in .\\loads\\X\\LOADNUM\\)   = SALES WORKSPACE

## Stages

  1. CREATE     → ordhead gets abc=' ' row; .\\loads\\X\\LOADNUM\\ folder created
  2. SALES      → tordhead edits (buyer/shipper/freight); ordhead untouched
                  EXCEPT: Inventory (purple) + StoreReq (orange) update BOTH
  3. PRE-POST   → financial entries pushed to ordhead, marked on_hold=true
  4. POST       → accounting verifies, removes on_hold (commits to GL/AR/AP)

## Divergence after Post (real and expected)

  Accounting ADDS to ordhead: commissions, payment lines, supplier invoice #s
  Sales      ADDS to tordhead: late shipper/freight changes

  Accounting is "more real" — sales has "the full picture."

## App aliases (frontend)

  i_aload  = ordhead  view
  i_sload  = tordhead view

Source: pilotbird:--facet-aload-sload (verified facet)
`);
  process.exit(0);
}

// ---------- SCHEMA ----------
if (args.includes('--schema')) {
  console.log(`
# Salesperson Data Schema

## SALESMAN.DBF  (master lookup)
   Path:    c:/clients/willdev/dbf/SALESMAN.DBF
   Records: 1 (willdev dev fixture; production differs)

   SALESMAN  c(8)    primary key (short code)
   NAME      c(30)   display name
   CRLF      c(2)    legacy trailing line break

## ORDHEAD.DBF  (sales attribution fields)
   Path:    c:/clients/willdev/dbf/ORDHEAD.DBF
   Records: 81,793

   INVCE_NO    c(8)   load number
   ABC         c(1)   blank = Load,  letter = Deal
   SALESMAN    c(8)   FK → SALESMAN.SALESMAN  ← THE LINK
   TERR        c(5)   territory code (e.g. "BM2")
   ID_NO       c(6)   customer ID
   ID_NAME     c(25)  customer name
   CUST_ORDER  c(15)  customer's PO number

## Reading these tables

   node c:/clients/desoto/tools/dbf-schema.js <path.DBF>
   node c:/clients/desoto/tools/dbf-query.js  <path.DBF> --count N --json
`);
  process.exit(0);
}

// ---------- DEALS ----------
if (args.includes('--deals')) {
  console.log(`
# The Six Deal Types

A Load (ORDHEAD abc=' ') contains Deals (ORDHEAD with letter code).
Salespeople assemble loads from these six deal types:

  COLOR   TYPE         HEADPOS  FINANCIAL?  NOTES
  ──────  ───────────  ───────  ──────────  ─────────────────────────────
  Green   Buyer        b        yes         Who's buying
  Red     Shipper      s        yes         Who's supplying (farm/packer)
  Blue    Freight      f        yes         Who's transporting
  Gray    Broker       k        yes         Commission party
  Purple  Inventory    i        no          In BOTH ordhead+tordhead always
  Orange  Store Req    q        no          In BOTH ordhead+tordhead always

  Purple ⊥ Orange  (mutually exclusive — a load either receives or releases)

  headpos field on ORDHEAD = type letter + position index (e.g. "b1", "s2", "f1")
`);
  process.exit(0);
}

// ---------- SURFACES ----------
if (args.includes('--surfaces')) {
  console.log(`
# Where Salespeople Actually Click

## Frontend  (owned by pilotbird)
  salesgrid.js                                            — sales grid rendering
  init.js → initSymphony → salesButton → containers       — sales screen init
  pilotbird:--facet-aload-sload                           — two-pass header rendering

## API Gateway  (owned by detroit)
  GET /api/v1/data/salespeople    routes/i_salesmen.js   ← UNCLAIMED
  (variants: i_salesment, salesmen [legacy])

## UI Modules  (owned by amarillo)
  Sales Module in Desktop sidebar                         ← NO BILLET OWNER

When asked about these surfaces, DEFER to the actual specialist.
`);
  process.exit(0);
}

// ---------- GAPS ----------
if (args.includes('--gaps')) {
  console.log(`
# Unowned Sales-Adjacent Areas

These are candidate growth domains for Core Sallisaw. Per current
guidance: do NOT claim without asking George first.

  1. /api/v1/data/salespeople        (detroit route, unclaimed)
  2. amarillo Sales Module           (sidebar entry, no billet owner)
  3. Commission calculation          (lives in ordhead post-Post, owner?)
  4. Sales performance metrics       (no facet found for sales reporting)
  5. Territory (TERR field) model    (used everywhere, undocumented)

For full discussion see:  node c:/clients/sally/readme.js --research
`);
  process.exit(0);
}

// ---------- RESEARCH ----------
if (args.includes('--research')) {
  const p = path.join(__dirname, 'library', 'research', 'research-2026-05-25.md');
  const fallback = path.join(__dirname, 'research-2026-05-25.md');
  const f = fs.existsSync(p) ? p : (fs.existsSync(fallback) ? fallback : null);
  if (f) {
    console.log(fs.readFileSync(f, 'utf8'));
  } else {
    console.log('No research notes found.');
  }
  process.exit(0);
}

// ---------- LIBRARY ----------
if (args.includes('--library')) {
  const idx = path.join(__dirname, 'library', 'INDEX.md');
  if (fs.existsSync(idx)) {
    console.log(fs.readFileSync(idx, 'utf8'));
  } else {
    console.log('library/INDEX.md not found.');
  }
  process.exit(0);
}

// ---------- TOOLS ----------
if (args.includes('--tools')) {
  const t = path.join(__dirname, 'TOOLS.md');
  if (fs.existsSync(t)) {
    console.log(fs.readFileSync(t, 'utf8'));
  } else {
    console.log('No TOOLS.md yet — sally has no tools beyond readme.js.');
  }
  process.exit(0);
}

// ---------- HELP ----------
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
# sally readme.js — flags

  (no args)      Default orientation
  --lifecycle    Load lifecycle (ordhead vs tordhead, Pre-Post, Post)
  --schema       SALESMAN.DBF + ORDHEAD.SALESMAN field reference
  --deals        Six deal types (color → headpos → financial)
  --surfaces     Where salespeople click (and who owns each surface)
  --gaps         Unowned sales-adjacent areas (candidate growth)
  --research     Full research notes (markdown)
  --library      library/INDEX.md
  --tools        TOOLS.md
  --facets       Domain-knowledge facets (state-tagged); <facet-name> reads one
  --json         Structured data (for cr.js whois, programmatic use)
  --help, -h     This message
`);
  process.exit(0);
}

// ---------- DEFAULT ----------
console.log(`
# sally — Salespeople Expertise in ProduceFlow

I am the network's expert on salespeople. My billet is sallySalespeople;
my island is core-sallisaw.

## The one fact you most need to know

Two filing systems exist. Salespeople work in the SECOND one.

  ordhead.dbf   = accounting's books
  tordhead.dbf  = sales workspace   ← salespeople live here

Sales work doesn't touch the books until Pre-Post → Post.

## Quick commands

  node readme.js --lifecycle   Load lifecycle (Create → Pre-Post → Post)
  node readme.js --schema      SALESMAN.DBF + ORDHEAD.SALESMAN fields
  node readme.js --deals       Six deal types salespeople assemble
  node readme.js --surfaces    UI/API surfaces salespeople touch
  node readme.js --gaps        Unowned sales-adjacent areas
  node readme.js --research    Full research notes
  node readme.js --library     library/INDEX.md
  node readme.js --tools       TOOLS.md
  node readme.js --help        All flags

## Defer to others for

  pilotbird   salesgrid.js, aload/sload rendering
  detroit     /api/v1/data/salespeople route
  amarillo    Sales Module UI

## Questions?

  DM sally
`);
