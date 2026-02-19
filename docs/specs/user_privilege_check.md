# User Privilege & Access Control Logic

## Overview
Access to functionalities is strictly governed by the `isAfrican` flag (Self-ID) and `isVeteran` status.

## Function: `check_user_privilege(user)`

### Pseudo-code
```python
def check_user_privilege(user):
    privileges = {
        'can_search_people': False,
        'can_post_coopertunity': False,
        'can_view_sensitive_projects': False,
        'can_read_articles': True, # Universal Access
        'visibility_level': 'GUEST'
    }

    # 1. African Identity Check (Core Gatekeeper)
    if user.isAfrican:
        privileges['can_search_people'] = True
        privileges['can_post_coopertunity'] = True
        privileges['visibility_level'] = 'MEMBER'
    else:
        # Non-African users have limited scope
        return privileges 

    # 2. Veteran Status Check (Security Clearance)
    if user.isVeteran:
        privileges['can_view_sensitive_projects'] = True
        privileges['visibility_level'] = 'VETERAN'

    # 3. Subscription / Tier Checks (Future Phase)
    # if user.subscription == 'PREMIUM': ...

    return privileges
```

## Implementation Strategy
- **Middleware**: Implement this check in Next.js Middleware or a Higher-Order Component (HOC) `withPrivilege`.
- **API Routes**: Verify `session.user.isAfrican` on all POST/PUT routes related to `Coopertunity` creation.
- **UI Feedback**: If a Non-African user attempts to post, show a modal: *"This feature is reserved for community members building the continent. Please enjoy our library of articles."*
