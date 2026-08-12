# AOBNAP Application Workflow

## Status Flow (No Appeals)

```
  ┌────────────────────────┐
  │       DRAFT            │ ← Business Owner creates application
  └──────────┬─────────────┘
             │ submit
             ▼
  ┌────────────────────────┐
  │     SUBMITTED          │ ← System runs automatic validation
  └──────┬─────────┬───────┘
         │ pass    │ fail
         ▼         ▼
  ┌──────────┐  ┌───────────────────────────┐
  │PERMISSION│  │AUTOMATIC_VALIDATION_FAILED│ ← Owner can correct & resubmit
  │ PENDING  │  └───────────────────────────┘
  └──┬───┬───┤
     │   │   │
     │   │   └── request correction ──► PERMISSION_CORRECTION_REQUIRED
     │   │                                      │
     │   │                              owner corrects
     │   │                                      │
     │   │                              ◄───────┘ (back to PERMISSION_PENDING)
     │   │
     │   └── reject ──► PERMISSION_REJECTED (terminal)
     │
     └── approve
         │
  ┌──────▼─────────────────┐
  │ PERMISSION_APPROVED    │
  └──────────┬─────────────┘
             │ auto-advance
  ┌──────────▼─────────────┐
  │ LANGUAGE_REVIEW_PENDING│ ← Language Officer reviews
  └──┬───┬───┬─────────────┘
     │   │   │
     │   │   └── request correction ──► LANGUAGE_CORRECTION_REQUIRED
     │   │                                      │
     │   │                              owner corrects
     │   │                                      │
     │   │                              ◄───────┘ (back to LANGUAGE_REVIEW_PENDING)
     │   │
     │   └── reject ──► LANGUAGE_REJECTED (terminal)
     │
     └── approve (digital sign)
         │
  ┌──────▼─────────────────┐
  │     APPROVED           │ ← Certificate + QR + Registry entry created
  └────────────────────────┘
```

## Key Rules
1. Permission MUST be approved before language review can proceed
2. Language approval triggers a single atomic transaction: certificate + registry + notifications
3. Corrections loop back to the same stage (permission or language)
4. Terminal states: PERMISSION_REJECTED, LANGUAGE_REJECTED, APPROVED, AUTOMATIC_VALIDATION_FAILED
