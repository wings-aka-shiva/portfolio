import { BrowserRouter as Router } from "react-router-dom"

import AppRoutes from "./routes/appRoutes"

function App() {

  return (
    <>
      <Router basename="/portfolio">
        <AppRoutes />
      </Router>
    </>
  )
}

export default App
