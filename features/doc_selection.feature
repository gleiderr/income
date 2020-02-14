#language: pt
Funcionalidade: Seleção e edição de múltiplas documentações
  Todo usuário deseja selecionar documentações independentes entre si. E o desenvolvedor deseja editá-las.

  Esquema do Cenário: Seleção de documentação
    O INCOME acessado
    Dada a documentação 1 abaixo
      """
      Documentação 1
      """
    E a documentação 2 abaixo
      """
      Documentação 2
      """
    Quando o usuário selecionar a documentação <n>
    Então deve ser exibida a documentação abaixo
      """
      Documentação <n>
      """
  Exemplos:
    | n |
    | 1 |
    | 2 |

