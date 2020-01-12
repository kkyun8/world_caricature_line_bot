
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
const Query = require('./module/query');
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
    
    Request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
          //保存
          fs.writeFileSync(`./image.jpg`, new Buffer(body), 'binary');
          console.log('file saved');
      } else {
          // TODO: handle error
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
    let returnMessage = ''
    console.log('get message')
    //event.message.textに注文番号
    if (event.message.text.indexOf('注文番号確認') >= 0) {
      returnMessage = '注文番号を確認します。'
      if(event.source.type == 'user') {

      }
      const sqlResult = await Query.checkOrderNumber(event.source.userId,connection)
      const createMessage = await MessageDesign.createPaymentMessage(sqlResult,PaymentJson)

      return client.replyMessage(event.replyToken, createMessage);
    }else{
      returnMessage = 'メッセージなし'
    }
 
    
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: returnMessage
    });
  
  }else{
    return Promise.resolve(null);
  }
 
  // コンテンツ取得
  // GET https://api-data.line.me/v2/bot/message/{messageId}/conten
  

}


app.listen(PORT);
console.log(`Server running at ${PORT}`);