import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Home } from './pages/Home'
import { EditorPage } from './pages/EditorPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Navigate to="/" replace />} />
        <Route path="/editor/:resumeId" element={<EditorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
