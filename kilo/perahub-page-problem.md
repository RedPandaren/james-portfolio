# Problem Statement: Perahub Mobile Application Portfolio Showcase Page

## Context
Perahub is a production-grade fintech platform operating in the Philippines, providing a unified interface for multiple financial services including international remittance processing, digital wallet management, bill payments, and electronic load purchases. The platform integrates with major remittance providers (Western Union, Ayannah, RIA, Japanremit, Intelexpress, TelereMIT), electronic payment networks (InstaPay, PesoNet), and bill payment aggregators (ECPay). Currently deployed on Google Cloud Platform with enterprise-grade security infrastructure, Perahub serves as a critical financial services utility for its user base.

## Core Problem
The current portfolio website lacks a dedicated showcase for Perahub, the most comprehensive and production-ready project in James Conales' portfolio. As the lead developer responsible for 90% of the backend systems, James needs a dedicated page that effectively demonstrates his contributions to this live fintech platform. The new page must highlight:

- The architectural complexity of integrating multiple remittance, payment, and wallet services under a unified platform
- The technical leadership demonstrated through the Laravel 4.2 to Node 22 migration
- The security consciousness shown through VAPT remediation implementation
- The cloud infrastructure expertise displayed through GCP CloudRun deployment with Apigee and KMS integration

## Impact
**Primary Stakeholder:** James Conales, seeking to showcase his backend development and fintech expertise to potential employers, clients, and collaborators.

**Secondary Stakeholders:**
- Recruiters and hiring managers evaluating James's technical capabilities
- Potential clients interested in fintech development services
- Fellow developers seeking reference architectures for multi-service payment platforms

**Current Gap:** Without a dedicated Perahub showcase page, visitors to the portfolio cannot fully appreciate the scope and complexity of James's production fintech experience. This represents a significant missed opportunity to demonstrate expertise in:

- High-availability financial transaction processing
- API integration with multiple third-party financial services
- Regulatory compliance and security implementation (VAPT remediation)
- Cloud-native architecture on GCP

## Requirements & Acceptance Criteria

### Functional Requirements
- [ ] Create a new standalone page at `/perahub` accessible from the portfolio navigation
- [ ] Implement a clickable redirection mechanism from the main Projects component to the Perahub page
- [ ] Include a feature breakdown section detailing all Perahub services (Remittance, E-Wallet, Bill Payments, E-Load)
- [ ] Document the technology stack with specific versions and frameworks used
- [ ] Provide an architecture overview highlighting the integration points between services

### Content Requirements
- [ ] Showcase James's role as primary backend developer (90% of backend systems)
- [ ] Highlight the Laravel 4.2 to Node 22 migration as a major technical achievement
- [ ] Document GCP infrastructure: CloudRun, Apigee API Gateway, and KMS encryption
- [ ] Detail notification systems: MacroKiosk SMS and OneSignal push notifications
- [ ] Include security credentials through VAPT remediation work

### User Experience Requirements
- [ ] Ensure the page follows the existing portfolio design system and theming
- [ ] Implement responsive design for mobile, tablet, and desktop viewing
- [ ] Include smooth navigation transitions between pages
- [ ] Add appropriate visual hierarchy emphasizing key achievements

### Technical Quality Requirements
- [ ] Maintain accessibility standards (WCAG 2.1 AA compliance)
- [ ] Ensure fast page load performance (Core Web Vitals targets)
- [ ] Use consistent component patterns with existing portfolio architecture

## Dependencies

### External Dependencies
- **OneSignal API:** For push notification feature documentation
- **MacroKiosk SMS Gateway:** For SMS notification feature documentation
- **InstaPay/PesoNet APIs:** For e-wallet integration documentation
- **ECPay API:** For bill payment integration documentation
- **Remittance Provider APIs:** Western Union, Ayannah, RIA, Japanremit, Intelexpress, TelereMIT

### Internal Dependencies
- **Existing Components:** Header, Footer, ThemeProvider, ScrollReveal
- **Navigation System:** Update app/components/Header.tsx to include Perahub link
- **Projects Component:** Modify to add Perahub as a featured project with link
- **Design System:** Follow existing patterns in app/globals.css and component styling

### Asset Dependencies
- **Screenshots/Mockups:** Placeholder for Perahub mobile app screenshots (to be provided)
- **Architecture Diagram:** Optional architecture overview graphic
- **Icons:** Service provider logos (Western Union, InstaPay, ECPay, etc.)

## Current State Notes

### Existing Portfolio Structure
The portfolio currently consists of:
- Homepage with Hero, About, TechStack, Experience, Projects, Contact sections
- Component-based architecture using React/Next.js
- Tailwind CSS for styling with custom theme support
- Scroll-based reveal animations for content sections

### Perahub Project Context
Perahub represents James's most technically complex and commercially significant project:

**Scope:**
- Multi-service financial platform processing remittance, wallet, bill payment, and e-load transactions
- Integration with 6+ remittance providers, 2 payment networks, and multiple bill payment services
- Customer management with transaction history, contacts, and savings features

**Technical Scale:**
- 90% backend coverage by single developer
- Production deployment on GCP CloudRun
- Enterprise API management via Apigee
- Encryption key management via GCP KMS

**Security Posture:**
- Completed VAPT remediation addressing critical vulnerabilities
- Compliance with financial services security requirements
- Secure handling of sensitive financial data

## Out of Scope
The following items are intentionally excluded from this problem statement:
- Backend implementation or code samples (this is a frontend portfolio showcase)
- API documentation or technical specifications
- Production deployment or infrastructure changes
- User authentication or dashboard functionality
- Integration with actual Perahub production systems
- Analytics or tracking implementation
- Multi-language support beyond English

## Open Questions

1. **Live App Link:** Should the page include a link to the live Perahub application? If yes, is there a public-facing URL available, or does it require login credentials?

2. **Screenshots:** Are screenshots/mockups of the Perahub mobile app available for inclusion on the showcase page?

3. **Metrics:** Are there any specific metrics (users, transactions, uptime) that should be highlighted on the page?

4. **Timeline:** What is the expected timeline for completing this page?

5. **Design Preferences:** Are there specific design elements or color schemes that should be incorporated to align with Perahub branding?

## Success Metrics
The Perahub showcase page will be considered successful when:
- Page is fully functional and accessible via `/perahub` route
- Navigation flow from Projects component to Perahub page is smooth and intuitive
- All key features and technologies are clearly documented
- Page maintains design consistency with existing portfolio
- Responsive design works across all target device sizes
