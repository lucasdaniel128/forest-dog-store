import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Providers } from "@/providers";
import { LandingPage } from "@/pages";
import { PoliticaDePrivacidadePage } from "@/pages";
import { TermosDeUsoPage } from "@/pages";
import { TrocasEDevolucoesPage } from "@/pages";
import { ContatoPage } from "@/pages";
import { RastrearPedidoPage } from "@/pages";

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidadePage />} />
          <Route path="/termos-de-uso" element={<TermosDeUsoPage />} />
          <Route path="/trocas-e-devolucoes" element={<TrocasEDevolucoesPage />} />
          <Route path="/contato" element={<ContatoPage />} />
          <Route path="/rastrear-pedido" element={<RastrearPedidoPage />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}
