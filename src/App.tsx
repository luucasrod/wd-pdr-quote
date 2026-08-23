import { Routes, Route } from "react-router-dom"
import { CustomerQuotePage } from "@/pages/customer-quote-page"
import { OwnerApp } from "@/pages/owner-app"

function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerQuotePage />} />
      <Route path="/oficina/*" element={<OwnerApp />} />
    </Routes>
  )
}

export default App
