#!/usr/bin/env node
// readme.js — Consumer interface for sally repo
// Author: sally gen-1 (2026-05-25)
// Domain: salespeople expertise in ProduceFlow

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

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
