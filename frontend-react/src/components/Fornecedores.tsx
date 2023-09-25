
import {useLocation} from 'react-router-dom';
import {useState, useEffect} from 'react'
import {MdOutlineEdit, MdOutlineDeleteOutline, MdOutlineSave} from 'react-icons/md' 
import {HiOutlinePlusCircle} from 'react-icons/hi'
import {IoMdCloseCircle} from 'react-icons/io'
import Menu from './Menu';


interface fornecedorProps { // tipo de dado
  idfor: number,
  nomefor: string,
  fisjur: string,
  cnpjcpf: string,
  telefone: string,
  cep: string,
  cidade: string,
  rua: string,
  bairro: string,
  numero: number,
  complemento: string,
  email: string
}

export default function Fornecedor()  {

  // esta variável vai conter o username passado na navegação
  const location = useLocation();
  // recupera o username
  const username = location.state?.username || '';

  
  // vetor de fornecedores
  const [fornecedores, setFornecedores] = useState<fornecedorProps[]>([])

  // variáveis de estado para os campos do formulário
  const [showModal, setShowModal] = useState(false);

  //Variáveis para os dados do produto
  const [idfor, setIdFor] = useState(0)
  const [nomefor, setNomeFor] = useState('');
  const [fisjur, setFisJur] = useState('');
  const [cnpjcpf, setCnpjCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState(0);
  const [complemento, setComplemento] = useState('');
  const [email, setEmail] = useState('');

  // fazer o hook useEffect para carregar os locais da API
    useEffect( () => {
    const buscaFornecedores = async () => {
      try {
        const resp = await fetch(`http://localhost:3333/fornecedor`)
        const fornecedor = await resp.json()
        if (resp.ok){
          setFornecedores(fornecedor) // atualiza vetor de fornecedores com dados da API
        }
        else {
          console.log('Falha na busca por dados')
        }
      }
      catch(error) {
        console.log(error)
      }
    }
    buscaFornecedores()
  } , [username])

    // função para remover um local de estoque pela tela
    const handleRemove = async (id: number) => {
      let confirma = confirm('Deseja remover esse fornecedor?')
      if (confirma) {
        // requisição DELETE para remover um produto através da API
        await fetch(`http://localhost:3333/fornecedor/delete/${id}`, {
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
        setFornecedores(fornecedores.filter( (Fornecedor) => Fornecedor.idfor !== id ))
      }
    }

    const handleEdit = (Fornecedor: fornecedorProps) => {
      setShowModal(true)
      setIdFor(Fornecedor.idfor) // usado para eu filtrar se é uma criação ou edição do fornecedor
      setNomeFor(Fornecedor.nomefor)
      setFisJur(Fornecedor.fisjur)
      setCnpjCpf(Fornecedor.cnpjcpf)
      setTelefone(Fornecedor.telefone)
      setCep(Fornecedor.cep)
      setCidade(Fornecedor.cidade)
      setRua(Fornecedor.rua)
      setBairro(Fornecedor.bairro)
      setNumero(Fornecedor.numero)
      setComplemento(Fornecedor.complemento)
      setEmail(Fornecedor.email)
    }

    const handleOpenModal = () => {
      setIdFor(0) 
      setNomeFor('')
      setFisJur('')
      setCnpjCpf('')
      setTelefone('')
      setCep('')
      setCidade('')
      setRua('')
      setBairro('')
      setNumero(0)
      setComplemento('')
      setEmail('')
      setShowModal(true);
    }
  
    const handleCloseModal = () => {
      setShowModal(false);
    }

    const handleSubmit = async (e:  React.FormEvent<HTMLFormElement>) => {
      e.preventDefault() // evita que a página seja recarregada
      let Fornecedor
      let verb
      let url
      if(idfor == 0){
        //inserção de local
        verb = `POST`
        url = `http://localhost:3333/fornecedor/add`
        Fornecedor = {
          nomefor,
          fisjur,
          cnpjcpf,
          telefone,
          cep,
          cidade,
          rua,
          bairro,
          numero,
          complemento,
          email
          }
      }
      else{
        //atualizacao de local
        verb = `PUT`
        url = `http://localhost:3333/fornecedor/update`
        Fornecedor = {
          idfor,
          nomefor,
          fisjur,
          cnpjcpf,
          telefone,
          cep,
          cidade,
          rua,
          bairro,
          numero,
          complemento,
          email
          }
      }
      try {
        // chamar a API para cadastrar o tipo
        const FornecedorCadastrado = await fetch(url, {
          method: verb,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Fornecedor)
        })
        .then( response => {
          return response.json()
        })
        if (idfor == 0) { // insere
          setFornecedores([...fornecedores, FornecedorCadastrado])
       }
       else { // atualiza na lista o tipo alterado
          setFornecedores(fornecedores.map( (fornecedor) => {
            if (fornecedor.idfor === idfor) {
              return FornecedorCadastrado
            }
            else {
              return fornecedor
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
      <div className="max-w-lg mx-5 my-5 mb-4"> 
        {/* lista de Locais dentro de uma tabela */}
        <div style={{ background: "linear-gradient(to right, #40E0D0, #4682B4)"}}>
          <h2 className="font-bold mb-4 text-black"> Fornecedores </h2>
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
              <label htmlFor="nomefor" style={{ color: '#000000'}}> Nome do Fornecedor: </label> <br />
                <input style={{background: '#fff', color:"#000"}} type="text" id="nomefor" name="nomefor" value={nomefor} onChange={(e) => setNomeFor(e.target.value)} required /><br />
                <label htmlFor="fisjur" style={{ color: '#000000'}}> F / J: </label> <br />
                <input style={{background: '#fff', color:"#000"}} type="text" id="fisjur" name="fisjur" value={fisjur} onChange={(e) => setFisJur(e.target.value)} required /><br />
                <label htmlFor="cnpjcpf" style={{ color: '#000000'}}> CNPJ / CPF: </label> <br />
                <input style={{background: '#fff', color:"#000"}} type="text" id="cnpjcpf" name="cnpjcpf" value={cnpjcpf} onChange={(e) => setCnpjCpf(e.target.value)} required /><br />
                <label htmlFor="telefone" style={{ color: '#000000'}}> Telefone: </label> <br />
                <input style={{background: '#fff', color:"#000"}} type="text" id="telefone" name="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required /><br />
                <label htmlFor="cep" style={{ color: '#000000'}}> Cep: </label> <br />
                <input style={{background: '#fff', color:"#000"}} type="text" id="cep" name="cep" value={cep} onChange={(e) => setCep(e.target.value)} required /><br />
                <label htmlFor="cidade" style={{ color: '#000000'}}> Cidade: </label> <br />
                <input style={{background: '#fff', color:"#000"}} type="text" id="cidade" name="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} required /><br />
                <label htmlFor="rua" style={{ color: '#000000'}}> Rua: </label> <br />
                <input style={{background: '#fff', color:"#000"}} type="text" id="rua" name="rua" value={rua} onChange={(e) => setRua(e.target.value)} required /><br />
                <label htmlFor="bairro" style={{ color: '#000000'}}> Bairro: </label> <br />
                <input style={{background: '#fff', color:"#000"}} type="text" id="bairro" name="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} required /><br />
                <label htmlFor="numero" style={{ color: '#000000'}}> Numero: </label> <br />
                <input style={{background: '#fff', color:"#000"}} type="number" id="numero" name="numero" value={numero} onChange={(e) => setNumero(Number(e.target.value))} required /><br />
                <label htmlFor="complemento" style={{ color: '#000000'}}> Complemento: </label> <br />
                <input style={{background: '#fff', color:"#000"}} type="text" id="complemento" name="complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} required /><br />
                <label htmlFor="email" style={{ color: '#000000'}}> E-mail: </label> <br />
                <input style={{background: '#fff', color:"#000"}} type="text" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
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
        <table className="w-full m-0">
          <thead>
            <tr className="bg-transparent">
              <th className=" px-4 py-2 text-black">Código</th>
              <th className=" px-4 py-2  text-black" >Nome</th>
              <th className=" px-4 py-2  text-black" >Físico / Jurídico</th>
              <th className=" px-4 py-2  text-black" >CNPJ / CPF</th>/
              <th className=" px-4 py-2  text-black" >Telefone</th>
              <th className=" px-4 py-2  text-black" >CEP</th>
              <th className=" px-4 py-2  text-black" >Cidade</th>
              <th className=" px-4 py-2  text-black" >Rua</th>
              <th className=" px-4 py-2  text-black" >Bairro</th>
              <th className=" px-4 py-2  text-black" >Numero</th>
              <th className=" px-6 py-2  text-black" >Complemento</th>
              <th className=" px-4 py-2  text-black" >Email</th>
            </tr>
          </thead>
          <tbody>
            {
              fornecedores.map( (Fornecedor) => (
                <tr key={Fornecedor.idfor}>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Fornecedor.idfor}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Fornecedor.nomefor}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Fornecedor.fisjur}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Fornecedor.cnpjcpf}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Fornecedor.telefone}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Fornecedor.cep}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Fornecedor.cidade}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Fornecedor.rua}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Fornecedor.bairro}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Fornecedor.numero}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Fornecedor.complemento}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black "  >{Fornecedor.email}</td>
                  <td className="border border-gray-300">
                      <button onClick={() => handleEdit(Fornecedor)} style={{backgroundColor: 'transparent'}} > 
                        <MdOutlineEdit size={20} style={{ color: '#1E90FF'}}/>
                      </button>
                    </td>
                    <td className="border border-gray-300">
                      <button onClick={() => handleRemove(Fornecedor.idfor)} style={{backgroundColor: 'transparent'}}> 
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