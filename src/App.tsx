import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Overview from "./pages/Overview";
import Transactions from "./pages/Transactions";
import Cards from "./pages/Cards";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="cards" element={<Cards />} />
      </Route>
    </Routes>
  );
}
