# INCOME (0.1.0)

Código fonte: https://github.com/gleiderr/income

> "O desenvolvimento de software é um jogo de invenção e comunicação cuja principal medida de sucesso é o software funcionando" (Alistair Cockburn, 2001)

O INCOME é uma ferramenta para desenvolvimento de ideias a partir da comunicação e da demonstração das soluções desenvolvidas. Cada ambiente de desenvolvimento possui seu próprio endereço (URL).

Apenas o usuário desenvolvedor pode criar ou editar novos ambientes. Para criação bastar acessar o endereço do ambiente e proceder como se já existisse. Ao salvar qualquer documentação ou interagir no chat, a criação do endereço estará efetivada.

Quando um usuário comum acessa um ambiente inexistente, então é exibida uma mensagem indicando a inexistência e ele é redirecionado ao caminho raíz.

O INCOME é composto por dois módulos principais. Este **módulo de documentação** que você está lendo contém as principais especificações de como os sistemas funcionam. Já o **módulo de chat** é onde toda a comunicação com os usuários e colaboradores acontece.

O ambiente possui compatibilidade com dispositivos móveis e desktops, com prioridade aos dispositivos móveis.

## Módulo de Documentação

Esse módulo destina-se ao texto descritivo dos sistemas. As edições são acompanhadas em tempo real pelos usuários. Ou seja, quando o desenvolvedor edita uma documentação os usuários conectados imediatamente veem a modificação, sem necessidade de atualização da página.

A documentação é redigida utilizando a linguagem [markdown](https://pt.wikipedia.org/wiki/Markdown)).

## Módulo Chat

Esse simples chat amplifica a capacidade de comunicação entre desenvolvedores e usuários. Essa comunicação é feita em tempo real e o único pré-requisito para tal é que o usuário conecte-se ao INCOME com usuário e senha.

As mensagens são exibidas na ordem que são recebidas pelo nosso servidor e por simplicidade exibem somente o nome do usuário e o conteúdo da mensagem.

Para cada ambiente existe um chat relacionado. Isso permite que os usuários comuniquem-se dentro de contextos específicos.

## Novidades dessa versão

- Gerenciar diversas documentações e diversos chats;
  - Referenciamento via URL;
- Cabeçalho comum ao chat e à documentação;

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
