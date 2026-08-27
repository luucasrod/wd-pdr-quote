import { Routes, Route } from "react-router-dom"
import { CustomerQuotePage } from "@/pages/customer-quote-page"
import { OwnerApp } from "@/pages/owner-app"
import { PrivacyPolicyPage } from "@/pages/privacy-policy-page"

function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerQuotePage />} />
      <Route path="/privacidade" element={<PrivacyPolicyPage />} />
      <Route path="/oficina/*" element={<OwnerApp />} />
    </Routes>
  )
}

export default App
