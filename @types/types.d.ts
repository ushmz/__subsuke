import {SQLResultSetRowList} from 'expo-sqlite';

interface UserItem extends SQLResultSetRowList {
  service: string,
  price: string,
  cycle: string,
  due: Date
}

interface HomeScreenProps {
  screenProps: any;
}

interface HomescreenState {
  list?: SQLResultSetRowList,
  service?: string,
  price?: string,
  cycle?: string,
  due?: Date,
  isVisible?: Boolean,
  token?: string
}

interface AdditionalTempState {
  list?: SQLResultSetRowList,
  service?: string,
  price?: string,
  cycle?: string,
  year?: number,
  month?: number,
  date?: number,
  due?: Date,
  isVisible?: Boolean,
  token?: string
}
