/**
 * CONTROLE DE MATERIAL DO ESTÚDIO — Backend (Google Apps Script)
 * ================================================================
 * Cole este código inteiro em Extensões > Apps Script, dentro da
 * planilha Google que vai guardar os dados. Depois publique como
 * "Aplicativo da Web" (veja o passo a passo no README.md).
 *
 * A planilha precisa ter duas abas, com exatamente estes nomes:
 *
 *   Aba "Itens"  (colunas, na ordem):
 *     A: id_qr | B: numero_original | C: categoria | D: descricao | E: status
 *     (status = "Disponivel" ou "Em uso")
 *
 *   Aba "Movimentacoes"  (colunas, na ordem):
 *     A: os_num | B: item_id | C: descricao | D: fotografo
 *     E: data_saida | F: data_devolucao | G: status
 *     (status = "Saida" ou "Devolvido")
 *
 * Os arquivos "planilha-modelo-Itens.csv" e
 * "planilha-modelo-Movimentacoes.csv" (nesta mesma pasta) já vêm
 * prontos para importar em cada aba.
 */

// ⚠️ TROQUE ESTE PIN antes de publicar! É a senha que o responsável
// pelo paiol digita no celular/tablet para confirmar saídas e devoluções.
var PIN_CORRETO = "1234";

var ABA_ITENS = "Itens";
var ABA_MOVS = "Movimentacoes";

// ------------------------------------------------------------------
// Ponto de entrada para leituras (GET) — usado pelas 3 páginas do site
// Exemplos:
//   ?acao=itens   -> lista de itens com status atual
//   ?acao=status  -> lista do que está fora agora (para status.html)
// ------------------------------------------------------------------
function doGet(e) {
  var acao = (e && e.parameter && e.parameter.acao) || "itens";
  try {
    if (acao === "status") {
      return responderJson({ ok: true, fora: listarItensForaDoPaiol() });
    }
    // padrão: devolve a lista completa de itens (usada pelo scanner e etiquetas)
    return responderJson({ ok: true, itens: listarItens() });
  } catch (err) {
    return responderJson({ ok: false, erro: String(err) });
  }
}

// ------------------------------------------------------------------
// Ponto de entrada para escrita (POST) — registrar saída ou devolução
// Corpo esperado (texto simples contendo JSON, para evitar bloqueio de
// CORS no navegador — não mude para "application/json" no app.js):
//
//  Saída (vários itens de uma vez, vira 1 Ordem de Serviço):
//    { "pin":"1234", "acao":"saida", "fotografo":"Fulano",
//      "itens":[{"id_qr":"EST-01","descricao":"..."}, ...] }
//
//  Devolução (1 item por vez):
//    { "pin":"1234", "acao":"devolucao", "item_id":"EST-01" }
// ------------------------------------------------------------------
function doPost(e) {
  try {
    var corpo = JSON.parse(e.postData.contents);

    if (corpo.pin !== PIN_CORRETO) {
      return responderJson({ ok: false, erro: "PIN incorreto." });
    }

    if (corpo.acao === "saida") {
      return responderJson(registrarSaida(corpo.fotografo, corpo.itens));
    }
    if (corpo.acao === "devolucao") {
      return responderJson(registrarDevolucao(corpo.item_id));
    }
    return responderJson({ ok: false, erro: "Ação desconhecida." });
  } catch (err) {
    return responderJson({ ok: false, erro: String(err) });
  }
}

// ------------------------------------------------------------------
// Lógica principal
// ------------------------------------------------------------------

