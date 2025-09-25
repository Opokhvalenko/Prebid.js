import { expect } from 'chai';
import { spec } from 'modules/pokhvalenkoBidAdapter.js';

describe('pokhvalenkoBidAdapter', function () {
  const bid = {
    bidder: 'pokhvalenko',
    adUnitCode: 'div-1',
    bidId: '1',
    transactionId: 't1',
    mediaTypes: { banner: { sizes: [[300, 250]] } },
    params: { aid: 350975 }
  };

  it('validates', function () {
    expect(spec.isBidRequestValid(bid)).to.equal(true);
    expect(spec.isBidRequestValid({ ...bid, params: {} })).to.equal(false);
  });

  it('buildRequests returns POST with data', function () {
    const req = spec.buildRequests([bid], { auctionId: 'a1', refererInfo: { page: 'https://site' } });
    expect(req.method).to.equal('POST');
    expect(req.url).to.be.a('string');
    const data = JSON.parse(req.data);
    expect(data.bids).to.have.length(1);
    expect(data.bids[0].params.aid).to.equal(350975);
  });

  it('interpretResponse maps server bids', function () {
    const serverResponse = { body: [{ bidId: '1', cpm: 0.5, w: 300, h: 250, adm: '<div>ad</div>', adomain: ['e.com'], cur: 'USD', ttl: 300 }] };
    const res = spec.interpretResponse(serverResponse);
    expect(res).to.have.length(1);
    expect(res[0].cpm).to.equal(0.5);
    expect(res[0].width).to.equal(300);
  });

  it('getUserSyncs returns syncs', function () {
    const syncs = spec.getUserSyncs({ pixelEnabled: true, iframeEnabled: true }, [{ body: {} }], { gdprApplies: true, consentString: 'CONSENT' }, '1YYY');
    expect(syncs.length).to.be.greaterThan(0);
  });
});
