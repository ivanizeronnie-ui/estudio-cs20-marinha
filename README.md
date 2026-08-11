# Controle de Material do Estúdio — Passo a passo

Sistema simples e gratuito para controlar, por QR code, o material que sai e volta
do paiol do estúdio. Funciona no navegador do celular/tablet, sem precisar instalar
nenhum aplicativo. Os dados ficam numa Planilha Google (a que você já conhece do
Excel) e o "site" fica publicado de graça no GitHub Pages.

Existem 3 etapas de configuração, feitas **uma única vez**. Depois disso é só usar
no dia a dia.

---

## Etapa 1 — Criar a Planilha Google (o "banco de dados")

✅ **Já adiantei essa parte para você.** Criei a planilha direto no seu Google Drive
(conta `ivanize.ronnie@gmail.com`), já com os 34 materiais cadastrados:

👉 **[Abrir a planilha "Controle de Material — Estúdio"](https://docs.google.com/spreadsheets/d/1MqB_hv2klc8HUR-TSnKk6JWnmvaf_O94aFF_U39BdaA/edit)**

Só faltam 2 ajustes rápidos que eu não consigo fazer por aqui (a conexão que tenho
com o Google Drive só cria/lê arquivos inteiros, não renomeia abas nem edita
células de uma planilha já existente):

1. Clique com o botão direito na aba (embaixo, hoje deve estar como "Sheet1" ou
   parecido) e renomeie para exatamente **`Itens`**.
2. Crie uma segunda aba (botão "+" embaixo) chamada exatamente **`Movimentacoes`**
   (sem acento, sem espaço). Cole nela o conteúdo de **`planilha-modelo-Movimentacoes.csv`**
   — só tem o cabeçalho mesmo, ela vai sendo preenchida sozinha conforme o sistema
   é usado.

> ⚠️ Os nomes das abas precisam ser exatamente `Itens` e `Movimentacoes` (o script
> procura por esses nomes).

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

Não precisa saber programar nem usar linha de comando — dá tudo pelo navegador.

1. Crie uma conta gratuita em [github.com](https://github.com) (se ainda não tiver).
2. Clique em **New repository** (repositório novo). Dê um nome, por exemplo
   `controle-material-estudio`. Deixe como **Public**. Não marque nenhuma opção de
   "README"/"licença" — pode criar vazio. Clique em **Create repository**.
3. Na página do repositório recém-criado, clique no link **"uploading an existing
   file"** (ou `Add file → Upload files`).
4. **Antes de subir os arquivos**, abra o arquivo `app.js` (desta pasta) num editor
   de texto e troque a linha:
   ```
   const APPS_SCRIPT_URL = "COLE_AQUI_A_URL_DO_SEU_APPS_SCRIPT";
   ```
   colando a URL que você copiou na Etapa 2, entre as aspas. Salve o arquivo.
5. Arraste **todos os arquivos desta pasta** (`index.html`, `status.html`,
   `etiquetas.html`, `style.css`, `app.js`, `scanner.js`, `status.js`,
   `etiquetas.js`, `dados-iniciais.js`) para a área de upload do GitHub. **Não
   precisa subir** `apps-script.gs` nem os arquivos `.csv` nem este `README.md`
   (eles já cumpriram o papel deles nas Etapas 1 e 2) — mas não tem problema
   nenhum se subir junto.
6. Clique em **Commit changes** para confirmar o upload.
7. Vá em **Settings → Pages** (menu à esquerda). Em "Build and deployment", escolha
   **Deploy from a branch**, branch **main**, pasta **/(root)**, e clique em **Save**.
8. Espere 1–2 minutos. Volte em **Settings → Pages** e você vai ver o link do site,
   algo como `https://SEU-USUARIO.github.io/controle-material-estudio/`. Esse é o
   endereço que você vai abrir no celular/tablet do paiol.

---

## Etapa 4 — Imprimir as etiquetas

1. No celular/computador, abra `https://SEU-USUARIO.github.io/.../etiquetas.html`.
2. Clique em **"Imprimir todas as etiquetas"**.
3. Recorte e cole cada etiqueta (QR code + código + nome) no material
   correspondente.

---

## Etapa 5 — Testar

1. Abra a página inicial (`index.html`) no celular que vai ficar no paiol.
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
- **Trocar/adicionar fotógrafos da lista**: edite o array `FOTOGRAFOS_INICIAIS` no
  arquivo `dados-iniciais.js` e suba o arquivo atualizado no GitHub (`Add file →
  Upload files`, sobrescreve o antigo).
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
