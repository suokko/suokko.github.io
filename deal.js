/**
 * Copyright (C) 2012 Pauli Nieminen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * jquery has to be included before this helper library.
 * http://jquery.com/
 */
(function(window, undefined) {

	var deal = function(number) {
		this.number = number;
		this.hands = [null, null, null, null];
		this.players = [null, null, null, null];
		this.bids = null;
		this.play = null;
		this.follow = deal.south;
	};

	deal.prototype = {

		addPlayer: function(seat, player) {
			this.players[seat] = player;
		},

		addHand: function(seat, cards) {
			this.hands[seat] = cards;
		},

		addBiding: function(bids) {
			this.bids = bids;
		},

		addPlay: function(p) {
			this.play = p;
		},

		kibitz: function(seat) {
			this.follow = seat;
		},

		generate: function(elem) {
			var appendSeat = function(player, hand, name) {
				var content = $("<div class='hand'></div>");

				if (player != null)
					content.append("<div class='n" + name.toLowerCase() + " name'>" + player + "</div>");
				else
					content.append("<div class='seat'>" + name + "</div>");
				content.append("<div class='cards s'>" + hand.getSuit(deal.spades) + "</div>");
				content.append("<div class='cards h'>" + hand.getSuit(deal.hearts) + "</div>");
				content.append("<div class='cards d'>" + hand.getSuit(deal.diamonds) + "</div>");
				content.append("<div class='cards c'>" + hand.getSuit(deal.clubs) + "</div>");
				return content;
			};

			var getDealer = function(number) {
				switch ((number - 1) % 4) {
				case 0:
					return "North";
				case 1:
					return "East";
				case 2:
					return "South";
				case 3:
					return "West";
				}
			};

			getVulnValue = function(number) {
				number = (number - 1) % 16;
				var shift = Math.floor(number/4);
				number += shift;
				return number % 4;
			};

			var getVuln = function(number) {
				switch (getVulnValue(number)) {
				case 0:
					return "None";
				case 1:
					return "N/S";
				case 2:
					return "E/W";
				case 3:
					return "Both";
				}
			};

			var appendBiding = function(number, bids, players) {
				var vulnValue = getVulnValue(number);
				var ew = (vulnValue == 2 || vulnValue == 3) ? "vuln" : "";
				var ns = (vulnValue == 1 || vulnValue == 3) ? "vuln" : "";

				var table = $("<table class='bids history'></table>");

				var line = $("<tr></tr>");

				line.append("<th class='" + ns + "'>" + (players[deal.north] != null ? players[deal.north] : "North") + "</th>");
				line.append("<th class='" + ew + "'>" + (players[deal.east] != null ? players[deal.east] : "East") + "</th>");
				line.append("<th class='" + ns + "'>" + (players[deal.south] != null ? players[deal.south] : "South") + "</th>");
				line.append("<th class='" + ew + "'>" + (players[deal.west] != null ? players[deal.west] : "West") + "</th>");
				table.append(line);

				number = (number - 1) % 4;
				var i = 0;
				var b = -number;

				while (b < bids.length()) {
					line = $("<tr></tr>");
					for (i = 0; i < 4; i++) {
						var cell = $("<td></td>");
						if (b < bids.length() && b >= 0) {
							cell.append(bids.getBid(b).toString());
						}
						line.append(cell);
						b++;
					}
					table.append(line);
				}

				return table;
			};

			var info_right = this.hands[(deal.west + this.follow) % 4] != null && this.hands[(deal.north + this.follow) % 4] == null ? " right" : "";
			var content;
			
			if (this.number != null) {
				content = $("<div class='info" + info_right + "'>" +
						"<tt class='number'>" + this.number +" </tt>"+
						"<div>" + getDealer(this.number) + "<br/>" + getVuln(this.number) + "</div></div>");
				elem.append(content);
			}

			var seats = ["South", "East", "North", "West"];
			var i;

			/* Figure out the declarer */
			this.declarer = null;
			if (this.bids != null && this.bids.declarer != null) {
				var number = this.number != null ? this.number - 1 : 0;
				var declarer = this.bids.declarer + number;
				switch (declarer % 4) {
				case 0:
					this.declarer = deal.north;
					break;
				case 1:
					this.declarer = deal.east;
					break;
				case 2:
					this.declarer = deal.south;
					break;
				case 3:
					this.declarer = deal.west;
					break;
				}
			}

			/* Generate cards for each player and rotate deal to
			 * have the kibitz target as south. */
			i = (deal.north + this.follow) % 4
			if (this.hands[i] != null) {
				content = appendSeat(this.players[i], this.hands[i], seats[i]);
				content.addClass("north");
				if (this.declarer != null) {
					if (this.declarer == i)
						content.addClass("declarer");
					else if ((this.declarer + 2) % 4 == i)
						content.addClass("dummy");
					else if ((this.declarer + 3) % 4 == i)
						content.addClass("toplay");
					content.addClass("hidden");
				}
				elem.append(content);
			}

			var clear_div = 0;
			i = (deal.west + this.follow) % 4
			if (this.hands[i] != null) {
				content = appendSeat(this.players[i], this.hands[i], seats[i]);
				content.addClass("west");
				if (this.declarer != null) {
					if (this.declarer == i)
						content.addClass("declarer");
					else if ((this.declarer + 2) % 4 == i)
						content.addClass("dummy");
					else if ((this.declarer + 3) % 4 == i)
						content.addClass("toplay");
					content.addClass("hidden");
				}
				elem.append(content);
				clear_div += 1;
			}
			i = (deal.east + this.follow) % 4
			if (this.hands[i] != null) {
				content = appendSeat(this.players[i], this.hands[i], seats[i]);
				content.addClass("east");
				if (this.declarer != null) {
					if (this.declarer == i)
						content.addClass("declarer");
					else if ((this.declarer + 2) % 4 == i)
						content.addClass("dummy");
					else if ((this.declarer + 3) % 4 == i)
						content.addClass("toplay");
					content.addClass("hidden");
				}
				elem.append(content);
				clear_div += 2;
			}

			/* Add target div for played cards */
			if (this.play != null) {
				elem.append($("<div class='playarea'/>"));
			}

			/* Div controlling positioning of play control, south
			 * and biding history.
			 */
			if (clear_div) {
				var clear = "left";
				if (clear_div == 2)
					clear = "right";
				else if (clear_div = 3)
					clear = "both";
				elem.append($("<div class='clear'/>").css("clear", clear)); 
			}
			
			/* Create a ew wrapper div to scale playing area */
			if (this.play != null) {
				elem.children(".west, .east, .clear, .playarea").wrapAll("<div class='ew_wrapper'/>");
			}

			/* Next append play controls (float left)*/
			if (this.play != null) {
				elem.append(this.play.getControls(this, elem));
			}

			/* Then biding history (float right) */
			if (this.bids != null) {
				content = appendBiding(this.number, this.bids, this.players);
				elem.append(content);
			}

			/* last comes south */
			i = (deal.south + this.follow) % 4
			if (this.hands[i] != null) {
				content = appendSeat(this.players[i], this.hands[i], seats[i]);
				content.addClass("south");
				if (this.declarer != null) {
					if (this.declarer == i)
						content.addClass("declarer");
					else if ((this.declarer + 2) % 4 == i)
						content.addClass("dummy");
					else if ((this.declarer + 3) % 4 == i)
						content.addClass("toplay");
				}
				elem.append(content);
			}

			elem.find(".declarer > .seat, .declarer > .name").append(elem.find('.contract').clone());
		},
	};

	deal.south = 0;
	deal.east = 1;
	deal.north = 2;
	deal.west = 3;

	deal.spades = 0;
	deal.hearts = 1;
	deal.diamonds = 2;
	deal.clubs = 3;

	var card = function(suit, rank) {
		this.suit = suit;
		this.rank = rank;
	}

	card.parseCard = function(ch1, ch2) {
		var suit, rank;

		switch (ch1) {
		case 'S':
		case 's':
		case '♠':
			suit = deal.spades;
			break;
		case 'H':
		case 'h':
		case '♥':
			suit = deal.hearts;
			break;
		case 'D':
		case 'd':
		case '♦':
			suit = deal.diamonds;
			break;
		case 'C':
		case 'c':
		case '♣':
			suit = deal.clubs;
			break;
		default:
			throw "Not a suit: " + ch1;
		}

		switch (ch2) {
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			rank = ch2.charCodeAt(0) - '0'.charCodeAt(0);
			break;
		case 'T':
		case 't':
			rank = 10;
			break;
		case 'J':
		case 'j':
			rank = 11;
			break;
		case 'Q':
		case 'q':
			rank = 12;
			break;
		case 'K':
		case 'k':
			rank = 13;
			break;
		case 'A':
		case 'a':
			rank = 14;
			break;
		case 'X':
		case 'x':
			rank = 1;
			break;
		case 'H':
		case 'h':
			rank = 15;
			break;
		default:
			throw "Not a card rank: " + ch2;
		}

		return new card(suit, rank);
	};

	card.prototype = {
		appendAlternative: function(card) {
			if (this.maybe !== undefined)
				throw "Cannot add an alternative to an alternative card";
			if (card.maybe !== undefined)
				throw "Cannot add an alternative card again";
			if (this.alternative === undefined)
				this.alternative = [];
			this.alternative.push(card);
			card.maybe = false;
			return this;
		},

		markMaybe: function() {
			if (this.maybe === undefined)
				throw "Can only set maybe for an alternative card";
			this.maybe = true;
			return this;
		},

		getRank: function() {
			switch (this.rank) {
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
				return this.rank.toString();
			case 11:
				return 'J';
			case 12:
				return 'Q';
			case 13:
				return 'K';
			case 14:
				return 'A';
			case 1:
				return 'x';
			case 15:
				return 'H';
			}
		},

		equals: function(b) {
			return this.rank == b.rank && this.suit == b.suit;
		},

		toString: function() {
			var r;

			switch (this.suit) {
			case deal.spades:
				r = "♠";
				break;
			case deal.hearts:
				r = "♥";
				break;
			case deal.diamonds:
				r = "♦";
				break;
			case deal.clubs:
				r = "♣";
				break;
			}
			r += this.getRank();
			if (this.alternative !== undefined) {
				r += '(';
				for (var i = 0; i < this.alternative.length; i++) {
					r += this.alternative[i];
				}
				r += ')';
			}
			if (this.maybe !== undefined && this.maybe)
				r += '%';
			return r;
		},
	};

	var hand = function(spades, hearts, diamonds, clubs) {
		var invalid = [];
		var duplicate = [];
		var parseSuit = function(suit, text) {
			var text = text.replace("10","T").replace("-", "");
			var rv = [];
			for (var i = 0; i < text.length; i++) {
				var ch = text.charAt(i);
				try {
					rv.push(card.parseCard(suit, ch));
				} catch(e) {
					/* TODO Add validation message state */
					invalid.push(ch);
				}
			}
			rv = rv.sort(function(a, b) { return b.rank - a.rank; });
			var j = 0;
			for (var i = 1; i < rv.length; i++) {
				if (rv[i - j - 1].equals(rv[i]) && rv[i].rank != 1 && rv[i].rank != 15) {
					j++;
					duplicate.push(rv[i]);
				}
				rv[i - j] = rv[i];
			}
			for (var i = 0; i < j; i++) {
				rv.pop();
			}
			return rv;
		};
		this.spades = parseSuit('s', spades);
		this.hearts = parseSuit('h', hearts);
		this.diamonds = parseSuit('d', diamonds);
		this.clubs = parseSuit('c', clubs);
		this.valid = [];
		if (invalid.length != 0)
			this.valid.push("There are invalid ranks for a card (" + invalid.join(", ") + ").");
		if (duplicate.length != 0)
			this.valid.push("There are duplicate cards in the hand (" + duplicate.join(", ") + ").");
		var total_cards = this.spades.length + this.hearts.length + this.diamonds.length + this.clubs.length;
		if (total_cards > 13)
			this.valid.push("There are " + total_cards + " cards.");
	};

	hand.prototype = {
		validate: function(element) {
			return this.valid.join("<br/>");
		},

		hasCard: function(card) {
			var s = null;
			switch (card.suit) {
			case deal.spades:
				s = this.spades;
				break;
			case deal.hearts:
				s = this.hearts;
				break;
			case deal.diamonds:
				s = this.diamonds;
				break;
			case deal.clubs:
				s = this.clubs;
				break;
			}
			for (var i = 0; i < s.length; i++) {
				if (s[i].equals(card))
					return true;
			}
			return false;
		},

		getSuit: function(suit) {
			var s = null;
			switch (suit) {
			case deal.spades:
				s = this.spades;
				break;
			case deal.hearts:
				s = this.hearts;
				break;
			case deal.diamonds:
				s = this.diamonds;
				break;
			case deal.clubs:
				s = this.clubs;
				break;
			}
			if (s.length == 0)
				return "—";

			var rv = [];
			for (var i = 0; i < s.length; i++) {
				rv.push(s[i].getRank());
			}
			return rv.join(" ");
		},

		toString: function() {
			return this.getSuit(deal.spades) + "<br />" +
				this.getSuit(deal.hearts) + "<br />" +
				this.getsuit(deal.diamonds) + "<br />" +
				this.getSuit(deal.clubs);
		},
	};

	var bid = function(bid) {
		this.bid = bid;
		this.declaration = null;
	}

	bid.prototype = {
		pass: 0,
		dbl: 1,
		rdbl: 2,
		question: 3,
		level1: 4,
		level2: 8,
		level3: 12,
		level4: 16,
		level5: 20,
		level6: 24,
		level7: 28,
		NT: 32,
		spade: 64,
		heart: 128,
		diamond: 256,
		club: 512,
		allsuits: 512 + 256 + 128 + 64 + 32,
		unknown: 1024,

		declare: function(text) {
			if (text != null)
				this.declaration = text.replace("!S","♠").replace("!s", "♠").replace("!H", "♥").replace("!h", "♥").replace("!D", "♦").replace("!d", "♦").replace("!C", "♣").replace("!c", "♣");
			else
				this.declaration = null;
			return this;
		},

		getTrump: function() {
			switch (this.bid & bid.prototype.allsuits) {
			case bid.prototype.spade:
				return deal.spades;
			case bid.prototype.heart:
				return deal.hearts;
			case bid.prototype.diamond:
				return deal.diamonds;
			case bid.prototype.club:
				return deal.clubs;
			default:
				return -1;
			}
		},

		toString: function() {
			var rv = "<div class='bid" + (this.declaration != null ? " alert" : "") + "'>";

			if (this.bid == this.pass) {
				rv += "<tt class='pass'>Pass</tt>";
			} else if (this.bid == this.question) {
				rv += "<tt>?</tt>";
			} else if (this.bid == this.unknown) {
				rv += "<tt class='double'>Unknown</tt>";
			} else {
				var level = (this.bid >> 2) & 7;
				var suit = this.bid >> 5;
				switch (suit) {
				case 1:
					suit = "NT";
					break;
				case 2:
					suit = "<tt class='sblack'>♠</tt>";
					break;
				case 4:
					suit = "<tt class='sred'>♥</tt>";
					break;
				case 8:
					suit = "<tt class='sred'>♦</tt>";
					break;
				case 16:
					suit = "<tt class='sblack'>♣</tt>";
					break;
				}
				if (level != 0 && suit != 0)
					rv +=  level + "" + suit;
			}

			if ((this.bid & 3) == this.dbl) {
				rv += "<tt class='double'>X</tt>";
			} else if ((this.bid & 3) == this.rdbl) {
				rv += "<tt class='redouble'>XX</tt>";
			}

			if (this.declaration != null) {
				var styleSuits = function(decl) {
					var rv = decl.replace("♠", "<tt class='sblack'>♠</tt>");
					rv = rv.replace("♣", "<tt class='sblack'>♣</tt>");
					rv = rv.replace("♥", "<tt class='sred'>♥</tt>");
					rv = rv.replace("♦", "<tt class='sred'>♦</tt>");
					return rv;
				};
				rv += "</div><div class='declaration'>" + styleSuits(this.declaration);
			}

			return rv + "</div>";

		},
	}

	var biding = function(b) {
		var parseBids = function(b) {
			var bids = new Array();
			var i;
			var level;
			var decl = null;
			for (i = 0; i < b.length; i++) {
				var ch = b.charAt(i);
				if (decl != null) {
					if (ch == ')') {
						bids[bids.length - 1].declare(decl);
						decl = null;
					} else {
						decl += ch;
					}
					continue;
				}
				switch(ch) {
				case 'P':
				case 'p':
					bids.push(new bid(bid.prototype.pass));
					break;
				case 'X':
				case 'x':
					bids.push(new bid(bid.prototype.dbl));
					break;
				case 'R':
				case 'r':
					bids.push(new bid(bid.prototype.rdbl));
					break;
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
					var val = ch.charCodeAt(0); 
					var one = '1'.charCodeAt(0);
					var bid_val = bid.prototype.level1;
					level = (val - one + 1) * bid_val;
					break;
				case 'S':
				case 's':
				case '♠':
					bids.push(new bid(bid.prototype.spade + level));
					break;
				case 'H':
				case 'h':
				case '♥':
					bids.push(new bid(bid.prototype.heart + level));
					break;
				case 'D':
				case 'd':
				case '♦':
					bids.push(new bid(bid.prototype.diamond + level));
					break;
				case 'C':
				case 'c':
				case '♣':
					bids.push(new bid(bid.prototype.club + level));
					break;
				case 'N':
				case 'n':
					if (b.charAt(i + 1).toUpperCase() == 'T')
						i++;

					bids.push(new bid(bid.prototype.NT + level));
					break;
				case '(':
					decl = "";
					break;
				case '?':
					bids.push(new bid(bid.prototype.question));
					break;
				default:
					bids.push(new bid(bid.prototype.unkown).declare(ch));
					break;
				}
			}
			return bids;
		}
		this.bids = parseBids(b);
		this.contract = null;
		this.declarer = null;

		var passes = - 1;
		var p = 0;
		var extras = 0;

		/* Check if biding end to 3 passes and figure out the contract */
		for (var i = this.bids.length; i-- > 0;) {
			if (this.bids[i].bid == bid.prototype.pass)
				p++;
			else if (passes < 0) {
				passes = p;
				if (this.bids[i].bid == bid.prototype.dbl ||
						this.bids[i].bid == bid.prototype.rdbl) {
					extras = this.bids[i].bid;
				}
			}

			if (this.bids[i].bid & bid.prototype.allsuits) {
				if (passes == 3)
					this.contract = this.bids[i];
				break;
			}
		}

		if (this.contract == null)
			return;

		this.contract = $.extend(true, {}, this.contract);
		this.contract.bid += extras;

		/* Find who is declaring this contract */
		for (i = i % 2; i < this.bids.length; i+=2) {
			if (this.bids[i].bid & (this.contract.bid & bid.prototype.allsuits)) {
				this.declarer = i % 4;
				break;
			}
		}
	}

	biding.prototype = {
		length: function() {
			return this.bids.length;
		},

		getBid: function(bid) {
			return this.bids[bid];
		}
	}

	var play = function(bbo_string) {
		var parseAlternative = function(input, i, c) {
			i++;
			var last;

			for (; i < input.length; i++) {
				var ch = input.charAt(i);
				if (ch == ')')
					break;
				else if (ch == '?') {
					last.markMaybe();
					continue;
				}
				try {
					last = card.parseCard(ch, input.charAt(i+1));
					c.appendAlternative(last);
					i++;
				} catch (e) {
					c.appendAlternative(ch);
				}
			}

			return i;
		};

		var parsePlay = function(input) {
			var play = [];
			var i;
			var trick = [];

			for (i = 0; i < input.length; i++) {
				var ch = input.charAt(i);
				switch (ch) {
				case '(':
					var last_trick = trick;
					if (trick.length == 0)
						last_trick = play[play.length - 1];
					i = parseAlternative(input, i, last_trick[last_trick.length - 1]);
					break;
				default:
					try {
						trick.push(card.parseCard(ch, input.charAt(i+1)));
						i++;
					} catch (e) {
						trick.push("U" + ch);
					}
					break;
				}
				if (trick.length == 4) {
					play.push(trick);
					trick = [];
				}
			}

			if (trick.length > 0)
				play.push(trick);
			return play;
		};

		this.cards = parsePlay(bbo_string);
		this.trick = 0;
	};

	var suitToClass = function(suit) {

		switch (suit) {
			case deal.spades:
				return '.s';
			case deal.hearts:
				return '.h';
			case deal.diamonds:
				return '.d';
			case deal.clubs:
				return '.c';
		}

	};

	var trickWinner = function(t, trump) {
		var max_rank = 0;
		var max_trump = 0;
		var suit_led = t[0].suit;
		var winning = -1;
		for (var i = 0; i < t.length; i++) {
			var rank = t[i].rank;
			var suit = t[i].suit;
			if (suit == trump) {
				if (rank > max_trump) {
					winning = i;
					max_trump = rank;
				}
			} else if (max_trump == 0 && suit == suit_led) {
				if (rank > max_rank) {
					winning = i;
					max_rank = rank;
				}
			}

		}
		return winning;
	}

	play.prototype = {
		claim: function(tricks) {
			return this;
		},

		clearPlayedCards: function(elem) {
			elem.find(".played.anim").remove();
		},

		next: function(d, elem) {
			var splitText = function(node, rank, cls) {
				var r = rank;
				for (var i = 0; i < node.childNodes.length; i++) {
					var nc = node.childNodes[i];
					if (nc.nodeType != 3)
						continue;
					
					var pos = nc.data.indexOf(r);

					if (pos < 0)
						continue;

					var span = document.createElement('span');
					span.className = cls;
					var middle = pos > 0 ? nc.splitText(pos) : nc;
					if (r.length < middle.data.length)
						middle.splitText(r.length + 1);
					span.appendChild(middle.cloneNode(true));
					middle.parentNode.replaceChild(span, middle);

					return span;
				}
				return null;
			};

			this.clearPlayedCards(elem);
			var t = this.cards[this.trick];
			var winner;
			var winning = trickWinner(t, d.bids.contract.getTrump());
			var player = elem.find(".toplay");
			for (var i = 0; i < t.length; i++) {
				var suit = t[i].suit;
				var rank = t[i].getRank();
				var suit_cls = suitToClass(suit);

				/* Mark the card played */
				var suit_elem = player.children(suit_cls);

				var span = splitText(suit_elem[0], rank, "played");

				if (span == null)
					throw "Card not found from the playeri: " + t[i];

				var names = ['south', 'west', 'north', 'east'];
				for (var j = 0; j < names.length; j++) {
					if (player[0].className.indexOf(names[j]) >= 0)
						break;
				}

				if (j == names.length)
					throw "Player class no found";

				/* Play the card */
				var animated = $(span).clone().addClass('cards').addClass('anim').addClass(suit_cls.charAt(1));
				animated.text(animated.text().replace(" ", ""));
				var pos = ['top', 'right', 'bottom', 'left'];
				animated.css(pos[j], 'auto');
				if (j & 1) {
					animated.css({'margin-top': '-0.6em',
							'top': '50%'})
				}

				elem.find('.playarea').append(animated);

				/* Show dummy after lead */
				if (this.trick == 0 && i == 0) {
					elem.find(".dummy").removeClass("hidden");
				}

				/* Move play turn to next player */
				player.removeClass("toplay");

				if (i == winning)
					winner = names[j];

				if (i != 3) {
					player =  elem.find('.' + names[(j+1)%4]);
					player.addClass('toplay');
				} else {
					player =  elem.find('.' + winner);
					player.addClass('toplay');
				}
			}
			this.trick++;
			if (t.length != 4)
				return undefined;
			var ns = winner == 'north' || winner == 'south';
			if (d.follow == deal.east || d.follow == deal.west)
				ns = !ns;
			return ns;
		},

		prev: function(d, elem) {
			this.trick--;
			this.clearPlayedCards(elem);
			var t = this.cards[this.trick];
			var winner;
			var winning = trickWinner(t, d.bids.contract.getTrump());
			var player = elem.find(".toplay");
			for (var i = t.length; i-- > 0;) {
				player.removeClass("toplay");

				var names = ['south', 'west', 'north', 'east'];
				for (var j = 0; j < names.length; j++) {
					if (player[0].className.indexOf(names[j]) >= 0)
						break;
				}

				if (j == names.length)
					throw "Player class no found";

				if (t.length == 4 && i == 3) {
					var last = (j + (3 - winning)) % 4;

					if (i == winning)
						winner = names[last];

					player =  elem.find('.' + names[last]);
					player.addClass('toplay');
				} else {
					if (i == winning)
						winner = names[(j + 3) % 4];
					player =  elem.find('.' + names[(j + 3) % 4]);
					player.addClass('toplay');
				}

				var suit = t[i].suit;
				var rank = t[i].getRank();

				/* Unmark the played card */
				var suit_elem = player.children(suitToClass(suit));
				var span = suit_elem.children("span:contains(" + rank + ")");

				if (span.length == 0)
					throw "Card not found when going back a trick: " + t[i];

				$(span[0].firstChild).unwrap();
			}

			if (this.trick == 0)
				elem.find('.dummy').addClass('hidden');

			if (t.length != 4)
				return undefined;
			var ns = winner == 'north' || winner == 'south';
			if (d.follow == deal.east || d.follow == deal.west)
				ns = !ns;
			return ns;
		},

		getControls: function(deal, element) {
			var _this = this;
			this.element = element;
			this.deal = deal;

			/* Generate the controls */
			var controls = $("<div class='controls' />");
			var prev = $("<input type='button' class='prev' value='Previous'/>");
			controls.append(prev);
			var next = $("<input type='button' class='next' value='Next'/><br/>");
			controls.append(next);
			var contract = $("<div class='contract'>"+ this.deal.bids.contract.toString() +"</div>");
			controls.append(contract);

			this.tricks_ns = $("<div class='tricks ns'>0</div>");
			controls.append(this.tricks_ns);
			this.tricks_ew = $("<div class='tricks ew'>0</div>");
			controls.append(this.tricks_ew);

			var enableButtons = function(trick, max) {
				if (trick == 0)
					prev.removeAttr('disabled');
				else if (trick == max)
					next.removeAttr('disabled');
			}

			var disableButtons = function(trick, max) {
				if (trick == 0)
					prev.attr('disabled', 'disabled');
				else if (trick == max)
					next.attr('disabled', 'disabled');
			}

			disableButtons(_this.trick, _this.cards.length);

			/* Connect even handlers */
			next.click(function(ev) {
				enableButtons(_this.trick, _this.cards.length);
				var w = _this.next(_this.deal, _this.element);
				if (w !== undefined) {
					var t;
					if (w)
						t = _this.tricks_ns;
					else
						t = _this.tricks_ew;
					t.text(parseInt(t.text()) + 1);
				}

				disableButtons(_this.trick, _this.cards.length);
			});
			prev.click(function(ev) {
				enableButtons(_this.trick, _this.cards.length);
				var w = _this.prev(_this.deal, _this.element);
				if (w !== undefined) {
					var t;
					if (w)
						t = _this.tricks_ns;
					else
						t = _this.tricks_ew;
					t.text(parseInt(t.text()) - 1);
				}

				if (_this.trick > 0) {
					_this.prev(_this.deal, _this.element);
					_this.next(_this.deal, _this.element);
				}

				disableButtons(_this.trick, _this.cards.length);
			});
			return controls;
		},

		toString: function() {
			var elem = $('<div/>');
			for (var i = 0; i < this.cards.length; i++) {
				elem.append(this.cards[i].join(" ") + "<br/>");
			}
			return elem;
		},
	}

	$(function () {
		var links = $(".post_group_links");
		if (links.length == 0)
			return;
		links.find("ol, li").addClass("post_group_link_list");

		links.each(function(index) {
			var post = $(this).parents(".post");
			var page = post.children(".post-title").text().replace(/^\s+|\s+$/g, "");
			var current_link = $(this).find("li:contains('" + page + "')");
			var page_links = $("<ol/>");

			post.find("h2").each(function(index) {
				var name = $(this).text();
				page_links.append($("<li><a href='#" + name + "'>" + name + "</a></li>").addClass("post_group_link_list"));
				$(this).attr('id', name);
			});

			var clone = $(this).clone();
			clone.find("li:contains('" + page + "')").append(page_links.clone());
			current_link.append(page_links.hide());

			page_links.show('slow');

			$(this).parent().append(clone.hide());
			clone.show('slow');
		});
		$(".blogger-clickTrap").css("z-index", -1);
	});

	window.play = play;
	window.deal = deal;
	window.hand = hand;
	window.card = card;
	window.biding = biding;
})(window);
