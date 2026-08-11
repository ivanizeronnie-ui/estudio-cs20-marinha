/*
 * Lista inicial dos materiais do estúdio, extraída de "ct sistilbem 02.xls".
 * Cada item recebe um ID de QR code fixo no formato EST-01, EST-02, ...
 *
 * Este arquivo serve como CÓPIA DE REFERÊNCIA local (usada pela página de
 * etiquetas.html como no primeiro carregamento / se a planilha ainda não
 * tiver sido preenchida). A lista "oficial" e editável no dia a dia é a
 * aba "Itens" da Google Sheets — para adicionar um item novo no futuro,
 * edite a planilha (não este arquivo) e gere a etiqueta pela própria
 * página etiquetas.html, que também lê da planilha.
 *
 * numero_original = número que o item já tinha na planilha CE-22, apenas
 * para referência/rastreabilidade (não é usado como chave, quem identifica
 * o item de forma única é o id_qr).
 */
const ITENS_INICIAIS = [
  { id_qr: "EST-01", numero_original: 1,  categoria: "Mobiliário",  descricao: "Cadeira Executiva Base Fixa em S Linha Office Gomada Preto" },
  { id_qr: "EST-02", numero_original: 2,  categoria: "Mobiliário",  descricao: "Mesa Dobrável - Estrutura Metálica Com Tampo em Plástico 0,80 x 0,76 x 0,75m" },
  { id_qr: "EST-03", numero_original: 3,  categoria: "Mobiliário",  descricao: "Smart TV LG Full HD AI de 43 polegadas 43LR67" },
  { id_qr: "EST-04", numero_original: 5,  categoria: "Equipamento", descricao: "Câmera Sony Alpha a7IV Mirrorless" },
  { id_qr: "EST-05", numero_original: 6,  categoria: "Equipamento", descricao: "Bateria Sony NP-FZ100 Rechargeable Lithium-Ion Battery (2280mAh)" },
  { id_qr: "EST-06", numero_original: 7,  categoria: "Equipamento", descricao: "Cartão De Memória Lexar 128gb 2000x UHS-II SDXC V90 300mb/s" },
  { id_qr: "EST-07", numero_original: 8,  categoria: "Equipamento", descricao: "SmallRig 4268B Bateria fictícia Sony NP-FZ100 com adaptador de energia" },
  { id_qr: "EST-08", numero_original: 9,  categoria: "Equipamento", descricao: "Lente Sigma 28-105mm f/2.8 DG DN Art (Sony E)" },
  { id_qr: "EST-09", numero_original: 10, categoria: "Equipamento", descricao: "Filtro para lente Sony 28-105mm - Hoya 82mm UV" },
  { id_qr: "EST-10", numero_original: 11, categoria: "Equipamento", descricao: "Plate Para Tripé Vertical L Suporte speedlite e modificadores de luz" },
  { id_qr: "EST-11", numero_original: 12, categoria: "Equipamento", descricao: "Iluminador Amaran 300c RGBWW LED" },
  { id_qr: "EST-12", numero_original: 13, categoria: "Equipamento", descricao: "C-stand Inox Cromado Greika 3,3m com saco contrapeso" },
  { id_qr: "EST-13", numero_original: 14, categoria: "Equipamento", descricao: "Softbox Bowens Godox Com Tela Grid 60x60cm Para Flash Estúdio" },
  { id_qr: "EST-14", numero_original: 15, categoria: "Equipamento", descricao: "Softbox Aputure Lantern 65 (Balão Chinês 65cm), com conjunto de saia" },
  { id_qr: "EST-15", numero_original: 16, categoria: "Equipamento", descricao: "BarnDoors Aputure c/ Suporte de gelatina + Grid, compatível com LS 300d II" },
  { id_qr: "EST-16", numero_original: 17, categoria: "Equipamento", descricao: "Aputure Fresnel 2x" },
  { id_qr: "EST-17", numero_original: 18, categoria: "Equipamento", descricao: "Suporte Godox S2 para flash speedlite e modificadores de luz" },
  { id_qr: "EST-18", numero_original: 19, categoria: "Equipamento", descricao: "Suporte adaptador para rebatedor fotográfico" },
  { id_qr: "EST-19", numero_original: 20, categoria: "Equipamento", descricao: "Super Clamp Duplo p/ tripé Suporte Iluminação Studio" },
  { id_qr: "EST-20", numero_original: 21, categoria: "Equipamento", descricao: "Braço Horizontal Para Tripé – rotação 360°, carga máx. 10kg" },
  { id_qr: "EST-21", numero_original: 22, categoria: "Equipamento", descricao: "SmallRig Suporte super braçadeira com mini cabeça esférica e adaptador" },
  { id_qr: "EST-22", numero_original: 23, categoria: "Equipamento", descricao: "Refletor Fotográfico 5 Em 1 - Oval 120x180cm" },
  { id_qr: "EST-23", numero_original: 24, categoria: "Equipamento", descricao: "Mesa de áudio RØDE Caster Pro II" },
  { id_qr: "EST-24", numero_original: 25, categoria: "Equipamento", descricao: "Microfone Rode PodMic Dinâmico" },
  { id_qr: "EST-25", numero_original: 26, categoria: "Equipamento", descricao: "Cabo microfone XLR F x M 15,0m Hi-flex C50J Shure" },
  { id_qr: "EST-26", numero_original: 27, categoria: "Equipamento", descricao: "FIFINE Microphone Boom Arm BM88" },
  { id_qr: "EST-27", numero_original: 28, categoria: "Equipamento", descricao: "Microfone de Lapela Sem Fio Hollyland Lark M2 Combo" },
  { id_qr: "EST-28", numero_original: 29, categoria: "Equipamento", descricao: "Fone de Ouvido Roland RH-5" },
  { id_qr: "EST-29", numero_original: 30, categoria: "Equipamento", descricao: "Mesa de corte Blackmagic Atem Mini Pro" },
  { id_qr: "EST-30", numero_original: 31, categoria: "Equipamento", descricao: "Cabo 8K Mini HDMI para HDMI, 10 metros, 48 Gbps, HDMI 2.1" },
  { id_qr: "EST-31", numero_original: 32, categoria: "Equipamento", descricao: "Cabo 8K HDMI para HDMI, 10 metros, 48 Gbps, HDMI 2.1" },
  { id_qr: "EST-32", numero_original: 33, categoria: "Equipamento", descricao: "Magnus REX VT-5000 Tripé de vídeo" },
  { id_qr: "EST-33", numero_original: 34, categoria: "Equipamento", descricao: "Flash a Bateria Godox V860III TTL HSS Para Câmera Sony" },
  { id_qr: "EST-34", numero_original: 35, categoria: "Equipamento", descricao: "Suporte Fundo Infinito Estúdio Parede Greika + 3 Rolos Papel" },
];

// Lista inicial de fotógrafos que aparecem no seletor da tela de escaneamento.
// Edite aqui os nomes, ou (melhor) mantenha uma aba "Fotografos" na planilha
// e ajuste app.js para carregar dali se preferir não editar código depois.
const FOTOGRAFOS_INICIAIS = [
  "1SG Ronnie",
  "1SG Paulo Cesar",
  "1SG Helton",
  "SO Ibrahim",
  "1SG Ibrahim",
  "2SG Mucio",
  "3SG Raul",
];
