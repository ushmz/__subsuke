import * as SQLite from 'expo-sqlite';

const connection = SQLite.openDatabase('subsuke');

export function createDBIfNotExistAsync() {
  return new Promise( (resolve, reject) => {
    connection.transaction(
      tx => {
        tx.executeSql(
          "create table if not exists subscriptions (\
            service text not null,\
            price int not null,\
            cycle text not null,\
            year int not null,\
            month int not null,\
            date int not null\
          )",
          null,
          (tx, {rows}) => {
            console.log('Successed to connect DB.');
          },
          (tx, err) => {
            console.log('Failed to connect DB.');
            console.log(err);
          }
        );
      },
      () => reject(),
      () => resolve()
    );
  });
}

export function selectAllAsync() {
  let result;
  return new Promise( (resolve, reject) => {
    connection.transaction(
      tx => {
        tx.executeSql(
          "select rowid, service, price, cycle, year, month, date from subscriptions;",
          null,
          (_, {rows}) => {
            result = rows;
          },
          (tx, err) => {
            console.log('Failed to collect data.');
            console.log(err);
            result = {_array: [], length: 0};
          }
        );
      },
      () => reject(result),
      () => resolve(result)
    );
  });
}

export function insertItemAsync(additional) {
  let insertId;
  return new Promise( (resolve, reject) => {
    connection.transaction(
      tx => {
        tx.executeSql(
          "insert into subscriptions(service, price, cycle, year, month, date) values(?,?,?,?,?,?);",
          [additional.service, additional.price, additional.cycle, additional.year, additional.month, additional.date],
          (tx, rs) => {
            // Args : (tx, {rows})
            insertId = rs['insertId'];
            console.log('[_onPressAdd] insert success (insert ID : ' + insertId+')');
          },
          (tx, error) => {
            console.log('[_onPressAdd] failed to insert');
            console.log(error);
          }
        );
      },
      () => reject(),
      () => resolve(insertId)
    );
  });
}

export function deleteItemByRowidAsync(rowid) {
  return new Promise( (resolve, reject) => {
    connection.transaction(
      tx => {
        tx.executeSql(
          "delete from subscriptions where rowid = ?;",
          [rowid],
          (tx, {rows}) => {
            console.log('[_onDelete] successed to delete item');
          },
          (tx, error) => {
            console.log(tx, err);
            console.log('[_onDelete] failed to delete item');
          }
        );
      },
      () => reject(),
      () => resolve()
    );
  });
}

export function updateItemAsync(item) {
  return new Promise( (resolve, reject) => {
    connection.transaction(
      tx => {
        Object.keys(item).forEach( key => {
          if (key !== 'rowid') {
            tx.executeSql(
              // This throws << Error code 1: near "?": syntax error >>
              // "update subscriptions set ? = ? where rowid = ?",
              // [key, item[key], item.rowid],
              // Column name couldn't define by "?" placeholder? (cause using placeholder, chars are escaped.)
              `update subscriptions set ${key} = '${item[key]}' where rowid = ${item['rowid']};`,
              null,
              (tx, rs) => {},
              (tx, err) => {
                console.log(err);
                console.log(key);
                console.log(item[key]);
                console.log(item['rowid']);
              }
            );
          };
        });
      },
      () => reject(),
      () => resolve()
    );
  });
}

export function updateItemAsyncTest(item) {
  return new Promise( (resolve, reject) => {
    connection.transaction(
      tx => {
        tx.executeSql(
          'update subscriptions set service = ? where rowid = ?;',
          [item.service, item.rowid]
        );
        tx.executeSql(
          'update subscriptions set price = ? where rowid = ?;',
          [item.price, item.rowid]
        );
        tx.executeSql(
          'update subscriptions set cycle = ? where rowid = ?;',
          [item.cycle, item.rowid]
        );
      },
      () => reject(),
      () => resolve()
    );
  });

}