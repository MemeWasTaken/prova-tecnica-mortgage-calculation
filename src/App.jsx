import Navbar from './components/Navbar';
import Main from './components/Main';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <Main />
      <Footer />
    </div>
  );
}