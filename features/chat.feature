#language: pt
Funcionalidade: Chat
  Eu desejo enviar e responder mensagens, receber respostas e ler mensagens de outros. Tudo isso da forma mais simples possível.
  
  Esquema do Cenário: Usuário deseja enviar mensagens ao desenvolvedor utilizando "Enter"
    Dado o remetente '<remetente>'
    E o destinatário 'desenvolvedor'
    E nenhuma mensagem enviada
    E chat renderizado pelo '<remetente>' às '17/11/2019 às 14:30'
    Quando o '<remetente>' digitar a mensagem '<mensagem>'
    E teclar 'Enter'
    Então o texto digitado deve ser limpo
    E uma mensagem deve ser exibida para o '<remetente>'
    E nessa mensagem "autor" contém ''
    E nessa mensagem "texto" contém '<mensagem>'
    E nessa mensagem "entrega" contém 'aguardando'

    Exemplos:
    | remetente | mensagem          |
    | joão      | Olá, bom dia!     |
    | pedro     | Boa tarde pessoas |

  Esquema do Cenário: Mensagem do <remetente> lida por desenvolvedor conectado simultaneamente
    Dado o remetente '<remetente>'
    E o destinatário 'desenvolvedor'
    E nenhuma mensagem enviada
    E chat renderizado pelo '<remetente>' às '17/11/2019 às 14:30'
    E chat renderizado pelo 'desenvolvedor' às '17/11/2019 às 14:30'
    Quando o '<remetente>' digitar a mensagem '<mensagem>'
    E teclar 'Enter'
    Então uma mensagem deve ser exibida para o 'desenvolvedor'
    E uma mensagem deve ser exibida para o '<remetente>'
    E nessa mensagem "leitura" contém 'desenvolvedor leu em 17/11/2019 às 14:30'

  Exemplos:
    | remetente | mensagem          |
    | joão      | Olá, bom dia!     |

  Esquema do Cenário: Mensagem do <remetente> lida por desenvolvedor duas vezes
    Dado o remetente '<remetente>'
    E o destinatário 'desenvolvedor'
    E nenhuma mensagem enviada
    Quando chat renderizado pelo '<remetente>' às '16/11/2019 às 14:30'
    E o '<remetente>' digitar a mensagem '<mensagem>'
    E teclar 'Enter'
    E chat renderizado pelo 'desenvolvedor' às '17/11/2019 às 14:30'
    E chat desconectado pelo 'desenvolvedor'
    E chat renderizado pelo 'desenvolvedor' às '18/11/2019 às 14:30'
    Então uma mensagem deve ser exibida para o 'desenvolvedor'
    E uma mensagem deve ser exibida para o '<remetente>'
    E nessa mensagem "leitura" contém 'desenvolvedor leu em 17/11/2019 às 14:30'

  Exemplos:
    | remetente | mensagem          |
    | joão      | Olá, bom dia!     |

  #Cenário: Usuário não conectado deseja enviar mensagens
  #Cenário: Usuário deseja ler mensagens
  #Cenário: Todo usuário deseja saber quando uma mensagem foi lida pelo destinatário
  #Cenário: Todo usuário deseja ler mensagens de seu interesse
