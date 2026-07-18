import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Providers } from "@/providers";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { LandingPage } from "@/pages";
import { PoliticaDePrivacidadePage } from "@/pages";
import { TermosDeUsoPage } from "@/pages";
import { TrocasEDevolucoesPage } from "@/pages";
import { ContatoPage } from "@/pages";
import { RastrearPedidoPage } from "@/pages";
import { CheckoutPage } from "@/pages";
import { CheckoutPixPage } from "@/pages";
import { CheckoutSucessoPage } from "@/pages";
import { NotFoundPage } from "@/pages";

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidadePage />} />
          <Route path="/termos-de-uso" element={<TermosDeUsoPage />} />
          <Route path="/trocas-e-devolucoes" element={<TrocasEDevolucoesPage />} />
          <Route path="/contato" element={<ContatoPage />} />
          <Route path="/rastrear-pedido" element={<RastrearPedidoPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/pix" element={<CheckoutPixPage />} />
          <Route path="/checkout/sucesso" element={<CheckoutSucessoPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}
