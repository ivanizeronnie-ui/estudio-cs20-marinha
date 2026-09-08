/* ==================================================================
 * Lógica da tela de escaneamento (index.html)
 * ================================================================== */

let itensCache = [];
let carrinho = []; // itens escaneados nesta sessão, prontos para sair
let ultimoScan = { codigo: "", quando: 0 };

document.addEventListener("DOMContentLoaded", async () => {
  preencherSelectFotografos();
  await recarregarItens();
  iniciarCamera();

  document.getElementById("pin").addEventListener("input", (e) => {
    PIN_ATUAL = e.target.value.trim();
  });
  document.getElementById("btn-emitir-os").addEventListener("click", emitirOrdemDeServico);
  document.getElementById("btn-voltar-scanner").addEventListener("click", () => {
    document.getElementById("tela-os").style.display = "none";
    document.getElementById("tela-principal").style.display = "block";
  });
  document.getElementById("btn-codigo-manual").addEventListener("click", () => {
    const codigo = document.getElementById("codigo-manual").value.trim().toUpperCase();
    if (codigo) processarCodigoLido(codigo);
  });
});

function preencherSelectFotografos() {
  const select = document.getElementById("fotografo");
  FOTOGRAFOS_INICIAIS.forEach((nome) => {
    const opt = document.createElement("option");
    opt.value = nome;
    opt.textContent = nome;
    select.appendChild(opt);
  });
}

async function recarregarItens() {
  try {
    itensCache = await buscarItens();
  } catch (err) {
    avisar("Não foi possível carregar a lista de itens: " + err.message, "erro");
  }
}

function iniciarCamera() {
  const html5QrCode = new Html5Qrcode("leitor");
  html5QrCode
    .start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 230 },
      (codigoLido) => processarCodigoLido(codigoLido.trim().toUpperCase()),
      () => {} // erro de leitura de frame — ignorado, é normal enquanto mira a câmera
    )
    .catch((err) => {
      avisar(
        "Não consegui abrir a câmera. Verifique a permissão do navegador. (" + err + ")",
        "erro"
      );
    });
}

function processarCodigoLido(codigo) {
  const agora = Date.now();
  // evita ler o mesmo código várias vezes seguidas (câmera lê ~10x por segundo)
  if (codigo === ultimoScan.codigo && agora - ultimoScan.quando < 2500) return;
  ultimoScan = { codigo, quando: agora };
  vibrarSeSuportado();

  // String(...) nos dois lados: a planilha pode guardar id_qr como número
  // (ex.: NUMPATs da Marinha, tipo 167397044) quando o valor "parece" numérico,
  // enquanto o código lido da câmera é sempre texto — sem essa conversão a
  // comparação "===" falha e o item nunca é reconhecido.
  const item = itensCache.find((i) => String(i.id_qr) === codigo);
  if (!item) {
    avisar(`QR code "${codigo}" não corresponde a nenhum item cadastrado.`, "erro");
    return;
  }

  if (item.status === "Em uso") {
    mostrarCardDevolucao(item);
  } else {
    adicionarAoCarrinho(item);
  }
}

function mostrarCardDevolucao(item) {
  const area = document.getElementById("card-item-lido");
  area.innerHTML = `
    <div class="card card-devolucao">
      <p><strong>${item.descricao}</strong> (${item.id_qr})</p>
      <p>Este item está atualmente <strong>em uso</strong>.</p>
      <button class="botao botao-devolver" id="btn-confirmar-devolucao">Confirmar devolução</button>
    </div>`;
  document.getElementById("btn-confirmar-devolucao").onclick = () => confirmarDevolucao(item);
}

async function confirmarDevolucao(item) {
  if (!PIN_ATUAL) {
    avisar("Digite o PIN no topo da tela antes de confirmar.", "erro");
    return;
  }
  try {
    const resp = await enviarAcao({ pin: PIN_ATUAL, acao: "devolucao", item_id: item.id_qr });
    if (!resp.ok) {
      avisar(resp.erro || "Não foi possível registrar a devolução.", "erro");
      return;
    }
    avisar(`Devolução registrada: ${item.descricao}.`, "ok");
    document.getElementById("card-item-lido").innerHTML = "";
    await recarregarItens();
  } catch (err) {
    avisar("Erro ao registrar devolução: " + err.message, "erro");
  }
}

function adicionarAoCarrinho(item) {
  if (carrinho.some((i) => i.id_qr === item.id_qr)) {
    avisar(`${item.descricao} já está no carrinho.`, "info");
    return;
  }
  carrinho.push({ id_qr: item.id_qr, descricao: item.descricao });
  renderCarrinho();
  avisar(`Adicionado: ${item.descricao}`, "ok");
}

function removerDoCarrinho(idQr) {
  carrinho = carrinho.filter((i) => i.id_qr !== idQr);
  renderCarrinho();
}

function renderCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  lista.innerHTML = "";
  carrinho.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.descricao} <button class="botao-remover" data-id="${item.id_qr}">remover</button>`;
    li.querySelector("button").onclick = () => removerDoCarrinho(item.id_qr);
    lista.appendChild(li);
  });
  document.getElementById("contador-carrinho").textContent = carrinho.length;
  document.getElementById("btn-emitir-os").disabled = carrinho.length === 0;
}

async function emitirOrdemDeServico() {
  const fotografo = document.getElementById("fotografo").value;
  if (!fotografo) {
    avisar("Selecione o fotógrafo responsável pela retirada.", "erro");
    return;
  }
  if (!PIN_ATUAL) {
    avisar("Digite o PIN no topo da tela antes de confirmar.", "erro");
    return;
  }
  if (carrinho.length === 0) return;

  try {
    const resp = await enviarAcao({ pin: PIN_ATUAL, acao: "saida", fotografo, itens: carrinho });
    if (!resp.ok) {
      avisar(resp.erro || "Não foi possível emitir a Ordem de Serviço.", "erro");
      return;
    }
    mostrarOrdemDeServicoImpressa(resp);
    carrinho = [];
    renderCarrinho();
    document.getElementById("card-item-lido").innerHTML = "";
    await recarregarItens();
  } catch (err) {
    avisar("Erro ao emitir Ordem de Serviço: " + err.message, "erro");
  }
}

function mostrarOrdemDeServicoImpressa(resposta) {
  document.getElementById("os-numero").textContent = resposta.os_num;
  document.getElementById("os-fotografo").textContent = resposta.fotografo;
  document.getElementById("os-data").textContent = resposta.data_saida;
  const corpo = document.getElementById("os-itens");
  corpo.innerHTML = "";
  resposta.itens.forEach((item, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${idx + 1}</td><td>${item.id_qr}</td><td>${item.descricao}</td>`;
    corpo.appendChild(tr);
  });

  document.getElementById("tela-principal").style.display = "none";
  document.getElementById("tela-os").style.display = "block";
  setTimeout(() => window.print(), 300);
}
