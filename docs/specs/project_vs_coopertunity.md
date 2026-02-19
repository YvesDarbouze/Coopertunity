# Data Object Specification: Project vs. Coopertunity

## Concept
A **Coopertunity** is the posted unit of need or offer. A **Project** is the broader container or successful realization of a Coopertunity.

## 1. The Coopertunity (The "Ask")
*   **Definition**: A discrete, time-bound request or offer displayed in the feed.
*   **Constraint**: "Expertise Needed" field is limited to **12 Keywords**.

### Schema Extension
```json
{
  "id": "uuid",
  "type": "SKILLS_REQUEST",
  "title": "Solar Installation Lead",
  "expertiseNeeded": ["Photovoltaics", "Electrical Engineering", "Project Management"], // Max 12 items
  "willingnessToTeach": true,
  "investmentAmount": null
}
```

## 2. The Project (The "Container")
*   **Definition**: A long-term endeavor that may spawn multiple Coopertunities over time.
*   **Relationship**: One Project -> Many Coopertunities.

### Schema Fields
*   **Project Name**: e.g., "Lagos Tech Hub Construction"
*   **Project Manager**: User ID
*   **Status**: Planning, Active, Completed, On Hold
*   **Sector**: Economic Sector
*   **Team Members**: List of Users (Matches)
*   **Funding Status**: % Funded

## Distinction
| Feature | Coopertunity | Project |
| :--- | :--- | :--- |
| **Duration** | Short-term / Transactional | Long-term / Lifecycle |
| **Purpose** | Connection mechanism | Management container |
| **Keyword Limit**| **Strict 12 keyword limit** | Unlimited description |
| **Visibility** | Public Feed (if verified) | Profile / Dashboard |
