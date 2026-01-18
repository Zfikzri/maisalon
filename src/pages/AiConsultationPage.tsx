import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Sparkles, Shield, Camera, Eye, Scissors, Palette, ChevronDown, Wand2 } from 'lucide-react'
import { analyzeFaceForStyling, generateStylePreview, type StyleAnalysisResult } from '@/lib/gemini'
import toast from 'react-hot-toast'

export function AiConsultationPage() {
    const [uploadedImage, setUploadedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<StyleAnalysisResult | null>(null)
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})
    const [generatedPreview, setGeneratedPreview] = useState<string | null>(null)
    const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB')
            return
        }

        setUploadedImage(file)

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleAnalyze = async () => {
        if (!uploadedImage) return

        setIsAnalyzing(true)
        try {
            const analysis = await analyzeFaceForStyling(uploadedImage)
            setResult(analysis)
            toast.success('Analysis complete!')
        } catch (error: any) {
            toast.error(error.message || 'Analysis failed. Please try again.')
            console.error('AI Analysis Error:', error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleGeneratePreview = async () => {
        if (!uploadedImage || !result) return

        setIsGeneratingPreview(true)
        try {
            // Use the first (best) recommendation
            const bestHairstyle = result.hairstyles[0]
            const bestColor = result.colors[0]

            toast.loading('Creating your style preview...', { duration: 1000 })

            const previewImage = await generateStylePreview(uploadedImage, bestHairstyle, bestColor)
            setGeneratedPreview(previewImage)
            toast.success('Preview generated!')
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate preview. Please try again.')
            console.error('Preview Generation Error:', error)
        } finally {
            setIsGeneratingPreview(false)
        }
    }

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    const handleReset = () => {
        setUploadedImage(null)
        setImagePreview(null)
        setResult(null)
        setExpandedSections({})
        setGeneratedPreview(null)
    }

    return (
        <div className="pt-24 min-h-screen">
            <div className="mx-auto max-w-[1200px] px-4 md:px-20 py-12">
                {/* Page Heading */}
                <div className="mb-12">
                    <h1 className="text-[#1a170f] dark:text-white text-5xl font-black leading-tight tracking-tight mb-3">
                        AI Style Consultation
                    </h1>
                    <p className="text-soft-gray dark:text-primary/70 text-lg font-medium max-w-2xl">
                        Experience the future of beauty. Our AI-powered analysis provides personalized style recommendations based on your unique features.
                    </p>
                </div>

                {/* Main Interactive Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                    {/* Left: Upload Panel */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white dark:bg-[#2a261a] p-8 rounded-xl shadow-sm h-full flex flex-col">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Camera className="w-5 h-5 text-primary" />
                                Upload Your Photo
                            </h3>

                            <label
                                htmlFor="photo-upload"
                                className="flex-grow flex flex-col items-center justify-center p-10 min-h-[400px] bg-primary/5 dark:bg-primary/5 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors"
                            >
                                {imagePreview ? (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img src={imagePreview} alt="Uploaded" className="max-w-full max-h-[400px] object-contain rounded-lg" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-6 text-center max-w-xs">
                                        <div className="w-20 h-20 rounded-full bg-white dark:bg-[#332e1f] flex items-center justify-center shadow-md">
                                            <Upload className="w-10 h-10 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[#1a170f] dark:text-white text-lg font-bold mb-1">
                                                Drop your portrait here
                                            </p>
                                            <p className="text-sm text-soft-gray dark:text-gray-400 font-medium">
                                                For best results, use a clear, well-lit front-facing photo.
                                            </p>
                                        </div>
                                        <div className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-primary text-background-dark text-sm font-bold shadow-lg shadow-primary/20">
                                            Browse Files
                                        </div>
                                    </div>
                                )}
                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </label>

                            {imagePreview && !result && (
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing}
                                    className="mt-6 w-full h-12 bg-primary text-white rounded-lg font-bold hover:bg-accent-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Analyze with AI
                                        </>
                                    )}
                                </button>
                            )}

                            <div className="mt-6 flex items-start gap-3 p-4 bg-background-light dark:bg-[#332e1f] rounded-lg">
                                <Shield className="w-4 h-4 text-primary mt-0.5" />
                                <p className="text-xs text-soft-gray dark:text-gray-400 leading-relaxed">
                                    <strong>Privacy First:</strong> Your images are processed instantly and are never stored or shared with third parties.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Recommendations Panel */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white dark:bg-[#2a261a] p-8 rounded-xl shadow-sm h-full flex flex-col">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                Personalized Recommendations
                            </h3>

                            {result ? (
                                <div className="flex-grow space-y-6">
                                    {/* Face Shape & Skin Tone */}
                                    <div className="grid grid-cols-2 gap-4 p-6 bg-primary/5 rounded-xl">
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-soft-gray mb-1">Face Shape</p>
                                            <p className="text-xl font-bold text-primary capitalize">{result.faceShape}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-soft-gray mb-1">Skin Tone</p>
                                            <p className="text-xl font-bold text-primary capitalize">{result.skinTone}</p>
                                        </div>
                                    </div>

                                    {/* Hairstyle Recommendations */}
                                    <div>
                                        <h4 className="font-bold mb-3 flex items-center gap-2">
                                            <Scissors className="w-5 h-5 text-primary" />
                                            Recommended Hairst styles
                                        </h4>
                                        <div className="space-y-3">
                                            {result.hairstyles.map((style, index) => (
                                                <div key={index} className="bg-white dark:bg-[#332e1f] border border-primary/10 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => toggleSection(`hairstyle-${index}`)}
                                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-primary/5 transition-colors"
                                                    >
                                                        <span className="font-semibold text-left">{style.name}</span>
                                                        <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections[`hairstyle-${index}`] ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    {expandedSections[`hairstyle-${index}`] && (
                                                        <div className="px-4 pb-3 pt-1 text-sm text-soft-gray leading-relaxed border-t border-primary/10">
                                                            {style.reason}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color Recommendations */}
                                    <div>
                                        <h4 className="font-bold mb-3 flex items-center gap-2">
                                            <Palette className="w-5 h-5 text-primary" />
                                            Recommended Colors
                                        </h4>
                                        <div className="space-y-3">
                                            {result.colors.map((color, index) => (
                                                <div key={index} className="bg-white dark:bg-[#332e1f] border border-primary/10 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => toggleSection(`color-${index}`)}
                                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-primary/5 transition-colors"
                                                    >
                                                        <span className="font-semibold text-left">{color.name}</span>
                                                        <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections[`color-${index}`] ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    {expandedSections[`color-${index}`] && (
                                                        <div className="px-4 pb-3 pt-1 text-sm text-soft-gray leading-relaxed border-t border-primary/10">
                                                            {color.reason}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Generated Preview Section */}
                                    {generatedPreview ? (
                                        <div className="bg-gradient-to-br from-primary/10 to-accent-gold/10 p-6 rounded-xl border-2 border-primary/20">
                                            <h4 className="font-bold mb-3 flex items-center gap-2">
                                                <Wand2 className="w-5 h-5 text-primary" />
                                                Your Style Preview
                                            </h4>
                                            <div className="relative rounded-lg overflow-hidden">
                                                <img
                                                    src={generatedPreview}
                                                    alt="Style Preview"
                                                    className="w-full h-auto"
                                                />
                                                <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                                                    AI Generated
                                                </div>
                                            </div>
                                            <p className="text-sm text-soft-gray mt-3 text-center">
                                                Preview showing you with {result.hairstyles[0].name} and {result.colors[0].name}
                                            </p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleGeneratePreview}
                                            disabled={isGeneratingPreview}
                                            className="w-full h-12 bg-gradient-to-r from-primary to-accent-gold text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isGeneratingPreview ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Generating Preview...
                                                </>
                                            ) : (
                                                <>
                                                    <Wand2 className="w-5 h-5" />
                                                    See Yourself with This Style
                                                </>
                                            )}
                                        </button>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleReset}
                                            className="flex-1 h-11 rounded border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors"
                                        >
                                            Try Another Photo
                                        </button>
                                        <button
                                            onClick={() => window.location.href = '/booking'}
                                            className="flex-1 h-11 rounded bg-primary text-white font-bold hover:bg-accent-gold transition-colors"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-grow flex flex-col items-center justify-center gap-8 p-10 bg-background-light/50 dark:bg-background-dark/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                                    <div className="relative">
                                        <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-primary/10 to-transparent flex items-center justify-center">
                                            <div className="w-40 h-40 rounded-full bg-white dark:bg-[#332e1f] flex items-center justify-center shadow-inner">
                                                <Sparkles className="w-16 h-16 text-soft-gray/30 dark:text-[#4a4435]" />
                                            </div>
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary/40 animate-pulse" />
                                        <div className="absolute bottom-4 -left-4 w-3 h-3 rounded-full bg-primary/20" />
                                    </div>
                                    <div className="flex flex-col items-center gap-3 text-center max-w-sm">
                                        <p className="text-[#1a170f] dark:text-white text-2xl font-black">
                                            Your Transformation Awaits
                                        </p>
                                        <p className="text-soft-gray dark:text-gray-400 text-base leading-relaxed">
                                            Upload a photo to receive AI-powered facial analysis and personalized style recommendations from our expert system.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="pt-10 border-t border-[#f2f0e8] dark:border-[#3a3528]">
                    <h2 className="text-2xl font-bold mb-10 text-center tracking-tight">
                        Three Steps to Your New Look
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Camera,
                                title: '01. Upload',
                                description: 'Share a clear front-facing photo. Our system works best with natural lighting.'
                            },
                            {
                                icon: Eye,
                                title: '02. Analyze',
                                description: 'Gemini AI analyzes your unique face shape, skin undertones, and features in seconds.'
                            },
                            {
                                icon: Scissors,
                                title: '03. Discover',
                                description: 'Receive expert hairstyle and color suggestions personalized just for you.'
                            }
                        ].map((step, index) => (
                            <motion.div
                                key={step.title}
                                className="flex flex-col items-center text-center group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                    <step.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h4 className="text-lg font-bold mb-3 uppercase tracking-wider text-xs">
                                    {step.title}
                                </h4>
                                <p className="text-soft-gray dark:text-gray-400 text-sm leading-relaxed max-w-[240px]">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
