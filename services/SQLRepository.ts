import { 
  openDatabase,
  SQLError, 
  SQLResultSet,
  SQLResultSetRowList,
  SQLTransaction,
  WebSQLDatabase   
} from 'expo-sqlite';

interface Subscription{
  service: string,
  price: number,
  cycle: string,
  year: number,
  month: number,
  date: number
}
  
const SELECT_ALL_QUERY = "\
  SELECT\
    rowid, \
    service, \
    price, \
    cycle, \
    year, \
    month, \
    date \
  FROM\
    subscriptions\
  ;"

const INIT_QUERY = "\
  CREATE TABLE IF NOT EXISTS subscriptions (\
    service TEXT NOT NULL,\
    price INT NOT NULL,\
    cycle TEXT NOT NULL,\
    year INT NOT NULL,\
    month INT NOT NULL,\
    date INT NOT NULL\
  )";

const INISERT_QUERY = "\
  INSERT INTO \
    subscriptions(\
      service, \
      price, \
      cycle, \
      year, \
      month, \
      date\
    )\
  VALUES(?,?,?,?,?,?);";

const UPDATE_QUERY = "\
  UPDATE \
    subscriptions \
  SET \
    ? = ? \
  WHERE \
    rowid = ?\
  ;";

const DELETE_QUERY = "\
  DELETE FROM \
    subscriptions \
  WHERE \
    rowid = ?\
  ;";

let Connection: WebSQLDatabase;

function getConnection(): void {
  Connection = openDatabase('subsuke');
}

let failedCallback = (msg: String, tx?: SQLTransaction, err?: SQLError): boolean => {
  console.log(msg);
  if (tx && err) {
    console.log(`${tx} - ${err}`);
  }
  return false;
}

function createDBIfNotExistAsync() {

  if (!Connection) getConnection();

  return new Promise( (resolve, reject) => {
    Connection.transaction(
      tx => tx.executeSql(INIT_QUERY),
      () => reject(console.log('Successed to connect DB.')),
      () => resolve(failedCallback('Failed to connect DB.'))
    );
  });
}

function selectAllAsync(): Promise<SQLResultSetRowList> {
  let result: SQLResultSetRowList;

  if (!Connection) {
    getConnection()      
  }

  return new Promise( (resolve, reject) => {
    Connection.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          SELECT_ALL_QUERY,
          [],
          (_: SQLTransaction, {rows}: SQLResultSet): boolean => {
            result = rows;
            return true;
          },
          (_: SQLTransaction, err: SQLError): boolean => {
            console.log('Failed to collect data.');
            console.log(err);
            result = { item: ()=>{}, length: 0};
            return false;
          }
        );
      },
      () => reject(result),
      () => resolve(result)
    );
  });
}

function insertItemAsync(additional: Item): Promise<any> {
  let insertId: number;

  if (!Connection) {
    getConnection()      
  }

  return new Promise( (resolve, reject) => {
    Connection.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          INISERT_QUERY,
          [additional.service, additional.price, additional.cycle, additional.year, additional.month, additional.date],
          (_: SQLTransaction, rs: SQLResultSet): boolean => {
            // Args : (tx, {rows})
            insertId = rs['insertId'];
            console.log('[_onPressAdd] insert success (insert ID : ' + insertId+')');
            return true;
          },
          (_: SQLTransaction, error: SQLError): boolean => {
            console.log('[_onPressAdd] failed to insert');
            console.log(error);
            return false
          }
        );
      },
      () => reject(),
      () => resolve(insertId)
    );
  });
}

function deleteItemByRowidAsync(rowid: number): Promise<void> {

  if (!Connection) {
    getConnection()      
  }

  return new Promise( (resolve, reject) => {
    Connection.transaction( (tx: SQLTransaction) => {
      tx.executeSql(
        DELETE_QUERY,
        [rowid],
        (_: SQLTransaction, rs: SQLResultSet) => {
          // If we need, console deleted rows
          rs.rowsAffected;
          console.log('[_onDelete] successed to delete item');
        },
        (tx: SQLTransaction, err: SQLError): boolean => {
          console.log(tx, err);
          console.log('[_onDelete] failed to delete item');
          return false;
        }
      );
      },
      () => reject(),
      () => resolve()
    );
  });
}

function updateItemAsync(item: Item): Promise<void> {

  if (!Connection) {
    getConnection()      
  }

  return new Promise( (resolve, reject) => {
    Connection.transaction( (tx: SQLTransaction): void => {
        Object.keys(item).forEach( (key: string): void => {
          if (key !== 'rowid') {
            tx.executeSql(
              UPDATE_QUERY,
              [key, item[key], item['rowid']],
            );
          };
        });
      },
      () => reject(),
      () => resolve()
    );
  });
}


interface Item {
  [name: string]: any
}

export {
  createDBIfNotExistAsync,
  selectAllAsync,
  insertItemAsync,
  updateItemAsync,
  deleteItemByRowidAsync
}
