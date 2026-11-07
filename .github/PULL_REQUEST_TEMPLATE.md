## Summary

Describe the change and the reason for it.

## Scope

- [ ] The change is limited to the stated purpose.
- [ ] No unrelated formatting, dependency, or architecture changes are included.
- [ ] Any new package has a clear responsibility and real consumer.

## Verification

- [ ] Build/lint/typecheck results are recorded where relevant.
- [ ] Tests cover the behavior changed, and no required test was silently skipped.
- [ ] The results correspond to the latest PR commit.
- [ ] If tests were not run, explain why and what remains unverified.

## Security and data

- [ ] No secrets, service-role keys, or private customer data are included.
- [ ] Authorization is enforced server-side where relevant.
- [ ] Tenant isolation and RLS implications are tested where relevant.
- [ ] Database migrations are reviewed for compatibility, rollback, and data impact.
- [ ] Production schema, permissions, secrets, deployment configuration, branch rulesets, and required checks have not been changed without explicit approval.

## Delivery and documentation

- [ ] Documentation and contracts are updated where needed.
- [ ] Monitoring, failure behavior, and rollback implications are considered.
- [ ] No production deployment or real-money capability is implied by CI success alone.

## Reviewer notes

List known limitations, open questions, and follow-up work.
