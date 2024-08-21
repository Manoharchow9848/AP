import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Footer from './components/Footer'
import Protect from './components/Protect'
import PrivateRoute from './components/PrivateRouutes'
import DashBoard from './pages/DashBoard'
import LocateMla from './pages/LocateMla'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import UpdateMla from './pages/UpdateMla'
function App() {
  

  return (
    <BrowserRouter>
      <Header />
      <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />

      <Route element={<Protect />}>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
         
          <Route path='/update-mla/:mlaId' element={<UpdateMla />} />
          
        </Route>

        <Route element={<PrivateRoute />}>
        <Route path='/dashboard' element={<DashBoard />} />   
        <Route path='/locator' element={<LocateMla />} />  
          </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
