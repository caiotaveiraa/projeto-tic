import JsPDF from 'jspdf';

export const gerarRelatorioSaldoEstoquePDF = async (idProduto, idLocal) => {
  try {
    const resp = await fetch(`http://localhost:3333/relsaldoProdutos/${idProduto}/${idLocal}`);

    if (resp.ok) {
      const relatorioData = await resp.json();

      // Criação do documento PDF usando jspdf
      const pdfDoc = new JsPDF();
      pdfDoc.setFontSize(12);

      // Adicione conteúdo ao PDF com base nos dados do relatório
      const titleText = 'Relatório de Saldo de Produtos Por Local de Estoque';
      pdfDoc.setFont('helvetica', 'bold');
      pdfDoc.setFontSize(16);
      const titleWidth = pdfDoc.getStringUnitWidth(titleText) * pdfDoc.internal.getFontSize() / pdfDoc.internal.scaleFactor;
      pdfDoc.text(titleText, (pdfDoc.internal.pageSize.width - titleWidth) / 2, 20);

      // Reset para a fonte e tamanho padrão
      pdfDoc.setFont('helvetica', 'normal');
      pdfDoc.setFontSize(12);

      // Defina o cabeçalho da tabela
      const headers = ['Cód. Produto', 'Dsc. Produto', 'Qtd. Estoque', 'Local de Estoque'];

      // Defina a largura das colunas
      const columnWidths = [30, 50, 50, 50];

      // Adicione o cabeçalho da tabela
      let startY = 40;
      const lineHeight = 15;

      headers.forEach((header, i) => {
        // Negrite os cabeçalhos
        pdfDoc.setFont('helvetica', 'bold');
        const headerWidth = pdfDoc.getStringUnitWidth(header) * pdfDoc.internal.getFontSize() / pdfDoc.internal.scaleFactor;
        pdfDoc.text(header, 20 + columnWidths.slice(0, i).reduce((acc, width) => acc + width, 0) + (columnWidths[i] - headerWidth) / 2, startY);
        pdfDoc.setFont('helvetica', 'normal');
      });

      startY += lineHeight;

      relatorioData.forEach((item) => {
        // Forçar a conversão para número antes de chamar toFixed
        const quantidadeFormatada = typeof item.quantidade === 'string' ? parseFloat(item.quantidade).toFixed(2) : item.quantidade.toFixed(2);

        const row = [
          item.idproduto.toString(),
          item.nomeprod,
          quantidadeFormatada, // Formatar para duas casas decimais
          item.nomelocal,
        ];

        row.forEach((value, i) => {
          const valueWidth = pdfDoc.getStringUnitWidth(value) * pdfDoc.internal.getFontSize() / pdfDoc.internal.scaleFactor;
          pdfDoc.text(value, 20 + columnWidths.slice(0, i).reduce((acc, width) => acc + width, 0) + (columnWidths[i] - valueWidth) / 2, startY);
        });

        startY += lineHeight;
      });

      // Abra o documento PDF no navegador
      const blob = pdfDoc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');

      console.log('Relatório PDF gerado com sucesso e aberto no navegador.');
    } else {
      console.log('Falha na busca por dados');
    }
  } catch (error) {
    console.error('Erro ao gerar o relatório PDF:', error.message);
  }
};


export const gerarRelatorioMovimentacoesPDF = async (tipoMov, idMovimento, idFornecedor) => {
  try {
    const resp = await fetch(`http://localhost:3333/relmovimentos/${tipoMov}/${idMovimento}/${idFornecedor}`);

    if (resp.ok) {
      const relatorioData = await resp.json();

      // Função para adicionar uma nova página se necessário
      const adicionarNovaPagina = () => {
        const alturaRestante = pdfDoc.internal.pageSize.height - startY;
        if (alturaRestante < lineHeight * 3) {
          pdfDoc.addPage();
          startY = 20; // Reinicia a posição Y na nova página
        }
      };

      // Criação do documento PDF usando jspdf com orientação paisagem e tamanho de página personalizado
      const pdfDoc = new JsPDF({
        orientation: 'landscape',
        format: 'a4', // Tamanho de página A4
      });
      pdfDoc.setFontSize(8);

      // Adicione conteúdo ao PDF com base nos dados do relatório
      const titleText = 'Relatório de Movimentações';
      pdfDoc.setFont('helvetica', 'bold');
      pdfDoc.setFontSize(12);
      const titleWidth = pdfDoc.getStringUnitWidth(titleText) * pdfDoc.internal.getFontSize() / pdfDoc.internal.scaleFactor;
      pdfDoc.text(titleText, (pdfDoc.internal.pageSize.width - titleWidth) / 2, 20);

      // Reset para a fonte e tamanho padrão
      pdfDoc.setFont('helvetica', 'normal');
      pdfDoc.setFontSize(8);

      // Defina o cabeçalho da tabela
      const headers = ['Cód. Movimento', 'Tipo Movimento', 'Dt. Movimento', 'Loc. de Estoque', 'Fornecedor', 'Produto', 'Quantidade', 'Un. Medida'];

      // Defina a largura das colunas (ajuste os valores conforme necessário)
      const columnWidths = [30, 25, 25, 30, 50, 60, 30, 15];

      // Adicione o cabeçalho da tabela
      let startY = 40;
      const lineHeight = 8;

      headers.forEach((header, i) => {
        // Negrite os cabeçalhos
        pdfDoc.setFont('helvetica', 'bold');
        const x = 10 + columnWidths.slice(0, i).reduce((acc, width) => acc + width, 0);
        pdfDoc.text(x, startY, header);
        pdfDoc.setFont('helvetica', 'normal');
      });

      startY += lineHeight;

      relatorioData.forEach((item) => {
        // Formatando a data para o formato desejado (dd/mm/yyyy)
        const formattedDate = new Date(item.dtinc).toLocaleDateString('pt-BR');
        const quantidadeFormatada = typeof item.quantidade === 'string' ? parseFloat(item.quantidade).toFixed(2) : item.quantidade.toFixed(2);
        // Adiciona uma nova página se necessário
        adicionarNovaPagina();

        // Forçar a conversão para número antes de chamar toFixed
        const row = [
          item.idmovimento.toString(),
          item.tipmov,
          formattedDate,
          item.nomelocal,
          `${item.idfor.toString()} - ${item.nomefor}`,
          `${item.idproduto.toString()} - ${item.nomeprod} `,
          quantidadeFormatada,
          item.siglaun,
        ];

        row.forEach((value, i) => {
          const x = 10 + columnWidths.slice(0, i).reduce((acc, width) => acc + width, 0);
          pdfDoc.text(x, startY, value);
        });

        startY += lineHeight;
      });

      // Abra o documento PDF no navegador
      const blob = pdfDoc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');

      console.log('Relatório PDF gerado com sucesso e aberto no navegador.');
    } else {
      console.log('Falha na busca por dados');
    }
  } catch (error) {
    console.error('Erro ao gerar o relatório PDF:', error.message);
  }
};