function registrarSaida(fotografo, itens) {
  if (!fotografo) return { ok: false, erro: "Selecione o fotógrafo." };
  if (!itens || !itens.length) return { ok: false, erro: "Nenhum item escaneado." };

  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaItens = planilha.getSheetByName(ABA_ITENS);
  var abaMovs = planilha.getSheetByName(ABA_MOVS);
  var dadosItens = abaItens.getDataRange().getValues(); // inclui cabeçalho na linha 0

  // Confere que nenhum item já está "Em uso" antes de gravar nada
  for (var i = 0; i < itens.length; i++) {
    var linhaItem = encontrarLinhaDoItem(dadosItens, itens[i].id_qr);
    if (linhaItem === -1) {
      return { ok: false, erro: "Item não cadastrado: " + itens[i].id_qr };
    }
    if (dadosItens[linhaItem][4] === "Em uso") {
      return { ok: false, erro: "Item já está em uso: " + dadosItens[linhaItem][3] };
    }
  }

  var agora = new Date();
  var osNum = "OS-" + Utilities.formatDate(agora, Session.getScriptTimeZone(), "yyyyMMdd-HHmmss");

  itens.forEach(function (item) {
    // 1) grava a movimentação
    abaMovs.appendRow([osNum, item.id_qr, item.descricao, fotografo, agora, "", "Saida"]);
    // 2) atualiza o status do item na aba Itens
    var linhaItem = encontrarLinhaDoItem(dadosItens, item.id_qr);
    abaItens.getRange(linhaItem + 1, 5).setValue("Em uso"); // +1 porque getDataRange é 0-index no array, planilha é 1-index
  });

  return {
    ok: true,
    os_num: osNum,
    fotografo: fotografo,
    data_saida: Utilities.formatDate(agora, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm"),
    itens: itens,
  };
}

function registrarDevolucao(itemId) {
  if (!itemId) return { ok: false, erro: "Item inválido." };

  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaItens = planilha.getSheetByName(ABA_ITENS);
  var abaMovs = planilha.getSheetByName(ABA_MOVS);

  // Procura a movimentação em aberto (status "Saida") mais recente para este item
  var dadosMovs = abaMovs.getDataRange().getValues();
  var linhaMov = -1;
  for (var i = dadosMovs.length - 1; i >= 1; i--) {
    if (dadosMovs[i][1] === itemId && dadosMovs[i][6] === "Saida") {
      linhaMov = i;
      break;
    }
  }
  if (linhaMov === -1) {
    return { ok: false, erro: "Este item não está registrado como retirado." };
  }

  var agora = new Date();
  abaMovs.getRange(linhaMov + 1, 6).setValue(agora); // coluna F: data_devolucao
  abaMovs.getRange(linhaMov + 1, 7).setValue("Devolvido"); // coluna G: status

  var dadosItens = abaItens.getDataRange().getValues();
  var linhaItem = encontrarLinhaDoItem(dadosItens, itemId);
  if (linhaItem !== -1) {
    abaItens.getRange(linhaItem + 1, 5).setValue("Disponivel");
  }

  return {
    ok: true,
    item_id: itemId,
    descricao: dadosMovs[linhaMov][2],
    data_devolucao: Utilities.formatDate(agora, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm"),
  };
}

function listarItens() {
  var abaItens = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA_ITENS);
  var dados = abaItens.getDataRange().getValues();
  var itens = [];
  for (var i = 1; i < dados.length; i++) {
    if (!dados[i][0]) continue; // pula linhas vazias
    itens.push({
      id_qr: dados[i][0],
      numero_original: dados[i][1],
      categoria: dados[i][2],
      descricao: dados[i][3],
      status: dados[i][4] || "Disponivel",
    });
  }
  return itens;
}

function listarItensForaDoPaiol() {
  var abaMovs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA_MOVS);
  var dados = abaMovs.getDataRange().getValues();
  var fora = [];
  for (var i = 1; i < dados.length; i++) {
    if (dados[i][6] === "Saida") {
      fora.push({
        os_num: dados[i][0],
        item_id: dados[i][1],
        descricao: dados[i][2],
        fotografo: dados[i][3],
        data_saida: Utilities.formatDate(new Date(dados[i][4]), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm"),
      });
    }
  }
  return fora;
}

function encontrarLinhaDoItem(dadosItens, idQr) {
  for (var i = 1; i < dadosItens.length; i++) {
    if (dadosItens[i][0] === idQr) return i;
  }
  return -1;
}

function responderJson(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(
    ContentService.MimeType.JSON
  );
}
