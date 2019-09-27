#language: pt
Funcionalidade: Chat
  Eu desejo enviar e responder mensagens, receber respostas e ler mensagens de outros. Tudo isso da forma mais simples possível.
  
  Esquema do Cenário: Usuário deseja enviar mensagens ao desenvolvedor utilizando "Enter"
    Dado o remetente '<remetente>'
    E o destinatário 'desenvolvedor'
    E nenhuma mensagem enviada
    E o chat renderizado
    Quando o usuário digitar a mensagem '<mensagem>'
    E teclar 'Enter'
    Então o texto digitado deve ser limpo
    E uma mensagem deve ser exibida para o usuário
    E o campo "autor" deve ser igual a ''
    E o campo "texto" deve ser igual a '<mensagem>'
    E o campo "entrega" deve ser igual a 'aguardando'

    Exemplos:
    | remetente | mensagem          |
    | joão      | Olá, bom dia!     |
    | pedro     | Boa tarde pessoas |


  #Cenário: Usuário não conectado deseja enviar mensagens
  #Cenário: Usuário deseja ler mensagens
  #Cenário: Todo usuário deseja saber quando uma mensagem foi lida pelo destinatário
  #Cenário: Todo usuário deseja ler mensagens de seu interesse
