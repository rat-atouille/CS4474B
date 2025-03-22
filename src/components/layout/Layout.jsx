import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

function Layout({children}) {
  return (
    <div className={"flex flex-row "}>
      <Sidebar/>
      <div className={"flex flex-col w-[80vw]"}>
        <Navbar/>
        {children}
      </div>
    </div>
  )
}

export default Layout;