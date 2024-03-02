const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "دمج",
    version: "1.0.0",
    role: 0,
    hasPrefix: false,
    description: "دمج اموجيهات.",
    usage: "emojimix [emoji1] [emoji2]",
    credits: "Developer",
    cooldown: 0
};

function isValidEmoji(emoji) {
    return emoji.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/);
}


module.exports.run = async ({ api, event, args }) => {

  try {
    
  const { threadID, messageID } = event;
  
  const time = new Date();
  const timestamp = time.toISOString().replace(/[:.]/g, "-");
  const pathPic = __dirname + '/cache/' + `${timestamp}_emojimix.png`;

  if (args.length < 2) {
    api.sendMessage("يرجى تقديم اثنين من الرموز التعبيرية للمزج.", threadID, messageID);
    return;
  };
    
    const emoji1 = args[0];
    const emoji2 = args[1];

    if (!isValidEmoji(emoji1) || !isValidEmoji(emoji2)) {
      api.sendMessage("تم تقديم رموز تعبيرية غير صالحة. يرجى تقديم رموز تعبيرية صالحة.", threadID, messageID);
      return;
    }
  
   const { data } = await axios.get(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`);
  
    const picture = data.results[0].url;
  
    const getPicture = (await axios.get(picture, { responseType: 'arraybuffer' })).data;

    fs.writeFileSync(pathPic, Buffer.from(getPicture, 'utf-8'));

    api.sendMessage({ body: '', attachment: fs.createReadStream(pathPic) }, threadID, () => fs.unlinkSync(pathPic), messageID);

    } catch(error) {
      api.sendMessage("لا يمكن الجمع بين الرموز التعبيرية.", threadID, messageID);
    }
};
