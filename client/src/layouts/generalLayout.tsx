import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import { Outlet } from "react-router-dom";

function GeneralLayout({children}) {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default GeneralLayout;
