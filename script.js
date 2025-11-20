function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatar() {
  const input = document.getElementById('input').value.trim();
  const output = document.getElementById('output');
  output.textContent = '';
  output.classList.remove('destacado');

  if (!input) {
    alert('Cole os dados antes de formatar!');
    return;
  }

  const linhas = input.split('\n');
  let resultado = '';

  linhas.forEach((linha) => {
    const campos = linha.split(/\t|,/).map(c => c.trim());

    let cargo = '---';
    let emailFuncional = '---';
    let emailPessoal = '---';
    let nomeCompleto = '---';
    let telefone = '---';
    let cpf = '---';
    let matricula = '---';
    let lotacao = '---';

    const palavrasCargo = [
      'Oficial Investigador de Polícia',
      'Delegado de Polícia Civil',
      'Inspetor de Polícia Civil',
      'Escrivão de Polícia Civil'
    ];

    campos.forEach((campo, index) => {
      // E-mails
      if (campo.includes('@')) {
        if (campo.includes('ce.gov')) emailFuncional = campo;
        else if (campo.includes('.com')) emailPessoal = campo;
      }

      // Cargo
      if (palavrasCargo.some(p => normalizarTexto(campo).includes(normalizarTexto(p)))) {
        cargo = campo;
      }

      // Nome completo no índice 11 (ajustado por você)
      if (index === 11 && !/\d/.test(campo) && campo.trim().length >= 8) {
        nomeCompleto = campo;
      }

      // CPF: 11 dígitos, somente números
      if (index === 13 && /^\d{11}$/.test(campo) && cpf === '---') {
        cpf = campo;
      }

      // Matrícula: índice 14, com letras, números, ponto ou hífen
      if (index === 14 && /^[\w.\-]{5,}$/.test(campo)) {
        matricula = campo;
      }

      // Lotação: índice 15
      if (index === 15) {
        lotacao = campo;
      }

      // Telefone: 11 dígitos e começa com 9
      if (/^\d{11}$/.test(campo) && campo[2] === '9') {
        telefone = campo;
      }
    });

    // Monta o resultado final da linha
    resultado += `Cargo: ${cargo}\n`;
    resultado += `Nome completo: ${nomeCompleto}\n`;
    resultado += `E-mail funcional: ${emailFuncional}\n`;
    resultado += `E-mail pessoal: ${emailPessoal}\n`;
    resultado += `CPF: ${cpf}\n`;
    resultado += `Matrícula: ${matricula}\n`;
    resultado += `Lotação: ${lotacao}\n`;
    resultado += `Telefone: ${telefone}\n\n`;
  });

  // Exibe o resultado
  output.textContent = resultado.trim();
  output.classList.add('destacado');
  copiarEExibirMensagem(resultado.trim());

  setTimeout(() => {
    document.getElementById('input').value = '';
  }, 4000);
}

