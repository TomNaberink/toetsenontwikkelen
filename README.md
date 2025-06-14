# 🎯 Toets Ontwikkelaar - AI voor Docenten

> **Een professionele AI-gestuurde tool voor het ontwikkelen van kennistoetsen**
>
> **Speciaal ontwikkeld voor docenten in het onderwijs**

Een geavanceerde Next.js applicatie die docenten helpt bij het ontwikkelen van hoogwaardige kennistoetsen met behulp van AI. Van meerkeuzevragen tot complexe casussen - deze tool ondersteunt alle aspecten van toetsontwikkeling.

## ✨ Kernfunctionaliteiten

### 🎯 **Toets Ontwikkeling**
- 📝 **Meerdere vraagtypen**: Meerkeuzevragen, juist/onjuist, open vragen, invulvragen, koppelvragen
- 🎓 **Alle onderwijsniveaus**: VMBO, HAVO, VWO, MBO, HBO, WO/Universiteit
- 🧠 **Bloom's Taxonomie**: Vragen op alle cognitieve niveaus (kennis tot evaluatie)
- 📚 **Contextuele casussen**: Optionele realistische scenario's voor praktijkgerichte toetsing
- ⚙️ **Flexibele configuratie**: Aanpasbaar aantal vragen en complexiteit

### 🤖 **AI-Gestuurde Kwaliteit**
- 🎯 **Eenduidige vraagstelling**: Elke vraag bevat één duidelijk probleem
- ✅ **Professionele alternatieven**: Goed gebalanceerde antwoordopties
- 📖 **Uitgebreide uitleg**: Onderbouwing van juiste antwoorden
- 🔍 **Stap-voor-stap begeleiding**: 7-stappen proces voor optimale resultaten

### 📄 **Export & Delen**
- 📋 **One-click kopiëren**: Direct naar klembord voor gebruik
- 📄 **Word export**: Professionele documenten voor verdere bewerking
- 🎨 **Markdown ondersteuning**: Mooie opmaak en structuur

## 🚀 Quick Start

