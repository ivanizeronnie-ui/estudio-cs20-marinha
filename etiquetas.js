/* ==================================================================
 * Lógica da página de etiquetas (etiquetas.html)
 * ================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  const grade = document.getElementById("grade-etiquetas");
  let itens = [];
  try {
    itens = await buscarItens();
  } catch (err) {
    avisar("Não foi possível carregar da planilha, usando lista local. (" + err.message + ")", "info");
    itens = ITENS_INICIAIS;
  }

  if (!apiConfigurada()) {
    avisar(
      "Mostrando a lista local (dados-iniciais.js) — configure app.js para puxar direto da planilha.",
      "info"
    );
  }

  itens.forEach((item) => {
    const etiqueta = document.createElement("div");
    etiqueta.className = "etiqueta";
    const qrDiv = document.createElement("div");
    qrDiv.className = "etiqueta-qr";
    etiqueta.appendChild(qrDiv);

    const legenda = document.createElement("div");
    legenda.className = "etiqueta-legenda";
    legenda.innerHTML = `<strong>${item.id_qr}</strong><br>${item.descricao}`;
    etiqueta.appendChild(legenda);

    grade.appendChild(etiqueta);

    // eslint-disable-next-line no-undef
    new QRCode(qrDiv, {
      text: item.id_qr,
      width: 90,
      height: 90,
      correctLevel: QRCode.CorrectLevel.M,
    });
  });
});
