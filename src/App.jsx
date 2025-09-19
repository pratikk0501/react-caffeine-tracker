import Layout from "./components/Layout";
import History from "./components/History";
import Hero from "./components/Hero";
import CoffeeForm from "./components/CoffeeForm";
import Stats from "./components/Stats";
import { useAuth } from "./context/AuthContext";

function App() {
  const { globalUser, globalData, isLoading } = useAuth();
  const isAuthenticated = globalUser;
  const isData = globalData && !!Object.keys(globalData || {}).length;

  const logincontent = (
    <>
      <Stats />
      <History />
    </>
  );

  return (
    <>
      <Layout>
        <Hero />
        <CoffeeForm isAuthenticated={isAuthenticated} />
        {isLoading && isAuthenticated && <p>Loading Data...</p>}
        {isAuthenticated && isData && logincontent}
      </Layout>
    </>
  );
}

export default App;
