# Description templates

One per issue type. Read only the section you need. Drop a section only if it truly doesn't apply.

### Story
```
## User story
As a <user>, I want <goal> so that <benefit>.

## Context
<What prompted this; where the app is today.>

## Scope
**In:** ...
**Out:** ...

## Acceptance criteria
- [ ] ...
- [ ] ...

## Technical notes
<Approach ideas, APIs/components involved, open questions.>

## References
- Branch / commit: `<branch>` @ `<sha>`
- Files: ...
```

### Subtask
```
## What
<The specific piece of the parent story.>

## Done when
- [ ] ...

## Files
- ...
```

### Task (standalone)
```
## What
<The work to do, in a few sentences.>

## Why
<What it unblocks or why it's needed.>

## Context
<Where things stand today; what prompted this.>

## Done when
- [ ] ...

## References
- Branch / commit: `<branch>` @ `<sha>`
- Files: ...

## Why deferred
...
```

### Issue (bug)
```
## Summary
<One or two sentences: what's broken.>

## Steps to reproduce
1. ...

## Expected
...

## Actual
...  (include error message / console output if any)

## Suspected cause
<file:line and reasoning, if known — say "unknown" otherwise.>

## Impact
<Who/what is affected, how often, any workaround.>

## Environment
- Branch / commit: `<branch>` @ `<sha>`
- Where: frontend / backend / both

## Why deferred
<Why this wasn't fixed when found.>
```

### Improvement / refactor
```
## Current state
<How it works now, with file:line.>

## Problem
<Why that's a problem: maintainability, perf, correctness risk, DX.>

## Proposed change
<What to do instead. Alternatives if any.>

## Benefits
...

## Risks / effort
<What could break; rough size S / M / L.>

## Done when
- [ ] ...

## Why deferred
...
```

### Idea
```
## Idea
<The idea in a few sentences.>

## Why it might be worth it
...

## Open questions
- ...

## Possible first step
<Smallest thing that would validate it.>
```

### Epic
```
## Goal
<The feature area and the outcome it delivers.>

## Stories (planned)
- ...

## Out of scope
...
```
