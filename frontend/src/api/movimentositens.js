export const modificarItens = async (dados) => {
    const verbo = 'POST'
    const url = 'http://localhost:3333/movimentoItens/add'

    try {
      const resp = await fetch(url, {
        method: verbo,
        headers: {
          'Content-Type': 'application/json',
        },
        body: dados
      });
      if (resp.ok) {
        const movimentoAdicionado = await resp.json();
        return movimentoAdicionado;
      }
  
      console.log('Falha ao adicionar movimento');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };