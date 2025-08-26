![Baby Shower BOT Banner](https://i.postimg.cc/PH4RcWYZ/Captura-de-Tela-2025-08-26-a-s-16-27-38.png)

# Baby Shower Bot

Este repositório contém o código-fonte para o Baby Shower Bot, um gerenciador de convites simples para eventos de chá de bebê. Este bot foi projetado para automatizar o processo de envio de convites, gerenciamento de confirmações e acompanhamento de itens como a contagem de fraldas.

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
  - [Configuração Customizada (config.js)](#configuração-customizada-configjs)
  - [Estrutura do guests.json](#estrutura-do-guestsjson)
- [Execução Local com ngrok](#execução-local-com-ngrok)
- [Proxy Reverso com Apache](#proxy-reverso-com-apache)
- [Integração com brdid.com.br (Opcional)](#integração-com-brdidcombr-opcional)
- [Comandos](#comandos)
- [Licença](#licença)
- [Contribuição](#contribuição)

## Visão Geral

O Baby Shower Bot é uma aplicação Node.js que utiliza a API do WhatsApp Business para gerenciar convites e confirmações para chás de bebê. Ele permite o envio de convites personalizados, o acompanhamento de respostas e a coleta de informações importantes, como o tamanho das fraldas que os convidados pretendem trazer.

<img src="https://i.postimg.cc/Bsw-p2MfS/example.png" width="200">

## Funcionalidades

- Envio automatizado de convites via WhatsApp.
- Gerenciamento de confirmações de presença.
- Contagem e acompanhamento de fraldas por tamanho.
- Comandos de administração para gerenciar convidados e lembretes.
- Mensagens personalizáveis.

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes pré-requisitos instalados:

- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Uma conta de desenvolvedor do Facebook/Meta com acesso à API do WhatsApp Business.
- Modelos de mensagens para envio dos convites e envio de localização criadas no [Gerenciador do WhatsApp](https://business.facebook.com/latest/whatsapp_manager)
- ngrok (para execução local e testes de webhook).
- Apache (para configuração de proxy reverso em ambiente de produção).

## Modelos de Mensagens do Gerenciador de WhatsApp

Para que o Baby Shower Bot possa enviar mensagens proativas (como convites ou lembretes) aos seus convidados via WhatsApp Business API, é necessário utilizar **Modelos de Mensagens (Message Templates)**. Estes modelos são pré-aprovados pelo WhatsApp para garantir que as comunicações sejam de alta qualidade e não spam. 

### O que são Modelos de Mensagens?

Modelos de Mensagens são formatos de mensagens pré-definidos que você cria e submete para aprovação do WhatsApp. Eles são usados para iniciar conversas com usuários que não enviaram uma mensagem para você nas últimas 24 horas. Mensagens de sessão (respostas a mensagens de usuários dentro de 24 horas) não exigem modelos.

### Como criar e gerenciar Modelos de Mensagens?

Você pode criar e gerenciar seus Modelos de Mensagens através do **Gerenciador de WhatsApp** no Facebook Business Manager. Siga os passos gerais:

1.  **Acesse o Gerenciador de WhatsApp:** No seu Facebook Business Manager, navegue até a seção de WhatsApp.
2.  **Modelos de Mensagens:** Encontre a opção para gerenciar Modelos de Mensagens.
3.  **Criar Novo Modelo:** Clique em 'Criar Modelo de Mensagem' e siga as instruções para definir o nome, categoria, idioma e o corpo da mensagem.
    -   **Variáveis:** Você pode incluir variáveis no seu modelo usando `{{1}}`, `{{2}}`, etc. Por exemplo: `Olá {{1}}, você foi convidado para o chá de bebê de {{2}}!` Essas variáveis serão preenchidas dinamicamente pelo bot com dados como o nome do convidado.
    -   **Componentes:** Você pode adicionar cabeçalhos (texto, mídia), corpo, rodapé e botões (chamada para ação, resposta rápida).
4.  **Submissão para Aprovação:** Após criar o modelo, submeta-o para aprovação. O processo de aprovação geralmente leva de alguns minutos a algumas horas.

### Modelos de Mensagens para o Baby Shower Bot

Para o funcionamento completo do Baby Shower Bot, você precisará de modelos para:

-   **Convites Iniciais:** Mensagens para enviar aos convidados que ainda não confirmaram.
-   **Lembretes:** Mensagens para enviar aos convidados que já confirmaram (se a funcionalidade de lembrete for usada).

O bot utiliza a estrutura de templates do WhatsApp Business API. Abaixo estão exemplos de como os modelos de mensagens são construídos no código, que devem ser replicados no Gerenciador de WhatsApp:

#### Modelo de Convite

Este modelo é usado para enviar o convite inicial aos convidados. Ele espera um cabeçalho com uma imagem e parâmetros no corpo para personalizar a mensagem.

**Componentes esperados no Gerenciador de WhatsApp:**

-   **Cabeçalho (Header):** Tipo `image`. O `imageId` deve ser o ID da imagem que você carregou no Facebook Business Manager para ser usada como cabeçalho do convite.
-   **Corpo (Body):** Dois parâmetros de texto. O primeiro (`{{1}}`) será preenchido com o `guest.name` (nome do convidado) e o segundo (`{{2}}`) com `guest.diaper` (informação sobre fralda, se aplicável).

Exemplo de corpo de mensagem no Gerenciador de WhatsApp:
`Olá {{1}}, você foi convidado para o chá de bebê! Por favor, confirme sua presença. Não se esqueça de trazer fraldas tamanho {{2}}!`

#### Modelo de Lembrete

Este modelo é usado para enviar lembretes aos convidados que já confirmaram. Ele espera um cabeçalho com uma localização e um parâmetro no corpo.

**Componentes esperados no Gerenciador de WhatsApp:**

-   **Cabeçalho (Header):** Tipo `location`. A localização será preenchida com as coordenadas, nome e endereço definidos em `config.templates.reminder.location`.
-   **Corpo (Body):** Um parâmetro de texto. O primeiro (`{{1}}`) será preenchido com o `guest.name` (nome do convidado).

Exemplo de corpo de mensagem no Gerenciador de WhatsApp:
`Olá {{1}}, este é um lembrete para o chá de bebê que será em breve! Mal podemos esperar para te ver!`

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/ralves87/baby-shower-bot.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd baby-shower-bot
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, baseado no `.env.sample`, e preencha com suas credenciais:

```
# WhatsApp Business
WHATSAPP_TOKEN=SEU_TOKEN_DO_WHATSAPP_BUSINESS_API
WHATSAPP_PHONE_NUMBER_ID=SEU_ID_DO_NUMERO_DE_TELEFONE_DO_WHATSAPP
WHATSAPP_VERIFY_TOKEN=SEU_TOKEN_DE_VERIFICACAO_DO_WHATSAPP

# Admins
ADMINS=9999999999999,8888888888888

# Templates
# Invite
TEMPLATE_INVITE_NAME=NOME_DO_TEMPLATE_INVITE
TEMPLATE_INVITE_IMAGE_ID=ID_DA_IMAGEM_DE_CONVITE
# Reminder
TEMPLATE_REMINDER_NAME=NOME_DO_TEMPLATE_REMIMDER
TEMPLATE_REMINDER_LOCATION_LATITUDE=LATITUDE_DA_LOCALIZAÇÃO
TEMPLATE_REMINDER_LOCATION_LONGITUDE=LONGITUDE_DA_LOCALIZAÇÃO
TEMPLATE_REMINDER_LOCATION_NAME=NOME_DO_LOCAL
TEMPLATE_REMINDER_LOCATION_ADDRESS=ENDEREÇO_DO_LOCAL
```

- `WHATSAPP_TOKEN`: O token de acesso gerado pela API do WhatsApp Business.
- `WHATSAPP_PHONE_NUMBER_ID`: O ID do seu número de telefone do WhatsApp Business API.
- `WHATSAPP_VERIFY_TOKEN`: Um token de verificação que você define para validar o webhook do WhatsApp.
- `ADMINS`: Número de telefone dos adminstradores separados por virgula e com código do país, exemplo: 551198765432
- `TEMPLATE_INVITE_NAME`: Nome do template de mensagem de convite cadastrado na plataforma do WhatsApp Business.
- `TEMPLATE_INVITE_IMAGE_ID`: ID da imagem associada ao template de convite, usada para enviar imagens junto com a mensagem.
- `TEMPLATE_REMINDER_NAME`: Nome do template de mensagem de lembrete cadastrado na plataforma do WhatsApp Business.
- `TEMPLATE_REMINDER_LOCATION_LATITUDE`: Latitude do local que será enviado no lembrete, útil para compartilhar localização.
- `TEMPLATE_REMINDER_LOCATION_LONGITUDE`: Longitude do local que será enviado no lembrete.
- `TEMPLATE_REMINDER_LOCATION_NAME`: Nome do local que será exibido na mensagem de lembrete.
- `TEMPLATE_REMINDER_LOCATION_ADDRESS`: Endereço completo do local para ser exibido na mensagem de lembrete.

### Configuração Customizada (config.js)

O arquivo `config/config.js` permite personalizar diversas configurações do bot, incluindo prazos, administradores, comandos e mensagens. Abaixo estão as seções principais que podem ser ajustadas:

```javascript
export default {
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN || "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "",
  },
  deadlines: {
    confirmation: "2025-08-25T23:59:59" // Data limite para confirmação
  },
  admins: process.env.ADMINS ? process.env.ADMINS.split(",") : [],
templates: {
    language: "pt_BR", // Idioma dos modelos de mensagem
    invite: {
        name: process.env.TEMPLATE_INVITE_NAME || "", // Nome do modelo de convite (definido no Gerenciador do WhatsApp)
        imageId: process.env.TEMPLATE_INVITE_IMAGE_ID || "", // ID da imagem usada no cabeçalho do convite
    },
    reminder: {
        name: process.env.TEMPLATE_REMINDER_NAME || "", // Nome do modelo de lembrete (definido no Gerenciador do WhatsApp)
        location: {
            latitude: process.env.TEMPLATE_REMINDER_LOCATION_LATITUDE || "", // Latitude da localização do evento
            longitude: process.env.TEMPLATE_REMINDER_LOCATION_LONGITUDE || "", // Longitude da localização do evento
            name: process.env.TEMPLATE_REMINDER_LOCATION_NAME || "", // Nome do local do evento
            address: process.env.TEMPLATE_REMINDER_LOCATION_ADDRESS || "" // Endereço do evento
        }
    },
},
  commands: {
    admin: {
      send: "/ENVIAR", // Comando para enviar convites
      list: "/CONVIDADOS", // Comando para listar convidados
      missing: "/FRALDAS", // Comando para verificar fraldas faltantes
      reminder: "/LEMBRETE", // Comando para enviar lembretes
    },
    user: {
      confirm: "CONFIRMAR" // Comando para o usuário confirmar presença
    },
  },
  files: {
    guests: path.join(__dirname, "../data/guests.json"), // Caminho para o arquivo de convidados
    confirmations: path.join(__dirname, "../data/confirmations.json"), // Caminho para o arquivo de confirmações
  },
  diapers: { 
    P: 0, 
    M: 1, 
    G: 1 // Metas de fraldas por tamanho
  },
  messages: {
    confirmation_closed: "🚫 Infelizmente, o prazo para confirmação já terminou.\n\nSe tiver alguma dúvida, envie uma mensagem no privado para os responsáveis",
    confirmation: "🎉 Obrigado pela confirmação, te esperamos lá!",
    decline: "Que pena, sem problemas! Mas se mudar de ideia, é só mandar a qualquer momento uma mensagem com a palavra: *CONFIRMAR*",
    all_invites_sent: "Convites enviados com sucesso.",
    no_pending_invites: "Nenhum convite pendente para envio.",
    reminder_sent: "Lembretes enviados para todos os confirmados!"
  },
  titles: {
    confirmation_list: "📋 Lista de confirmações:",
    diapers_count: "🍼 Fraldas confirmadas x faltantes:",
    total_guests: "📊 Total de convidados:"
  },
  labels: {
    pending: "⏳ Pendente",
    confirmed: "✅ Confirmado",
    declined: "❌ Não irá",
    diapers: {
      size: {
        p: "P",
        m: "M",
        g: "G"
      },
      confirmed: "Confirmadas:",
      target: "Meta:",
      missing: "Faltam:"
    }
  },
  buttons: {
    confirm: {
      title: "Contem comigo",
      payload: "Contem comigo"
    },
    decline: {
      title: "Não poderei ir",
      payload: "Não poderei ir"
    }
  }
};
```

**Pontos importantes:**

- **`deadlines.confirmation`**: Altere a data e hora limite para as confirmações.
- **`admins`**: Adicione os números de telefone dos administradores que terão acesso aos comandos administrativos. Certifique-se de incluir o código do país (ex: `55` para Brasil) e o DDD.
- **`commands`**: Personalize os comandos que o bot irá reconhecer.
- **`files`**: Os caminhos para `guests.json` e `confirmations.json` são definidos aqui. Geralmente, não é necessário alterá-los.
- **`diapers`**: Defina as metas de fraldas por tamanho (P, M, G).
- **`messages`, `titles`, `labels`, `buttons`**: Personalize todas as mensagens, títulos, rótulos e textos dos botões que o bot utiliza para interagir com os usuários.

### Estrutura do guests.json

O arquivo `guests.json` armazena as informações dos convidados e é utilizado para o envio de convites. Ele deve ser um array de objetos, onde cada objeto representa um convidado. Este arquivo deve ser criado no diretório data.

```json
[
  { 
    "name": "Maria Silva", 
    "phone": "9999999999999"
  },
  { 
    "name": "João Pereira", 
    "phone": "9999999999999"
  }
]
```

**Campos:**

- `name`: O nome completo do convidado.
- `phone`: Numéro de telefone do convidado

### Estrutura do confirmations.json

O arquivo `confirmations.json` armazena as informações dos convidados e é utilizado para o envio de convites. Ele deve ser um array de objetos, onde cada objeto representa um convidado. Embora o arquivo não esteja presente no repositório, sua estrutura é inferida pelo uso no `config.js` e pela funcionalidade do bot. Um exemplo de estrutura seria:

**Importante:**
O arquivo confirmations.json é gerado automaticamente quando o comando de enviar os convites é acionado. Não é necessário criar o arquivo manualmente.

```json
[
  {
    "id": "9999999999999",
    "name": "Maria Silva",
    "status": "pending",
    "diaper_size": "P",
    "message_sent": false
  },
  {
    "id": "9999999999999",
    "name": "João Pereira",
    "status": "pending",
    "diaper_size": "G",
    "message_sent": false
  }
]
```

**Campos:**

- `id`: O número de telefone do convidado (com código do país e DDD).
- `name`: O nome completo do convidado.
- `status`: O status da confirmação (`pending`, `confirmed`, `declined`).
- `diaper_size`: O tamanho da fralda que o convidado confirmou que trará (ex: `P`, `M`, `G`). Pode ser `null` se não houver confirmação de fralda.
- `message_sent`: Um booleano indicando se a mensagem de convite já foi enviada para este convidado.

## Execução Local com ngrok

Para testar o bot localmente e permitir que o WhatsApp se comunique com sua máquina, você pode usar o ngrok. O ngrok cria um túnel seguro para seu localhost.

1. Inicie o bot:

   ```bash
   npm start
   ```

   O bot estará rodando na porta 3000 por padrão.

2. Em um novo terminal, inicie o ngrok apontando para a porta do seu bot:

   ```bash
   ngrok http 3000
   ```

3. O ngrok irá gerar uma URL pública (ex: `https://xxxxxx.ngrok.io`). Copie esta URL.

4. No painel de desenvolvedor do Facebook/Meta, configure o webhook da sua aplicação WhatsApp Business API para apontar para esta URL do ngrok, adicionando `/webhook` ao final (ex: `https://xxxxxx.ngrok.io/webhook`). Certifique-se de que o `WHATSAPP_VERIFY_TOKEN` no seu arquivo `.env` corresponda ao token de verificação configurado no Facebook.

## Proxy Reverso com Apache

Para implantar o bot em um servidor de produção, é recomendável usar um proxy reverso com Apache. Isso permite que o Apache gerencie as requisições HTTP/HTTPS e as encaminhe para a sua aplicação Node.js, que pode estar rodando em uma porta diferente.

1. Certifique-se de que o Apache esteja instalado e configurado no seu servidor.

2. Habilite os módulos `mod_proxy` e `mod_proxy_http` no Apache:

   ```bash
   sudo a2enmod proxy proxy_http
   ```

3. Crie um novo arquivo de configuração de Virtual Host para o seu bot (ex: `/etc/apache2/sites-available/baby-shower-bot.conf`):

   ```apache
   <VirtualHost *:80>
       ServerName seu_dominio.com
       ProxyPreserveHost On

       ProxyPass / http://localhost:3000/
       ProxyPassReverse / http://localhost:3000/
   </VirtualHost>
   ```

   - Substitua `seu_dominio.com` pelo seu domínio real.
   - `http://localhost:3000` deve ser o endereço e porta onde sua aplicação Node.js está rodando no servidor.

4. Habilite o novo site e reinicie o Apache:

   ```bash
   sudo a2ensite baby-shower-bot.conf
   sudo systemctl restart apache2
   ```

5. Configure o webhook do WhatsApp Business API para apontar para `https://seu_dominio.com/webhook`.

## Integração com brdid.com.br (Opcional)

Se você precisar de um número virtual para o WhatsApp Business API, o brdid.com.br é uma opção para alugar números virtuais. Embora a integração direta com o brdid.com.br não seja parte do código deste bot, você pode usar os serviços deles para obter um número que será configurado na sua conta do WhatsApp Business API no Facebook/Meta.

1. Acesse o site [brdid.com.br](https://brdid.com.br/).
2. Siga as instruções para alugar um número virtual.
3. Uma vez que você tenha o número, siga as instruções do Facebook/Meta para registrá-lo e configurá-lo com a API do WhatsApp Business. Este processo geralmente envolve a verificação do número através de um código enviado via SMS ou chamada de voz para o número virtual.

## Comandos

Os comandos podem ser enviados para o bot via WhatsApp. Os comandos de administração são restritos aos números listados na configuração `admins`.

**Comandos de Administração:**

- `/ENVIAR`: Envia convites para todos os convidados pendentes no `guests.json`.
- `/CONVIDADOS`: Lista o status de confirmação de todos os convidados.
- `/FRALDAS`: Exibe a contagem de fraldas confirmadas e as metas.
- `/LEMBRETE`: Envia lembretes para os convidados que já confirmaram presença.

**Comandos de Usuário:**

- `CONFIRMAR`: O usuário envia esta mensagem para confirmar sua presença.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Copyright (C) 2025 by Rafael Alves

A permissão é concedida , a título gratuito , a qualquer pessoa que obtenha uma cópia deste software e dos arquivos de documentação associados (o "Software") , para lidar com o Software sem restrição , incluindo, sem limitação, os direitos de usar, copiar, modificar, mesclar , publicar, distribuir , sublicenciar e / ou vender cópias do Software, e permitir que as pessoas a quem o Software é fornecido a fazê-lo , observadas as seguintes condições:

O aviso de copyright acima e este aviso de permissão devem ser incluídos em todas as cópias ou partes substanciais do Software.

O SOFTWARE É FORNECIDO "COMO ESTÁ" , SEM GARANTIA DE QUALQUER TIPO, EXPRESSA OU IMPLÍCITA, INCLUINDO , SEM LIMITAÇÃO, AS GARANTIAS DE COMERCIALIZAÇÃO, ADEQUAÇÃO A UM DETERMINADO FIM E NÃO VIOLAÇÃO. EM NENHUM CASO OS AUTORES OU DETENTORES DE DIREITOS AUTORAIS SERÁ RESPONSÁVEL POR QUALQUER RECLAMAÇÃO, DANOS OU OUTRA RESPONSABILIDADE, SEJA EM UMA AÇÃO DE CUMPRIMENTO DE CONTRATO OU DE OUTRA FORMA, DECORRENTES DE OU EM RELAÇÃO AO SOFTWARE OU O USO OU OUTRAS FUNÇÕES DO SOFTWARE.
