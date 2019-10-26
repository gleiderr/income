#language: pt
Funcionalidade: Chat
  Eu desejo enviar mensagens, ler mensagens minhas e de outros.
  
  Esquema do Cenário: Usuário deseja enviar mensagens ao desenvolvedor utilizando "Enter"
    Dado o remetente '<remetente>'
    E nenhuma mensagem enviada
    E chat renderizado pelo '<remetente>'
    Quando o '<remetente>' digitar a mensagem '<mensagem>'
    E teclar 'Enter'
    Então o texto digitado deve ser limpo
    E uma mensagem deve ser exibida para o '<remetente>'
    E nessa mensagem "autor" contém '<remetente>'
    E nessa mensagem "texto" contém '<mensagem>'

    Exemplos:
    | remetente | mensagem          |
    | joão      | Olá, bom dia!     |
    | pedro     | Boa tarde pessoas |

  Esquema do Cenário: Mensagem do <remetente> lida por desenvolvedor conectado simultaneamente
    Dado o remetente '<remetente>'
    E nenhuma mensagem enviada
    E chat renderizado pelo '<remetente>'
    E chat renderizado pelo 'desenvolvedor'
    Quando o '<remetente>' digitar a mensagem '<mensagem>'
    E teclar 'Enter'
    Então uma mensagem deve ser exibida para o 'desenvolvedor'
    E uma mensagem deve ser exibida para o '<remetente>'

  Exemplos:
    | remetente | mensagem          |
    | joão      | Olá, bom dia!     |

  Cenário: Usuário não conectado deseja enviar mensagens
    Dado o remetente ''
    E nenhuma mensagem enviada
    E chat renderizado pelo ''
    Quando o '' digitar a mensagem 'Olá bom dia'
    E teclar 'Enter'
    Então deve ser emitido alerta 'Conecte-se para enviar mensagens'

  #Cenário: Usuário não conectado deseja enviar mensagens
  #Cenário: Usuário deseja ler mensagens
  #Cenário: Todo usuário deseja saber quando uma mensagem foi lida pelo destinatário
  #Cenário: Todo usuário deseja ler mensagens de seu interesse
