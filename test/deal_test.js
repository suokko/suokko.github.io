describe("Deal class suit", function() {
	var _dealer1 = [deal.north, deal.east, deal.south, deal.west];
	var _dealer2 = ["North", "East", "South", "West"];
	var _vuln = ['None', "N/S", "E/W", "Both",
		"N/S", "E/W", "Both", 'None',
		"E/W", "Both", 'None', "N/S",
		"Both", 'None', "N/S", "E/W"];
	var _cards = [["", "348Q", "9K", "23689TJ"],
		["T9", "KT2", "AQ762", "K74"],
		["56JK", "57JA", "348T", "5"],
		["23478QA", "69", "5J", "QA"]];

	var _players = ['GIB S', 'GIB E', 'GIB N', 'GIB w'];
	var _seats = ['South', 'East', 'North', 'West'];
	var _biding = "P1D3C3SP3NTPPP";
	var _play = "CJCQC5C4D5D3DAD9S9C2S2SJD4D2DKDJH3H6HAH2DTDQC3S3C7C6CAS5H9H5HTHQH4S4HJHKCKCTS7H7D6C9S8D8S6STH8SQSASKD7C8";
	beforeEach(function() {
		$(".suite").last().append("<div class='diagram' id='board' style='display: none;'/>");
	});

	var fail_count = 0;
	afterEach(function() {
		/* Discard passed tests and making failed tests visible */
		if (this.results_.failedCount == 0) {
			$("#board").remove();
		} else {
			fail_count++;
			var elem = $("#board");
			elem.attr("id", "board" + fail_count);
			elem.css('display', 'inline-block');
		}
	});

	var tester = function(_name, _n, _p, _h, _b, _k) {
		var _this = this;
		this.name = _name;
		this.board = _n;
		this.players = _p;
		this.hands = _h;
		this.biding = _b;
		this.kibitz = _k;
		this.it = function() {
			it(_this.name, function() {
				var d;
				var elem = $("#board");
				expect(function() {d = new deal(_this.board);}).not.toThrow();
				var nr_hands = 0;

				for (var k in _this.hands) {
					if (_this.hands[k] != null) {
						expect(function() {
							d.addHand(k, new hand(_this.hands[k][0], _this.hands[k][1], _this.hands[k][2], _this.hands[k][3]));
						}).not.toThrow();
						nr_hands++;
					}
				}

				var p = _play.substr(0);
				if (nr_hands == 4 && _this.biding != null) {
					var firsttrick = p.substr(0, 8);
					var rotation = ((_this.board - 1) % 4) * 2;

					firsttrick = firsttrick.substr(rotation, 8 - rotation) + 
						firsttrick.substr(0, rotation);
					p = firsttrick + p.substr(8);

					expect(function() {
						d.addPlay(new play(p));
					}).not.toThrow();
				}

				for (var k in _this.players) {
					if (_this.players[k] !== "")
						expect(function() {
							d.addPlayer(k, _this.players[k]);
						}).not.toThrow();
				}

				if (_this.kibitz >= 0) {
					expect(function() {
						d.kibitz(_this.kibitz);
					}).not.toThrow();
				}

				if (_this.biding != null) {
					expect(function() {
						d.addBiding(new biding(_this.biding));
					}).not.toThrow();
				}

				expect(function() {d.generate(elem);}).not.toThrow();

				/* Test the info box */
				if (_this.board == null)
					expect(elem.find(".info").length).toBe(0);
				else
					expect(elem.find(".info").text()).toBe(_this.board + " " +
						_dealer2[(_this.board - 1) % _dealer2.length] +
						_vuln[(_this.board - 1) % _vuln.length]);

				/* Check info box goes to right if north is missing but west is present */
				if (elem.find(".north").length == 0 && elem.find(".west").length != 0)
					expect(elem.find(".info.right").length).toBe(1);
				else
					expect(elem.find(".info.right").length).toBe(0);

				var checkHand = function(compass) {
					var n = _this.kibitz != -1 ? _this.kibitz : 0;
					var name = _seats[(compass + 4 - n) % 4];
					var suits = ['s', 'h', 'd', 'c'];

					if (_this.hands[compass] == null) {
						expect(elem.find("." + name.toLowerCase()).length).toBe(0);
						return;
					}

					expect(elem.find("." + name.toLowerCase()).length).toBe(1);
					if (_this.players[compass] != "") {
						expect(elem.find("." + name.toLowerCase()).text().indexOf(_this.players[compass])).toBeGreaterThan(-1);
						expect(elem.find("." + name.toLowerCase()).find('.n' + _seats[compass].toLowerCase()).length).toBe(1);
						if ((compass + _this.board - 1) % 4 == deal.east && _this.biding != null && nr_hands == 4) {
							expect(elem.find("." + name.toLowerCase()).find('.contract').length).toBe(1);
							expect(elem.find("." + name.toLowerCase()).find('.contract').text()).toBe("3NT");
						}
					} else {
						expect(elem.find("." + name.toLowerCase()).text().indexOf(_seats[compass])).toBeGreaterThan(-1);
					}
					for (var s = 0; s < 4; s++) {
						var cards = _this.hands[compass][s].split('');
						var suit = elem.find("." + name.toLowerCase() + ' .cards.' + suits[s]);
						expect(suit.length).toBe(1);
						/* Check each card */
						for (var c = 0; c < cards.length; c++) {
							var card = cards[c].toUpperCase();
							if (card == 'T') {
								card = '10';
							}
							if (card == '') {
								card = '—';
							}
							expect(suit.text().indexOf(card)).toBeGreaterThan(-1);
						}
					}
				}

				for (var k in _this.hands) {
					checkHand(parseInt(k));
				}

				if (nr_hands == 4 && _this.biding != null) {
					var k = _this.kibitz == -1 ? 0 : _this.kibitz;
					var nr_hidden = k == (4 + (deal.west - _this.board - 3) % 4) % 4 ? 3 : 2;
					expect(elem.find(".next").attr('disabled')).not.toBe('disabled');
					expect(elem.find(".prev").attr('disabled')).toBe('disabled');
					expect(elem.find('.hidden').length).toBe(3);
					for (var i = 0; i < 12; i++) {
						expect(function() {
							elem.find(".next").click();
						}).not.toThrow();
						expect(elem.find(".next").attr('disabled')).not.toBe('disabled');
						expect(elem.find(".prev").attr('disabled')).not.toBe('disabled');
						expect(elem.find('.hidden').length).toBe(nr_hidden);
					}
					expect(function() {
						elem.find(".next").click();
					}).not.toThrow();

					expect(elem.find(".next").attr('disabled')).toBe('disabled');
					expect(elem.find(".prev").attr('disabled')).not.toBe('disabled');
					expect(elem.find('.hidden').length).toBe(0);
					
					for (var i = 0; i < 12; i++) {
						expect(function() {
							elem.find(".prev").click();
						}).not.toThrow();
						expect(elem.find(".next").attr('disabled')).not.toBe('disabled');
						expect(elem.find(".prev").attr('disabled')).not.toBe('disabled');
						expect(elem.find('.hidden').length).toBe(nr_hidden);
					}
					expect(function() {
						elem.find(".prev").click();
					}).not.toThrow();
					expect(elem.find(".next").attr('disabled')).not.toBe('disabled');
					expect(elem.find(".prev").attr('disabled')).toBe('disabled');
					expect(elem.find('.hidden').length).toBe(3);
				} else if (_this.biding != null) {
					/* TODO test that cards aren't hidden */
				} else {
					expect(elem.find('.hidden').length).toBe(0);
				}
			});
		}
	}

	var name = ["1", // 0
	    "number having ", "east", // 2
	    "names", "GIB", // 4
	    "kibitzing", "west", // 6
	    "with biding", "1H", // 8
	    "and cards", "♠1" // 10
	    ];

	var seat = 0;
	var names;
	var kibitz;
	var hands;
	var num = null;

	/**/
	var selectBiding = function() {
		if (num == null)
			name[0] = "null";
		else
			name[0] = num;

		name[8] = "no";
		new tester(name.join(" "), num, names, hands, null, kibitz).it();
		name[8] = _biding;
		name[0] = num;
		new tester(name.join(" "), num, names, hands, _biding, kibitz).it();

		if (num == null)
			num = 1;
		else
			num++;
	}

	var selectKibitz = function() {
		for (var bit = -1; bit < 4; bit++) {
			if ((seat & (1<<bit)) == 0 && bit != -1)
				continue;
			if (bit == -1)
				name[6] = "None";
			else
				name[6] = _seats[bit];
			kibitz = bit;

			selectBiding();
		}
	};

	var selectNames = function() {
		for (var n = 0; n < 16; n++) {
			if ((~seat & n) != 0 || (seat == 0 && n != 0))
				continue;
			names = [];
			for (var bit = 0; bit < 4; bit++) {
				if ((1 << bit) & n)
					names[bit] = _players[bit];
				else
					names[bit] = "";
			}
			name[4] = names.join(",");

			selectKibitz();
		}
	};

	var selectSeats = function() {
		for (seat = 0; seat < 16; seat++) {
			hands = [null, null, null, null];
			var s = {};
			for (var bit = 0; bit < _seats.length; bit++) {
				if (seat & (1 << bit)) {
					s[bit] = _seats[bit];
					hands[bit] = _cards[bit];
				}
			}
			var se = [];
			for (var k in s)
				se.push(s[k]);
			
			name[2] = se.join(",");
			name[10] = [];
			
			for (var k in hands) {
				if (hands[k] != null)
					name[10].push("[" + hands[k].join(", ") + "]");
				else
					name[10].push("[]");
			}

			name[10] = name[10].join(", ");

			selectNames();
		}
	};

	selectSeats();
});
