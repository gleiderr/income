#language: pt
Funcionalidade: Seleção e edição de múltiplas documentações
  Todo usuário deseja selecionar documentações independentes entre si. E o desenvolvedor deseja editá-las.

  @puppeteer
  Cenário: Seleção de documentação
    Dado o INCOME acessado
    Quando a documentação raíz abaixo estiver presente no banco de dados
      """
      Documentação raíz
      """
    E a documentação 1 abaixo estiver presente no banco de dados
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

  @puppeteer
  Cenário: Tentativa de acesso a documentações que não existem

  @puppeteer
  Cenário: Edição de documentações
    Dado um usuário administrador
    E a documentação raíz abaixo
      """
      Documentação raíz
      """
    E a documentação 1 abaixo
      """
      Documentação 1
      """
    E a documentação 2 abaixo
      """
      Documentação 2
      """
    E o INCOME acessado
    Quando o usuário incluir a documentação raíz
    E salvá-la
    E o usuário acessar a url '1'
    E o usuário incluir a documentação '1'
    E salvá-la
    E o usuário acessar a url '2'
    E o usuário incluir a documentação '2'
    E salvá-la
    E recarregar a página
    Então deve ser acessada a documentação raíz através do link raíz
    E deve ser acessada a documentação 1 através do link 1
    E deve ser acessada a documentação 2 através do link 2