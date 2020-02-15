#language: pt
Funcionalidade: Seleção e edição de múltiplas documentações
  Todo usuário deseja selecionar documentações independentes entre si. E o desenvolvedor deseja editá-las.

  Esquema do Cenário: Seleção de documentação
    Dado o INCOME acessado
    Quando a documentação raíz abaixo estiver presente no banco de dados
      """
      Documentação raíz
      """
    Quando a documentação 1 abaixo estiver presente no banco de dados
      """
      Documentação 1
      """
    E a documentação 2 abaixo estiver presente no banco de dados
      """
      Documentação 2
      """
    Então deve ser acessada a documentação raíz através do link raíz
    E deve ser acessada a documentação 1 através do link 1
    E deve ser acessada a documentação 2 através do link 2

  Esquema do Cenário: Edição de documentações
    Dado um usuário administrador
    E o INCOME acessado
    E a documentação 1 abaixo presente no banco de dados
      """
      Documentação 1
      """
    E a documentação 2 abaixo presente no banco de dados
      """
      Documentação 2
      """
    Quando o adminstrador clicar sobre "Nova Documentação"
    E incluir a documentação 1
    E salvá-la
    E o adminstrador clicar sobre "Nova Documentação"
    E incluir a documentação 2
    E salvá-la
    E recarregar a página
    Então deve ser acessada a documentação raíz através do link raíz
    E deve ser acessada a documentação 1 através do link 1
    E deve ser acessada a documentação 2 através do link 2