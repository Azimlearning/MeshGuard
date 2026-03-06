# Tools Directory

This directory contains **Layer 3** atomic, deterministic utility scripts.

## Rules
- Each script must do ONE thing well.
- All scripts must be independently runnable from the command line.
- Use `.env` for any secrets.
- Write output to `.tmp/` for intermediate files.

## Scripts

| Script | Purpose | Status |
|---|---|---|
| *(none yet)* | — | — |

## Future Candidates
- `tools/test-socket.js` — CLI tool to fire a test `trigger_sos` event and log the response
- `tools/validate-nodes.js` — Validates node array integrity from swarmEngine
- `tools/benchmark-routing.js` — Measures average trace computation time for N nodes
