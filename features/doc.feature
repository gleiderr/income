#language: pt
Funcionalidade: Documentação
  Desenvolvedor deseja escrever e salvar documentação em markdown e visualizar em HTML.

  Cenário: Digitação do markdown
    Dado o texto
      """
      # Título
      Texto
      """
    Quando digitar o texto
    E clicar sobre salvar
    Então o texto deve ser salvo
    E o texto deve ser exibido