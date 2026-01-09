import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/app/page";
import MyForms from "@/app/forms/page";
import FormView from "@/app/forms/[id]/page";
import NotFound from "@/pages/NotFound";
import SingleFormPage from "./app/forms/SingleFormPage";
import FormResponsesPage from "./app/forms/FormResponsesPage";
import LoginPage from "@/app/auth/LoginPage";
import PublicFormPage from "@/app/public/PublicFormPage";
import EditFormPage from "@/app/forms/EditFormPage";




const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forms" element={<MyForms />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/forms/:id" element={<SingleFormPage />} />
          <Route path="/forms/:id/responses"element={<FormResponsesPage />}/>
          <Route path="/f/:id" element={<PublicFormPage />} />
          <Route path="/forms/:id/edit" element={<EditFormPage />} />



        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
