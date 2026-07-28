import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { AuthProvider } from './context/AuthContext.jsx'
import { store } from './redux/store.js'
import "./styles/global.css"
 import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
