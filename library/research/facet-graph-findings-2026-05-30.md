# Sally Research Round 2 — Facet-Graph Sourced

**Date:** 2026-05-30
**Author:** sally gen-1 (on claude-opus-4-8)
**Method:** Facet graph (neoga, `--db facets`) as primary source, cross-checked
against `_SYSTEM_KNOWLEDGE/BUSINESS_CONTEXT/General ProduceFLOW Information.md`.
**Why:** George's guidance — the network's curated knowledge lives in the facet
graph. Query the specialists who already documented things; don't reverse-engineer
files.

---

## 1. THE gold facet: sales vs accounting (verified, taught by George)

**Source: `gainesville:--facet-sales-vs-accounting` — VERIFIED, taught by George 2026-05-27**

> "This is the most important domain distinction for choosing where a document
> gets its data. Most documents use sload."

| | SLOAD = the PLAN | ALOAD = the REAL accounting txn |
|---|---|---|
| What | What the salesman has entered | Financial txns pre-posted from sales |
| DBF | `loads/0/{loadnum}/tordhead.dbf` + `tordtail.dbf` (per-load folder) | `ordhead.dbf` + `ordtail.dbf` (central, 100Ks of records) |
| `_app` | `_app.i_sload[loadnum]` | `_app.i_aload[loadnum]` |
| Status | NOT accounting truth — plans for what *will* be invoiced/paid | Accounting reality (or candidate once posted) |

**Lifecycle (canonical):**
1. Load created → single row in central ORDHEAD, `invce_no` set, blank `abc`. That row IS the load's identity.
2. Salesman works → fills tordhead/tordtail (sload). Financial deals (invoice, PO) exist **only in sload** at this stage — they're plans.
3. **Inventory is the exception** → inventory deals can appear in aload *earlier* than financial ones (inventory affects real facts immediately).
4. Pre-post → salesman pushes financial txns to accounting → appear in ORDHEAD/ORDTAIL (aload) as UNPOSTED.
5. Accounting accepts → POSTED. Receivables, payables, GL booked.

**Data-shape gotchas (these bite):**
- `sload[load].ORDHEAD` keys are **underscore-prefixed** (`_A`, `_B`…). Always has every deal. `ORDTAIL` is one flat array — filter by `.abc`.
- `aload[load]` keys are **bare letters** (`D`), plus a `'0'` navigation record. **Missing key ≠ "no such deal" — it means "not pre-posted yet."**
- "When in doubt: sload" — most documents represent current sales intent (BOLs, pick tickets, sales confirmations, draft invoices). Use aload only for posted-accounting state (posted invoice, statement, AR aging).

Parallel facets: `appleton:--facet-sload-vs-aload` (global-object side), `pilotbird:--facet-aload-sload` (rendering/business model).

**This supersedes my round-1 framing.** Round-1 said "accounting is more real, sales has the full picture" — accurate, but gainesville is the verified, George-taught canonical version. Cite gainesville first.

---

## 2. How the sales SCREEN gets populated

**Source: `pilotbird:--facet-surface-init` (verified)**

```
init.js (indiahook) → _app.fn.initSymphony() (symphony.js, kansascity)
  → dispatches app_button_clicked {salesButton}
  → uiMiddleware.js (louisville) routes to mainAppsHandlers['salesButton']
  → clickhandlers.js (pittsburgh) shows leftMainItemsSalesContainer + gridSalesContainer
```

**Source: `pilotbird:--facet-grid-content-generation` (verified)**
- The **Sales** view (`.gridSales`) is **LEGACY** — a `salesgrid.js` IIFE.
- The **Loads** view (`.gridLoads`) is the modern pattern — iframe programs via `loadProgram`.
- So sales UI is the old generation; loads UI is the new one. Worth knowing if sales-screen modernization ever comes up.

**Symphony is OWNED (correction to an earlier assumption):**
- `kansascity:--facet-architecture` — symphony.js structure
- `sylvansprings:--facet-bootstrap` — how Symphony initializes the trader interface
- Chain owners: init.js=indiahook, symphony.js=kansascity, uiMiddleware.js=louisville, clickhandlers.js=pittsburgh

---

## 3. Data loading: sload-first, aload-fallback

**Source: `auburndale:--facet-data-fallback` (unverified)**

