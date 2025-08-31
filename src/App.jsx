import Header from './Components/Header';
import SearchBar from './Components/SearchBar';
import ActionCard from './Components/ActionCard';
import RecentItems from './Components/RecentItems';
import LostItemForm from './Components/LostItemForm';
import lost from './assets/images/lost.png';
import found from './assets/images/found.png';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="main-wrapper">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <SearchBar />
              <hr style={{width: '100%', maxWidth: 1020, borderColor: '#D9D9D9', margin: '24px auto'}} />
              <ActionCard
                title="Did you lose an item?"
                subtitle="Misplace something important on campus? We got you covered"
                imgSrc={lost}
                buttonText="Report it here"
                imgWidth={450}
                imgHeight={370}
                link="/report-lost"
              />
              <hr style={{width: '100%', maxWidth: 1020, height: '20px', background: '#D9D9D9', borderColor: '#D9D9D9', margin: '24px auto'}} />
              <ActionCard
                title="Did you find a misplaced item?"
                subtitle="Spotted something that is not yours but looks so precious to someone? Let's help you return it to the owner."
                imgSrc={found}
                buttonText="Report it here"
                imgWidth={750}
                imgHeight={370}
              />
              <RecentItems />
            </>
          } />
          <Route path="/report-lost" element={<LostItemForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
