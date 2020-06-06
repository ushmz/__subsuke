import * as SQLite from 'expo-sqlite';

class SQLRepository {

  connection: SQLite.WebSQLDatabase;
  
  INIT_QUERY: string = "create table if not exists subscriptions (\
    service text not null,\
    price int not null,\
    cycle text not null,\
    year int not null,\
    month int not null,\
    date int not null\
  )";
  INISERT_QUERY: string = "insert into subscriptions(service, price, cycle, year, month, date) values(?,?,?,?,?,?);";
  UPDATE_QUERY: string = "update subscriptions set ? = ? where rowid = ?;";
  DELETE_QUERY: string = "delete from subscriptions where rowid = ?;";

  constructor() {
    this.connection = SQLite.openDatabase('subsuke');
  }

  establishConnection(): void {
    this.connection = SQLite.openDatabase('subsuke');
  }

  successCallback = (tx: SQLTransaction, {rows}: SQLResultSet, msg: String): boolean =>{
    console.log(msg);
    return true;
  }
  
  failedCallback = (tx: SQLTransaction, err: SQLError, msg: String): boolean => {
    console.log(err);
    console.log(msg);
    return false;
  }

  //Need?
  releaseConnection() {
  }
  
  createDBIfNotExistAsync() {

    if (!this.connection) {
      this.establishConnection()      
    }

    return new Promise( (resolve, reject) => {
      this.connection.transaction(
        tx => {
          tx.executeSql(
            this.INIT_QUERY,
            [],
            (tx: any, {rows}: any) => {
              console.log('Successed to connect DB.');
            },
            (tx: any, err: any): any=> {
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
  
  selectAllAsync(): Promise<Object> {
    let result: object;

    if (!this.connection) {
      this.establishConnection()      
    }

    return new Promise( (resolve, reject) => {
      this.connection.transaction(
        (tx: SQLTransaction) => {
          tx.executeSql(
            "select rowid, service, price, cycle, year, month, date from subscriptions;",
            [],
            (_: SQLTransaction, {rows}: SQLResultSet): boolean => {
              result = rows;
              return true;
            },
            (tx: SQLTransaction, err: SQLError): boolean => {
              console.log('Failed to collect data.');
              console.log(err);
              result = {_array: [], length: 0};
              return false;
            }
          );
        },
        () => reject(result),
        () => resolve(result)
      );
    });
  }

  insertItemAsync(additional: Item): Promise<any> {
    let insertId: number;

    if (!this.connection) {
      this.establishConnection()      
    }

    return new Promise( (resolve, reject) => {
      this.connection.transaction(
        (tx: SQLTransaction) => {
          tx.executeSql(
            this.INISERT_QUERY,
            [additional.service, additional.price, additional.cycle, additional.year, additional.month, additional.date],
            (tx: SQLTransaction, rs: SQLResultSet): boolean => {
              // Args : (tx, {rows})
              insertId = rs['insertId'];
              console.log('[_onPressAdd] insert success (insert ID : ' + insertId+')');
              return true;
            },
            (tx: SQLTransaction, error: SQLError): boolean => {
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
  
  deleteItemByRowidAsync(rowid: number): Promise<void> {

    if (!this.connection) {
      this.establishConnection()      
    }

    return new Promise( (resolve, reject) => {
      this.connection.transaction( (tx: SQLTransaction) => {
        tx.executeSql(
          this.DELETE_QUERY,
          [rowid],
          (tx: SQLTransaction, {rows}: SQLResultSet) => {
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
  
  updateItemAsync(item: Item): Promise<void> {

    if (!this.connection) {
      this.establishConnection()      
    }

    return new Promise( (resolve, reject) => {
      this.connection.transaction( (tx: SQLTransaction): void => {
          Object.keys(item).forEach( (key: string): void => {
            if (key !== 'rowid') {
              tx.executeSql(
                this.UPDATE_QUERY,
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
}

interface Item {
  [name: string]: object
}
