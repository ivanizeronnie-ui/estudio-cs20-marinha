/* ==================================================================
 * Lógica do painel "O que está fora" (status.html)
 * ================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("pin").addEventListener("input", (e) => {
    PIN_ATUAL = e.target.value.trim();
  });
  document.getElementById("btn-atualizar").addEventListener("click", carregarStatus);
  carregarStatus();
});

async function carregarStatus() {
  const corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = `<tr><td colspan="5">Carregando...</td></tr>`;
  try {
    const fora = await buscarStatusFora();
    if (!apiConfigurada()) {
      avisar(
        "A URL do Apps Script ainda não foi configurada em app.js — nenhum dado real para mostrar.",
        "erro"
      );
    }
    if (fora.length === 0) {
      corpo.innerHTML = `<tr><td colspan="5">Nenhum material fora do paiol no momento. ✅</td></tr>`;
      return;
    }
    corpo.innerHTML = "";
    fora.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.descricao} <br><span class="codigo-pequeno">${item.item_id}</span></td>
        <td>${item.fotografo}</td>
        <td>${item.data_saida}</td>
        <td>${item.os_num}</td>
        <td><button class="botao botao-devolver" data-id="${item.item_id}">Devolver</button></td>`;
      tr.querySelector("button").onclick = () => devolverPelaTabela(item);
      corpo.appendChild(tr);
    });
  } catch (err) {
    corpo.innerHTML = `<tr><td colspan="5">Erro ao carregar: ${err.message}</td></tr>`;
  }
}

async function devolverPelaTabela(item) {
  if (!PIN_ATUAL) {
    avisar("Digite o PIN no topo da tela antes de confirmar a devolução.", "erro");
    return;
  }
  try {
    const resp = await enviarAcao({ pin: PIN_ATUAL, acao: "devolucao", item_id: item.item_id });
    if (!resp.ok) {
      avisar(resp.erro || "Não foi possível registrar a devolução.", "erro");
      return;
    }
    avisar(`Devolução registrada: ${item.descricao}.`, "ok");
    carregarStatus();
  } catch (err) {
    avisar("Erro ao registrar devolução: " + err.message, "erro");
  }
}
