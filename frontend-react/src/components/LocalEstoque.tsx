
import {useLocation} from 'react-router-dom';
import {useState, useEffect} from 'react'
import {MdOutlineEdit, MdOutlineDeleteOutline, } from 'react-icons/md'
import {HiOutlinePlusCircle} from 'react-icons/hi'
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
  const [showModal, setShowModal] = useState(false);
  const [nomelocal, setNomeLocal] = useState('');

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

    // função para remover um local de estoque pela tela
    const handleRemove = async (id: number) => {
      let confirma = confirm('Deseja remover esse local de estoque?')
      if (confirma) {
        // requisição DELETE para remover um produto através da API
        await fetch(`http://localhost:3333/locaisEstoque/delete/${id}`, {
          method: 'DELETE'
        })
        .then( response => {
          return response.json()
        })
        .catch(error => {
            alert(error)
        })
        // atualiza a lista dos locais - removendo o local deletado
        // SetLocais vai receber como parâmetro a lista de locais atual após delete
        // retirando o local que foi removido
        setLocais(locais.filter( (Local) => Local.idlocal !== id ))
      }
    }

    const handleEdit = (Local: localEstoqueProps) => {
      setName(Local.nomelocal)
      console.log(Local.idlocal)
      setId(Local.idlocal) // usado para eu filtrar se é uma criação ou edição do local
    }

    const handleOpenModal = () => {
      setShowModal(true);
    }
  
    const handleCloseModal = () => {
      setShowModal(false);
    }

    const handleFormSubmit = async (e) => {
      e.preventDefault();
  
      // Envie os dados do formulário para a API ou faça o que for necessário para cadastrar o estoque.
  
      // Após o cadastro bem-sucedido, feche a modal.
      setShowModal(false);
    }

  return (
    <>
    <div className="flex-col">
        <Menu username={username}/>
    </div>
    <div className="w-full justify-center">
      <div className="max-w-lg mx-10 my-5 mb-4 "> 
        {/* lista de Locais dentro de uma tabela */}
        <div style={{ background: "linear-gradient(to right, #40E0D0, #4682B4)"}}>
          <h2 className="font-bold mb-4" style={{ color: '#000000'}}> Locais de Locais </h2>
        </div>
        <button onClick={() => handleOpenModal()} style={{backgroundColor: '#A4EA4F', color: '#000000',  display: 'flex', alignItems: 'center', height: '25px', marginBottom: '10px'}} > 
          <HiOutlinePlusCircle size={15} style={{ color: '#000000', marginRight: '3px' }}/> <span style={{ fontSize: '10px'}}> Novo registro  </span>
        </button>
        {/* Modal para cadastrar estoque */}
        {showModal && (
          <div className="modal" 	
          style={{position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0, 0, 0, 0.7)', zIndex: '1000', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div className="modal-content"  style={{background: '#fff', padding: '20px', width: '80%', maxWidth: '400px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'}}>
              <span className="close" onClick={handleCloseModal} style={{ color: '#000000'}} >&times;</span> 
              <span style={{ color: '#000000'}}> Cadastro de Estoque </span> 
              <form onSubmit={handleFormSubmit}>
                <label htmlFor="nomeLocal" style={{ color: '#000000'}}> Nome do Local: </label>
                <input type="text" id="nomeLocal" name="nomeLocal" value={nomelocal} onChange={(e) => setNomeLocal(e.target.value)} required />
                <button type="submit"  style={{backgroundColor: '#A4EA4F', color: '#000000',  display: 'flex', alignItems: 'center', height: '25px', marginBottom: '10px'}}>
                  Cadastrar
                </button>
              </form>
            </div>
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="bg-transparent">
              <th className=" px-4 py-2 text-black">Código</th>
              <th className=" px- py-2  text-black" >Nome</th>
            </tr>
          </thead>
          <tbody>
            {
              locais.map( (Local) => (
                <tr key={Local.idlocal}>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Local.idlocal}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Local.nomelocal}</td>
                  <td className="border border-gray-300">
                      <button onClick={() => handleEdit(Local)} style={{backgroundColor: 'transparent'}} > 
                        <MdOutlineEdit size={20} style={{ color: '#1E90FF'}}/>
                      </button>
                    </td>
                    <td className="border border-gray-300">
                      <button onClick={() => handleRemove(Local.idlocal)} style={{backgroundColor: 'transparent'}}> 
                        <MdOutlineDeleteOutline size={20} style={{ color: 'red' }}  />
                      </button>
                    </td> 
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