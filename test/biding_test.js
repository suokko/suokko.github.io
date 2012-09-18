describe("Biding class suit", function() {
	it("Test parsing all valid bids", function() {
		var bids;
		var bid;
		expect(function () {bids = new biding(
				"1C1D1H1S1N" +
				"2c2d2h2s2n" +
				"3C3D3H3S3NT" +
				"4C4D4H4S4nt" +
				"5C5D5H5S5Nt" +
				"6C6D6H6S6nT" +
				"7C7D7H7S7NT" +
				"XxRrPp?");}).not.toThrow();
		bid = bids.getBid(0);
		expect(bids.length()).toBe(42);
		expect(bids.getBid(0).bid).toBe(bid.club + bid.level1);
		expect(bids.getBid(1).bid).toBe(bid.diamond + bid.level1);
		expect(bids.getBid(2).bid).toBe(bid.heart + bid.level1);
		expect(bids.getBid(3).bid).toBe(bid.spade + bid.level1);
		expect(bids.getBid(4).bid).toBe(bid.NT + bid.level1);
		expect(bids.getBid(5).bid).toBe(bid.club + bid.level2);
		expect(bids.getBid(6).bid).toBe(bid.diamond + bid.level2);
		expect(bids.getBid(7).bid).toBe(bid.heart + bid.level2);
		expect(bids.getBid(8).bid).toBe(bid.spade + bid.level2);
		expect(bids.getBid(9).bid).toBe(bid.NT + bid.level2);
		expect(bids.getBid(10).bid).toBe(bid.club + bid.level3);
		expect(bids.getBid(11).bid).toBe(bid.diamond + bid.level3);
		expect(bids.getBid(12).bid).toBe(bid.heart + bid.level3);
		expect(bids.getBid(13).bid).toBe(bid.spade + bid.level3);
		expect(bids.getBid(14).bid).toBe(bid.NT + bid.level3);
		expect(bids.getBid(15).bid).toBe(bid.club + bid.level4);
		expect(bids.getBid(16).bid).toBe(bid.diamond + bid.level4);
		expect(bids.getBid(17).bid).toBe(bid.heart + bid.level4);
		expect(bids.getBid(18).bid).toBe(bid.spade + bid.level4);
		expect(bids.getBid(19).bid).toBe(bid.NT + bid.level4);
		expect(bids.getBid(20).bid).toBe(bid.club + bid.level5);
		expect(bids.getBid(21).bid).toBe(bid.diamond + bid.level5);
		expect(bids.getBid(22).bid).toBe(bid.heart + bid.level5);
		expect(bids.getBid(23).bid).toBe(bid.spade + bid.level5);
		expect(bids.getBid(24).bid).toBe(bid.NT + bid.level5);
		expect(bids.getBid(25).bid).toBe(bid.club + bid.level6);
		expect(bids.getBid(26).bid).toBe(bid.diamond + bid.level6);
		expect(bids.getBid(27).bid).toBe(bid.heart + bid.level6);
		expect(bids.getBid(28).bid).toBe(bid.spade + bid.level6);
		expect(bids.getBid(29).bid).toBe(bid.NT + bid.level6);
		expect(bids.getBid(30).bid).toBe(bid.club + bid.level7);
		expect(bids.getBid(31).bid).toBe(bid.diamond + bid.level7);
		expect(bids.getBid(32).bid).toBe(bid.heart + bid.level7);
		expect(bids.getBid(33).bid).toBe(bid.spade + bid.level7);
		expect(bids.getBid(34).bid).toBe(bid.NT + bid.level7);
		expect(bids.getBid(35).bid).toBe(bid.dbl);
		expect(bids.getBid(36).bid).toBe(bid.dbl);
		expect(bids.getBid(37).bid).toBe(bid.rdbl);
		expect(bids.getBid(38).bid).toBe(bid.rdbl);
		expect(bids.getBid(39).bid).toBe(bid.pass);
		expect(bids.getBid(40).bid).toBe(bid.pass);
		expect(bids.getBid(41).bid).toBe(bid.question);
		expect(bids.contract).toBeNull();
		expect(bids.declarer).toBeNull();
	});

	it("Test valid partial biding", function() {
		var bids;
		expect(function () {bids = new biding("PPP1NTPPXPP");}).not.toThrow();
		bid = bids.getBid(0);
		expect(bids.length()).toBe(9);
		expect(bids.getBid(0).bid).toBe(bid.pass);
		expect(bids.getBid(1).bid).toBe(bid.pass);
		expect(bids.getBid(2).bid).toBe(bid.pass);
		expect(bids.getBid(3).bid).toBe(bid.NT + bid.level1);
		expect(bids.getBid(4).bid).toBe(bid.pass);
		expect(bids.getBid(5).bid).toBe(bid.pass);
		expect(bids.getBid(6).bid).toBe(bid.dbl);
		expect(bids.getBid(7).bid).toBe(bid.pass);
		expect(bids.getBid(8).bid).toBe(bid.pass);
		expect(bids.contract).toBeNull();
		expect(bids.declarer).toBeNull();
		
		expect(function () {bids = new biding("PPP1NTPPXPP?");}).not.toThrow();
		bid = bids.getBid(0);
		expect(bids.length()).toBe(10);
		expect(bids.getBid(0).bid).toBe(bid.pass);
		expect(bids.getBid(1).bid).toBe(bid.pass);
		expect(bids.getBid(2).bid).toBe(bid.pass);
		expect(bids.getBid(3).bid).toBe(bid.NT + bid.level1);
		expect(bids.getBid(4).bid).toBe(bid.pass);
		expect(bids.getBid(5).bid).toBe(bid.pass);
		expect(bids.getBid(6).bid).toBe(bid.dbl);
		expect(bids.getBid(7).bid).toBe(bid.pass);
		expect(bids.getBid(8).bid).toBe(bid.pass);
		expect(bids.getBid(9).bid).toBe(bid.question);
		expect(bids.contract).toBeNull();
		expect(bids.declarer).toBeNull();
	});

	it("Test valid complete biding", function() {
		var bids, elm;
		expect(function () {bids = new biding("PPP1NTPPP");}).not.toThrow();
		bid = bids.getBid(0);
		expect(bids.length()).toBe(7);
		expect(bids.getBid(0).bid).toBe(bid.pass);
		expect(bids.getBid(1).bid).toBe(bid.pass);
		expect(bids.getBid(2).bid).toBe(bid.pass);
		expect(bids.getBid(3).bid).toBe(bid.NT + bid.level1);
		expect(bids.getBid(4).bid).toBe(bid.pass);
		expect(bids.getBid(5).bid).toBe(bid.pass);
		expect(bids.getBid(6).bid).toBe(bid.pass);
		expect(bids.contract.bid).toBe(bid.NT + bid.level1);
		expect(bids.declarer).toBe(3);
		elm = $(bids.contract.toString());
		expect(elm.text()).toBe("1NT");

		expect(function () {bids = new biding("PPP1NTP3NTPPP");}).not.toThrow();
		bid = bids.getBid(0);
		expect(bids.length()).toBe(9);
		expect(bids.getBid(0).bid).toBe(bid.pass);
		expect(bids.getBid(1).bid).toBe(bid.pass);
		expect(bids.getBid(2).bid).toBe(bid.pass);
		expect(bids.getBid(3).bid).toBe(bid.NT + bid.level1);
		expect(bids.getBid(4).bid).toBe(bid.pass);
		expect(bids.getBid(5).bid).toBe(bid.NT + bid.level3);
		expect(bids.getBid(6).bid).toBe(bid.pass);
		expect(bids.getBid(7).bid).toBe(bid.pass);
		expect(bids.getBid(8).bid).toBe(bid.pass);
		expect(bids.contract.bid).toBe(bid.NT + bid.level3);
		expect(bids.declarer).toBe(3);
		elm = $(bids.contract.toString());
		expect(elm.text()).toBe("3NT");

		expect(function () {bids = new biding("PPP1NTPP3NTPPP");}).not.toThrow();
		bid = bids.getBid(0);
		expect(bids.length()).toBe(10);
		expect(bids.getBid(0).bid).toBe(bid.pass);
		expect(bids.getBid(1).bid).toBe(bid.pass);
		expect(bids.getBid(2).bid).toBe(bid.pass);
		expect(bids.getBid(3).bid).toBe(bid.NT + bid.level1);
		expect(bids.getBid(4).bid).toBe(bid.pass);
		expect(bids.getBid(5).bid).toBe(bid.pass);
		expect(bids.getBid(6).bid).toBe(bid.NT + bid.level3);
		expect(bids.getBid(7).bid).toBe(bid.pass);
		expect(bids.getBid(8).bid).toBe(bid.pass);
		expect(bids.getBid(9).bid).toBe(bid.pass);
		expect(bids.contract.bid).toBe(bid.NT + bid.level3);
		expect(bids.declarer).toBe(2);
		elm = $(bids.contract.toString());
		expect(elm.text()).toBe("3NT");

		expect(function () {bids = new biding("PPP1NTPPXPPP");}).not.toThrow();
		bid = bids.getBid(0);
		expect(bids.length()).toBe(10);
		expect(bids.getBid(0).bid).toBe(bid.pass);
		expect(bids.getBid(1).bid).toBe(bid.pass);
		expect(bids.getBid(2).bid).toBe(bid.pass);
		expect(bids.getBid(3).bid).toBe(bid.NT + bid.level1);
		expect(bids.getBid(4).bid).toBe(bid.pass);
		expect(bids.getBid(5).bid).toBe(bid.pass);
		expect(bids.getBid(6).bid).toBe(bid.dbl);
		expect(bids.getBid(7).bid).toBe(bid.pass);
		expect(bids.getBid(8).bid).toBe(bid.pass);
		expect(bids.getBid(9).bid).toBe(bid.pass);
		expect(bids.contract.bid).toBe(bid.NT + bid.level1 + bid.dbl);
		expect(bids.declarer).toBe(3);
		elm = $(bids.contract.toString());
		expect(elm.text()).toBe("1NTX");

		expect(function () {bids = new biding("PPP1NTPPXRPPP");}).not.toThrow();
		bid = bids.getBid(0);
		expect(bids.length()).toBe(11);
		expect(bids.getBid(0).bid).toBe(bid.pass);
		expect(bids.getBid(1).bid).toBe(bid.pass);
		expect(bids.getBid(2).bid).toBe(bid.pass);
		expect(bids.getBid(3).bid).toBe(bid.NT + bid.level1);
		expect(bids.getBid(4).bid).toBe(bid.pass);
		expect(bids.getBid(5).bid).toBe(bid.pass);
		expect(bids.getBid(6).bid).toBe(bid.dbl);
		expect(bids.getBid(7).bid).toBe(bid.rdbl);
		expect(bids.getBid(8).bid).toBe(bid.pass);
		expect(bids.getBid(9).bid).toBe(bid.pass);
		expect(bids.getBid(10).bid).toBe(bid.pass);
		expect(bids.contract.bid).toBe(bid.NT + bid.level1 + bid.rdbl);
		expect(bids.declarer).toBe(3);
		elm = $(bids.contract.toString());
		expect(elm.text()).toBe("1NTXX");
	});

	it("Parse declaration", function() {
		var bids;
		expect(function () {bids = new biding("P(Nothing in !C)6C(Better !c)");}).not.toThrow();
		expect(bids.length()).toBe(2);
		expect($(bids.getBid(0).toString()).text()).toBe("PassNothing in ♣");
		expect($(bids.getBid(1).toString()).text()).toBe("6♣Better ♣");
	});
});
