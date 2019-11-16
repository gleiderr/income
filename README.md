# INCOME

Toda documentação não técnica e discussões podem ser acessadas em http://gleider.ml/income

O INCOME utiliza 
- React(JavaScript) como linguagem de programação.
- Google Firebase como base de dados
- Markdown para documentação simples e ágil
- BDD utilizando Cucumber para testes automatizados centrados no usuário
- Google Material Design, pensando primeiramente em Smartphones
- Versionamento em Github
- VSCode para desenvolvimento

### Módulo Chat
Módulo de comunicação ágil entre todos os interessados por determinada solução. Desenvolvido visando a independência de outros módulos, pois futuramente poderá ser utilizado juntamente com outras aplicações.

Envio de mensagens pode ser realizado utilizando "Enter" ou botão de envio.

#### Mensagens

A estrutura de cada mensagem é dada pelo modelo abaixo.

```json
"id": {
  "autor": "autor_id",
  "texto": "minha mensagem",
  "timestamp": "timestamp",
}
```

- **`autor`**: Autor;
- **`texto`**: Texto da mensagem;
- **`timestamp`**: é definido pelo próprio servidor e representa o momento que a mensagem é gravada na base de dados. É utilizado para ordenar as mensagens apropriadamente.

### Módulo de Documentação
Módulo pensado também para ser independente de outros módulos.
Utiliza a linguagem Markdown para escrita da documentação e permite a conversão e  visualização em HTML.

Somente é gravado o texto Markdown.

### Módulo INCOME
Módulo que integra Chat e Documentação

### Regras de segurança
#### Perfil de Usuário

|                  | Criar | Ler  | Alterar | Excluir |
|:-----------------|:-----:|:----:|:-------:|:-------:|
|**Todos**         | não   | não  | não     | não     |
|**Comum**         | sim*  | sim* | não     | não     |
|**Administrador** | sim*  | sim* | não     | não     |
*Desde que seja o dono do perfil

#### Mensagens

|                  | Criar | Ler | Alterar | Excluir |
|:-----------------|:-----:|:---:|:-------:|:-------:|
|**Todos**         | não   | sim | não     | não     |
|**Comum**         | sim*  | sim | não     | não     |
|**Administrador** | sim*  | sim | não     | não     |
*Desde que seja o autor

#### Documentação

|                  | Criar | Ler | Alterar | Excluir |
|:-----------------|:-----:|:---:|:-------:|:-------:|
|**Todos**         | não   | sim | não     | não     |
|**Comum**         | não   | sim | não     | não     |
|**Administrador** | sim   | sim | sim     | não     |
