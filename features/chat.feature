#language: pt
Funcionalidade: Chat em torno de um projeto
  Eu como usuário comunicativo desejo informar minha necessidade ao desenvolvedor e obter uma resposta do desenvolvedor o mais rápido possível.
  Eu como usuário tímido desejo consultar as documentações e solicitações de outros usuários para saber se alguém já mencionou o que preciso.
  Eu como desenvolvedor desejo mapear quem são os interessados em determinada funcionalidade para comunicar-lhes efetivamente sobre seu desenvolvimento.
  
  #Pré-requisitos para interação via chat
  Contexto:
    Dado que usuário está logado
    
  Cenário: Todo usuário deseja ler mensagens sob determinada prioridade
    Então o usuário deseja ver as mensagens ordenadas cronologicamente
    E primeiro as respostas a suas próprias mensagens
    E segundo as respostas aos assuntos de seu interesse
    E terceiro as respostas a outros assuntos
  
  Cenário: Usuário comunicativo deseja enviar mensagens e não se importa de serem públicas
  Cenário: Usuário comunicativo deseja obter respostas públicas ou não
  
  Cenário: Usuário tímido deseja enviar mensagens somente ao desenvolvedor
  Cenário: Usuário tímido deseja obter respostas igualmente privadas
  
  Cenário: Desenvolvedor deseja responder publicamente a outros usuários
  Cenário: Desenvolvedor deseja responder privadamente a outros usuários
    Então as mensagem respondida deve tornar-se privada
  
