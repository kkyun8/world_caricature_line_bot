
'use strict';

//.env call
require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const fs = require('fs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const Request = require('request');
const PORT = process.env.PORT;

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

let connection = mysql.createConnection({
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
function handleEvent(event) {

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
          // @todo handle error
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

    //event.message.textに注文番号
    if (event.message.text.indexOf('注文番号確認') >= 0) {
      returnMessage = '注文番号を確認します。'
    }else{
      returnMessage = 'なし'
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

function checkOrderNumber(userId){
  //mysql select
  let result = 'database_error'
  connection.query('select name from sample_images where id = 1', function (error, results, fields) {
    if (error) throw error;
    result = results[0]
  });
  
  console.log(result)
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);