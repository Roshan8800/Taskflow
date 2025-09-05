import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('TaskFlow', () => App);
AppRegistry.runApplication('TaskFlow', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});