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
