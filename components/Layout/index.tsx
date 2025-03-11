import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import ToSModal from "../ToSModal";
import ToastsRenderer from "../ToastsRenderer";

const Layout = () => (
  <div className="lexo-guilds-root">
    <Header hasGuilds={false} />
    <div className="content-container">
      <div className="content">
        <Outlet />
      </div>
    </div>
    <Footer />
    <ToSModal />
    <ToastsRenderer />
  </div>
);

export default Layout;
