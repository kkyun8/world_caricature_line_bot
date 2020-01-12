
module.exports = {
  /**
  * オーダ情報取得
  */
  checkOrderNumber(userId,connection) {
    //mysql select
    console.log("start mysql order select")
    let result = ''
    connection.query("select * from orders where line_id = " + '"' + userId + '"', function (error, results, fields) {
      if (error) throw error;
      //WEB_USER .RowDataPacket   
      console.log("mysql result")
      result = results
    });
    console.log("mysql end")
    return result
  }
};

// `id` bigint(20) NOT NULL AUTO_INCREMENT,
// `sample_image_id` int(11) NOT NULL,
// `order_number` varchar(255) NOT NULL,
// `order_status` int(11) DEFAULT '1',
// `flame_size` varchar(255) DEFAULT 'M',
// `premium_wrapping` tinyint(1) DEFAULT '0',
// `price` int(11) NOT NULL,
// `name_kanji` varchar(255) NOT NULL,
// `name_furigana` varchar(255) NOT NULL,
// `email` varchar(255) DEFAULT NULL,
// `line_id` varchar(255) DEFAULT NULL,
// `cell_phone_number` varchar(255) DEFAULT NULL,
// `home_phone_number` varchar(255) DEFAULT NULL,
// `postal_code` varchar(255) NOT NULL,
// `address1` varchar(255) NOT NULL,
// `address2` varchar(255) NOT NULL,
// `comment` varchar(255) DEFAULT NULL,
// `created_at` datetime NOT NULL,
// `updated_at` datetime NOT NULL,


