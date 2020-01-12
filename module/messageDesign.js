
module.exports = {
  //mysql結果からLINEメッセージを作る
  createPaymentMessage(result,json){
    return json
  }
};

      // event-object
      // { type: 'message',
      //   replyToken: 'c2685d864a834d8cbed97ebab726408f',
      //   source:
      //    { userId: 'U8ddfa4072a046528f8fc06be500d6511', type: 'user' },
      //   timestamp: 1578722600963,
      //   mode: 'active',
      //   message: { type: 'text', id: '11237809632403', text: 'あ' } }