### Stap 1: 🔑 API Key Verkrijgen
Verkrijg een gratis Gemini API key via [Google AI Studio](https://makersuite.google.com/app/apikey)

### Stap 2: 🛠️ Project Setup
```bash
# Clone het project
git clone [repository-url]
cd toets-ontwikkelaar

# Dependencies installeren
npm install

# Environment variables instellen
cp .env.example .env.local
# Voeg je GEMINI_API_KEY toe aan .env.local
```

### Stap 3: 🎉 Start de applicatie
```bash
npm run dev
# Open http://localhost:3000
```

### Stap 4: 🚀 Deploy naar Netlify
1. **In Bolt.new**: "Deploy to Netlify"
2. **Environment Variables toevoegen** in Netlify dashboard:
   - `GEMINI_API_KEY` (vereist voor AI functionaliteit)
3. **Deploy** en je app is live!

## 📋 Toets Ontwikkel Proces

### 🎯 **7-Stappen Wizard**
1. **Vraagtype selecteren**: Kies uit 5 verschillende vraagformaten
2. **Aantal bepalen**: 1-50 vragen, met snelkeuze opties
3. **Onderwijsniveau**: Van VMBO tot Universiteit
4. **Bloom-niveaus**: Selecteer gewenste cognitieve complexiteit
5. **Casus optie**: Met of zonder contextuele scenario's
6. **Onderwerp definiëren**: Specifiek vakgebied of thema
7. **Context verstrekken**: Uitgebreide achtergrond voor optimale vragen

### 🧠 **AI Toets Expert**
De AI gebruikt een geavanceerde prompt die gebaseerd is op onderwijskundige best practices:

```
- Eenduidige vraagformulering (één probleem per vraag)
- Professionele alternatieven (geen "alle/geen van bovenstaande")
- Korte, zakelijke formulering
- Vermijding van ontkennende vraagstelling
- Gelijkwaardige antwoordlengte
- Bloom-taxonomie integratie
- Contextuele relevantie
```

## 🎓 Ondersteunde Vraagtypen

### 📝 **Meerkeuzevragen**
- 4 antwoordopties met één juist antwoord
- Goed gebalanceerde distractors
- Duidelijke vraagstelling

### ✅ **Juist/Onjuist Vragen**
- Stellingen met binaire keuze
- Onderbouwing van het juiste antwoord
- Vermijding van dubbelzinnigheid

### 📖 **Open Vragen**
- Uitgebreide antwoordmogelijkheden
- Duidelijke beoordelingscriteria
- Verschillende complexiteitsniveaus

### 📝 **Invulvragen**
- Ontbrekende begrippen of concepten
- Contextgerichte zinnen
- Eenduidige antwoorden

### 🔗 **Koppelvragen**
- Begrippen aan definities koppelen
- Conceptuele verbanden leggen
- Systematische matching

## 🎯 Bloom's Taxonomie Integratie

### 📚 **Kennis** (Onthouden)
- Feiten, begrippen, procedures
- Definitievragen
- Reproductie van geleerde stof

### 🧠 **Begrip** (Begrijpen)
- Betekenis uitleggen
- Eigen woorden gebruiken
- Voorbeelden geven

### ⚙️ **Toepassing** (Toepassen)
- Kennis in nieuwe situaties
- Procedures uitvoeren
- Praktische implementatie

### 🔍 **Analyse** (Analyseren)
- Informatie ontleden
- Verbanden herkennen
- Structuren identificeren

### 🔨 **Synthese** (Creëren)
- Elementen combineren
- Nieuwe oplossingen bedenken
- Innovatieve benaderingen

### ⚖️ **Evaluatie** (Evalueren)
- Beoordelen op criteria
- Kwaliteit waarderen
- Gefundeerde oordelen

## 🛠️ Technical Architecture

### 📂 **Project Structure**
```
├── 🔑 .env.local                 # API Keys (maak zelf aan)
├── 📦 package.json               # Dependencies & scripts
├── ⚙️ next.config.js             # Next.js configuration
├── 🌐 netlify.toml               # Netlify deployment config
└── src/
    ├── 🎨 app/
    │   ├── 🌍 globals.css         # Tailwind CSS styling
    │   ├── 📱 layout.tsx          # App layout & metadata
    │   ├── 🏠 page.tsx            # Main interface
    │   └── 🔌 api/
    │       └── 💬 chat/route.ts   # Gemini AI endpoint
    └── 🧩 components/
        ├── 🎯 ToetsOntwikkelaar.tsx    # Main toets development interface
        ├── 📝 MarkdownRenderer.tsx     # Response formatting
        └── ⚙️ ResponseActions.tsx      # Export & copy functionality
```

### 🔌 **API Integration**
- **Gemini AI**: Geavanceerde toetsgeneratie
- **Smart Model**: Optimale balans tussen snelheid en kwaliteit
- **Streaming**: Real-time response weergave

## 🎨 User Experience

### 💜 **Modern Design**
- Strakke, professionele interface
- Intuïtieve 7-stappen wizard
- Responsive design voor alle apparaten
- Progress tracking en validatie

### ⚡ **Performance**
- Next.js 15 optimalisaties
- Netlify CDN integratie
- TypeScript voor betrouwbaarheid
- Efficiënte AI API calls

### 🔒 **Security & Privacy**
- Server-side API key management
- Geen opslag van toetsinhoud
- GDPR-compliant design
- Secure HTTPS deployment

## 📚 Gebruik Cases

### 👨‍🏫 **Voor Docenten**
- 📝 **Snelle toetsontwikkeling**: Van idee naar complete toets in minuten
- 🎯 **Kwaliteitsborging**: AI-gestuurde vraagvalidatie
- 📊 **Bloom-integratie**: Automatische verdeling over cognitieve niveaus
- 💡 **Inspiratie**: Nieuwe vraagformuleringen en benaderingen

### 🏫 **Voor Onderwijsinstellingen**
- 📈 **Efficiëntie**: Snellere toetsontwikkeling
- ✅ **Standaardisatie**: Consistente vraagkwaliteit
- 🎓 **Niveaudifferentiatie**: Aangepaste moeilijkheidsgraad
- 📋 **Documentatie**: Professionele export mogelijkheden

### 📖 **Voor Vakgebieden**
- 🔬 **Exacte vakken**: Formules, berekeningen, experimenten
- 📚 **Taalvakken**: Literatuur, grammatica, tekstbegrip
- 🌍 **Maatschappijvakken**: Geschiedenis, aardrijkskunde, economie
- 🎨 **Creatieve vakken**: Kunst, muziek, drama

## 🚀 Deployment & Production

### 🌐 **Netlify (Aanbevolen)**
```bash
# Automatische deployment via Bolt.new
1. ✅ "Deploy to Netlify" button
2. ✅ Environment variables instellen
3. ✅ Automatische HTTPS & CDN
```

### ⚙️ **Environment Variables**
```env
GEMINI_API_KEY=your_gemini_api_key_here    # Google AI Studio
NODE_ENV=production                         # Auto-set door Netlify
```

### 📊 **Performance Monitoring**
- Netlify Analytics integratie
- API response time tracking
- User experience metrics
- Error monitoring

## 🔧 Customization & Extension

### 🎨 **Styling Aanpassingen**
```css
/* globals.css - Pas het kleurenschema aan */
:root {
  --primary-color: #2563eb;     /* Blauw accent */
  --secondary-color: #f3f4f6;   /* Light background */
  --text-color: #1f2937;        /* Dark text */
}
```

### 🤖 **AI Model Configuration**
```typescript
// Gemini model selectie
const modelName = 'gemini-2.5-flash-preview-05-20' // Optimaal voor toetsontwikkeling
```

### 📝 **Vraagtype Uitbreiding**
Nieuwe vraagtypen kunnen eenvoudig worden toegevoegd in `ToetsOntwikkelaar.tsx`:

```typescript
const vraagTypes = [
  { id: 'nieuw-type', label: 'Nieuw Type', beschrijving: 'Beschrijving...' },
  // ... bestaande types
]
```

## 🤝 Contributing & Support

### 🛠️ **Development Setup**
```bash
# Development mode
npm run dev

# Type checking  
npm run lint

# Production build test
npm run build && npm start
```

### 🐛 **Bug Reports**
Voor issues en feature requests, gebruik de GitHub Issues functionaliteit met:
- 🖥️ Browser & OS versie
- 📝 Stappen om te reproduceren
- 📋 Error messages/screenshots
- 🎯 Verwacht vs werkelijk gedrag

### 💡 **Feature Roadmap**
- [ ] **Vraagbank**: Opslaan en hergebruiken van vragen
- [ ] **Collaborative editing**: Samen toetsen ontwikkelen
- [ ] **Analytics**: Vraagstatistieken en moeilijkheidsanalyse
- [ ] **Templates**: Voorgedefinieerde toetsformaten
- [ ] **Integration**: LMS koppeling (Moodle, Canvas, etc.)

## 📚 Resources & Links

### 🔗 **Officiële Documentatie**
- [Next.js 15 Docs](https://nextjs.org/docs) - Framework reference
- [Gemini AI Docs](https://ai.google.dev/docs) - AI capabilities
- [Netlify Functions](https://docs.netlify.com/functions/overview/) - Deployment

### 🎓 **Onderwijskundige Resources**
- [Bloom's Taxonomy](https://cft.vanderbilt.edu/guides-sub-pages/blooms-taxonomy/) - Cognitieve niveaus
- [Toetsconstructie](https://www.surf.nl/toetsing-en-beoordeling) - Best practices
- [Assessment Design](https://www.edutopia.org/assessment) - Moderne benaderingen

### 💬 **Community & Support**
- [GitHub Repository](https://github.com/[repository]) - Source code & issues
- [Netlify Community](https://community.netlify.com/) - Deployment help
- [Next.js Discord](https://discord.gg/nextjs) - Technical support

---

## 🎉 **Klaar om Professionele Toetsen te Ontwikkelen?**

Deze tool geeft docenten de kracht van AI om snel, efficiënt en professioneel kennistoetsen te ontwikkelen. Van eenvoudige meerkeuzevragen tot complexe casusanalyses - alles is mogelijk!

**🎯 Start nu en transformeer je toetsontwikkeling!**

---

*Versie 1.0 - Toets Ontwikkelaar voor het Onderwijs*  
*Last updated: December 2024*