import './style.css'
import { Header } from './components/Header'
import { Body } from './components/Body'
import { Footer } from './components/Footer'

// Render the main app layout
const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  ${Header()}
  ${Body()}
  ${Footer()}
`