export const gerarRelatorioFornecedorPDF = async (idFornecedor, fisJur) => {
  try {
    const resp = await fetch(`http://localhost:3333/relFornecedoresCad/${idFornecedor}/${fisJur}`);

    if (resp.ok) {
      const relatorioData = await resp.json();

      // Criação do documento PDF usando jsPDF com orientação paisagem e tamanho de página personalizado
      const pdfDoc = new JsPDF();
      pdfDoc.setFontSize(10); // Reduz o tamanho da fonte para 10

      // Adicione conteúdo ao PDF com base nos dados do relatório
      const titleText = 'Relatório de Fornecedores';
      pdfDoc.setFont('helvetica', 'bold');
      pdfDoc.setFontSize(12); // Reduz o tamanho da fonte para o título
      const titleWidth = pdfDoc.getStringUnitWidth(titleText) * pdfDoc.internal.getFontSize() / pdfDoc.internal.scaleFactor;
      pdfDoc.text(titleText, (pdfDoc.internal.pageSize.width - titleWidth) / 2, 20);

      // Reset para a fonte e tamanho padrão
      pdfDoc.setFont('helvetica', 'normal'); // Agora, apenas a fonte normal

      const lineHeight = 12;
      const pageHeight = pdfDoc.internal.pageSize.height;
      let startY = 40;

      relatorioData.forEach((item) => {
        // Verifique se há espaço suficiente na página atual
        if (startY + lineHeight > pageHeight) {
          // Se não houver, adicione uma nova página
          pdfDoc.addPage();
          startY = 20; // Reinicie a posição Y na nova página
        }

        // Adicione verificações para evitar valores nulos ou indefinidos
        const fornecedorLabel = item.idfor ? `${item.idfor} - ${item.nomefor}` : '';
        const cnpjLabel = 'CNPJ:';
        const tipoFornecedorLabel = 'Tipo Fornecedor:';
        const telefoneLabel = 'Telefone:';
        const enderecoLabel = 'Endereço:';
        const bairroLabel = 'Bairro:';
        const complementoLabel = 'Complemento:';
        const cepLabel = 'CEP:';
        const cidadeLabel = 'Cidade:';
        const emailLabel = 'E-Mail:';

        pdfDoc.setFont('helvetica', 'bold');
        pdfDoc.text(fornecedorLabel, 20, startY); // Nome do fornecedor em negrito
        startY += lineHeight;

        pdfDoc.setFont('helvetica', 'normal');
        pdfDoc.text(`${cnpjLabel} ${item.cnpjcpf || ''}`, 20, startY);
        startY += lineHeight;

        pdfDoc.text(`${tipoFornecedorLabel} ${item.fisjur || ''}`, 20, startY);
        startY += lineHeight;

        pdfDoc.text(`${telefoneLabel} ${item.telefone || ''}`, 20, startY);
        startY += lineHeight;

        pdfDoc.text(`${enderecoLabel} ${item.rua || ''}, ${item.numero || ''}`, 20, startY);
        startY += lineHeight;

        pdfDoc.text(`${bairroLabel} ${item.bairro || ''}`, 20, startY);
        startY += lineHeight;

        pdfDoc.text(`${complementoLabel} ${item.complemento || ''}`, 20, startY);
        startY += lineHeight;

        pdfDoc.text(`${cepLabel} ${item.cep || ''}`, 20, startY);
        startY += lineHeight;

        pdfDoc.text(`${cidadeLabel} ${item.cidade || ''}`, 20, startY);
        startY += lineHeight;

        pdfDoc.text(`${emailLabel} ${item.email || ''}`, 20, startY);
        startY += lineHeight;

        // Adiciona uma linha em branco entre fornecedores
        startY += lineHeight;
      });

      // Abra o documento PDF no navegador
      const blob = pdfDoc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');

      console.log('Relatório PDF gerado com sucesso e aberto no navegador.');
    } else {
      console.log('Falha na busca por dados');
    }
  } catch (error) {
    console.error('Erro ao gerar o relatório PDF:', error.message);
  }
};
















