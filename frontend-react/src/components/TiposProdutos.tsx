
import {useLocation} from 'react-router-dom';
import {useState, useEffect} from 'react'
import {MdOutlineEdit, MdOutlineDeleteOutline, MdOutlineSave} from 'react-icons/md' 
import {HiOutlinePlusCircle} from 'react-icons/hi'
import {IoMdCloseCircle} from 'react-icons/io'
import Menu from './Menu';


interface tiposProdutosProps { // tipo de dado
  idtipprod: number,
  nometipprod: string,
}

export default function TiposProdutos()  {

  // esta variável vai conter o username passado na navegação
  const location = useLocation();
  // recupera o username
  const username = location.state?.username || '';

  
  // vetor de locais
  const [tipos, setTipos] = useState<tiposProdutosProps[]>([])

  // variáveis de estado para os campos do formulário
  const [showModal, setShowModal] = useState(false);
  const [nometipprod, setNomeTipProd] = useState('');
  const [idtipprod, setIdTipProd] = useState(0)

  // fazer o hook useEffect para carregar os Tipos de produto da API (GET)
    useEffect( () => {
    const buscaTipos = async () => {
      try {
        const resp = await fetch(`http://localhost:3333/tiposProdutos`)
        const retorno = await resp.json()
        if (resp.ok){
          setTipos(retorno) // atualiza vetor de produtos com dados da API
        }
        else {
          console.log('Falha na busca por dados')
        }
      }
      catch(error) {
        console.log(error)
      }
    }
    buscaTipos()
  } , [username])

    // função para remover um tipo de produto pela tela
    const handleRemove = async (id: number) => {
      let confirma = confirm('Deseja remover esse tipo de produto?')
      if (confirma) {
        // requisição DELETE para remover um tipo através da API - é passado o id na url
        await fetch(`http://localhost:3333/tiposProdutos/delete/${id}`, {
          method: 'DELETE'
        })
        .then( response => {
          return response.json()
        })
        .catch(error => {
            alert(error)
        })
        // atualiza a lista dos locais - removendo o tipo
        // SetLocais vai receber como parâmetro a lista de tipo atual após delete
        // retirando o local que foi removido
        setTipos(tipos.filter( (Tipo) => Tipo.idtipprod !== id ))
      }
    }

    const handleEdit = (Tipo: tiposProdutosProps) => {
      setShowModal(true)
      setNomeTipProd(Tipo.nometipprod)
      setIdTipProd(Tipo.idtipprod) // usado para eu filtrar se é uma criação ou edição do tipo
    }

    const handleOpenModal = () => {
        setIdTipProd(0)
        setNomeTipProd('')
        setShowModal(true);
    }
  
    const handleCloseModal = () => {
      setShowModal(false);
    }

    const handleSubmit = async (e:  React.FormEvent<HTMLFormElement>) => {
      e.preventDefault() // evita que a página seja recarregada
      let Tipo
      let verb
      let url
      if(idtipprod == 0){
        //inserção de local
        verb = `POST`
        url = `http://localhost:3333/tiposProdutos/add`
        Tipo = {
          nometipprod
          }
      }
      else{
        //atualizacao de local
        verb = `PUT`
        url = `http://localhost:3333/tiposProdutos/update`
        Tipo = {
          idtipprod,
          nometipprod
          }
      }
      try {
        // chamar a API para cadastrar o tipo
        const TipoCadastrado = await fetch(url, {
          method: verb,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Tipo)
        })
        .then( response => {
          return response.json()
        })
        if (idtipprod == 0) { // insere
          setTipos([...tipos, TipoCadastrado])
       }
       else { // atualiza na lista o tipo alterado
          setTipos(tipos.map( (tipo) => {
            if (tipo.idtipprod === idtipprod) {
              return TipoCadastrado
            }
            else {
              return tipo
            }
          }))
       }
      }
      catch(error) {
        console.log(error)
      }
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
          <h2 className="font-bold mb-4" style={{ color: '#000000'}}> Tipos de Produtos </h2>
        </div>
        <button onClick={() => handleOpenModal()} style={{backgroundColor: '#A4EA4F', color: '#000000',  display: 'flex', alignItems: 'center', height: '25px', marginBottom: '10px'}} > 
          <HiOutlinePlusCircle size={15} style={{ color: '#000000', marginRight: '3px' }}/> <span style={{ fontSize: '10px'}}> Novo registro  </span>
        </button>

        {/* Modal para cadastrar local */}
        {showModal && (
          <div className="modal" 	
          style={{position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0, 0, 0, 0.7)', zIndex: '1000', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div className="modal-content"  style={{background: '#d3d3d3', padding: '20px', width: '80%', maxWidth: '400px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'}}>
              <span style={{ color: '#000000', fontWeight: 'bold'}}> Cadastro de Tipos de Produtos </span> 
              <form onSubmit={handleSubmit}>
                <label htmlFor="nometipo" style={{ color: '#000000'}}> Nome: </label> <br /> 
                <input style={{background: '#fff', color:"#000"}} type="text" id="nometipo" name="nometipo" value={nometipprod} onChange={(e) => setNomeTipProd(e.target.value)} required />
                <div className="form-group" style={{ display: 'flex', justifyContent: 'flex-end', gap: '2px', marginTop: '10px' }}>
                    <button  type="submit"  style={{ color: '#A4EA4F',  display: 'flex', alignItems: 'center', height: '25px'}}>
                    <MdOutlineSave/>
                    </button>
                    <button onClick={handleCloseModal} style={{ background: 'transparent', color: '#FF0000',  display: 'flex', alignItems: 'center', height: '25px', marginBottom: '10px'}}>
                    <IoMdCloseCircle/>
                    </button>
                </div>
              </form>  
            </div>
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="bg-transparent">
              <th className=" px-4 py-2 text-black">Código</th>
              <th className=" px- py-2  text-black">Nome</th>
            </tr>
          </thead>
          <tbody>
            {
              tipos.map( (Tipo) => (
                <tr key={Tipo.idtipprod}>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Tipo.idtipprod}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Tipo.nometipprod}</td>
                  <td className="border border-gray-300">
                      <button onClick={() => handleEdit(Tipo)} style={{backgroundColor: 'transparent'}} > 
                        <MdOutlineEdit size={20} style={{ color: '#1E90FF'}}/>
                      </button>
                    </td>
                    <td className="border border-gray-300">
                      <button onClick={() => handleRemove(Tipo.idtipprod)} style={{backgroundColor: 'transparent'}}> 
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