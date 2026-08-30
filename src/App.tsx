import { Routes, Route } from "react-router-dom"
import { CustomerQuotePage } from "@/pages/customer-quote-page"
import { OwnerApp } from "@/pages/owner-app"
import { PrivacyPolicyPage } from "@/pages/privacy-policy-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { OficinaPasscodeGate } from "@/components/auth/oficina-passcode-gate"

function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerQuotePage />} />
      <Route path="/privacidade" element={<PrivacyPolicyPage />} />
      <Route
        path="/oficina/*"
        element={
          <OficinaPasscodeGate>
            <OwnerApp />
          </OficinaPasscodeGate>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
