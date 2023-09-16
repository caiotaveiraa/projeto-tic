
import {useLocation} from 'react-router-dom';
import {useState, useEffect} from 'react'
import {MdEdit, MdOutlineDeleteOutline} from 'react-icons/md'
import Menu from './Menu';

export default function LocalEstoque()  {

    // esta variável vai conter o username passado na navegação
    const location = useLocation();
    // recupera o username
    //vamos utilizar Cookies para armazenar o username - BREVE
    const username = location.state?.username || '';
    
      return (
          <>
          <div className="flex-col">
          <Menu username={username}/>
        </div>
          <div className="flex flex-col items-center justify-center ">
              <div className="max-w-md mx-10 my-5 mb-4">
                  Página de LOCAIS
              </div>
          </div>
          </>
      )
}

/*interface localEstoqueProps { // tipo de dado
  id: number,
  name: string,
}

export function LocalEstoque() {
  // esta variável vai conter o username passado na navegação
  const location = useLocation();
  // recupera o username
  const username = location.state?.username || '';

  
  // vetor de locais
  const [locais, setLocais] = useState<localEstoqueProps[]>([])

  // variáveis de estado para os campos do formulário
  const [name, setName] = useState('')
  
  // diferencia se vai inserir (id = 0) ou editar (id não for 0) um produto
  const [id, setId] = useState(0)

  // fazer o hook useEffect para carregar os locais da API
    useEffect( () => {
    const buscaLocais = async () => {
      try {
        const resp = await fetch(`http://localhost:3333/locaisEstoque`)
        const locais = await resp.json()
        if (resp.ok){
          setLocais(locais) // atualiza vetor de produtos com dados da API
        }
        else {
          console.log('Falha na busca por dados')
        }
      }
      catch(error) {
        console.log(error)
      }
    }
    buscaLocais()
  } , [username])

}
export default LocalEstoque;*/