# Toca Aqui - React Native App

Uma aplicação React Native para conectar contratantes e profissionais do audiovisual.

## 🚀 Tecnologias Utilizadas

- **React Native 0.73.2** - Framework principal
- **TypeScript** - Tipagem estática
- **React Navigation 6** - Navegação entre telas
- **Supabase** - Backend e autenticação
- **React Query** - Gerenciamento de estado e cache
- **React Native Reanimated** - Animações performáticas
- **React Native Gesture Handler** - Gestos nativos
- **React Native Vector Icons** - Ícones
- **AsyncStorage** - Armazenamento local

## 📱 Funcionalidades Implementadas

### ✅ Primeira Fase (Concluída)
- [x] Configuração inicial do projeto React Native
- [x] Estrutura de navegação com React Navigation
- [x] Sistema de autenticação com Supabase
- [x] Tela de Splash Screen animada
- [x] Tela inicial (Index) com design responsivo
- [x] Tela de autenticação (Login/Registro/Recuperação)
- [x] Dashboard básico com alternância de perfis
- [x] Sistema de temas e cores consistente
- [x] Componentes UI reutilizáveis (Button, Input, Card)
- [x] Integração com AsyncStorage para persistência
- [x] Toast notifications para feedback do usuário

### 🔄 Próximas Fases
- [ ] Tela de exploração de profissionais
- [ ] Tela de eventos
- [ ] Perfil do usuário e edição
- [ ] Sistema de notificações
- [ ] Configurações do app
- [ ] Upload de imagens
- [ ] Sistema de reservas
- [ ] Pagamentos
- [ ] Chat entre usuários

## 🛠️ Configuração do Ambiente

### Pré-requisitos
- Node.js 18+
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS)

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd toca-aqui-mobile
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o ambiente iOS (apenas macOS)**
```bash
cd ios && pod install && cd ..
```

4. **Execute o projeto**

Para Android:
```bash
npm run android
```

Para iOS:
```bash
npm run ios
```

Para iniciar o Metro bundler:
```bash
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── ui/             # Componentes de interface
├── contexts/           # Contextos React
├── hooks/              # Hooks customizados
├── lib/                # Configurações e utilitários
├── screens/            # Telas da aplicação
├── styles/             # Estilos e temas
└── App.tsx             # Componente principal
```

## 🎨 Design System

### Cores
- **Background**: #0A0A0A (Preto profundo)
- **Card**: #1A1A1A (Cinza escuro)
- **Accent**: #ea384c (Vermelho Toca Aqui)
- **Text Primary**: #FFFFFF (Branco)
- **Text Secondary**: #AAAAAA (Cinza claro)

### Espaçamentos
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

## 🔐 Autenticação

O app utiliza Supabase para autenticação, oferecendo:
- Login com email/senha
- Registro de novos usuários
- Recuperação de senha
- Persistência de sessão
- Alternância entre perfis (Contratante/Profissional)

## 📱 Compatibilidade

- **iOS**: 12.0+
- **Android**: API 21+ (Android 5.0)

## 🚀 Build para Produção

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do email: contato@tocaaqui.app.br

---

**Toca Aqui** - Conectando talentos do audiovisual 🎵