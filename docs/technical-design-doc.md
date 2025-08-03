# Technical Design Document Template

## Metadata

- **Stage:** [Specify the development stage (e.g., Planning, Development, Testing, Released)]
- **Driver(s):** [List responsible individuals]
- **Approver(s):** [List who must approve this]
- **Consulted Team(s):** [List teams whose input is needed]
- **Consulted:** [List key stakeholders]
- **Informed:** [List people who need to be kept informed]
- **Jira Link:** [Provide a link to the associated Jira ticket]
- **Doc Status:** [Specify document completeness: Draft, 10%, 30%, 80%, 100%]
- **Domains:** [Specify relevant domains]
- **Status:** [Specify project status]
- **Tags:** [Specify applicable tags]
- **Type:** [Specify document type (e.g., Brief, Proposal)]

---

## Narrative & Requirements

### Narrative

#### Where are we now?

- Outline the existing problems and pain points that this project aims to solve.
- Include details on how current solutions are inadequate or inefficient.

#### Where do we want to be?

- Define the goals and objectives for the project.
- Specify key improvements that will be made.
- If applicable, include links to design or workflow documents.

#### Why this matters

- Explain the impact of not achieving the stated goals.
- Highlight risks or blockers preventing broader implementation.

### Requirements

- Clearly define the deliverables of the project.
- Specify new features, interfaces, and functionalities to be introduced.

---

## Dependencies & Risks

### Technical Dependencies

- Identify external services, libraries, APIs, or systems that this project depends on.

### Team Dependencies

- List other teams that need to collaborate on this project.
- Address risks associated with dependencies on other teams.

### Cross Team Agreement and Documentation (Optional)

#### Summary of Agreement

- Explain why cross-team collaboration is necessary.
- Summarize agreed-upon objectives.

#### Agreeing People

- List key stakeholders from each involved team.

#### Links to communication

- Provide links to relevant Slack threads, meeting notes, or documentation.

### Security

- Identify potential security risks.
- If applicable, complete a Rapid Risk Assessment (RRA).

### Risks (Technical & Otherwise)

- List known risks and potential mitigations.

---

## Technical Design

### Overview

- Describe the overall technical approach.
- Link to additional technical documentation if available.

### Current Architecture

- Provide an overview of how the system currently operates.
- Include diagrams if necessary.

### Proposed Architecture

- Describe the changes that will be made.
- Include updated diagrams to illustrate new components.

### System Interaction & Data Flow

- Explain how data will flow through the system.
- Provide sequence diagrams for key processes.

### Persistence

- Describe how data will be stored and managed.

### Access Control

- Define how access permissions will be structured.

### API & Controller Updates

- List new API endpoints and controllers that will be introduced or modified.

---

## Operational Excellence

### Metrics & Monitoring

- Identify key metrics to track the success of the project.
- Specify monitoring tools (e.g., Datadog, Rudderstack).

### Logging & Debugging

- Describe logging strategies to support troubleshooting.

### Runbooks & Incident Response

- Outline response plans for potential failures.

---

## Testing and Integration Plan

### Testing Strategy

- Define the scope of automated vs. manual testing.
- Include details on unit, integration, and end-to-end testing.

### Backward Compatibility

- Describe any risks related to breaking changes.

### QA Environment

- Specify seed data or configurations needed for testing.

---

## Deployment and Release Plan

### Release Strategy

- Outline phases of the release.
- Specify whether feature flags will be used.

### Communication Plan

- Describe how updates will be shared with stakeholders and customers.

### Rollback Plan

- Define criteria for rolling back changes if issues arise.

### Post-Release Monitoring

- Specify tools and metrics for monitoring the release.

---

## Appendix

### Additional Notes

- Include any relevant background information or references.

### References

- Link to external resources, documents, and related briefs.

### Justifications for Design Choices

- Provide explanations for major technical decisions.

---

This template serves as a structured guide for creating technical briefs. Adjust sections as needed to fit project-specific requirements.
