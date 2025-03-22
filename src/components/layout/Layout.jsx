import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

function Layout({children}) {
  return (
    <div className={"flex flex-row "}>
      <Sidebar/>
      <div className={"flex flex-col w-[80vw]"}>
        <Navbar/>
        <div className={"bg-[#212121]"}>
          {children}</div>
      </div>
    </div>
  )
}

export default Layout;