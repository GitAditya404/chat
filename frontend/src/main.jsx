import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { RoomsProvider } from '../context/RoomContext.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <RoomsProvider>
            <App />
        </RoomsProvider>
    </BrowserRouter>

)
