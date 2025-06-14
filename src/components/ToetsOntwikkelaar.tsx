'use client'

import { useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import ResponseActions from './ResponseActions'

interface ToetsVraag {
  id: string
  vraag: string
  type: string
  antwoorden?: string[]
  juisteAntwoord?: string | number
  uitleg?: string
}

interface ToetsSpecificatie {
  type: string
  aantal: number
  niveau: string
  bloomNiveaus: string[]
  metCasus: boolean
  onderwerp: string
  context: string
}

export default function ToetsOntwikkelaar() {
  const [stap, setStap] = useState(1)
  const [specificatie, setSpecificatie] = useState<ToetsSpecificatie>({
    type: '',
    aantal: 5,
    niveau: '',
    bloomNiveaus: [],
    metCasus: false,
    onderwerp: '',
    context: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [gegenereerdeToets, setGegenereerdeToets] = useState('')
  const [error, setError] = useState('')

  const vraagTypes = [
    { id: 'meerkeuze', label: 'Meerkeuzevragen (4 opties)', beschrijving: 'Klassieke multiple choice met één juist antwoord' },
    { id: 'juist-onjuist', label: 'Juist/Onjuist vragen', beschrijving: 'Stellingen die waar of onwaar zijn' },
    { id: 'open', label: 'Open vragen', beschrijving: 'Vragen die een uitgebreid antwoord vereisen' },
    { id: 'invullen', label: 'Invulvragen', beschrijving: 'Zinnen met ontbrekende woorden of begrippen' },
    { id: 'matching', label: 'Koppelvragen', beschrijving: 'Begrippen of concepten aan elkaar koppelen' }
  ]

  const onderwijsNiveaus = [
    { id: 'vmbo', label: 'VMBO', beschrijving: 'Voorbereidend middelbaar beroepsonderwijs' },
    { id: 'havo', label: 'HAVO', beschrijving: 'Hoger algemeen voortgezet onderwijs' },
    { id: 'vwo', label: 'VWO', beschrijving: 'Voorbereidend wetenschappelijk onderwijs' },
    { id: 'mbo', label: 'MBO', beschrijving: 'Middelbaar beroepsonderwijs' },
    { id: 'hbo', label: 'HBO', beschrijving: 'Hoger beroepsonderwijs' },
    { id: 'wo', label: 'WO/Universiteit', beschrijving: 'Wetenschappelijk onderwijs' }
  ]

  const bloomNiveaus = [
    { id: 'kennis', label: 'Kennis', beschrijving: 'Feiten, begrippen en procedures onthouden' },
    { id: 'begrip', label: 'Begrip', beschrijving: 'Betekenis begrijpen en uitleggen' },
    { id: 'toepassing', label: 'Toepassing', beschrijving: 'Kennis gebruiken in nieuwe situaties' },
    { id: 'analyse', label: 'Analyse', beschrijving: 'Informatie ontleden en verbanden leggen' },
    { id: 'synthese', label: 'Synthese', beschrijving: 'Elementen combineren tot iets nieuws' },
    { id: 'evaluatie', label: 'Evaluatie', beschrijving: 'Beoordelen en waarderen op basis van criteria' }
  ]

  const handleBloomNiveauChange = (niveau: string) => {
    setSpecificatie(prev => ({
      ...prev,
      bloomNiveaus: prev.bloomNiveaus.includes(niveau)
        ? prev.bloomNiveaus.filter(n => n !== niveau)
        : [...prev.bloomNiveaus, niveau]
    }))
  }

  const genereerToets = async () => {
    setIsGenerating(true)
    setError('')
    setGegenereerdeToets('')

    try {
      // Bouw de prompt op basis van de specificaties
      const prompt = `
Je bent een toetsexpert die kennistoetsen ontwikkelt voor docenten. Ontwikkel een toets met de volgende specificaties:

**Toets Specificaties:**
- Type vragen: ${specificatie.type}
- Aantal vragen: ${specificatie.aantal}
- Onderwijsniveau: ${specificatie.niveau}
- Bloom-niveaus: ${specificatie.bloomNiveaus.join(', ')}
- Met casus: ${specificatie.metCasus ? 'Ja' : 'Nee'}
- Onderwerp: ${specificatie.onderwerp}

**Context en achtergrond:**
${specificatie.context}

**Instructies voor vraagontwikkeling:**
1. Formuleer vragen eenduidig - één probleem per vraag
2. Bij meerkeuzevragen: slechts één alternatief is correct
3. Vermijd "alle/geen van bovenstaande" opties
4. Formuleer kort en zakelijk
5. Vermijd ontkennende vraagstellingen
6. Alle antwoordopties ongeveer even lang
7. Verdeel vragen over de gevraagde Bloom-niveaus

${specificatie.metCasus ? 'Begin met een korte, realistische casus die relevant is voor het onderwerp.' : ''}

Geef voor elke vraag aan:
- Het Bloom-niveau
- Het juiste antwoord (bij gesloten vragen)
- Een korte uitleg waarom dit het juiste antwoord is

Format de output als een professionele toets met duidelijke nummering en structuur.
`

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          aiModel: 'smart'
        }),
      })

      if (!response.ok) {
        throw new Error('Er ging iets mis bij het genereren van de toets')
      }

      const data = await response.json()
      setGegenereerdeToets(data.response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout opgetreden')
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setStap(1)
    setSpecificatie({
      type: '',
      aantal: 5,
      niveau: '',
      bloomNiveaus: [],
      metCasus: false,
      onderwerp: '',
      context: ''
    })
    setGegenereerdeToets('')
    setError('')
  }

  const kanDoorgaan = () => {
    switch (stap) {
      case 1: return specificatie.type !== ''
      case 2: return specificatie.aantal > 0
      case 3: return specificatie.niveau !== ''
      case 4: return specificatie.bloomNiveaus.length > 0
      case 5: return true // Casus is optioneel
      case 6: return specificatie.onderwerp.trim() !== ''
      case 7: return specificatie.context.trim() !== ''
      default: return false
    }
  }

  if (gegenereerdeToets) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              🎯 Jouw Gegenereerde Toets
            </h2>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nieuwe Toets Maken
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Toets Specificaties:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div><strong>Type:</strong> {specificatie.type}</div>
              <div><strong>Aantal:</strong> {specificatie.aantal} vragen</div>
              <div><strong>Niveau:</strong> {specificatie.niveau}</div>
              <div><strong>Bloom:</strong> {specificatie.bloomNiveaus.join(', ')}</div>
              <div><strong>Casus:</strong> {specificatie.metCasus ? 'Ja' : 'Nee'}</div>
              <div><strong>Onderwerp:</strong> {specificatie.onderwerp}</div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <MarkdownRenderer content={gegenereerdeToets} />
          </div>

          <ResponseActions 
            content={gegenereerdeToets}
            isMarkdown={true}
            className="mt-4"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Stap {stap} van 7</span>
            <span className="text-sm text-gray-500">{Math.round((stap / 7) * 100)}% voltooid</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(stap / 7) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Stap 1: Type toetsvraag */}
        {stap === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              1. Welk type toetsvraag wil je?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vraagTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    specificatie.type === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSpecificatie(prev => ({ ...prev, type: type.id }))}
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{type.label}</h3>
                  <p className="text-sm text-gray-600">{type.beschrijving}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stap 2: Aantal vragen */}
        {stap === 2 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              2. Hoeveel vragen wil je hebben?
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aantal vragen
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={specificatie.aantal}
                  onChange={(e) => setSpecificatie(prev => ({ ...prev, aantal: parseInt(e.target.value) || 1 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {[5, 10, 15, 20, 25].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSpecificatie(prev => ({ ...prev, aantal: num }))}
                    className={`p-2 rounded-lg border transition-colors ${
                      specificatie.aantal === num
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {num} vragen
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stap 3: Onderwijsniveau */}
        {stap === 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              3. Welk onderwijsniveau?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {onderwijsNiveaus.map((niveau) => (
                <div
                  key={niveau.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    specificatie.niveau === niveau.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSpecificatie(prev => ({ ...prev, niveau: niveau.id }))}
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{niveau.label}</h3>
                  <p className="text-sm text-gray-600">{niveau.beschrijving}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stap 4: Bloom-niveaus */}
        {stap === 4 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              4. Van welke Bloom-niveaus moeten de vragen zijn?
            </h2>
            <p className="text-gray-600 mb-6">Selecteer één of meerdere niveaus (vragen worden verdeeld over de gekozen niveaus)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bloomNiveaus.map((niveau) => (
                <div
                  key={niveau.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    specificatie.bloomNiveaus.includes(niveau.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleBloomNiveauChange(niveau.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">{niveau.label}</h3>
                      <p className="text-sm text-gray-600">{niveau.beschrijving}</p>
                    </div>
                    {specificatie.bloomNiveaus.includes(niveau.id) && (
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stap 5: Casus */}
        {stap === 5 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              5. Moet er een korte casus worden beschreven voor de vragen?
            </h2>
            <p className="text-gray-600 mb-6">Een casus geeft context en maakt vragen realistischer</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  specificatie.metCasus === true
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSpecificatie(prev => ({ ...prev, metCasus: true }))}
              >
                <h3 className="font-semibold text-gray-800 mb-2">✅ Ja, met casus</h3>
                <p className="text-sm text-gray-600">Begin met een realistische situatie of case study</p>
              </div>
              <div
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  specificatie.metCasus === false
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSpecificatie(prev => ({ ...prev, metCasus: false }))}
              >
                <h3 className="font-semibold text-gray-800 mb-2">❌ Nee, directe vragen</h3>
                <p className="text-sm text-gray-600">Ga direct naar de toetsvragen zonder casus</p>
              </div>
            </div>
          </div>
        )}

        {/* Stap 6: Onderwerp */}
        {stap === 6 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              6. Wat is het onderwerp van de vragen?
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Onderwerp/Vakgebied
                </label>
                <input
                  type="text"
                  value={specificatie.onderwerp}
                  onChange={(e) => setSpecificatie(prev => ({ ...prev, onderwerp: e.target.value }))}
                  placeholder="Bijvoorbeeld: Geschiedenis van de Tweede Wereldoorlog, Moleculaire biologie, Marketing strategieën..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Tips voor een goed onderwerp:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Wees specifiek: "Fotosynthese" i.p.v. "Biologie"</li>
                  <li>• Geef het hoofdstuk of thema aan als relevant</li>
                  <li>• Vermeld eventuele focus: theorie, praktijk, of beide</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Stap 7: Context */}
        {stap === 7 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              7. Kun je context geven van het onderwerp?
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Context en achtergrond informatie
                </label>
                <textarea
                  value={specificatie.context}
                  onChange={(e) => setSpecificatie(prev => ({ ...prev, context: e.target.value }))}
                  placeholder="Beschrijf de leerstof, belangrijke concepten, theorieën of praktische aspecten die in de toets aan bod moeten komen. Hoe meer detail, hoe beter de vragen aansluiten bij je onderwijs..."
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">✅ Goede context bevat:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Belangrijke begrippen en definities</li>
                  <li>• Theorieën of modellen die behandeld zijn</li>
                  <li>• Praktische toepassingen of voorbeelden</li>
                  <li>• Specifieke leerdoelen of competenties</li>
                  <li>• Eventuele bronnen of literatuur</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Navigatie */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setStap(Math.max(1, stap - 1))}
            disabled={stap === 1}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Vorige
          </button>

          {stap < 7 ? (
            <button
              onClick={() => setStap(stap + 1)}
              disabled={!kanDoorgaan()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Volgende
            </button>
          ) : (
            <button
              onClick={genereerToets}
              disabled={!kanDoorgaan() || isGenerating}
              className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Toets wordt gegenereerd...</span>
                </>
              ) : (
                <>
                  <span>🎯 Genereer Toets</span>
                </>
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}