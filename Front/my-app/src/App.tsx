import Login from './features/counter/Login';
import Navbar from './features/counter/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './features/counter/ProductList';
import Cart from './features/counter/Cart';
import HomePage from './features/counter/Home';


const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Login></Login>
        <Cart></Cart>
        <Routes>
          <Route path="/products/:id" element={<ProductList />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
