export const buscaLocais = async () => {
    try {
     const resp = await fetch(`http://localhost:3333/locaisEstoque`)
      if (resp.ok) {
        const locais = await resp.json()
        return locais;
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const deletaLocal = async (localId) => {
    try {
      const resp = await fetch(`http://localhost:3333/locaisEstoque/delete/${localId}`, {
        method: 'DELETE', // Especifica o método como DELETE
      });
      if (resp.ok) {
        const localApagado = await resp.json();
        return localApagado;
      }
      console.log('Falha ao apagar local de estoque!');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const novoLocal = async (dados, insercao) => {
    let verbo
    let url
    if(insercao)
    {
      verbo = 'POST'
      url = `http://localhost:3333/locaisEstoque/add`
    }
    else
    {
      verbo = 'PUT'
      url = `http://localhost:3333/locaisEstoque/update`
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
        const localAdicionado = await resp.json();
        return localAdicionado;
      }
  
      console.log('Falha ao adicionar local de estoque!');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };
  