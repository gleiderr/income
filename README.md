# INCOME (0.1.0)

Código fonte: https://github.com/gleiderr/income

> "O desenvolvimento de software é um jogo de invenção e comunicação cuja principal medida de sucesso é o software funcionando" (Alistair Cockburn, 2001)

O INCOME é composto por dois módulos principais. Este **módulo de documentação** que você está lendo é onde estão as principais especificações de como nossos softwares funcionam. Já o **módulo de chat** é onde toda a interação com nossos usuários e colaboradores acontece.

O ambiente possui compatibilidade com dispositivos móveis e desktops, com prioridade aos dispositivos móveis.

## Módulo de Documentação

Esse módulo permite o acesso às documentações diretamente via URL. As edições são acompanhadas em tempo real pelos usuários. Ou seja, quando o desenvolvedor editar uma documentação os usuários conectados verão a modificação imediatamente, sem necessidade de atualização da página.

Os usuários podem acessar as diversas documentações diretamente via URL ou através de links que podem estar presentes na própria documentação ou em sites externos.

Apenas o usuário desenvolvedor pode criar e editar documentações. Para criação ou edição bastar acessar a URL escolhida e editá-la utilizando [markdown](https://pt.wikipedia.org/wiki/Markdown)). Essa URL será utilizada como endereço permanente para a documentação.

Quando um usuário acessar uma URL sem documentação correspondente, então será exibida uma mensagem incentivando-o a enviar uma sugestão de documentação e será apresentado um link para a URL raíz.

## Módulo Chat

Esse simples chat amplifica a capacidade de comunicação entre desenvolvedores e usuários. Essa comunicação é feita em tempo real e o único pré-requisito para tal é que o usuário conecte-se ao INCOME com usuário e senha.

As mensagens são exibidas na ordem que são recebidas pelo nosso servidor e por simplicidade exibem somente o nome do usuário e o conteúdo da mensagem.

Para cada documentação existe um chat relacionado. Assim os usuários podem comunicar-se dentro de contextos específicos.

## Novidades dessa versão

- Gerenciar diversas documentações e diversos chats;
  - Referenciamento via URL;
- Cabeçalho comum ao chat e à documentação;

## Novas sugestões

- Criar links internos que não exijam o recarregamento da página;
- Criar breadcrumbs para navegação fácil entre documentações;
- Criar cabeçalho com acesso ás diversas documentações;

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
- Somente o desenvolvedor pode acessar criar novos contextos para documentações ou chats.
