---
description: Add a new event trigger or template to the game
allowed-tools: Read, Write, Glob, Grep
---

# Add Event: $ARGUMENTS

Add a new event to the Conflict game. The argument should describe the event type (e.g., "assassination attempt" or "oil embargo").

## Event System Overview

Events are triggered by game conditions and generate AI content. They have:
- **Triggers** - Conditions that cause the event
- **Templates** - Fallback content if AI fails
- **Options** - Player choices with consequences

## Event Categories

1. `crisis` - Urgent threats requiring immediate response
2. `opportunity` - Chances to improve situation
3. `diplomatic` - International relations events
4. `military` - Combat and defense events
5. `internal` - Domestic Israeli politics
6. `international` - Global events affecting the region

## Steps

### 1. Define Trigger Conditions

Add to `data/events.yaml`:

```yaml
events:
  {event_id}:
    id: "{event_id}"
    name: "{Event Display Name}"
    category: "{category}"
    
    # When this event can trigger
    triggers:
      # Relationship-based
      relationship:
        country: "{country_id}"
        level: "{relationship_level}"
        direction: "at_or_worse"  # or "at_or_better", "exactly"
      
      # Stability-based
      stability:
        country: "{country_id}"
        level: "{stability_level}"
        direction: "at_or_worse"
      
      # Turn-based
      turn:
        min: 6  # Not before turn 6
        max: 24  # Not after turn 24
      
      # Random chance (per turn when other conditions met)
      probability: 0.15  # 15% chance
      
      # Requires another event to have happened
      requires_event: "{previous_event_id}"
      
      # Excludes if another event active
      excludes_event: "{conflicting_event_id}"
    
    # How urgent is response needed
    urgency: "pressing"  # immediate, pressing, routine
    
    # Which countries are involved
    relatedCountries: ["{country_id}"]
    
    # Cooldown before can trigger again
    cooldownTurns: 6
```

### 2. Create Template Content

Add fallback template (used if AI generation fails):

```yaml
    template:
      title: "{Event Title - max 60 chars}"
      description: |
        {2-3 paragraphs describing the situation.
        Should set up the decision the player must make.
        Max 500 characters.}
      
      advisorOpinions:
        defense: "{Defense minister's view - max 150 chars}"
        foreign: "{Foreign minister's view - max 150 chars}"
        intelligence: "{Mossad chief's view - max 150 chars}"
```

### 3. Define Player Options

Each event needs 2-4 options:

```yaml
    options:
      - id: "option_aggressive"
        label: "{Button text - max 30 chars}"
        description: "{Tooltip explaining choice}"
        effects:
          # Relationship changes
          relationships:
            - country: "{country_id}"
              change: -2  # Levels to shift (negative = worse)
          
          # Stability changes
          stability:
            - country: "{country_id}"
              change: -1
          
          # Budget impact
          budget: -5000000  # Cost in dollars
          
          # Violence points (affects leadership style)
          violencePoints: 5
          
          # Knesset approval
          knessetChange: 1  # Positive = more opposition
          
          # Trigger follow-up event
          triggersEvent: "{followup_event_id}"
        
        # Conditions to show this option
        requires:
          budget: 5000000  # Minimum budget needed
          relationship:
            country: "usa"
            level: "satisfactory"
            direction: "at_or_better"
      
      - id: "option_diplomatic"
        label: "{Diplomatic option}"
        # ... effects
      
      - id: "option_ignore"
        label: "Take no action"
        effects:
          # Usually has consequences for inaction
          stability:
            - country: "israel"
              change: -1
```

### 4. Add AI Prompt Template

Update `data/prompts.yaml` with generation prompt:

```yaml
prompts:
  event_{event_id}:
    system: |
      You are generating content for a political simulation game set in 1997 Middle East.
      Maintain a serious, realistic tone. Events should feel consequential.
      
    user: |
      Generate a {category} event about {event_description}.
      
      Current game state:
      - Turn: {{turn}}
      - Israel stability: {{israel_stability}}
      - Relationships: {{relationships}}
      - Recent events: {{recent_events}}
      
      Generate JSON matching this schema:
      {
        "title": "string (max 60 chars)",
        "description": "string (max 500 chars, 2-3 paragraphs)",
        "advisorOpinions": {
          "defense": "string (max 150 chars)",
          "foreign": "string (max 150 chars)",
          "intelligence": "string (max 150 chars)"
        }
      }
      
      Requirements:
      - Title should be newspaper headline style
      - Description sets up a difficult choice
      - Advisors should disagree to create tension
      - Reference current game state for continuity
```

### 5. Update EventEngine

If the event has unique trigger logic, update `src/engine/EventEngine.ts`:

```typescript
// Add to evaluateTriggers function
if (eventDef.id === '{event_id}') {
  // Custom trigger logic here
}
```

### 6. Add Event Art (Optional)

If this is a new category, add header art specification to art assets doc:
- Size: Full width × 200px
- Style: News photograph aesthetic
- Location: `public/images/events/{category}_header.png`

### 7. Test the Event

Create a test case:

```typescript
describe('{event_id} event', () => {
  it('should trigger when conditions met', () => {
    const state = createMockState({
      // Set up trigger conditions
    });
    const events = EventEngine.evaluateTriggers(state);
    expect(events).toContainEqual(
      expect.objectContaining({ id: '{event_id}' })
    );
  });
});
```

### 8. Summary

Output:
- Event ID and category
- Trigger conditions
- Number of options
- Files modified
