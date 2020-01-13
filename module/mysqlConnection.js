const beginTransaction = (connection) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  });
}

const query = (connection, statement, params) => {
  return new Promise((resolve, reject) => {
    connection.query(statement, params, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        console.log('sql実行成功');
        resolve(results, fields);
      }
    });
  });
}

const commit = (connection) => {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};

const rollback = (connection, err) => {
  return new Promise((resolve, reject) => {
    connection.rollback(() => {
      reject(err);
    });
  });
};

module.exports = {
  beginTransaction: beginTransaction,
  query: query,
  commit: commit,
  rollback: rollback,
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


