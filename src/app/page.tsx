import ToetsOntwikkelaar from '@/components/ToetsOntwikkelaar'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Toets Ontwikkelaar
          </h1>
          
          <p className="text-xl text-blue-700 font-medium mb-6">
            AI-gestuurde tool voor het ontwikkelen van professionele kennistoetsen
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              🎯 Wat kan deze tool voor je doen?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">✓</span>
                <span>Meerkeuzevragen, juist/onjuist vragen en open vragen genereren</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">✓</span>
                <span>Vragen op verschillende Bloom-niveaus (kennis tot evaluatie)</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">✓</span>
                <span>Aangepast aan jouw onderwijsniveau en vakgebied</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <ToetsOntwikkelaar />
      </div>
    </div>
  )
}