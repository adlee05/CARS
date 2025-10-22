import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import { Outlet } from "react-router-dom";

function GeneralLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default GeneralLayout;
