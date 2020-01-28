# INCOME (0.1.0)
Código fonte: https://github.com/gleiderr/income

> "O desenvolvimento de software é um jogo de invenção e comunicação cuja principal medida de sucesso é o software funcionando" (Alistair Cockburn, 2001)

O INCOME é composto por dois módulos principais. Este **módulo de documentação** que você está lendo é onde estão as principais especificações de como nossos softwares funcionam. Já o **módulo de chat** é onde toda a interação com nossos usuários e colaboradores acontece.

## Módulo de Documentação
Esse módulo permite que o desenvolvedor escreva a documentação de forma simples ([markdown](https://pt.wikipedia.org/wiki/Markdown)) e que suas edições sejam acompanhadas em tempo real por seus usuários. Ou seja, quando o desenvolvedor salvar sua documentação os usuários conectados verão a edição imediatamente, sem necessidade de atualização da página.

## Módulo Chat
Esse simples chat amplifica a capacidade de comunicação entre desenvolvedores e usuários. Essa comunicação é feita em tempo real e o único pré-requisito para tal é que o usuário conecte-se com usuário e senha.

As mensagens são exibidas na ordem que são recebidas pelo nosso servidor e exibem somente o nome do usuário e o conteúdo da mensagem.

## Tecnologias utilizadas

O INCOME utiliza 
- React(JavaScript) como linguagem de programação.
- Google Firebase como base de dados
- Markdown para documentação simples e ágil
- BDD utilizando Cucumber para testes automatizados centrados no usuário
- Google Material Design, pensando primeiramente em smartphones
- Versionamento em Github
- VSCode para desenvolvimento

## Regras de segurança
- **Perfil de usuário:** Somente o usuário conectado pode criar um perfil para si e somente ele tem permissão de leitura sobre seu próprio perfil;
- **Mensagens:** Todos os usuários podem ler qualquer mensagem do chat. Porém, somente usuários conectados podem criar suas próprias mensagens. E ninguém pode alterar ou excluir mensagens;
- **Documentação:** Todos os usuários têm permissão de leitura sobre a documentação, mas somente o administrador pode criar ou modificar documentações.
