import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { RequireAuth } from './components/RequireAuth'
import { MoviesListPage } from './pages/MoviesListPage'
import { MovieDetailPage } from './pages/MovieDetailPage'
import { MovieCreatePage } from './pages/MovieCreatePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ActivatePage } from './pages/ActivatePage'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<MoviesListPage />} />
          <Route path="/movies/new" element={<RequireAuth><MovieCreatePage /></RequireAuth>} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/activate" element={<ActivatePage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
