#language: pt
Funcionalidade: Documentação
  O desenvolvedor deseja escrever e salvar documentação em markdown e visualizar em HTML.

  Cenário: Estado inicial do botão salvar
    Quando a documentação for exibida
    Então o botão deve ser exibido "normal"

  Cenário: Estado intermediário do botão salvar
    Quando a documentação for exibida
    E o desenvolvedor clicar sobre salvar
    Então o botão deve ser exibido "aguardando"

  Cenário: Estado final do botão salvar
    Quando a documentação for exibida
    E o desenvolvedor clicar sobre salvar
    E o sistema confirmar o salvamento
    Então o botão deve ser exibido "normal"

  Cenário: Digitação do markdown
    Dado o seguinte texto markdown:
      """
      # Título
      Texto
      """
    Quando a documentação for exibida
    E o desenvolvedor "desabilitar" a visualização
    E o desenvolvedor digitar o texto markdown
    E o desenvolvedor clicar sobre salvar
    E o desenvolvedor "habilitar" a visualização
    Então o seguinte conteúdo deve ser exibido:
      """
      <h1 id="título">Título</h1>
      <p>Texto</p>
      """