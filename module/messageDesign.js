
  //mysql結果からLINEメッセージを作る
  const createPaymentMessage = (result, jsonfile) => {
    return new Promise((resolve,reject) => {
      console.log("json 加工 start")
      const sqlResult = JSON.parse(JSON.stringify(result))
      let returnJson = [];
      sqlResult.forEach(element => {
        console.log("sql loop")
          const order = element
          let json = jsonfile
          // TODO: contents.hero.url に AWS S3
          //messageJson.contents.hero.url =     
          //sample_images.name
          json.contents.body.contents[0].contents[0].text = order.name
          //sample_images.information
          json.contents.body.contents[0].contents[1].text = order.information
          //order.order_number
          json.contents.body.contents[1].contents[1].text = order.order_number
          //￥order.price
          json.contents.body.contents[2].contents[1].text = "￥" + order.price
          //注文者名：order.name_kanji order.name_furigana
          json.contents.body.contents[3].contents[0].text = order.name_kanji + " " + order.name_furigana
          // お届け先：〒order.postal_code order.address1 order.address2
          json.contents.body.contents[3].contents[1].text = "〒" + order.postal_code + " " + order.address1 + " " + order.address2;
          // payment url /payment/order_number
          json.contents.footer.contents[0].action.uri = "http://localhost:5000/payment/" + order.order_number
          returnJson.push(json);
        });

      if(returnJson){
        console.log("json 加工 success")
        resolve(returnJson);
      }else{
        reject('not found');
      }
    });
  };

module.exports = {
  createPaymentMessage: createPaymentMessage,
};


//  const query = (connection, statement, params) => {
//   return new Promise((resolve, reject) => {
//     connection.query(statement, params, (err, results, fields) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results, fields);
//       }
//     });
//   });

      // event-object
      // { type: 'message',
      //   replyToken: 'c2685d864a834d8cbed97ebab726408f',
      //   source:
      //    { userId: 'U8ddfa4072a046528f8fc06be500d6511', type: 'user' },
      //   timestamp: 1578722600963,
      //   mode: 'active',
      //   message: { type: 'text', id: '11237809632403', text: 'あ' } }

      // [ RowDataPacket {
      //   id: 2,
      //   sample_image_id: 1,
      //   order_number: '2019112814301202726147',
      //   order_status: 1,
      //   flame_size: 'M',
      //   premium_wrapping: 0,
      //   price: 14000,
      //   name_kanji: 'や',
      //   name_furigana: 'や',
      //   email: 'mail@mail.com',
      //   line_id: 'U8ddfa4072a046528f8fc06be500d6511',
      //   cell_phone_number: '090',
      //   home_phone_number: '090',
      //   postal_code: '3510006',
      //   address1: '埼玉県朝霞市仲町',
      //   address2: 'あ',
      //   comment: '',
      //   created_at: 2019-11-28T05:30:12.000Z,
      //   updated_at: 2019-11-28T05:30:12.000Z } ]


          // const message = 
          // {
          //   type: "flex",
          //   altText: "Flex Message",
          //   contents: {
          //     type: "bubble",
          //     hero: {
          //       type: "image",
          //       url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_5_carousel.png",
          //       size: "full",
          //       aspectRatio: "4:3",
          //       aspectMode: "cover"
          //     },
          //     body: {
          //       type: "box",
          //       layout: "vertical",
          //       contents: [
          //         {
          //           type: "box",
          //           layouthero: "vertical",
          //           margin: "md",
          //           contents: [
          //             {
          //               type: "text",
          //               text: "sample_images.name",
          //               size: "xl",
          //               weight: "bold",
          //               wrap: true
          //             },
          //             {
          //               type: "text",
          //               text: "sample_images.infomation",
          //               size: "xs",
          //               color: "#AAAAAA",
          //               wrap: true
          //             }
          //           ]
          //         },
          //         {
          //           type: "box",
          //           layout: "baseline",
          //           margin: "md",
          //           contents: [
          //             {
          //               type: "text",
          //               text: "注文番号：",
          //               size: "lg",
          //               align: "start",
          //               weight: "bold",
          //               wrap: true
          //             },
          //             {
          //               type: "text",
          //               text: order.order_number,
          //               size: "lg",
          //               align: "end",
          //               weight: "bold",
          //               wrap: true
          //             }
          //           ]
          //         },
          //         {
          //           type: "box",
          //           layout: "baseline",
          //           margin: "md",
          //           contents: [
          //             {
          //               type: "text",
          //               text: "価格：",
          //               size: "lg",
          //               weight: "bold"
          //             },
          //             {
          //               type: "text",
          //               text: "￥" + order.price,
          //               size: "lg",
          //               align: "end",
          //               weight: "bold",
          //               wrap: true
          //             }
          //           ]
          //         },
          //         {
          //           type: "box",
          //           layout: "vertical",
          //           spacing: "xxl",
          //           margin: "md",
          //           contents: [
          //             {
          //               type: "text",
          //               text: "注文者名：" + order.name_kanji + " " + order.name_furigana,
          //               margin: "sm",
          //               align: "start",
          //               wrap: true
          //             },
          //             {
          //               type: "text",
          //               text: "お届け先：〒" + order.postal_code + " " + order.address1 + " " + order.address2,
          //               margin: "sm",
          //               align: "start",
          //               wrap: true
          //             },
          //             {
          //               type: "text",
          //               text: "＊詳しい注文者情報は以下の支払いページを参考してください。",
          //               margin: "lg",
          //               size: "sm",
          //               align: "center",
          //               wrap: true
          //             }
          //           ]
          //         }
          //       ]
          //     },
          //     footer: {
          //       type: "box",
          //       layout: "vertical",
          //       spacing: "sm",
          //       contents: [
          //         {
          //           type: "button",
          //           action: {
          //             type: "uri",
          //             label: "支払いページを開く",
          //             uri: "http://localhost:5000"
          //           },
          //           style: "primary"
          //         }
          //       ]
          //     }
          //   }
          // }
          
