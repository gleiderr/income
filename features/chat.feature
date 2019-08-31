#language: pt
#language: pt
Funcionalidade: Chat em torno de um projeto
  Eu como usuário comunicativo desejo informar minha necessidade ao desenvolvedor e obter uma resposta do desenvolvedor o mais rápido possível.
  Eu como desenvolvedor desejo mapear quem são os interessados em determinada funcionalidade para comunicar-lhes efetivamente sobre seu desenvolvimento.
  
  Cenário: Todo usuário deseja ler as mensagens
  
  Cenário: Todo usuário deseja saber quando uma mensagem foi lida pelo destinatário
    Dado que o usuário enviou uma mensagem
    E o administrador leu
    Então deve ser exibida a data de leitura na mensagem
  
  Cenário: Todo usuário deseja ler mensagens de seu interesse
    Dado que foi acessado o projeto "Sistema de Projetos"
    Então devem ser exibidas as 50 últimas mensagens
    E as mensagens devem ser ordenadas cronologicamente
    E as mensagens devem ser sobre o assunto "Sistema de Projetos"
  
  Cenário: Usuário deseja enviar mensagens

######################################## não fazer daqui para baixo
Funcionalidade: Chat em torno de um projeto
  Eu como usuário comunicativo desejo informar minha necessidade ao desenvolvedor e obter uma resposta do desenvolvedor o mais rápido possível.
  Eu como usuário tímido desejo consultar as documentações e solicitações de outros usuários para saber se alguém já mencionou o que preciso.
  Eu como desenvolvedor desejo mapear quem são os interessados em determinada funcionalidade para comunicar-lhes efetivamente sobre seu desenvolvimento.
  
  Cenário: Todo usuário deseja ler as mensagens públicas
  
  Cenário: Todo usuário deseja saber quando uma mensagem foi lida pelo destinatário
  
  Cenário: Todo usuário não logado deseja ler mensagens de seu interesse
    Dado que foi acessado o projeto "Sistema de Projetos"
    Então devem ser exibidas as 50 últimas mensagens 
    E as mensagens devem ser sobre o assunto "Sistema de Projetos"
  
  Cenário: Todo usuário logado deseja ler mensagens ordenadas sob determinada prioridade
    Dado que usuário está logado
    Então o usuário deseja ver as mensagens ordenadas cronologicamente
    E primeiro as respostas a suas próprias mensagens
    E segundo as respostas aos assuntos de seu interesse
    E terceiro as mensagens a outros assuntos
  
  Cenário: Usuário comunicativo deseja enviar mensagens públicas
  Cenário: Usuário comunicativo não se importa de as respostas a suas mensagens públicas 
  
  Cenário: Usuário tímido deseja enviar mensagens somente ao desenvolvedor
  Cenário: Usuário tímido deseja as respostas a mensagens privadas permaneçam privadas
  
  Cenário: Desenvolvedor deseja responder publicamente a outros usuários
 
  Cenário: Desenvolvedor deseja responder privadamente a outros usuários
    Então as mensagem respondida deve tornar-se privada
  
  Cenário: O desenvolvedor deseja ler todas as mensagens ainda não lidas por ele
  
  
