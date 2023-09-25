import {useLocation} from 'react-router-dom';
import {useState, useEffect} from 'react'
import {MdOutlineEdit, MdOutlineDeleteOutline, MdOutlineSave} from 'react-icons/md' 
import {HiOutlinePlusCircle} from 'react-icons/hi'
import {IoMdCloseCircle} from 'react-icons/io'
import Menu from './Menu';


interface UnidadeMedidaProps { // tipo de dado
  idunidade: number,
  siglaun: string,
  nomeunidade: string
}

export default function UnidadeMedida()  {

  // esta variável vai conter o username passado na navegação
  const location = useLocation();
  // recupera o username
  const username = location.state?.username || '';

  
  // vetor de unidades
  const [Unidades, setUnidade] = useState<UnidadeMedidaProps[]>([])

  // variáveis de estado para os campos do formulário
  const [showModal, setShowModal] = useState(false);
  const [nomeUnidade, setNomeUnidade] = useState('');
  const [siglaUn, setSiglaUnidade] = useState('');
  const [idunidade, setId] = useState(0)

  // fazer o hook useEffect para carregar as unidades da API
    useEffect( () => {
    const buscaUnidades = async () => {
      try {
        const resp = await fetch(`http://localhost:3333/unidadeMedida`)
        const retorno = await resp.json()
        if (resp.ok){
          setUnidade(retorno) // atualiza vetor de produtos com dados da API
        }
        else {
          console.log('Falha na busca por dados')
        }
      }
      catch(error) {
        console.log(error)
      }
    }
    buscaUnidades()
  } , [username])

    // função para remover uma unidade de medida pela tela
    const handleRemove = async (id: number) => {
      let confirma = confirm('Deseja remover essa unidade de medida?')
      if (confirma) {
        // requisição DELETE para remover um produto através da API
        await fetch(`http://localhost:3333/unidadeMedida/delete/${id}`, {
          method: 'DELETE'
        })
        .then( response => {
          return response.json()
        })
        .catch(error => {
            alert(error)
        })

        // atualiza a lista das unidade - removendo a unidade deletada
        // SetUnidades vai receber como parâmetro a lista de unidades atual após delete
        // retirando o local que foi removido
        setUnidade(Unidades.filter( (unidade) => unidade.idunidade !== id ))
      }
    }

    const handleEdit = (unidade: UnidadeMedidaProps) => {
      setShowModal(true)
      setSiglaUnidade(unidade.siglaun)
      setNomeUnidade(unidade.nomeunidade)
      setId(unidade.idunidade) // usado para eu filtrar se é uma criação ou edição do local
    }

    const handleOpenModal = () => {
      setNomeUnidade('')
      setSiglaUnidade('')
      setId(0)
      setShowModal(true);
    }
  
    const handleCloseModal = () => {
      setShowModal(false);
    }

    const handleSubmit = async (e:  React.FormEvent<HTMLFormElement>) => 
    {
      e.preventDefault() // evita que a página seja recarregada
      let unidade
      let verb
      let url
      if(idunidade == 0){
        //inserção de local
        verb = `POST`
        url = `http://localhost:3333/unidadeMedida/add`
        unidade = {
            siglaUn,
            nomeUnidade
          }
      }
      else{
        //atualizacao de local
        verb = `PUT`
        url = `http://localhost:3333/unidadeMedida/update`
        unidade = {
            idunidade,
            siglaUn,
            nomeUnidade            
          }
      }
      try {
        console.log(unidade)
        // chamar a API para cadastrar o local
        const UnidadeCadastrada = await fetch(url, {
          method: verb,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(unidade)
        })
        .then( response => {
          return response.json()
        })
        if (idunidade == 0) { // insere
          setUnidade([...Unidades, UnidadeCadastrada])
       }
       else { // atualiza na lista o produto alterado
        setUnidade(Unidades.map( (unidade) => {
            if (unidade.idunidade === idunidade) {
              return UnidadeCadastrada
            }
            else {
              return unidade
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
          <h2 className="font-bold mb-4" style={{ color: '#000000'}}> Unidades de Medida </h2>
        </div>
        <button onClick={() => handleOpenModal()} style={{backgroundColor: '#A4EA4F', color: '#000000',  display: 'flex', alignItems: 'center', height: '25px', marginBottom: '10px'}} > 
          <HiOutlinePlusCircle size={15} style={{ color: '#000000', marginRight: '3px' }}/> <span style={{ fontSize: '10px'}}> Novo registro  </span>
        </button>

        {/* Modal para cadastrar local */}
        {showModal && (
          <div className="modal" 	
          style={{position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0, 0, 0, 0.7)', zIndex: '1000', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div className="modal-content"  style={{background: '#d3d3d3', padding: '20px', width: '80%', maxWidth: '400px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'}}>
              <span style={{ color: '#000000', fontWeight: 'bold'}}> Cadastro de Unidades de Medida </span> 
              <form onSubmit={handleSubmit}>
                <label htmlFor="nomeLocal" style={{ color: '#000000'}}> Sigla Unidade: </label> <br /> 
                <input style={{background: '#fff', color: '#000000'} } type="text" id="siglaUnidade" name="siglaUnidade" value={siglaUn} onChange={(e) => setSiglaUnidade(e.target.value)} required  /> <br />
                <label htmlFor="nomeLocal" style={{ color: '#000000'}}> Dsc. Unidade: </label> <br /> 
                <input style={{background: '#fff', color: '#000000'} } type="text" id="nomeUnidade" name="nomeUnidade" value={nomeUnidade} onChange={(e) => setNomeUnidade(e.target.value)} required /> <br />
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
              <th className=" px- py-2  text-black" >Sigla</th>
              <th className=" px- py-2  text-black" >Unidade</th>
            </tr>
          </thead>
          <tbody>
            {
              Unidades.map( (unidade) => (
                <tr key={unidade.idunidade}>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{unidade.idunidade}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{unidade.siglaun}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{unidade.nomeunidade}</td>
                  <td className="border border-gray-300">
                      <button onClick={() => handleEdit(unidade)} style={{backgroundColor: 'transparent'}} > 
                        <MdOutlineEdit size={20} style={{ color: '#1E90FF'}}/>
                      </button>
                    </td>
                    <td className="border border-gray-300">
                      <button onClick={() => handleRemove(unidade.idunidade)} style={{backgroundColor: 'transparent'}}> 
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