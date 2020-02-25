#language: pt
Funcionalidade: Acesso a documentação e comunicação em um único ambiente
  Eu, como interessado numa invenção, desejo ter minhas ferramentas de invenção e comunicação integradas em um único ambiente que minimize a troca de contextos durante o processo de criação.

  Cenário: Acesso a documentação e chat em ambiente desktop
    Dado um ambiente 'desktop'
    E o INCOME acessado
    Então deve ser exibida a documentação
    E deve ser exibido o chat

  Cenário: Acesso à documentação em dispositivo móvel
    Dado um ambiente 'móvel'
    E o INCOME acessado
    Então deve ser exibida a documentação
    E não deve ser exibido o chat

  Cenário: Acesso ao chat em dispositivo móvel
    Dado um ambiente 'móvel'
    E o INCOME acessado
    Quando o usuário clicar sobre o botão chat
    Então deve ser exibido o chat
    E não deve ser exibida a documentação

  Cenário: Acesso ao chat e depois à documentação em dispositivo móvel
    Dado um ambiente 'móvel'
    E o INCOME acessado
    Quando o usuário clicar sobre o botão 'chat'
    E clicar sobre o botão 'voltar'
    Então deve ser exibida a documentação
    E não deve ser exibido o chat

  Cenário: Redimensionamento interativo do chat em dispositivo móvel
    Dado um ambiente 'móvel'
    E o INCOME acessado
    Quando o usuário clicar sobre o botão 'chat'
    E o usuário redimensionar a tela para a metade do tamanho inicial
    Então os componentes devem ser redimensionados apropriadamente

Cenário: Redimensionamento interativo da documentação em dispositivo móvel
    Dado um ambiente 'móvel'
    E o INCOME acessado
    Quando o usuário clicar sobre o botão 'chat'
    E o usuário redimensionar a tela para a metade do tamanho inicial
    Então os componentes devem ser redimensionados apropriadamente