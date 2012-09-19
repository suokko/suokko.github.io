describe("Play test suit", function() {
	it("Play parsing", function() {
		var text = "";
		var suits = ["C","D","H","S"];
		var rank = ["2","3","4","5","6","7","8","9","T","J","Q","K","A"];
		var p;
		for (var i = 0; i < suits.length; i++) {
			var s = suits[i];
			for (var j = 0; j < rank.length; j++) {
				var r = rank[j];
				text += s + r;
			}
		}

		expect(function() {p = new play(text)}).not.toThrow();
		expect(p.trick).toBe(0);
		expect(p.cards.length).toBe(13);
		expect(p.cards[0].length).toBe(4);
		expect(p.cards[0][0].toString()).toBe("♣2");
		expect(p.cards[0][1].toString()).toBe("♣3");
		expect(p.cards[0][2].toString()).toBe("♣4");
		expect(p.cards[0][3].toString()).toBe("♣5");
		expect(p.cards[1].length).toBe(4);
		expect(p.cards[1][0].toString()).toBe("♣6");
		expect(p.cards[1][1].toString()).toBe("♣7");
		expect(p.cards[1][2].toString()).toBe("♣8");
		expect(p.cards[1][3].toString()).toBe("♣9");
		expect(p.cards[2].length).toBe(4);
		expect(p.cards[2][0].toString()).toBe("♣10");
		expect(p.cards[2][1].toString()).toBe("♣J");
		expect(p.cards[2][2].toString()).toBe("♣Q");
		expect(p.cards[2][3].toString()).toBe("♣K");
		expect(p.cards[3].length).toBe(4);
		expect(p.cards[3][0].toString()).toBe("♣A");
		expect(p.cards[3][1].toString()).toBe("♦2");
		expect(p.cards[3][2].toString()).toBe("♦3");
		expect(p.cards[3][3].toString()).toBe("♦4");
		expect(p.cards[4].length).toBe(4);
		expect(p.cards[4][0].toString()).toBe("♦5");
		expect(p.cards[4][1].toString()).toBe("♦6");
		expect(p.cards[4][2].toString()).toBe("♦7");
		expect(p.cards[4][3].toString()).toBe("♦8");
		expect(p.cards[5].length).toBe(4);
		expect(p.cards[5][0].toString()).toBe("♦9");
		expect(p.cards[5][1].toString()).toBe("♦10");
		expect(p.cards[5][2].toString()).toBe("♦J");
		expect(p.cards[5][3].toString()).toBe("♦Q");
		expect(p.cards[6].length).toBe(4);
		expect(p.cards[6][0].toString()).toBe("♦K");
		expect(p.cards[6][1].toString()).toBe("♦A");
		expect(p.cards[6][2].toString()).toBe("♥2");
		expect(p.cards[6][3].toString()).toBe("♥3");
		expect(p.cards[7].length).toBe(4);
		expect(p.cards[7][0].toString()).toBe("♥4");
		expect(p.cards[7][1].toString()).toBe("♥5");
		expect(p.cards[7][2].toString()).toBe("♥6");
		expect(p.cards[7][3].toString()).toBe("♥7");
		expect(p.cards[8].length).toBe(4);
		expect(p.cards[8][0].toString()).toBe("♥8");
		expect(p.cards[8][1].toString()).toBe("♥9");
		expect(p.cards[8][2].toString()).toBe("♥10");
		expect(p.cards[8][3].toString()).toBe("♥J");
		expect(p.cards[9].length).toBe(4);
		expect(p.cards[9][0].toString()).toBe("♥Q");
		expect(p.cards[9][1].toString()).toBe("♥K");
		expect(p.cards[9][2].toString()).toBe("♥A");
		expect(p.cards[9][3].toString()).toBe("♠2");
		expect(p.cards[10].length).toBe(4);
		expect(p.cards[10][0].toString()).toBe("♠3");
		expect(p.cards[10][1].toString()).toBe("♠4");
		expect(p.cards[10][2].toString()).toBe("♠5");
		expect(p.cards[10][3].toString()).toBe("♠6");
		expect(p.cards[11].length).toBe(4);
		expect(p.cards[11][0].toString()).toBe("♠7");
		expect(p.cards[11][1].toString()).toBe("♠8");
		expect(p.cards[11][2].toString()).toBe("♠9");
		expect(p.cards[11][3].toString()).toBe("♠10");
		expect(p.cards[12].length).toBe(4);
		expect(p.cards[12][0].toString()).toBe("♠J");
		expect(p.cards[12][1].toString()).toBe("♠Q");
		expect(p.cards[12][2].toString()).toBe("♠K");
		expect(p.cards[12][3].toString()).toBe("♠A");
	});

	it("Alternative parsing", function() {
		var p;
		expect(function() {p = new play("c5(d5?d7?)h4(h5)c6(c4)c7(c8)")}).not.toThrow();
		expect(p.trick).toBe(0);
		expect(p.cards.length).toBe(1);
		expect(p.cards[0].length).toBe(4);
		expect(p.cards[0][0].toString()).toBe("♣5(♦5%♦7%)");
		expect(p.cards[0][1].toString()).toBe("♥4(♥5)");
		expect(p.cards[0][2].toString()).toBe("♣6(♣4)");
		expect(p.cards[0][3].toString()).toBe("♣7(♣8)");
		expect(p.toString().text()).toBe("♣5(♦5%♦7%) ♥4(♥5) ♣6(♣4) ♣7(♣8)");
	});
});
