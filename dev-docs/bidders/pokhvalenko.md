---
layout: bidder
title: pokhvalenko
description: Pokhvalenko Bidder Adapter
biddercode: pokhvalenko
tcfeu_supported: true
gvl_id: 0
usp_supported: true
coppa_supported: false
gpp_sids: tcfeu, usnat, usp
schain_supported: true
dchain_supported: false
media_types: banner
pbjs: true
pbs: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: partial
privacy_sandbox: topics
sidebarType: 1
---

### Note
Requires account setup. Contact: [setup@pokhvalenko.ua](mailto:setup@pokhvalenko.ua)

### Bid Params
| Name | Scope | Description | Example | Type |
|---|---|---|---|---|
| `aid` | required | Account / placement id | `350975` | number |

### Test Ad Unit
```js
{
  code: 'ad-top',
  mediaTypes: { banner: { sizes: [[300,250],[300,600]] } },
  bids: [{ bidder: 'pokhvalenko', params: { aid: 350975 } }]
}