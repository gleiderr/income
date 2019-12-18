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
    Quando o desenvolvedor "desabilitar" a visualização
    E digitar o texto markdown
    E clicar sobre salvar
    E o desenvolvedor "habilitar" a visualização
    Então o texto deve ser salvo
    E o seguinte conteúdo deve ser exibido:
      """
      <h1 id="título">Título</h1>
      <p>Texto</p>
      """

  Esquema do Cenário: Estados intermediários do botão salvar