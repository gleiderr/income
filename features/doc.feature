#language: pt
Funcionalidade: Documentação
  O desenvolvedor deseja escrever e salvar documentação em markdown e visualizar em HTML.

  Cenário: Digitação do markdown
    Dado o seguinte texto markdown:
      """
      # Título
      Texto
      """
    E a documentação exibindo o cabeçalho
    Quando o desenvolvedor desabilitar a visualização
    E digitar o texto markdown
    E clicar sobre salvar
    Então o texto deve ser salvo
    E o texto deve ser exibido