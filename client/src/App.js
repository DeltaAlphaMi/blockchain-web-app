import './App.css';
import store from './redux/store'
import TransactionContainer from './components/TransactionContainer'
import Transfer from './components/Transfer'
import { Provider } from 'react-redux'


function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <TransactionContainer />
        <Transfer />
      </div>
    </Provider>
  );
}

export default App;
