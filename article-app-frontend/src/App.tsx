import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Article from "./pages/Article";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-gray-900">
      <BrowserRouter>
        <Header />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/article/:slug" element={<Article />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
