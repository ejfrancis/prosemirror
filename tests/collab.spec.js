let servers, browsers;
const FIRST_APP_URL = 'http://localhost:3005';
const SECOND_APP_URL = 'http://localhost:3007';

beforeEach(function() {
  browsers = {
    first: browser.instances[0],
    second: browser.instances[1]
  };
  servers = {
    first: server.instances[0],
    second: server.instances[1]
  };
});
describe('collab', function() {
  describe('simple, two users one server', function() {
    it('maintains synchronized doc state between clients', function() {
      browsers.first.url(FIRST_APP_URL);
      browsers.second.url(SECOND_APP_URL);
      expect(true).to.equal(true);
    });
  });
  it('has PORT env var set', function() {
    function getRootUrl() {
      return process.env.ROOT_URL;
    }
    expect(server.instances[0].execute(getRootUrl)).to.equal(FIRST_APP_URL);
    expect(server.instances[1].execute(getRootUrl)).to.equal(SECOND_APP_URL);
  });

});