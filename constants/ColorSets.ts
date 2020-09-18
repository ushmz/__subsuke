interface Color {
    [target: string]: string
}

interface Theme {
    [name: string]: Color
}

const tintColor = '#2f95dc';

const defaultColor: Color = {
  tintColor,
  tabIconDefault: '#ccc',
  tabIconSelected: tintColor,
  tabBar: '#fefefe',
  errorBackground: 'red',
  errorText: '#fff',
  warningBackground: '#EAEB5E',
  warningText: '#666804',
  noticeBackground: tintColor,
  noticeText: '#fff',
};

const theme: Theme = {
    light: {
        primaryText: '',
        text: 'rgb(10, 10, 10)',    // yo!check!
        header: 'rgb(175, 82, 222)',
        dark: 'rgb(250, 250, 250)',
        darker: 'rgb(240,240,240)',
        yetDarker: 'rgb(230,230,230)',
      },
      dark: {
        primaryText: '',
        text: 'rgb(200, 200, 200)',
        header: 'rgb(80, 20, 120)',
        dark:  'rgb(75, 75, 75)',
        darker: 'rgb(65, 65, 65)',
        yetDarker: 'rgb(35, 35, 35)',    // yo!check!
      },
      subsuke: {
        primaryText: '',
        text: 'rgb(200, 200, 200)',
        header: 'rgb(80, 20, 120)',
        dark: 'rgb(40, 10, 60)',
        darker: 'rgb(20, 5, 30)',
        yetDarker: 'rgb(10, 2, 15)',
      },  
}
  
export {defaultColor, theme}