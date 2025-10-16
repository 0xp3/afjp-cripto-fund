[Jump to Spanish](https://github.com/0xp3/AFJP-Aptos/tree/main?tab=readme-ov-file#afjp-cripto---sistema-de-jubilaci%C3%B3n-basado-en-criptomonedas)
# AFJP Cripto ‒ Cryptocurrency-Based Retirement System

## Introduction  
AFJP Cripto presents an innovative model for a retirement system using blockchain technology, integrating retirement savings tokens, stock market investments, and opportunities in tokenized real estate. Each contribution generates **AFJP Tokens**, which represent retirement savings; these can be exchanged in a dedicated sub-market. The platform offers exclusive benefits for affiliates, such as access to tokenized real estate (RWA), options for early retirement, and a secure, flexible, and profitable retirement system managed through a virtual wallet.

## Main Features  
- **Retirement savings**: Earn **AFJP tokens** through contributions, which remain locked for 5 years (vesting). Afterwards, they can be sold, exchanged for **LADRILLO tokens** (real estate) or **JUVENTUD tokens** (rental access), or kept for retirement.  
- **Tokenized real estate**: Buy fractions of properties with **LADRILLO tokens** and receive proportional income from rentals. Rent properties with **JUVENTUD tokens**.  
- **Marketplace**: Buy, sell or exchange tokens (AFJP, LADRILLO, JUVENTUD) using fiat money, cryptocurrencies, or other tokens.  
- **Exclusive benefits**: Gain real estate, pharmaceutical, and tourism benefits as an active affiliate.  
- **Token Inheritance**: Designate beneficiary wallets for token inheritance in case of user’s death.

## Getting Started

### Prerequisites  
- [ ] A web3-compatible wallet (e.g. Lace Wallet)  
- [ ] Node.js & npm / Yarn for local development  
- [ ] Access to the blockchain network (e.g. Hedera testnet or mainnet)  

### Create Your Wallet  
1. Install the **Lace Wallet** extension or app.  
2. Click **“Connect Lace Wallet to access AFJP Cripto”** on the platform.  
3. Select **“Create new wallet”**.  
4. Enter your personal details and click **“Complete AFJP Cripto registration”**.  
5. Store your mnemonic phrase and password securely.

### Log In  
1. Click **“Connect Lace Wallet to access AFJP Cripto”**.  
2. Enter your password.  
   - If you forgot it, click **“Reset wallet”** and enter your mnemonic phrase.  
   - To access from a new device, select **“Import wallet”** and enter your mnemonic phrase.

## Platform Functionalities

### Main Dashboard  
- **Language selection**: Choose your preferred language from the top right menu, next to the **“Log out”** button.  
- **Tokens summary**: Display your **AFJP Tokens**, current value, gains achieved, and price per token.  
- **Platform statistics**: View general platform and user statistics, followed by total statistics for all tokens on the platform.  
- **Action buttons**:  
  1. **Contribute AFJP Tokens**: Choose between the minimum monthly contribution or a custom amount. The tokens are locked for 5 years (vesting), then can be sold, exchanged for **LADRILLO** or **JUVENTUD** tokens, or kept.  
  2. **Buy LADRILLO Tokens**: Use unlocked **AFJP tokens** or fiat money to purchase **LADRILLO tokens** from other users or from the platform itself. Also allows selling **AFJP** or **LADRILLO** tokens to other users.  
  3. **Benefits**: Navigate to the Benefits section to access exclusive perks.  
- **Recent transactions**: View the transaction history of your wallet.  
- **Platform news**: Read updates and articles by clicking on news items.

### Contributions  
- **User statistics**: View personalized statistics of your wallet and contributions.  
- **AFJP Token history**: Review your purchased **AFJP tokens** history.  
- **Purchase form**: Buy **AFJP tokens** using fiat money.

### Marketplace  
- **Real-time stats**: Monitor the performance of **AFJP tokens**.  
- **Buy Tokens**: Acquire **AFJP** or **LADRILLO tokens** with local currency, dollars, or cryptocurrencies.  
- **Sell Tokens**: Exchange **AFJP tokens** for fiat money (dollars, pesos, etc.).  
- **Token Exchange**: Swap **AFJP tokens** for **LADRILLO** or **JUVENTUD tokens**.  
- **Credit**: Request a loan by locking tokens as collateral and choosing a repayment term.

### Real Estate  
- **Affiliate benefits**: Explore current real estate benefits for affiliates.  
- **Property listings**: Browse tokenized properties (RWA) available for purchase or rental, with detailed specifics.  
- **Purchase/rental**: Buy fractions of properties with **LADRILLO tokens** or rent with **JUVENTUD tokens**.  
- **Newsletter subscription**: Sign up to receive updates about new properties and benefits.

### Tourism (Affiliates Only)  
- **Property booking**: Select dates on a calendar and click **“Book Now”** to reserve a property.

### Benefits  
- **Affiliate advantages**: Access real estate, pharmaceutical, and medical benefits for active affiliates.  
- **Token inheritance**: Designate beneficiary wallets for inheritance of tokens.  
- **Link to marketplace**: Navigate to the **Marketplace** section for token transactions.  
- **Payments**: Pay rent, medical or pharmacy services with **JUVENTUD tokens** using QR code or public address.  
- **Discount calculator**: Calculate discounts on medicines by entering their price.  
- **Beneficiary info**: View or modify token beneficiary details.

## Technology Stack


### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context API
- **Routing**: React Router DOM
- **Blockchain Integration**: Aptos SDK
- **Build Tool**: Vite
- **Package Manager**: npm/yarn


### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT + Wallet signatures
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Zod
- **Testing**: Jest + Supertest


### Blockchain
- **Platform**: Aptos Blockchain
- **Language**: Move
- **Development**: Aptos CLI
- **Testing**: Move unit tests
- **Deployment**: Aptos devnet/mainnet


### Infrastructure
- **Cloud Provider**: AWS/Azure/GCP
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack
- **Caching**: Redis

## Smart Contract Architecture

### Core Token Contracts
- **1. AFJP Token** (`afjp_token.move`)
- **2. Juventud Token** (`juventud_token.move`)
- **3. Ladrillo Token** (`ladrillo_token.move`)

### Supporting Contracts
- **4. Vesting Contract** (`afjp_vesting.move`)
- **5. Staking Contract** (`afjp_staking.move`)
- **6. Lending Contract** (`afjp_lending.move`)
- **7. Inheritance Contract** (`afjp_inheritance.move`)
- **8. Property Manager** (`property_manager.move`)
- **9. Anti-Whale contract** (`anti-whale.move`)


## Development & Deployment

1. Clone the repository  
2. Install packages  
   ```bash
   npm install
   # or
   yarn install


# AFJP Cripto - Sistema de jubilación basado en criptomonedas

## Introducción
AFJP Cripto presenta un modelo innovador de sistema de jubilación que utiliza tecnología blockchain, integrando tokens de ahorro jubilatorio, inversiones en bolsa y oportunidades en bienes raíces tokenizados. Cada aporte genera **Tokens AFJP**, que representan los ahorros para la jubilación, los cuales pueden intercambiarse en un submercado dedicado. La plataforma ofrece beneficios exclusivos para afiliados, como acceso a propiedades tokenizadas (RWA), opciones de jubilación anticipada y un sistema de jubilación seguro, flexible y rentable gestionado a través de una billetera virtual.

## Características principales
- **Ahorro jubilatorio**: Obtén **tokens AFJP** mediante aportes, los cuales permanecen bloqueados por 5 años (vesting). Posteriormente, pueden venderse, intercambiarse por **tokens LADRILLO** (bienes raíces) o **JUVENTUD** (alquileres), o mantenerse para la jubilación.
- **Bienes raíces tokenizados**: Compra fracciones de propiedades con **tokens LADRILLO** y obtén ingresos proporcionales por alquileres. Alquila propiedades con **tokens JUVENTUD**.
- **Mercado**: Compra, vende o intercambia tokens (AFJP, LADRILLO, JUVENTUD) con dinero fiat, criptomonedas u otros tokens.
- **Beneficios exclusivos**: Accede a beneficios inmobiliarios, farmacéuticos y turísticos para afiliados activos.
- **Herencia de Tokens**: Designa billeteras beneficiarias para la herencia de tokens en caso de fallecimiento del usuario.

## Primeros pasos

### Crear tu billetera
1. Instala la extensión o aplicación de **Lace Wallet**.
2. Haz clic en **"Conectar Lace Wallet para acceder a AFJP Cripto"** en la plataforma.
3. Selecciona **"Crear nueva billetera"**.
4. Ingresa tus datos personales y haz clic en **"Completar registro AFJP Cripto"**.
5. Guarda de forma segura tu frase mnemotécnica y contraseña.

### Iniciar sesión
1. Haz clic en **"Conectar Lace Wallet para acceder a AFJP Cripto"**.
2. Ingresa tu contraseña.
   - Si la olvidaste, haz clic en **"Restablecer billetera"** e ingresa tu frase mnemotécnica.
   - Para acceder desde un nuevo dispositivo, selecciona **"Importar billetera"** e ingresa tu frase mnemotécnica.

## Funcionalidades de la plataforma

### Panel Principal
- **Selección de idioma**: Elige tu idioma preferido desde el menú superior derecho, junto al botón **"Cerrar sesión"**.
- **Resumen de Tokens**: Muestra tus **Tokens AFJP**, su valor actual, ganancias obtenidas y el precio por token.
- **Estadísticas de la plataforma**: Visualiza estadísticas generales de la plataforma y sus usuarios, seguidas de estadísticas totales de todos los tokens de la plataforma.
- **Botones de acción**:
  1. **Aportar Tokens AFJP**: Elige entre el aporte mensual mínimo o una cantidad personalizada. Los tokens quedan bloqueados por 5 años (vesting), luego pueden venderse, intercambiarse por **tokens LADRILLO** o **JUVENTUD**, o mantenerse.
  2. **Comprar Tokens LADRILLO**: Usa **tokens AFJP** desbloqueados o dinero fiat para adquirir **tokens LADRILLO** de otros usuarios o de la plataforma. También permite vender **tokens AFJP** o **LADRILLO** a otros usuarios.
  3. **Beneficios**: Navega a la sección de Beneficios para acceder a ventajas exclusivas.
- **Transacciones recientes**: Consulta el historial de transacciones de tu billetera.
- **Noticias de la plataforma**: Lee actualizaciones y artículos haciendo clic en las noticias.

### Aportes
- **Estadísticas del usuario**: Visualiza estadísticas personalizadas de tu billetera y aportes.
- **Historial de Tokens AFJP**: Revisa el historial de **Tokens AFJP** comprados.
- **Formulario de compra**: Adquiere **Tokens AFJP** con dinero fiat.

### Mercado
- **Estadísticas en tiempo real**: Monitorea el rendimiento de los **tokens AFJP**.
- **Comprar Tokens**: Adquiere **tokens AFJP** o **LADRILLO** con moneda local, dólares o criptomonedas.
- **Vender Tokens**: Intercambia **tokens AFJP** por dinero fiat (dólares, pesos, etc.).
- **Intercambio de Tokens**: Cambia **tokens AFJP** por **tokens LADRILLO** o **JUVENTUD**.
- **Crédito**: Solicita un préstamo bloqueando tokens como garantía y selecciona el plazo de pago.

### Inmuebles
- **Beneficios para afiliados**: Explora los beneficios inmobiliarios actuales para afiliados.
- **Listado de propiedades**: Consulta propiedades tokenizadas (RWA) disponibles para compra o alquiler, con detalles específicos.
- **Compra/alquiler**: Compra fracciones de propiedades con **tokens LADRILLO** o alquila con **tokens JUVENTUD**.
- **Suscripción a newsletter**: Regístrate para recibir actualizaciones sobre nuevas propiedades y beneficios.

### Turismo (Solo afiliados)
- **Reserva de propiedades**: Selecciona fechas en el calendario y haz clic en **"Reservar Ahora"** para reservar una propiedad.

### Beneficios
- **Ventajas para afiliados**: Accede a beneficios inmobiliarios, farmacéuticos y médicos para afiliados activos.
- **Herencia de tokens**: Designa billeteras beneficiarias para la herencia de tokens.
- **Enlace al mercado**: Navega a la sección **Mercado** para transacciones de tokens.
- **Pagos**: Paga alquileres, servicios médicos o farmacéuticos con **tokens JUVENTUD** mediante código QR o dirección pública.
- **Calculadora de descuentos**: Calcula descuentos en medicamentos ingresando su precio.
- **Información de beneficiarios**: Visualiza o modifica los detalles de los beneficiarios de tokens.


## Stack tecnológico

### Frontend
- **Framework**: React 18 con TypeScript
- **Librería UI**: componentes shadcn/ui
- **Estilos**: Tailwind CSS
- **Gestión de estado**: React Query + Context API
- **Ruteo**: React Router DOM
- **Integración blockchain**: Aptos SDK
- **Herramienta de build**: Vite
- **Gestor de paquetes**: npm/yarn

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de datos**: PostgreSQL 15+
- **ORM**: Prisma
- **Autenticación**: JWT + firmas de wallet
- **Documentación de API**: Swagger/OpenAPI
- **Validación**: Zod
- **Testing**: Jest + Supertest

### Blockchain
- **Plataforma**: Aptos Blockchain
- **Lenguaje**: Move
- **Desarrollo**: Aptos CLI
- **Pruebas**: Tests unitarios Move
- **Despliegue**: devnet/mainnet Aptos

### Infraestructura
- **Proveedor cloud**: AWS/Azure/GCP
- **Contenerización**: Docker
- **Orquestación**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitorización**: Prometheus + Grafana
- **Logging**: ELK Stack
- **Cache**: Redis

## Arquitectura de contratos inteligentes

### Contratos de tokens principales
- 1. Token AFJP (`afjp_token.move`)
- 2. Token Juventud (`juventud_token.move`)
- 3. Token Ladrillo (`ladrillo_token.move`)

### Contratos de soporte
- 4. Contrato de vesting (`afjp_vesting.move`)
- 5. Contrato de staking (`afjp_staking.move`)
- 6. Contrato de préstamos (`afjp_lending.move`)
- 7. Contrato de herencia (`afjp_inheritance.move`)
- 8. Property Manager (`property_manager.move`)
- 9. Contrato Anti-Whale (`anti-whale.move`)

## Desarrollo y despliegue

1. Clona el repositorio  
2. Instala paquetes  
   ```bash
   npm install
   # o
   yarn install

