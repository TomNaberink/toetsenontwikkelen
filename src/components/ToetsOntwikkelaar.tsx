'use client'

import { useState, useRef } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import ResponseActions from './ResponseActions'

interface VraagTypeSpecificatie {
  type: string
  aantal: number
}

interface UploadedFile {
  id: string
  name: string
  content: string
  type: string
  size: number
}

interface ToetsSpecificatie {
  vraagTypes: VraagTypeSpecificatie[]
  niveau: string
  bloomNiveaus: string[]
  metCasus: boolean
  onderwerp: string
  context: string
  bijlagen: UploadedFile[]
  outputFormaat: 'samen' | 'apart'
}

export default function ToetsOntwikkelaar() {
  const [stap, setStap] = useState(1)
  const [specificatie, setSpecificatie] = useState<ToetsSpecificatie>({
    vraagTypes: [],
    niveau: '',
    bloomNiveaus: [],
    metCasus: false,
    onderwerp: '',
    context: '',
    bijlagen: [],
    outputFormaat: 'samen'
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [gegenereerdeToets, setGegenereerdeToets] = useState('')
  const [vragenVersie, setVragenVersie] = useState('')
  const [antwoordenVersie, setAntwoordenVersie] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const beschikbareVraagTypes = [
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

  const handleVraagTypeChange = (typeId: string, aantal: number) => {
    setSpecificatie(prev => {
      const bestaandeIndex = prev.vraagTypes.findIndex(vt => vt.type === typeId)
      
      if (aantal === 0) {
        // Verwijder het type als aantal 0 is
        return {
          ...prev,
          vraagTypes: prev.vraagTypes.filter(vt => vt.type !== typeId)
        }
      }
      
      if (bestaandeIndex >= 0) {
        // Update bestaand type
        const nieuweVraagTypes = [...prev.vraagTypes]
        nieuweVraagTypes[bestaandeIndex] = { type: typeId, aantal }
        return {
          ...prev,
          vraagTypes: nieuweVraagTypes
        }
      } else {
        // Voeg nieuw type toe
        return {
          ...prev,
          vraagTypes: [...prev.vraagTypes, { type: typeId, aantal }]
        }
      }
    })
  }

  const getTotaalAantalVragen = () => {
    return specificatie.vraagTypes.reduce((total, vt) => total + vt.aantal, 0)
  }

  const handleBloomNiveauChange = (niveau: string) => {
    setSpecificatie(prev => ({
      ...prev,
      bloomNiveaus: prev.bloomNiveaus.includes(niveau)
        ? prev.bloomNiveaus.filter(n => n !== niveau)
        : [...prev.bloomNiveaus, niveau]
    }))
  }

  const handleFileUpload = async (file: File) => {
    try {
      const fileName = file.name.toLowerCase()
      
      // Ondersteunde formaten (zonder PDF)
      const isText = fileName.endsWith('.txt') || fileName.endsWith('.md')
      const isDocument = fileName.endsWith('.docx')
      const isCsv = fileName.endsWith('.csv')
      
      if (!isText && !isDocument && !isCsv) {
        alert('Ondersteunde formaten: .txt, .md, .docx, .csv')
        return
      }

      let content = ''
      
      if (isText) {
        // Lees tekstbestanden direct
        content = await file.text()
      } else {
        // Voor DOCX/CSV gebruik de upload API
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload-docx', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Fout bij uploaden van document')
        }

        const data = await response.json()
        content = data.content
      }

      const uploadedFile: UploadedFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        content: content,
        type: file.type,
        size: file.size
      }

      setSpecificatie(prev => ({
        ...prev,
        bijlagen: [...prev.bijlagen, uploadedFile]
      }))

    } catch (error) {
      console.error('Upload error:', error)
      alert('Fout bij uploaden: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    }
  }

  const removeBijlage = (id: string) => {
    setSpecificatie(prev => ({
      ...prev,
      bijlagen: prev.bijlagen.filter(b => b.id !== id)
    }))
  }

  // Functie om vragen en antwoorden te scheiden
  const scheidVragenEnAntwoorden = (toetsContent: string) => {
    const lines = toetsContent.split('\n')
    let vragenContent = ''
    let antwoordenContent = ''
    let isInAntwoordenSectie = false
    
    // Zoek naar "DEEL 2" of "ANTWOORDEN" sectie
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (line.includes('DEEL 2') || line.includes('ANTWOORDEN') || line.includes('**ANTWOORDEN**')) {
        isInAntwoordenSectie = true
        antwoordenContent += line + '\n'
      } else if (isInAntwoordenSectie) {
        antwoordenContent += line + '\n'
      } else {
        vragenContent += line + '\n'
      }
    }
    
    // Als er geen duidelijke scheiding is, probeer op basis van patronen
    if (!isInAntwoordenSectie) {
      const vragenRegex = /^\d+\.\s/gm
      const antwoordRegex = /^(Antwoord|Uitleg|Bloom-niveau):/gm
      
      let currentVraag = ''
      let currentAntwoord = ''
      let isVraag = true
      
      for (const line of lines) {
        if (vragenRegex.test(line)) {
          if (currentVraag) vragenContent += currentVraag + '\n\n'
          if (currentAntwoord) antwoordenContent += currentAntwoord + '\n\n'
          currentVraag = line
          currentAntwoord = ''
          isVraag = true
        } else if (antwoordRegex.test(line) || line.includes('Bloom-niveau:')) {
          if (isVraag && currentVraag) {
            vragenContent += currentVraag + '\n\n'
            currentVraag = ''
          }
          currentAntwoord += line + '\n'
          isVraag = false
        } else if (isVraag) {
          currentVraag += '\n' + line
        } else {
          currentAntwoord += line + '\n'
        }
      }
      
      // Voeg laatste items toe
      if (currentVraag) vragenContent += currentVraag + '\n'
      if (currentAntwoord) antwoordenContent += currentAntwoord + '\n'
    }
    
    return { vragenContent: vragenContent.trim(), antwoordenContent: antwoordenContent.trim() }
  }

  // Functie om Word document te downloaden
  const downloadWordDocument = async (content: string, filename: string, title: string) => {
    try {
      // Import Packer dynamically
      const { Document, Paragraph, TextRun, HeadingLevel, Packer } = await import('docx')
      
      // Maak titel
      const titleParagraph = new Paragraph({
        children: [new TextRun({
          text: title,
          bold: true,
          size: 32,
          color: "2563eb"
        })],
        heading: HeadingLevel.TITLE,
        spacing: { after: 400 }
      })
      
      // Maak subtitel met toets info
      const vraagTypesBeschrijving = specificatie.vraagTypes.map(vt => {
        const type = beschikbareVraagTypes.find(bt => bt.id === vt.type)
        return `${vt.aantal}x ${type?.label.split(' ')[0] || vt.type}`
      }).join(', ')
      
      const subtitleParagraph = new Paragraph({
        children: [new TextRun({
          text: `${specificatie.onderwerp} | ${specificatie.niveau.toUpperCase()} | ${vraagTypesBeschrijving}`,
          italics: true,
          size: 20,
          color: "666666"
        })],
        spacing: { after: 600 }
      })
      
      // Converteer markdown content naar Word paragraphs
      const contentLines = content.split('\n')
      const paragraphs = [titleParagraph, subtitleParagraph]
      
      for (const line of contentLines) {
        if (line.trim() === '') {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: "" })],
            spacing: { after: 200 }
          }))
        } else if (line.startsWith('# ')) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({
              text: line.replace('# ', ''),
              bold: true,
              size: 28,
              color: "1f2937"
            })],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }))
        } else if (line.startsWith('## ')) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({
              text: line.replace('## ', ''),
              bold: true,
              size: 24,
              color: "374151"
            })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          }))
        } else if (line.match(/^\d+\.\s/)) {
          // Vraag nummering
          paragraphs.push(new Paragraph({
            children: [new TextRun({
              text: line,
              bold: true,
              size: 22
            })],
            spacing: { before: 300, after: 150 }
          }))
        } else if (line.startsWith('**') && line.endsWith('**')) {
          // Bold text
          paragraphs.push(new Paragraph({
            children: [new TextRun({
              text: line.replace(/\*\*/g, ''),
              bold: true,
              size: 20
            })],
            spacing: { after: 150 }
          }))
        } else {
          // Normale tekst
          paragraphs.push(new Paragraph({
            children: [new TextRun({
              text: line,
              size: 20
            })],
            spacing: { after: 120 }
          }))
        }
      }
      
      // Voeg footer toe
      const footerParagraph = new Paragraph({
        children: [new TextRun({
          text: `Gegenereerd op ${new Date().toLocaleDateString('nl-NL')} | Toets Ontwikkelaar AI`,
          size: 16,
          color: "9ca3af",
          italics: true
        })],
        spacing: { before: 600 }
      })
      paragraphs.push(footerParagraph)
      
      const doc = new Document({
        creator: "Toets Ontwikkelaar AI",
        title: title,
        description: `${specificatie.onderwerp} toets voor ${specificatie.niveau}`,
        sections: [{
          properties: {},
          children: paragraphs
        }]
      })
      
      const blob = await Packer.toBlob(doc)
      
      // Download
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Word download failed:', error)
      alert('Fout bij downloaden van Word document: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    }
  }

  const genereerToets = async () => {
    setIsGenerating(true)
    setError('')
    setGegenereerdeToets('')
    setVragenVersie('')
    setAntwoordenVersie('')

    try {
      // Bouw vraagtype beschrijving
      const vraagTypesBeschrijving = specificatie.vraagTypes.map(vt => {
        const type = beschikbareVraagTypes.find(bt => bt.id === vt.type)
        return `${vt.aantal}x ${type?.label || vt.type}`
      }).join(', ')

      // Bouw bijlagen context
      const bijlagenContext = specificatie.bijlagen.length > 0 
        ? `\n\n**Bijgevoegde documenten:**\n${specificatie.bijlagen.map(b => 
            `\n**${b.name}:**\n${b.content}`
          ).join('\n\n---\n')}`
        : ''

      // Bouw de prompt op basis van de specificaties
      const prompt = `
Je bent een toetsexpert die kennistoetsen ontwikkelt voor docenten. Ontwikkel een toets met de volgende specificaties:

**Toets Specificaties:**
- Vraagtypen en aantallen: ${vraagTypesBeschrijving}
- Totaal aantal vragen: ${getTotaalAantalVragen()}
- Onderwijsniveau: ${specificatie.niveau}
- Bloom-niveaus: ${specificatie.bloomNiveaus.join(', ')}
- Met casus: ${specificatie.metCasus ? 'Ja' : 'Nee'}
- Onderwerp: ${specificatie.onderwerp}
- Output formaat: ${specificatie.outputFormaat === 'samen' ? 'Vragen en antwoorden bij elkaar' : 'Eerst alle vragen, dan alle antwoorden apart'}

**Context en achtergrond:**
${specificatie.context}${bijlagenContext}

**Instructies voor vraagontwikkeling:**
1. Formuleer vragen eenduidig - één probleem per vraag
2. Bij meerkeuzevragen: slechts één alternatief is correct
3. Vermijd "alle/geen van bovenstaande" opties
4. Formuleer kort en zakelijk
5. Vermijd ontkennende vraagstellingen
6. Alle antwoordopties ongeveer even lang
7. Verdeel vragen over de gevraagde Bloom-niveaus
8. Maak precies het gevraagde aantal vragen per type

${specificatie.metCasus ? 'Begin met een korte, realistische casus die relevant is voor het onderwerp.' : ''}

**Output formaat:**
${specificatie.outputFormaat === 'samen' 
  ? `Geef elke vraag direct gevolgd door:
- Het Bloom-niveau
- Het juiste antwoord (bij gesloten vragen)
- Een korte uitleg waarom dit het juiste antwoord is

Format: Vraag → Antwoord → Uitleg, dan volgende vraag.`
  : `Deel de output op in twee secties:

**DEEL 1: VRAGEN**
Geef alle vragen genummerd, zonder antwoorden of uitleg.

**DEEL 2: ANTWOORDEN EN UITLEG**
Geef voor elke vraag (met nummer):
- Het Bloom-niveau
- Het juiste antwoord
- Een korte uitleg waarom dit het juiste antwoord is`
}

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
      
      // Als apart formaat is gekozen, splits de content
      if (specificatie.outputFormaat === 'apart') {
        const { vragenContent, antwoordenContent } = scheidVragenEnAntwoorden(data.response)
        setVragenVersie(vragenContent)
        setAntwoordenVersie(antwoordenContent)
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout opgetreden')
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setStap(1)
    setSpecificatie({
      vraagTypes: [],
      niveau: '',
      bloomNiveaus: [],
      metCasus: false,
      onderwerp: '',
      context: '',
      bijlagen: [],
      outputFormaat: 'samen'
    })
    setGegenereerdeToets('')
    setVragenVersie('')
    setAntwoordenVersie('')
    setError('')
  }

  const kanDoorgaan = () => {
    switch (stap) {
      case 1: return specificatie.vraagTypes.length > 0 && getTotaalAantalVragen() > 0
      case 2: return specificatie.niveau !== ''
      case 3: return specificatie.bloomNiveaus.length > 0
      case 4: return true // Casus is optioneel
      case 5: return specificatie.onderwerp.trim() !== ''
      case 6: return specificatie.context.trim() !== '' // Bijlagen zijn optioneel
      case 7: return true // Output formaat heeft default
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div><strong>Vraagtypen:</strong> {specificatie.vraagTypes.map(vt => {
                const type = beschikbareVraagTypes.find(bt => bt.id === vt.type)
                return `${vt.aantal}x ${type?.label.split(' ')[0] || vt.type}`
              }).join(', ')}</div>
              <div><strong>Totaal:</strong> {getTotaalAantalVragen()} vragen</div>
              <div><strong>Niveau:</strong> {specificatie.niveau}</div>
              <div><strong>Bloom:</strong> {specificatie.bloomNiveaus.join(', ')}</div>
              <div><strong>Casus:</strong> {specificatie.metCasus ? 'Ja' : 'Nee'}</div>
              <div><strong>Onderwerp:</strong> {specificatie.onderwerp}</div>
              <div><strong>Bijlagen:</strong> {specificatie.bijlagen.length} bestand(en)</div>
              <div><strong>Formaat:</strong> {specificatie.outputFormaat === 'samen' ? 'Vragen & antwoorden samen' : 'Vragen en antwoorden apart'}</div>
            </div>
          </div>

          {/* Toon verschillende versies afhankelijk van het gekozen formaat */}
          {specificatie.outputFormaat === 'samen' ? (
            // Samen formaat - toon alles in één blok
            <div>
              <div className="bg-white border rounded-lg p-6 mb-4">
                <MarkdownRenderer content={gegenereerdeToets} />
              </div>

              <ResponseActions 
                content={gegenereerdeToets}
                isMarkdown={true}
                className="mb-4"
              />

              {/* Extra Word download knop */}
              <div className="flex justify-center">
                <button
                  onClick={() => downloadWordDocument(
                    gegenereerdeToets, 
                    `Toets_${specificatie.onderwerp.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.docx`,
                    `Toets: ${specificatie.onderwerp}`
                  )}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>📄 Download Complete Toets (Word)</span>
                </button>
              </div>
            </div>
          ) : (
            // Apart formaat - toon twee aparte secties
            <div className="space-y-6">
              {/* Vragen sectie */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-blue-800">📝 Alleen Vragen</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadWordDocument(
                        vragenVersie, 
                        `Vragen_${specificatie.onderwerp.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.docx`,
                        `Vragen: ${specificatie.onderwerp}`
                      )}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download Vragen</span>
                    </button>
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <MarkdownRenderer content={vragenVersie} />
                </div>
                <ResponseActions 
                  content={vragenVersie}
                  isMarkdown={true}
                  className="mt-3"
                />
              </div>

              {/* Antwoorden sectie */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-green-800">✅ Antwoorden & Uitleg</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadWordDocument(
                        antwoordenVersie, 
                        `Antwoorden_${specificatie.onderwerp.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.docx`,
                        `Antwoorden: ${specificatie.onderwerp}`
                      )}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download Antwoorden</span>
                    </button>
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <MarkdownRenderer content={antwoordenVersie} />
                </div>
                <ResponseActions 
                  content={antwoordenVersie}
                  isMarkdown={true}
                  className="mt-3"
                />
              </div>

              {/* Centrale download knop voor beide versies */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => downloadWordDocument(
                    vragenVersie, 
                    `Vragen_${specificatie.onderwerp.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.docx`,
                    `Vragen: ${specificatie.onderwerp}`
                  )}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <span>📝 Download Alleen Vragen</span>
                </button>
                <button
                  onClick={() => downloadWordDocument(
                    antwoordenVersie, 
                    `Antwoorden_${specificatie.onderwerp.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.docx`,
                    `Antwoorden: ${specificatie.onderwerp}`
                  )}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <span>✅ Download Alleen Antwoorden</span>
                </button>
              </div>
            </div>
          )}
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

        {/* Stap 1: Flexibele vraagtype selectie */}
        {stap === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              1. Welke vraagtypen wil je en hoeveel van elk?
            </h2>
            <p className="text-gray-600 mb-6">Kies precies welke typen vragen je wilt en hoeveel van elk type</p>
            
            <div className="space-y-4">
              {beschikbareVraagTypes.map((type) => {
                const huidigAantal = specificatie.vraagTypes.find(vt => vt.type === type.id)?.aantal || 0
                
                return (
                  <div key={type.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{type.label}</h3>
                        <p className="text-sm text-gray-600">{type.beschrijving}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <label className="text-sm font-medium text-gray-700">Aantal:</label>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={huidigAantal}
                          onChange={(e) => handleVraagTypeChange(type.id, parseInt(e.target.value) || 0)}
                          className="w-16 p-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    {/* Snelkeuze knoppen */}
                    <div className="flex space-x-2">
                      {[1, 2, 3, 5, 10].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleVraagTypeChange(type.id, num)}
                          className={`px-3 py-1 text-xs rounded border transition-colors ${
                            huidigAantal === num
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      {huidigAantal > 0 && (
                        <button
                          onClick={() => handleVraagTypeChange(type.id, 0)}
                          className="px-3 py-1 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Wis
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {getTotaalAantalVragen() > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Overzicht geselecteerde vragen:</h4>
                <div className="text-sm text-blue-700">
                  {specificatie.vraagTypes.map(vt => {
                    const type = beschikbareVraagTypes.find(bt => bt.id === vt.type)
                    return (
                      <div key={vt.type}>• {vt.aantal}x {type?.label}</div>
                    )
                  })}
                  <div className="font-semibold mt-2 pt-2 border-t border-blue-300">
                    Totaal: {getTotaalAantalVragen()} vragen
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stap 2: Onderwijsniveau */}
        {stap === 2 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              2. Welk onderwijsniveau?
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

        {/* Stap 3: Bloom-niveaus */}
        {stap === 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              3. Van welke Bloom-niveaus moeten de vragen zijn?
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

        {/* Stap 4: Casus */}
        {stap === 4 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              4. Moet er een korte casus worden beschreven voor de vragen?
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

        {/* Stap 5: Onderwerp */}
        {stap === 5 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              5. Wat is het onderwerp van de vragen?
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

        {/* Stap 6: Context + Bijlagen */}
        {stap === 6 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              6. Context en bijlagen
            </h2>
            
            {/* Context textarea */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Context en achtergrond informatie
                </label>
                <textarea
                  value={specificatie.context}
                  onChange={(e) => setSpecificatie(prev => ({ ...prev, context: e.target.value }))}
                  placeholder="Beschrijf de leerstof, belangrijke concepten, theorieën of praktische aspecten die in de toets aan bod moeten komen..."
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Bijlagen sectie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bijlagen (optioneel)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="space-y-4">
                    <div>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-gray-600">Upload extra documenten voor context</p>
                      <p className="text-sm text-gray-500">DOCX, TXT, MD, CSV bestanden</p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Bestand Selecteren
                    </button>
                  </div>
                </div>

                {/* Geüploade bijlagen */}
                {specificatie.bijlagen.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-700">Geüploade bijlagen:</h4>
                    {specificatie.bijlagen.map((bijlage) => (
                      <div key={bijlage.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-800">{bijlage.name}</p>
                            <p className="text-sm text-gray-500">{(bijlage.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeBijlage(bijlage.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.txt,.md,.csv"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleFileUpload(file)
                  e.target.value = '' // Reset input
                }
              }}
              className="hidden"
            />
          </div>
        )}

        {/* Stap 7: Output formaat */}
        {stap === 7 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              7. Hoe wil je de toets hebben?
            </h2>
            <p className="text-gray-600 mb-6">Kies hoe je de vragen en antwoorden wilt zien</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  specificatie.outputFormaat === 'samen'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSpecificatie(prev => ({ ...prev, outputFormaat: 'samen' }))}
              >
                <h3 className="font-semibold text-gray-800 mb-2">📝 Vragen en antwoorden samen</h3>
                <p className="text-sm text-gray-600 mb-3">Elke vraag direct gevolgd door het antwoord en uitleg</p>
                <div className="text-xs text-gray-500 bg-white p-2 rounded border">
                  <strong>Voorbeeld:</strong><br/>
                  1. Vraag hier...<br/>
                  <em>Antwoord: A) Optie A</em><br/>
                  <em>Uitleg: Omdat...</em><br/><br/>
                  2. Volgende vraag...
                </div>
              </div>
              <div
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  specificatie.outputFormaat === 'apart'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSpecificatie(prev => ({ ...prev, outputFormaat: 'apart' }))}
              >
                <h3 className="font-semibold text-gray-800 mb-2">📋 Vragen en antwoorden apart</h3>
                <p className="text-sm text-gray-600 mb-3">Eerst alle vragen, dan alle antwoorden met uitleg</p>
                <div className="text-xs text-gray-500 bg-white p-2 rounded border">
                  <strong>Voorbeeld:</strong><br/>
                  <strong>VRAGEN:</strong><br/>
                  1. Vraag hier...<br/>
                  2. Volgende vraag...<br/><br/>
                  <strong>ANTWOORDEN:</strong><br/>
                  1. A) Uitleg...<br/>
                  2. B) Uitleg...
                </div>
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  <strong>💡 Bonus:</strong> Je krijgt 2 aparte Word documenten die je direct kunt downloaden!
                </div>
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