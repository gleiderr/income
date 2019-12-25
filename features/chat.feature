#language: pt
Funcionalidade: Chat
  Eu desejo enviar mensagens, ler mensagens minhas e de outros.
  
  Esquema do Cenário: Usuário deseja enviar mensagens ao desenvolvedor
    Dado o remetente '<remetente>'
    E nenhuma mensagem enviada
    E chat renderizado pelo '<remetente>'
    Quando o '<remetente>' digitar a mensagem '<mensagem>'
    E enviar mensagem
    Então o texto digitado deve ser igual a '' 
    E uma mensagem deve ser exibida para o '<remetente>'
    E nessa mensagem "autor" contém '<remetente>'
    E nessa mensagem "texto" contém '<mensagem>'

    Exemplos:
    | remetente | mensagem          |
    | joão      | Olá, bom dia!     |
    | pedro     | Boa tarde pessoas |

  Cenário: Mensagem do <remetente> lida por desenvolvedor conectado simultaneamente
    Dado o remetente 'joão'
    E nenhuma mensagem enviada
    E chat renderizado pelo 'joão'
    E chat renderizado pelo 'desenvolvedor'
    Quando o 'joão' digitar a mensagem '<mensagem>'
    E enviar mensagem
    Então uma mensagem deve ser exibida para o 'desenvolvedor'
    E uma mensagem deve ser exibida para o 'joão'

  #Usuários não conectados não recebem nome no chat
  Cenário: Usuário não conectado deseja enviar mensagens
    Dado o remetente ''
    E nenhuma mensagem enviada
    E chat renderizado pelo ''
    Quando o '' digitar a mensagem 'Olá bom dia'
    E enviar mensagem 
    Então o texto digitado deve ser igual a 'Olá bom dia'

  #Cenário somente poderá ser testado quano "mocar" testes com puppeteer
  Cenário: eventos de rolagem do scroll