`populateStrips()` parses `invce_no` → `load_no` + `abc`, then:
1. Try `_app.i_sload[load_no].ORDHEAD['_'+abc]`
2. Fallback `_app.i_aload[load_no][abc].ORDHEAD`

(auburndale glosses sload="super load" aggregated / aload="abc load" per-ABC — a
slightly different gloss than gainesville's plan-vs-posted, but mechanically the
same two sources. Trust gainesville for the *business* meaning.)

---

## 4. Grounding in BUSINESS_CONTEXT (the Willis/Publix narrative)

`General ProduceFLOW Information.md` gives the canonical salesperson story:
the salesperson is the **load coordinator** (Willis Produce in the example).
Order receipt → load planning → sourcing (Farmwey) → freight (Acme) →
scheduling backward from delivery → booking → execution on PowerFLOW boards.

The doc's data model matches the graph exactly:
- **Load** = ORDHEAD with blank ABC. **Deal** = ORDHEAD with ABC code.
- Six deal types (Green Buyer / Red Shipper / Blue Freight / Gray Broker /
  Purple Inventory / Orange StoreReq); Purple ⊥ Orange.
- Line items live in ORDTAIL (one ORDHEAD → many ORDTAIL).

The graph adds what the doc doesn't spell out: that the salesperson's editing
surface is **sload (tordhead)** and the books are **aload (ordhead)**, with the
pre-post/post boundary between them.

---

## 5. Commission — PARTIAL coverage (correction)

Not a total gap. The graph has:
- **`detroit:--facet-route-liqcomm`** (tbd, unclaimed) — `GET /api/liqcomm`,
  "Liquidation commission." Relates to grower liquidations (cf. Core LincolnPark).

But **general sales-rep commission** (rate tables, per-salesman payout on a
posted load) still has no dedicated facet. The gainesville lifecycle notes only
that "accounting adds commissions post-Post." So: liquidation commission has an
API surface; rep-commission calculation remains undocumented in the graph.

---

## 6. Genuine gaps the graph confirms (silent on these)

| Topic | Facet coverage | Note |
|---|---|---|
| Territory (TERR) model | NONE | `TERR c(5)` is on every ORDHEAD/TORDHEAD (e.g. "BM2") but no specialist documents what territory codes mean or drive |
| Rep commission calc | NONE (liqcomm ≠ this) | Only "accounting adds it post-Post" |
| Sales performance metrics | NONE | No reporting/dashboard facet |
| SALESMAN.DBF ownership | NONE | The master table itself has no specialist |

`cr.js search sales` / `search salesman` → empty. No corporal, billet, or island
besides Sally claims the salesperson domain. That is exactly the opening Sally fills.

---

## 7. Surface ownership map (graph-confirmed)

| Surface | Facet | Owner |
|---|---|---|
| Sales/accounting business model | gainesville:--facet-sales-vs-accounting (verified) | gainesville |
| sload/aload global objects | appleton:--facet-sload-vs-aload | appleton |
| aload/sload rendering | pilotbird:--facet-aload-sload (verified) | pilotbird |
| sales screen init | pilotbird:--facet-surface-init (verified) | pilotbird |
| grid content gen (sales=legacy) | pilotbird:--facet-grid-content-generation (verified) | pilotbird |
| sload→aload fallback | auburndale:--facet-data-fallback | auburndale |
| Symphony orchestration | kansascity:--facet-architecture, sylvansprings:--facet-bootstrap | kansascity / sylvansprings |
| GET /api/v1/data/salespeople | detroit:--facet-route-i_salesmen | UNCLAIMED |
| GET /api/liqcomm | detroit:--facet-route-liqcomm | UNCLAIMED |
| Sales Module (sidebar) | amarillo:--facet-module-sales | NO OWNER |

---

## 8. Next actions

1. **Read `appleton:--facet-sload-vs-aload`** next session — the global-object companion to gainesville.
2. **Declare Sally's own facets** and connect them (REFERENCES) to gainesville / pilotbird / appleton. Convention learned this round: `--facet-*` flags in readme.js, three states `(tbd)→(unverified)→(verified)`; only the specialist fills, only George verifies; then `facets.js sync sally`.
3. **DM gainesville** — thank/cite; she holds the verified gold facet. Sally should build on it, not restate it.
4. **Raise with George:** territory model + rep-commission calc are the cleanest unclaimed sales domains.
