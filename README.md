# Controle de Material do Estúdio — Passo a passo

Sistema simples e gratuito para controlar, por QR code, o material que sai e volta
do paiol do estúdio. Funciona no navegador do celular/tablet, sem precisar instalar
nenhum aplicativo. Os dados ficam numa Planilha Google (a que você já conhece do
Excel) e o "site" fica publicado de graça no GitHub Pages.

Existem 3 etapas de configuração, feitas **uma única vez**. Depois disso é só usar
no dia a dia.

---

## Etapa 1 — Criar a Planilha Google (o "banco de dados")

✅ **100% pronta, nada para você fazer aqui.** Criei a planilha direto no seu Google
Drive (conta `ivanize.ronnie@gmail.com`), já com as duas abas com o nome certo
(`Itens` e `Movimentacoes`) e os 34 materiais cadastrados:

👉 **[Abrir a planilha "Controle de Material — Estúdio (FINAL)"](https://docs.google.com/spreadsheets/d/1Y6uurdbxGJUcqF2usVDq3K8CW1qOM3EFsIOFmhsgfz0/edit)**

> 🗑️ No processo eu criei 2 versões de rascunho antes de acertar essa (o Google
> Drive só deixa criar arquivo novo, não editar aba de um já existente — tive que
> testar até achar o formato certo). Pode apagar direto no Drive as duas com nome
> **"Controle de Material — Estúdio"** e **"(estrutura)"** — só a que termina em
> **"(FINAL)"** importa.

---

## Etapa 2 — Publicar o "Apps Script" (o que liga o site à planilha)

1. Ainda na planilha, vá em **Extensões → Apps Script**. Vai abrir uma nova aba.
2. Apague o código de exemplo que já vem escrito, e cole todo o conteúdo do
   arquivo **`apps-script.gs`** (desta pasta).
3. Logo no topo do código tem a linha:
   ```
   var PIN_CORRETO = "1234";
   ```
   Troque `"1234"` pelo PIN que você quer usar no dia a dia (4 a 6 números, entre
   aspas). Esse é o código que você vai digitar no celular para autorizar cada
   saída/devolução.
4. Clique em **Salvar** (ícone de disquete) e dê um nome ao projeto, ex.: "Controle
   de Material".
5. Clique em **Implantar → Nova implantação**. Em "Tipo", escolha **App da Web**.
   - Executar como: **Eu (seu e-mail)**
   - Quem tem acesso: **Qualquer pessoa**
6. Clique em **Implantar**. O Google vai pedir para você autorizar o script (é
   normal aparecer um aviso "App não verificado" — clique em "Avançado" e depois
   "Acessar [nome do projeto] (não seguro)", é o seu próprio script, é seguro).
7. Depois de autorizar, o Google mostra uma **URL do app da Web**, algo como:
   `https://script.google.com/macros/s/AKfycb.../exec`
   **Copie essa URL inteira** — vai precisar dela na próxima etapa.

> Se um dia você editar o `apps-script.gs` de novo, lembre de ir em **Implantar →
> Gerenciar implantações → ✏️ (editar) → Nova versão → Implantar** para as
> mudanças valerem.

---

## Etapa 3 — Colocar o site no ar (GitHub Pages)

✅ **Já fiz essa parte inteira para você.** Instalei o GitHub CLI, você autorizou o
login, e a partir daí criei o repositório e publiquei o site sozinho. Está no ar:

👉 **https://ivanizeronnie-ui.github.io/controle-material-estudio/**

(código-fonte: [github.com/ivanizeronnie-ui/controle-material-estudio](https://github.com/ivanizeronnie-ui/controle-material-estudio))

**Quando você tiver a URL do Apps Script (fim da Etapa 2), não precisa editar nada
sozinho** — é só me mandar essa URL aqui no chat que eu mesmo edito o `app.js` e
publico a atualização no site (já tenho acesso de escrita configurado no repositório).
Se preferir editar você mesmo: abra o arquivo `app.js` no site do GitHub (link acima),
clique no ícone de lápis ✏️, troque a linha `COLE_AQUI_A_URL_DO_SEU_APPS_SCRIPT` pela
URL, e clique em **Commit changes**.

---

## Etapa 4 — Imprimir as etiquetas

1. Abra **https://ivanizeronnie-ui.github.io/controle-material-estudio/etiquetas.html**
   no celular/computador.
2. Clique em **"Imprimir todas as etiquetas"**.
3. Recorte e cole cada etiqueta (QR code + código + nome) no material
   correspondente.

---

## Etapa 5 — Testar

1. Abra a página inicial (https://ivanizeronnie-ui.github.io/controle-material-estudio/)
   no celular que vai ficar no paiol.
2. Digite o PIN.
3. Aponte a câmera para uma etiqueta de teste — o item deve aparecer na lista de
   "Itens escaneados para saída".
4. Escolha um fotógrafo e clique em **Emitir Ordem de Serviço** — deve abrir a
   tela de impressão da OS, e a linha correspondente deve aparecer na aba
   `Movimentacoes` da planilha.
5. Abra `status.html` — o item de teste deve aparecer como "fora".
6. Volte ao `index.html`, escaneie o mesmo item de novo — agora deve aparecer o
   botão **"Confirmar devolução"**. Confirme e veja o item sumir do `status.html`.

Se tudo isso funcionar, o sistema está pronto para uso real. 🎉

---

## Manutenção do dia a dia

- **Adicionar um material novo**: acrescente uma linha na aba `Itens` da
  planilha (próximo código sequencial, ex. `EST-35`), depois abra `etiquetas.html`
  e imprima — a etiqueta nova aparece sozinha, sem precisar mexer em nenhum
  arquivo.
- **Trocar/adicionar fotógrafos da lista**: me peça aqui no chat, ou edite você
  mesmo o array `FOTOGRAFOS_INICIAIS` direto no arquivo `dados-iniciais.js` pelo
  site do GitHub (ícone de lápis ✏️ → editar → Commit changes).
- **Trocar o PIN**: edite `PIN_CORRETO` no `apps-script.gs` (dentro do Apps
  Script, não neste arquivo local) e implante uma nova versão (veja aviso na
  Etapa 2).
- **Consultar o histórico completo**: é só abrir a planilha Google normalmente,
  aba `Movimentacoes` — cada linha é uma saída ou devolução, com data e hora.

## Avisos importantes

- Como o GitHub Pages gratuito exige repositório **público**, qualquer pessoa que
  souber o endereço do site consegue *ver* a URL do Apps Script dentro do código.
  Por isso o PIN é conferido **dentro do próprio Apps Script** (não só na tela) —
  sem o PIN certo, ninguém consegue registrar saída/devolução, mesmo sabendo a
  URL. Ainda assim, evite divulgar o link do site fora da equipe do estúdio, e
  troque o PIN de tempos em tempos.
- Este sistema não faz login individual — quem estiver com o PIN pode operar.
  Para o caso de uso descrito (um único ponto de escaneamento, operado pelo
  responsável do paiol), isso é proporcional ao risco.
- A câmera só funciona em páginas HTTPS — o GitHub Pages já publica em HTTPS por
  padrão, então não precisa se preocupar com isso.