function formatar2() {
  const input = document.getElementById('input').value.trim();
  const output = document.getElementById('output');
  output.textContent = '';
  output.classList.remove('destacado');

  if (!input) {
    alert('Cole os dados antes de formatar!');
    return;
  }

  const linhas = input.split('\n');
  let resultado = '';

  const palavrasCargo = [
    'Oficial Investigador de Polícia',
    'Delegado de Polícia Civil',
    'Inspetor de Polícia Civil',
    'Escrivão de Polícia Civil'
  ];

  const palavrasLotacao = [
    'Delegacia', 'Coordenação', 'Núcleo', 'Unidade',
    'Municipal', 'Coplan', 'SSP', 'DP', 'Departamento',
    'DHPP', 'DPI', 'Divisão', 'DM', 'DDM', 'DENARC', 'DDF', 'DRF',
    'DRFVC', 'DECAP', 'DCA', 'DRACO', 'CORE', 'Metropolitana', 'Regional',
    'Distrito', 'Policial', 'DR', 'DECECA', 'DCA', 'DAMPS', 'CEPROD', 'DG', 'DAS',
    'SECCIONAL'
  ];

  const emissoresPossiveis = [
    'SSP', 'SSP-CE', 'SSPCE', 'SPTC', 'IFCE',
    'DETRAN', 'SSPDSCE', 'SSPDS', 'Ssp', 'SSP CE', 'SDS', 'SDS/PE'
  ];

  const termosIgnoradosNome = [
    'usuário de rede', 'reset de senha', 'formulário'
  ];

  linhas.forEach((linha) => {
    const campos = linha.split(/\t|,/).map(c => c.trim());

    let emailPessoal = '---';
    let cargo = '---';
    let nomeCompleto = '---';
    let emailFuncional = '---';
    let cpf = '---';
    let matricula = '---';
    let lotacao = '---';
    let telefone = '---';
    let emissor = '---';
    let rg = '---';
    let dataNascimento = '---';

    campos.forEach((campo, index) => {
      const campoNormalizado = normalizarTexto(campo);

      // E-mail
      if (campo.includes('@')) {
        if (campo.includes('ce.gov')) {
          emailFuncional = campo;
        } else if (campo.includes('.com') || campo.includes('.br')) {
          emailPessoal = campo;
        }
      }

      // Cargo
      if (palavrasCargo.some(p => campoNormalizado.includes(normalizarTexto(p)))) {
        cargo = campo;
      }

      // Nome completo mais flexível (aceita caso tudo em maiúsculo ou minúsculo)
      if (index === 18) {
      // Só aceita como nome se não tiver números e for razoável
      if (!/\d/.test(campo) && campo.trim().length >= 8) {
      nomeCompleto = campo;
        }
      }

      // Telefone
      if (/^\d{11}$/.test(campo) && campo[2] === '9') {
        telefone = campo;
      }

      // CPF
      if (/^\d{11}$/.test(campo) && cpf === '---') {
        cpf = campo;
      }

      // Matrícula (permitindo ponto, hífen)
      if (index === 21 && /^[\w\.\-]{5,}$/.test(campo)) {
        matricula = campo;
      }

      // Lotação
      if (index === 22) {
        lotacao = campo;
      }

      // Órgão expedidor
      if (emissoresPossiveis.some(e => campoNormalizado.includes(normalizarTexto(e)))) {
        emissor = campo;
      }

      // RG
      if (index === 30) {
        rg = campo;
      }

      // Data de nascimento
      if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(campo)) {
        dataNascimento = campo;
      }
    });

    resultado += `Cargo: ${cargo}\n`;
    resultado += `Nome completo: ${nomeCompleto}\n`;
    resultado += `E-mail funcional: ${emailFuncional}\n`;
    resultado += `E-mail Recuperação: ${emailPessoal}\n`;
    resultado += `CPF: ${cpf}\n`;
    resultado += `Matrícula: ${matricula}\n`;
    resultado += `Lotação: ${lotacao}\n`;
    resultado += `Telefone: ${telefone}\n`;
    resultado += `Órgão expedidor: ${emissor}\n`;
    resultado += `RG: ${rg}\n`;
    resultado += `Data de nascimento: ${dataNascimento}\n\n`;
  });

  output.textContent = resultado.trim();
  output.classList.add('destacado');
  copiarEExibirMensagem(resultado.trim());
  setTimeout(() => {
    document.getElementById('input').value = '';
  }, 6000);
}

function copiarEExibirMensagem(texto) {
  const mensagem = document.getElementById('mensagem-copiar');

  // Fallback que funciona em qualquer ambiente
  const textArea = document.createElement("textarea");
  textArea.value = texto;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const sucesso = document.execCommand('copy');
    exibirMensagem(sucesso ? 'Formatado e copiado com sucesso!' : 'Erro ao copiar o texto.', sucesso);
  } catch (err) {
    exibirMensagem('Erro ao copiar o texto.', false);
  }

  document.body.removeChild(textArea);
}

function exibirMensagem(texto, sucesso = true) {
  const mensagem = document.getElementById('mensagem-copiar');
  mensagem.textContent = texto;
  mensagem.className = 'mensagem-copiar ' + (sucesso ? 'mensagem-sucesso' : 'mensagem-erro');

  setTimeout(() => {
    mensagem.textContent = '';
    mensagem.className = 'mensagem-copiar';
  }, 8000);
}
