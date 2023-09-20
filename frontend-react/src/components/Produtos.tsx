
import {useLocation} from 'react-router-dom';
import {useState, useEffect} from 'react'
import {MdOutlineEdit, MdOutlineDeleteOutline, MdOutlineSave} from 'react-icons/md' 
import {HiOutlinePlusCircle} from 'react-icons/hi'
import {IoMdCloseCircle} from 'react-icons/io'
import Menu from './Menu';


interface produtoProps { // tipo de dado
  idproduto: number,
  idtipprod: number,
  idunidade: number,
  nomeprod: string,
  quantminima: number
}

export default function Produto()  {

  // esta variável vai conter o username passado na navegação
  const location = useLocation();
  // recupera o username
  const username = location.state?.username || '';

  
  // vetor de produtos
  const [produtos, setProdutos] = useState<produtoProps[]>([])

  // variáveis de estado para os campos do formulário
  const [showModal, setShowModal] = useState(false);

  //Variáveis para os dados do produto
  const [idproduto, setIdProduto] = useState(0)
  const [idtipprod, setIdTipProd] = useState(0)
  const [idunidade, setIdUnidade] = useState(0)
  const [quantminima, setQuantMinima] = useState(0)
  const [nomeprod, setNomeProd] = useState('');

  // fazer o hook useEffect para carregar os locais da API
    useEffect( () => {
    const buscaProdutos = async () => {
      try {
        const resp = await fetch(`http://localhost:3333/produtos`)
        const produto = await resp.json()
        if (resp.ok){
          setProdutos(produto) // atualiza vetor de produtos com dados da API
        }
        else {
          console.log('Falha na busca por dados')
        }
      }
      catch(error) {
        console.log(error)
      }
    }
    buscaProdutos()
  } , [username])

    // função para remover um local de estoque pela tela
    const handleRemove = async (id: number) => {
      let confirma = confirm('Deseja remover esse produto?')
      if (confirma) {
        // requisição DELETE para remover um produto através da API
        await fetch(`http://localhost:3333/produtos/delete/${id}`, {
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
        setProdutos(produtos.filter( (Produto) => Produto.idproduto !== id ))
      }
    }

    const handleEdit = (Produto: produtoProps) => {
      setShowModal(true)
      setIdProduto(Produto.idproduto) // usado para eu filtrar se é uma criação ou edição do local
      setIdTipProd(Produto.idtipprod)
      setIdUnidade(Produto.idunidade)
      setNomeProd(Produto.nomeprod)
      setQuantMinima(Produto.quantminima)
    }

    const handleOpenModal = () => {
      setShowModal(true);
    }
  
    const handleCloseModal = () => {
      setShowModal(false);
    }

    const handleSubmit = async (e:  React.FormEvent<HTMLFormElement>) => {
      e.preventDefault() // evita que a página seja recarregada
    
    let Produto

    Produto = {
      nomeprod,
      idtipprod,
      idunidade,
      quantminima
      }
      try {
        // chamar a API para cadastrar o local
        const ProdutoCadastrado = await fetch(`http://localhost:3333/produtos/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Produto)
        })
        .then( response => {
          return response.json()
        })
        // atualiza a lista de local
        // monta uma nova lista com a lista anterior + local cadastrado
         
        setProdutos([...produtos, ProdutoCadastrado])
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
          <h2 className="font-bold mb-4" style={{ color: '#000000'}}> Produtos </h2>
        </div>
        <button onClick={() => handleOpenModal()} style={{backgroundColor: '#A4EA4F', color: '#000000',  display: 'flex', alignItems: 'center', height: '25px', marginBottom: '10px'}} > 
          <HiOutlinePlusCircle size={15} style={{ color: '#000000', marginRight: '3px' }}/> <span style={{ fontSize: '10px'}}> Novo registro  </span>
        </button>

        {/* Modal para cadastrar local */}
        {showModal && (
          <div className="modal" 	
          style={{position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0, 0, 0, 0.7)', zIndex: '1000', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div className="modal-content"  style={{background: '#d3d3d3', padding: '20px', width: '80%', maxWidth: '400px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'}}>
              <span style={{ color: '#000000', fontWeight: 'bold'}}> Cadastro de Produto </span> 
              <form onSubmit={handleSubmit}>
              <label htmlFor="nomeproduto" style={{ color: '#000000'}}> Nome do Produto: </label> <br />
                <input style={{background: '#fff'}} type="text" id="nomeproduto" name="nomeproduto" value={nomeprod} onChange={(e) => setNomeProd(e.target.value)} required /><br />
                <label htmlFor="idtipprod" style={{ color: '#000000'}}> Id Tipo de Produto: </label> <br />
                <input style={{background: '#fff'}} type="number" id="idtipprod" name="idtipprod" value={idtipprod} onChange={(e) => setIdTipProd(Number(e.target.value))} required /><br />
                <label htmlFor="idunidade" style={{ color: '#000000'}}> Id Unidade de Medida: </label> <br />
                <input style={{background: '#fff'}} type="number" id="idunidade" name="idunidade" value={idunidade} onChange={(e) => setIdUnidade(Number(e.target.value))} required /><br />
                <label htmlFor="quantminima" style={{ color: '#000000'}}> Quantidade Minima: </label> <br />
                <input style={{background: '#fff'}} type="number" id="quantminima" name="quantminima" value={quantminima} onChange={(e) => setQuantMinima(Number(e.target.value))} required /><br />
              </form>  
              <div className="form-group" style={{ display: 'flex', justifyContent: 'flex-end', gap: '2px', marginTop: '10px' }}>
                <button  type="submit"  style={{ color: '#A4EA4F',  display: 'flex', alignItems: 'center', height: '25px'}}>
                  <MdOutlineSave/>
                </button>
                <button onClick={handleCloseModal} style={{ background: 'transparent', color: '#FF0000',  display: 'flex', alignItems: 'center', height: '25px', marginBottom: '10px'}}>
                  <IoMdCloseCircle/>
                </button>
              </div>
            </div>
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="bg-transparent">
              <th className=" px-4 py-2 text-black">Código</th>
              <th className=" px- py-2  text-black" >Nome</th>
              <th className=" px- py-2  text-black" >Quantidade Mínima</th>
              <th className=" px- py-2  text-black" >Tipo de Produto</th>
              <th className=" px- py-2  text-black" >Unidade de Medida</th>
            </tr>
          </thead>
          <tbody>
            {
              produtos.map( (Produto) => (
                <tr key={Produto.idproduto}>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Produto.idproduto}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Produto.nomeprod}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Produto.quantminima}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Produto.idtipprod}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Produto.idunidade}</td>
                  <td className="border border-gray-300">
                      <button onClick={() => handleEdit(Produto)} style={{backgroundColor: 'transparent'}} > 
                        <MdOutlineEdit size={20} style={{ color: '#1E90FF'}}/>
                      </button>
                    </td>
                    <td className="border border-gray-300">
                      <button onClick={() => handleRemove(Produto.idproduto)} style={{backgroundColor: 'transparent'}}> 
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