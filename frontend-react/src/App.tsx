import Inicio from './components/Inicio'
import Login from './components/Login/Login'
import Cadastrar from './components/Login/CadastrarUsuario'
import Nfe from './components/Nfe'
import Produto from './components/Produtos'
import LocalEstoque from './components/LocalEstoque'

import './styles/global.css'
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'

function App() {

  return (
    <Router>
      <div className="flex">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/novousuario" element={<Cadastrar />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/cadastros/*">
            <Route path="fornecedores" element={<Inicio />} />
            <Route path="unidades" element={<Inicio />} />
            <Route path="tipos" element={<Inicio />} />
            <Route path="produtos" element={<Produto />} />
            <Route path="composicoes" element={<Inicio />} />
            <Route path="locais" element={<LocalEstoque />} />
            <Route path="usuarios" element={<Inicio />} />
          </Route>
          <Route path="/nfe" element={<Nfe />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
