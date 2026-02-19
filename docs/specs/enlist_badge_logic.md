# Enlist Badge Logic & Validation

## Overview
The "Enlist" badge identifies military veterans on the platform. This badge is not merely cosmetic; it alters visibility in search algorithms for security-related projects and grants access to specific "Coopertunity" types (e.g., security consulting, logistics in conflict zones).

## Validation Criteria (Logic Flow)
To claim the badge, a user must pass a verification process. Since we are targeting a Pan-African user base plus Diaspora, verification methods will vary but follow a standard confidence score.

### 1. User Action
- User toggles "I am a Military Veteran" in profile settings.
- **Trigger**: `POST /api/verification/enlist`

### 2. Verification Data Collection
The system prompts for:
- **Service Branch**: Army, Navy, Air Force, etc.
- **Country of Service**: e.g., Nigeria, Kenya, USA, UK.
- **Service Number / ID**: For checking against national databases (where APIs exist) or manual review.
- **Document Upload**: DD-214 (USA), Certificate of Discharge, or equivalent.

### 3. Verification Process (Pseudo-code)
```typescript
async function verifyEnlistment(userId: string, data: EnlistmentData): Promise<VerificationResult> {
  // Step 1: Automated Check (if available)
  // e.g., ID.me API for US veterans or similar
  const autoCheck = await checkVeteranDatabase(data.country, data.serviceNumber);
  
  if (autoCheck.confirmed) {
    return grantBadge(userId, { source: 'AUTOMATED', confidence: 1.0 });
  }

  // Step 2: Queue for Manual Review (if auto fails or unavailable)
  // Uploads document to secure S3 bucket with 'private' ACL
  await uploadVerificationDoc(data.document);
  await createAdminTicket({ type: 'VETERAN_VERIFY', userId });
  
  return { status: 'PENDING_REVIEW' };
}
```

## Search Algorithm Impact
The `isVeteran` flag modifies the Matchmaking Score (MS) for specific sectors.

### Weighted Boost
If `Coopertunity.type` is `SECURITY_CONSULTING` or `LOGISTICS` AND `Coopertunity.sector` is `QUATERNARY` (Strategic/Knowledge):

- **Standard Match**: Skills matches + geo score.
- **Veteran Boost**:
  ```python
  if user.isVeteran and coopertunity.requiresSecurityClearance:
      score += 50 points (High Relevance)
      visibility_rank = "TOP_TIER"
  ```
- **Exclusive Access**: Some projects may be *gated* entirely to `isVeteran` users.
  ```python
  if coopertunity.isRestricted and not user.isVeteran:
      return null (Hidden from search results)
  ```

## UI Presentation
- **Profile**: Gold Star or Shield icon next to name.
- **Search Results**: Highlighted border or badge in candidate lists for relevant employers.
