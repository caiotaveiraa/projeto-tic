export const buscaNf = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/nf`);
      if (resp.ok) {
        const nfs = await resp.json();
        return nfs;
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const deletaNf = async (nfId) => {
    try {
      /*
      // Primeiro preciso deletar todos os itens ligados a esse movimento.
      const resp2 = await fetch(`http://localhost:3333/movimentoItens/deleteall/${movId}`, {
        method: 'DELETE', // Especifica o método como DELETE
      });
      if (resp2.ok) {
        const itensApagados = await resp2.json();
        console.log(itensApagados)
      }
      */
      const resp = await fetch(`http://localhost:3333/nf/delete/${nfId}`, {
        method: 'DELETE', // Especifica o método como DELETE
      });
      if (resp.ok) {
        const nfApagada = await resp.json();
        return nfApagada;
      }
      console.log('Falha ao apagar');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const novaNf = async (dados, insercao) => {
    let verbo
    let url
    if(insercao)
    {
      verbo = 'POST'
      url = 'http://localhost:3333/nf/add'
    }
    else
    {
      verbo = 'PUT'
      url = 'http://localhost:3333/nf/update'
    }
    try {
      const resp = await fetch(url, {
        method: verbo,
        headers: {
          'Content-Type': 'application/json',
        },
        body: dados
      });
      if (resp.ok) {
        const nfAdicionada = await resp.json();
        return nfAdicionada;
      }
  
      console.log('Falha ao adicionar movimento');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };
  