#language: pt
Funcionalidade: Documentação
  Desenvolvedor deseja escrever e salvar documentação em markdown e visualizar em HTML.

  Cenário: Digitação do markdown
    Dado o texto markdown:
      """
      # Título
      Texto
      """
    E a documentação renderizada 'exibindo' o cabeçalho
    Quando habilitar a edição
    E digitar o texto
    E clicar sobre salvar
    Então o texto deve ser salvo
    E o texto deve ser exibido