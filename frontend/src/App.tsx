import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import TransactionList from './pages/TransactionList';
import CreateTransaction from './pages/CreateTransaction';
import TransactionDetail from './pages/TransactionDetail';
import ConversionWorkspace from './pages/ConversionWorkspace';
import SupportedCurrencies from './pages/SupportedCurrencies';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<TransactionList />} />
          <Route path="transactions/new" element={<CreateTransaction />} />
          <Route path="transactions/:id" element={<TransactionDetail />} />
          <Route path="convert" element={<ConversionWorkspace />} />
          <Route path="currencies" element={<SupportedCurrencies />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
