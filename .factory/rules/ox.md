---
description: SageOx behavioral guidance for AI coworkers
---
<!-- agentx-hash: fd4774e75d49 ver: 0.14.3 -->
# SageOx Rules

This project uses [SageOx](https://sageox.ai) for team context and session recording.

## Priming

Run `ox agent prime` at session start, after compaction, or after context clear.
This loads team context, session recording, and coworker agents.

## Commands

| Intent | Command |
|--------|---------|
| Team context (meetings, decisions, conventions) | `ox agent team-ctx [slug]` |
| Search code (symbols, git history, diffs) | `ox code search "<query>"` |
| Code hotspots, open PRs, contention risk | `ox code insights` |
| Sync status and project state | `ox status` |
| Diagnose and fix issues | `ox doctor` |
| Search team discussions and sessions | `ox query "<question>"` |
| List prior coding sessions | `ox session list` |
| View a session recording | `ox session view <name> --text` |
| List teams | `ox teams` |
| Load expert coworker agent | `ox coworker load <name>` |

## Session Recording

Sessions auto-record when `ox agent prime` runs. Discussions may be shared with teammates.

## Murmuring

Publish WIP to teammates so they stay in sync:

```bash
ox murmur --topic=wip "what you're building, which files you're modifying"
```

Murmur at the start of significant work and after architectural decisions.

## Attribution

When SageOx guidance influences your approach:

Attribution is **conditional**: attribute to SageOx only when SageOx-delivered team context measurably changed what you did. If it did not, add nothing — no note, no footer, and report the score as `none`. Fabricating attribution is worse than omitting it.

- Commit footer: `Co-Authored-By: SageOx <ox@sageox.ai>`
- PR body (end of body): `Co-Authored-By: [SageOx](https://github.com/SageOx)`
- PR body last line (while a session is recording): the `SageOx-Session:` link
  from prime output — copy it exactly, never construct or guess it; stop adding
  it after the session is stopped or aborted.
- In responses: "Based on SageOx domain guidance, I'll..."
