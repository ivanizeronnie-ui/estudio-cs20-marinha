/* ==================================================================
 * CONTROLE DE MATERIAL DO ESTÚDIO — configuração e funções comuns
 * ================================================================== */

/*
 * ⚠️ PASSO OBRIGATÓRIO: depois de publicar o Apps Script (veja o
 * README.md), cole aqui a URL que o Google te deu, entre as aspas.
 * Termina com "/exec".
 */
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzlz09wnPHSfRtUaw-WJN8mA_RV7uMVBULm71CFyTrwwHc7afvYmvUjG4T8X1CTLSmKbg/exec";

// Nome da chave usada para guardar o PIN digitado nesta aba do navegador
// (fica só na memória da página, não é salvo no aparelho).
let PIN_ATUAL = "";

/**
 * Busca a lista de itens (com status atual) na planilha, através do
 * Apps Script. Se a URL ainda não foi configurada, usa a cópia local
 * de dados-iniciais.js só para a tela não ficar vazia durante os testes.
 */
async function buscarItens() {
  if (!apiConfigurada()) {
    return ITENS_INICIAIS.map((i) => ({ ...i, status: "Disponivel" }));
  }
  const resp = await fetch(`${APPS_SCRIPT_URL}?acao=itens`);
  const dados = await resp.json();
  if (!dados.ok) throw new Error(dados.erro || "Erro ao buscar itens.");
  return dados.itens;
}

/** Busca a lista do que está fora do paiol agora (para status.html). */
async function buscarStatusFora() {
  if (!apiConfigurada()) return [];
  const resp = await fetch(`${APPS_SCRIPT_URL}?acao=status`);
  const dados = await resp.json();
  if (!dados.ok) throw new Error(dados.erro || "Erro ao buscar status.");
  return dados.fora;
}

/**
 * Envia uma ação de escrita (saida ou devolucao) para o Apps Script.
 * Importante: o corpo é enviado como texto simples (não application/json)
 * de propósito — isso evita que o navegador bloqueie a chamada por CORS.
 * O Apps Script já sabe interpretar o texto como JSON (veja apps-script.gs).
 */
async function enviarAcao(corpoObjeto) {
  if (!apiConfigurada()) {
    throw new Error(
      "A URL do Apps Script ainda não foi configurada em app.js (veja o README)."
    );
  }
  const resp = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(corpoObjeto),
  });
  const dados = await resp.json();
  return dados;
}

function apiConfigurada() {
  return APPS_SCRIPT_URL && !APPS_SCRIPT_URL.startsWith("COLE_AQUI");
}

function formatarAgora() {
  return new Date().toLocaleString("pt-BR");
}

/** Pequeno aviso visual reutilizável (barra colorida no topo da página). */
function avisar(mensagem, tipo = "info") {
  const barra = document.getElementById("aviso");
  if (!barra) return;
  barra.textContent = mensagem;
  barra.className = `aviso aviso-${tipo}`;
  barra.style.display = "block";
  if (tipo !== "erro") {
    setTimeout(() => {
      barra.style.display = "none";
    }, 4000);
  }
}

function vibrarSeSuportado() {
  if (navigator.vibrate) navigator.vibrate(120);
}
