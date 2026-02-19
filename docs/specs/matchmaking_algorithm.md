# Coopertunity Matchmaking Algorithm

## Overview
The core engine of Coopertunity. It connects Diaspora skills and capital with Continental needs. The algorithm produces a **Match Score (0-100)** for each User-Coopertunity pair.

## Scoring Factors & Weights

| Factor | Weight | Description |
| :--- | :--- | :--- |
| **1. Skill Match** | **40%** | Overlap between User `skillsInventory` and Coopertunity `expertiseNeeded`. |
| **2. Geolocation** | **20%** | Proximity or relevance to User's `location` or preferred interest regions. |
| **3. Willingness to Donate** | **15%** | If User is willing to volunteer (Teach) vs. Commercial interest. |
| **4. Industry Relevance** | **15%** | Match between User's `profession` sector and Coopertunity `sector`. |
| **5. Veteran Status** | **10%** | (Conditional) Boost for Security/Logistics roles if `isVeteran` is true. |

## Algorithm Logic (Pseudo-code)

```python
def calculate_match_score(user, coopertunity):
    score = 0
    
    # 1. Skill Match (40 pts)
    # Jaccard Index or simple intersection count
    user_skills = set(user.skillsInventory)
    required_skills = set(coopertunity.expertiseNeeded)
    
    if len(required_skills) > 0:
        intersection = len(user_skills.intersection(required_skills))
        skill_ratio = intersection / len(required_skills)
        score += skill_ratio * 40
    else:
        score += 20 # Baseline if no specific skills listed (General Labor)

    # 2. Geolocation (20 pts)
    # Haversine distance if lat/long available, or Country code match
    if user.location_country == coopertunity.location_country:
        score += 20
    elif user.region == coopertunity.region: # e.g. West Africa
        score += 10
        
    # 3. Willingness to Donate (Teach) (15 pts)
    # High value placed on skills transfer
    if coopertunity.type == 'SKILLS_REQUEST' and user.willingnessToTeach:
        score += 15
        
    # 4. Industry Relevance (15 pts)
    # Taxonomy Sector match
    if user.profession_sector == coopertunity.sector:
        score += 15
        
    # 5. Veteran Status (10 pts)
    if coopertunity.requiresSecurity and user.isVeteran:
        score += 10
        
    return min(score, 100)
```

## Execution
- **Trigger**: Run asynchronously when a new `Coopertunity` is posted or a User updates their profile.
- **Storage**: Store scores > 60 in a `Match` table for efficient querying on the Dashboard.
