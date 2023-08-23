import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { type FC } from 'react'
import App from '@/pages/App'
import { Layout } from '@/components/layouts/Layout'

const RoutesProvider: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default RoutesProvider
