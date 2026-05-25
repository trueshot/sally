# Tools — sally

## readme.js

**Purpose**: Consumer interface for the sally repo. Default output is a short orientation; flags provide progressive disclosure into salespeople-domain knowledge.

**Location**: `c:/clients/sally/readme.js`

**Usage**:
```
node c:/clients/sally/readme.js [flag]
```

**Commands/Options**:

| Flag         | Description                                                           |
|--------------|-----------------------------------------------------------------------|
| (none)       | Default orientation — what sally does, the one critical fact, commands |
| `--lifecycle` | Load lifecycle (Create → Pre-Post → Post; ordhead vs tordhead)        |
| `--schema`   | SALESMAN.DBF + ORDHEAD.SALESMAN field reference                       |
| `--deals`    | Six deal types (color → headpos → financial)                          |
| `--surfaces` | Where salespeople click (and who owns each surface)                   |
| `--gaps`     | Unowned sales-adjacent areas (candidate growth)                       |
| `--research` | Full research notes markdown                                          |
| `--library`  | `library/INDEX.md`                                                    |
| `--tools`    | This file                                                             |
| `--json`     | Structured data (for `cr.js whois`, programmatic callers)             |
| `--help`,`-h`| List all flags                                                        |

**Examples**:
```bash
node c:/clients/sally/readme.js
# → 30-line orientation: what sally does, the critical ordhead/tordhead fact, command list

node c:/clients/sally/readme.js --lifecycle
# → load lifecycle stages with the divergence-after-Post note

node c:/clients/sally/readme.js --json | jq .key_facts
# → programmatic access to data anchor, lifecycle, deal types
```

**Prerequisites**: Node.js (any version; uses only built-in `fs` + `path`).

**Tips**:
- Default output is intentionally short (under 30 lines). For depth, use a flag.
- `--research` reads from `library/research/` first, then falls back to repo root.
- `--json` is what `cr.js whois sally` will consume.
- If you're asking about salesgrid.js, `/api/v1/data/salespeople`, or the amarillo Sales Module — sally will tell you to defer to pilotbird, detroit, or amarillo respectively.
