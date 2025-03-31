// import "./App.css";
import { Link } from "react-router-dom";
import axios from "../src/api/axios";
import { useStore } from "./store/myStore";

async function logout() {
  const logout = useStore.getState().logout; // ✅ Get logout function from Zustand

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASEURL}/auth/logout`
    );
    if (response.status === 200) {
      console.log("✅ Logout successful");
    }
  } catch (error) {
    console.error("❌ Logout failed:", error);
  } finally {
    logout(); // ✅ Always clear the frontend state, even if API call fails
  }
}
function App() {
  const userInfo = useStore((state) => state.user);
  console.log(useStore.getState().user);
  console.log(userInfo);

  return (
    <div>
      <Link to="/blog">
        <button className="border-2 bg-blue-500 hover:bg-blue-900 transition-colors p-2 ">
          See all blogs
        </button>
      </Link>

      {userInfo ? (
        <button
          className="border-2 bg-blue-500 hover:bg-blue-900 transition-colors p-2 "
          onClick={logout}
        >
          logout
        </button>
      ) : (
        <Link to="/register">
          <button className="border-2 bg-blue-500 hover:bg-blue-900 transition-colors p-2 ">
            login
          </button>
        </Link>
      )}
    </div>
  );
}

export default App;
