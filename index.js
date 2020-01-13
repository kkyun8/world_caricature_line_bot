
'use strict';

//.env call
require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const fs = require('fs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const Request = require('request');
const MessageDesign = require('./module/messageDesign');
const PaymentJson =require('./module/messageJson/payment.json')
const mysqlConnection = require('./module/mysqlConnection');
const PORT = process.env.PORT;
const WEB_USER = process.env.WEB_USER;

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const app = express();

async function getMessageData(userId) {
  console.log("getMessageData実行")
  // TODO: １個以上の注文の場合、メッセージ対応
  const sqlResult = await mysqlConnection.query(connection,  'SELECT s.name,s.information, o.order_number, o.price, o.name_kanji, o.name_furigana, o.postal_code, o.address1, o.address2 FROM orders o, sample_images s WHERE o.line_id = ? AND o.sample_image_id = s.id ORDER BY o.id DESC LIMIT 1',[userId]);
  const createMessage = await MessageDesign.createPaymentMessage(sqlResult,PaymentJson);
  return createMessage;
}

//ブラウザ確認用(無くても問題ない)
app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); 
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
    if(req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff'){
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return; 
    }

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});


const client = new line.Client(config);

//handleEvent
async function handleEvent(event) {

  //画像取得してすぐデータ保存S3
  if (event.message.type === 'image') {
  
    const getUrl = 'https://api-data.line.me/v2/bot/message/' + event.message.id + '/content'
    console.log(getUrl)
    console.log('get image')

    const options = {
      url: getUrl,
      method: 'get',
      headers: {
          'Authorization': 'Bearer ' + config.channelAccessToken,
      },
      encoding: null
    };
    
    await Request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
          //ローカル保存
          //TODO: AWS S3保存
          fs.writeFileSync(`./image.jpg`, new Buffer(body), 'binary');
          console.log('file saved');
      } else {
          // TODO: handle error
          console.log('save error')
      }
    });

    // client.getMessageContent(event.message.id).then((stream) => {
    //   stream.on('data', (chunk) => {
    //     fs.writeFileSync(`./image.jpg`, new Buffer.from(chunk), 'binary');
    //     console.log(`done`);
    //   });
    //   stream.on('error', (err) => {
    //     // error handling
    //   });
    // });

  }else if (event.type === 'message'){
    console.log('message受信')
    //event.message.textに注文番号
    if (event.message.text.indexOf('注文番号確認') >= 0) {
      if(event.source.type == 'user') {

      }

      //mysqlでデーター取得＞＞結果からJson加工＞＞Jsonをreturn
      console.log('「注文情報確認」入力確認')
      const result = await getMessageData(event.source.userId)
      return client.replyMessage(event.replyToken,result)
    }else{

      const result = [{
          type: 'text',
          text: '「' + event.message.text + '」を入力しました。'
        },
      ];

      return client.replyMessage(event.replyToken,result)
    }
 
  }else{
    return Promise.resolve(null);
  }
 
  // コンテンツ取得
  // GET https://api-data.line.me/v2/bot/message/{messageId}/conten
  

}



app.listen(PORT);
console.log(`Server running at ${PORT}`);