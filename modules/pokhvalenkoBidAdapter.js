import { registerBidder } from '../src/adapters/bidderFactory.js';
import { BANNER } from '../src/mediaTypes.js';

const BIDDER_CODE = 'pokhvalenko';
const ENDPOINT_URL = 'https://prebid.pokhvalenko.ua/auction';

function toSizes(bid) {
  const sizes = bid.mediaTypes?.banner?.sizes || bid.sizes || [];
  return Array.isArray(sizes[0]) ? sizes : [sizes];
}

export const spec = {
  code: BIDDER_CODE,
  gvlid: 0,
  supportedMediaTypes: [BANNER],
  aliases: [{ code: 'myAlias' }],

  isBidRequestValid(bid) {
    return !!bid?.params?.aid;
  },

  buildRequests(validBidRequests, bidderRequest = {}) {
    const payload = {
      auctionId: bidderRequest.auctionId,
      referer: bidderRequest.refererInfo?.page || '',
      gdpr: bidderRequest.gdprConsent ?? null,
      usp: bidderRequest.uspConsent ?? null,
      bids: validBidRequests.map(b => ({
        bidId: b.bidId,
        adUnitCode: b.adUnitCode,
        sizes: toSizes(b),
        params: b.params,
        transactionId: b.transactionId,
      })),
    };

    return {
      method: 'POST',
      url: ENDPOINT_URL,
      data: JSON.stringify(payload),
      options: { contentType: 'application/json', withCredentials: true },
    };
  },

  interpretResponse(serverResponse) {
    const body = serverResponse?.body;
    if (!Array.isArray(body)) return [];

    return body.map(r => ({
      requestId: r.bidId || r.requestId,
      cpm: Number(r.cpm || 0),
      width: r.w || r.width,
      height: r.h || r.height,
      ad: r.adm || r.ad,
      ttl: r.ttl || 300,
      creativeId: r.crid || r.creativeId || 'pokhvalenko-crid',
      currency: r.cur || 'USD',
      netRevenue: true,
      meta: { advertiserDomains: r.adomain || [] },
      mediaType: BANNER,
    }));
  },

  getUserSyncs(syncOptions = {}, _serverResponses = [], gdprConsent, uspConsent) {
    const params = new URLSearchParams();
    if (gdprConsent) {
      if (typeof gdprConsent.gdprApplies === 'boolean') {
        params.set('gdpr', Number(gdprConsent.gdprApplies).toString());
      }
      if (gdprConsent.consentString) params.set('gdpr_consent', gdprConsent.consentString);
    }
    if (uspConsent) params.set('us_privacy', uspConsent);
    const qs = params.toString();
    const tail = qs ? `?${qs}` : '';

    const syncs = [];
    if (syncOptions.pixelEnabled) syncs.push({ type: 'image', url: `https://prebid.pokhvalenko.ua/sync/pixel${tail}` });
    if (syncOptions.iframeEnabled) syncs.push({ type: 'iframe', url: `https://prebid.pokhvalenko.ua/sync/iframe${tail}` });
    return syncs;
  },

  onTimeout() {},
  onBidWon() {},
  onSetTargeting() {},
  onBidderError() {},
  onAdRenderSucceeded() {},
};

registerBidder(spec);
