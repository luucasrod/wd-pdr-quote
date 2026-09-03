import { Routes, Route } from "react-router-dom"
import { CustomerQuotePage } from "@/pages/customer-quote-page"
import { OwnerApp } from "@/pages/owner-app"
import { PrivacyPolicyPage } from "@/pages/privacy-policy-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { RequireAuth } from "@/auth/require-auth"

function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerQuotePage />} />
      <Route path="/privacidade" element={<PrivacyPolicyPage />} />
      <Route
        path="/oficina/*"
        element={
          <RequireAuth>
            <OwnerApp />
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
