import React from 'react';

import Homepage from "./pages/Homepage"
import Academicspage from './pages/Academicspage';
import { Route,Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import NotesPage from './pages/NotesPage';
import PapersPage from './pages/PapersPage';
import BooksPage from './pages/BooksPage';
import LabsPage from './pages/LabsPage';
import CGPACalculator from './components/CGPACalculator';
import Upload from './pages/Upload';
import UploadForm from './pages/UploadForm';
import AboutusPage from './pages/AboutusPage';
import RateUsPage from './pages/RateUsPage';








function App() {


  return (
  <>

    <Routes> 
     <Route path="/" element ={<Homepage/>}/>
     <Route path="/academic" element ={<Academicspage/>}/>
     <Route path="/notes" element ={<NotesPage/>}/>
     <Route path="/papers" element ={<PapersPage/>}/>
     <Route path="/books" element ={<BooksPage/>}/>
     <Route path="/labs" element ={<LabsPage/>}/>
     <Route path="/calc" element ={ <CGPACalculator/>}/>
     <Route path="/up" element ={<Upload/>}/>
     <Route path="/about" element ={<AboutusPage/>}/>
     <Route path="/uploadform/:type" element={<UploadForm />} />
     <Route path="/rateus" element ={<RateUsPage/>}/>
  
   
     
    

     
     
    
     
  
   </Routes>
</>
  
    
  
  )
}

export default App
