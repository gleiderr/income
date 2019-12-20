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
    | remetente | mensagem          | comando |
    | joão      | Olá, bom dia!     | Enter   |
    | pedro     | Boa tarde pessoas | Botão   |

  Esquema do Cenário: Mensagem do <remetente> lida por desenvolvedor conectado simultaneamente
    Dado o remetente '<remetente>'
    E nenhuma mensagem enviada
    E chat renderizado pelo '<remetente>'
    E chat renderizado pelo 'desenvolvedor'
    Quando o '<remetente>' digitar a mensagem '<mensagem>'
    E enviar mensagem
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
    E enviar mensagem 
    Então o texto digitado deve ser igual a 'Olá bom dia'

  #Cenário: Usuário não conectado deseja enviar mensagens
  #Cenário: Usuário deseja ler mensagens
  #Cenário: Todo usuário deseja saber quando uma mensagem foi lida pelo destinatário
  #Cenário: Todo usuário deseja ler mensagens de seu interesse
