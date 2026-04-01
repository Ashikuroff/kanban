# Kanban Project Requirements

## v1 Requirements (MVP)

### Board Management
- [ ] **BOARD-01**: Application displays exactly one Kanban board on load
- [ ] **BOARD-02**: Board state is maintained in-memory during user session
- [ ] **BOARD-03**: Board opens with dummy data populated for immediate usability

### Column Management
- [ ] **COLUMN-01**: Board contains exactly 5 columns
- [ ] **COLUMN-02**: Users can rename any of the 5 columns
- [ ] **COLUMN-03**: Column order is preserved left-to-right
- [ ] **COLUMN-04**: Column titles are stored as text (no formatting or special characters required)

### Card Management
- [ ] **CARD-01**: Users can add new cards to any column
- [ ] **CARD-02**: Cards have a title field (editable text)
- [ ] **CARD-03**: Cards have a details field (editable text)
- [ ] **CARD-04**: Users can delete existing cards from any column
- [ ] **CARD-05**: Cards remain in their columns until moved or deleted
- [ ] **CARD-06**: Each card has a unique identifier

### Drag and Drop Interface
- [ ] **DRAG-01**: Cards can be dragged between columns
- [ ] **DRAG-02**: Cards can be reordered within the same column
- [ ] **DRAG-03**: Visual feedback is provided during drag operations
- [ ] **DRAG-04**: Drop zones are highlighted when dragging over valid targets
- [ ] **DRAG-05**: Drag and drop is operable via keyboard and screen readers

### User Interface
- [ ] **UI-01**: Implement exact color scheme from requirements:
    - Accent Yellow: `#ecad0a` - accent lines, highlights
    - Blue Primary: `#209dd7` - links, key sections
    - Purple Secondary: `#753991` - submit buttons, important actions
    - Dark Navy: `#032147` - main headings
    - Gray Text: `#888888` - supporting text, labels
- [ ] **UI-02**: Professional, polished appearance
- [ ] **UI-03**: Responsive layout works on desktop and tablet screens
- [ ] **UI-04**: No archive functionality
- [ ] **UI-05**: No search/filter functionality
- [ ] **UI-06**: No extra features beyond those explicitly listed

## v2 Requirements (Future Considerations)
- [ ] **BOARD-V2-01**: Support for multiple boards
- [ ] **COLUMN-V2-01**: Column color coding
- [ ] **COLUMN-V2-02**: Adjustable column widths
- [ ] **CARD-V2-01**: Due dates on cards
- [ ] **CARD-V2-02**: Labels/tags for cards
- [ ] **CARD-V2-03**: Checklists within cards
- [ ] **CARD-V2-04**: File attachments to cards
- [ ] **CARD-V2-05**: Comments on cards
- [ ] **DRAG-V2-01**: Swimlanes within columns
- [ ] **DRAG-V2-02**: WIP limits enforcement
- [ ] **UI-V2-01**: Local storage persistence
- [ ] **UI-V2-02**: Export/import board as JSON
- [ ] **UI-V2-03**: Undo/redo functionality
- [ ] **UI-V2-04**: Keyboard shortcuts
- [ ] **UI-V2-05**: Real-time collaboration
- [ ] **UI-V2-06**: User accounts and authentication

## Out of Scope
- [Advanced Reporting] — Explicitly excluded per requirements: "No archive, no search/filter"
- [Workflow Automation] — Explicitly excluded per requirements: "Keep it simple"
- [Third-party Integrations] — Explicitly excluded per requirements: "No persistence" and "No user management"
- [Mobile Applications] — Web-only MVP as specified
- [Offline Support] — Not required for MVP
- [Multi-language Support] — English only for MVP
- [Theme Customization] — Use specified color scheme only
- [Advanced Permissions] — No user management in MVP
- [Audit Trails] — Not required for MVP
- [Notifications] — No notification systems
- [Calendar Views] — No timeline, calendar, or Gantt chart views
- [Time Tracking] — No hours spent or estimation features
- [Dependencies] — No card linking or dependency tracking
- [Epics/Stories] — No hierarchical card organization
- [Voting/Rating] — No user voting or rating systems
- [Analytics Dashboard] — No metrics or reporting interface
- [Custom Fields] — No extensible card attribute system
- [Automation Rules] — No if-this-then-that style automation
- [Templates Marketplace] — No community template sharing

## Traceability Section
*This section will be updated during roadmap creation to map requirements to phases.*
