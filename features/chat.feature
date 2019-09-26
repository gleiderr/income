#language: pt
Funcionalidade: Chat
  Eu desejo enviar mensagens espontaneamente, responder mensagens, receber respostas e ler mensagens de outros. Tudo isso da forma mais ágil possível.
  #Quando o digitar a mensagem 'oi'
  
  Cenário: Usuário conectado deseja enviar mensagens ao desenvolvedor utilizando "Enter"
    Dado o usuário 'a' conectado
    E o destinatário 'desenvolvedor'
    E o chat renderizado
    Quando o usuário digitar a mensagem 'Olá, bom dia!'
    E teclar 'Enter'
    Então o texto digitado deve estar limpo


  Cenário: Usuário não conectado deseja enviar mensagens
  Cenário: Usuário deseja ler mensagens
  Cenário: Todo usuário deseja saber quando uma mensagem foi lida pelo destinatário
  Cenário: Todo usuário deseja ler mensagens de seu interesse
