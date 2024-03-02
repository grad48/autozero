module.exports.config = {
	name: "اتصال",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NTKhang, ManhG Fix Get",
	description: "الإبلاغ عن خطأ الروبوت إلى المشرف أو التعليق ",
	usages: "[حدث خطأ أو تعليقات]",
	cooldown: 5,
	hasPrefix: false,
};

module.exports.handleReply = async function({ api: e, args: n, event: a, Users: s, handleReply: o, prefix: t }) {
	var i = await s.getNameUser(a.senderID);
	switch (o.type) {
		case "reply":
			var admins = this.config.ADMINBOT; // Assuming ADMINBOT is defined elsewhere
			for (let admin of admins) {
				e.sendMessage({
					body: "📄Feedback from " + i + ":\n" + a.body,
					mentions: [{
						id: a.senderID,
						tag: i
					}]
				}, admin, ((e, n) => global.client.handleReply.push({
					name: this.config.name,
					messageID: n.messageID,
					messID: a.messageID,
					credits: a.senderID,
					id: a.threadID,
					type: "calladmin"
				})));
			}
			break;
		case "calladmin":
			e.sendMessage({
				body: `📌ردود الفعل من المشرف ${i} to you:\n--------\n${a.body}\n--------\n»💬قم بالرد على هذه الرسالة لمواصلة إرسال التقارير إلى المشرف`,
				mentions: [{
					tag: i,
					id: a.senderID
				}]
			}, o.id, ((e, n) => global.client.handleReply.push({
				name: this.config.name,
				credits: a.senderID,
				messageID: n.messageID,
				type: "reply"
			})), o.messID);
			break;
	}
};

module.exports.run = async function({ api: e, event: n, args: a, Users: s, Threads: o }) {
	if (!a[0]) return e.sendMessage("You have not entered the content to report", n.threadID, n.messageID);
	let i = await s.getNameUser(n.senderID);
	var t = n.senderID,
		d = n.threadID;
	let threadInfo = (await o.getData(n.threadID)).threadInfo;
	var l = require("moment-timezone").tz("Asia/Manila").format("HH:mm:ss D/MM/YYYY");
	e.sendMessage(`At: ${l}\nYour report has been sent to the bot admins`, n.threadID, (() => {
		var admins = this.config.ADMINBOT; // Assuming ADMINBOT is defined elsewhere
		for (let admin of admins) {
			let threadName = threadInfo.threadName;
			e.sendMessage(`👤تقرير من: ${i}\n👨‍👩‍👧‍👧مجموعه: ${threadName}\n🔰معرف مجموعه: ${d}\n🔷معرف شخص: ${t}\n-----------------\n⚠️عطل: ${a.join(" ")}\n-----------------\nTime: ${l}`, admin, ((e, a) => global.client.handleReply.push({
				name: this.config.name,
				messageID: a.messageID,
				credits: n.senderID,
				messID: n.messageID,
				id: d,
				type: "calladmin"
			})));
		}
	}));
};
