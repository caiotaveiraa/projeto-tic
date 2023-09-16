
import {useLocation} from 'react-router-dom';
import {useState, useEffect} from 'react'
import {MdEdit, MdOutlineDeleteOutline} from 'react-icons/md'
import Menu from './Menu';

interface localEstoqueProps { // tipo de dado
  idlocal: number,
  nomelocal: string,
}

export default function LocalEstoque()  {

  // esta variável vai conter o username passado na navegação
  const location = useLocation();
  // recupera o username
  const username = location.state?.username || '';

  
  // vetor de locais
  const [locais, setLocais] = useState<localEstoqueProps[]>([])

  // variáveis de estado para os campos do formulário
  const [nomelocal, setName] = useState('')
  
  // diferencia se vai inserir (id = 0) ou editar (id não for 0) um produto
  const [idlocal, setId] = useState(0)

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

  return (
    <>
    
    <div className="flex-col">
        <Menu username={username}/>
    </div>
    <div className="flex flex-col items-center justify-center ">
      <div className="max-w-md mx-10 my-5 mb-4">
        {/* lista de Locais dentro de uma tabela */}
        <h2 className="font-bold mb-4"> Lista de Locais </h2>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nome</th>
            </tr>
          </thead>
          <tbody>
            {
              locais.map( (Local) => (
                <tr key={Local.id}>
                  <td className="border border-gray-300 px-4 py-2"  >{Local.idlocal}</td>
                  <td className="border border-gray-300 px-4 py-2">{Local.nomelocal}</td>
                </tr>
              ) /* fim da função dentro do map */
              ) /* fim do map */
            } {/* fim do reactjs */}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}