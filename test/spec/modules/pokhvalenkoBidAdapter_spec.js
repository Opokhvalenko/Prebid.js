import { expect } from 'chai';
import { spec } from 'modules/pokhvalenkoBidAdapter.js';

const VALID_BID = {
  bidder: 'pokhvalenko',
  adUnitCode: 'div-1',
  bidId: '1',
  transactionId: 't1',
  mediaTypes: { banner: { sizes: [[300, 250]] } },
  params: { aid: 350975 }
};

const BIDDER_REQUEST = {
  auctionId: 'a1',
  refererInfo: { page: 'https://site' }
};

const SERVER_RESPONSE = {
  body: [
    {
      bidId: '1',
      cpm: 0.5,
      w: 300,
      h: 250,
      adm: '<div>ad</div>',
      adomain: ['e.com'],
      cur: 'USD',
      ttl: 300
    }
  ]
};

describe('pokhvalenkoBidAdapter', function () {
  it('validates', function () {
    expect(spec.isBidRequestValid(VALID_BID)).to.equal(true);
    expect(spec.isBidRequestValid({ ...VALID_BID, params: {} })).to.equal(false);
  });

  it('buildRequests returns POST with payload', function () {
    const req = spec.buildRequests([VALID_BID], BIDDER_REQUEST);
    expect(req.method).to.equal('POST');
    expect(req.url).to.be.a('string');

    const data = JSON.parse(req.data);
    expect(data).to.have.property('auctionId', 'a1');
    expect(data.bids).to.have.length(1);
    expect(data.bids[0].params.aid).to.equal(350975);
  });

  it('interpretResponse maps server bids', function () {
    const res = spec.interpretResponse(SERVER_RESPONSE);
    expect(res).to.have.length(1);

    const bid = res[0];
    expect(bid.requestId).to.equal('1');
    expect(bid.cpm).to.equal(0.5);
    expect(bid.width).to.equal(300);
    expect(bid.height).to.equal(250);
    expect(bid.ad).to.be.a('string');
    expect(bid.currency).to.equal('USD');
  });
});
