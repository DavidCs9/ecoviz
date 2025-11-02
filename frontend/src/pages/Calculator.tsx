import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Input } from '../components/ui/input'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { Checkbox } from '../components/ui/checkbox'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useToast } from '../hooks/use-toast'
import { useDataPersistence } from '../stores/dataStore'
import { Progress } from '../components/ui/progress'
import { v4 as uuidv4 } from 'uuid'

const API_URL = import.meta.env.VITE_API_URL
const steps = ['Housing', 'Transportation', 'Food', 'Consumption']

const loadingFacts = [
  'Did you know? A single tree can absorb up to 48 pounds of CO2 per year.',
  'Fun fact: The average person generates about 4.5 tons of CO2 per year.',
  'Tip: Reducing your meat consumption can significantly lower your carbon footprint.',
  'Interesting: Renewable energy sources made up 26% of global electricity generation in 2018.',
  'Fact: The transportation sector accounts for about 14% of global greenhouse gas emissions.',
  'Did you know? LED lights use up to 90% less energy than traditional incandescent bulbs.',
  'Tip: Using public transportation can significantly reduce your carbon footprint.',
]

export function Calculator() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { validateAndSaveData } = useDataPersistence()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentFact, setCurrentFact] = useState('')
  const [isFinalizingDetails, setIsFinalizingDetails] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    // Location
    zipCode: '',

    // Housing & Energy
    housingType: '',
    householdSize: '',
    monthlyElectricityBill: '',
    usesNaturalGas: false,
    monthlyNaturalGasBill: '',
    usesHeatingOil: false,
    heatingOilFillsPerYear: '',
    heatingOilTankSizeGallons: '',

    // Transportation
    carMake: '',
    carModel: '',
    carYear: '',
    commuteMilesOneWay: '',
    commuteDaysPerWeek: '',
    weeklyErrandsMilesRange: '',
    weeklyBusMiles: '',
    weeklyTrainMiles: '',
    flightsUnder3Hours: '',
    flights3To6Hours: '',
    flightsOver6Hours: '',

    // Food
    dietDescription: '',

    // Consumption
    shoppingFrequencyDescription: '',
    recycledMaterials: [] as string[],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
    // Track when user inputs data
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prevData => ({ ...prevData, [name]: value }))
    // Track when user selects an option
  }

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormData(prevData => ({ ...prevData, [name]: checked }))
  }

  // Removed unused handleMultiSelectChange function

  const handleNext = () => {
    setCurrentStep(prevStep => {
      const nextStep = prevStep + 1
      // Track when user moves to next step
      return nextStep
    })
  }

  const handlePrevious = () => {
    setCurrentStep(prevStep => {
      const nextStep = prevStep - 1
      // Track when user moves to previous step
      return nextStep
    })
  }

  // Validation function for each step
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0: {
        // Housing - Required: zipCode, householdSize, monthlyElectricityBill
        const hasBasicHousing =
          formData.zipCode.trim() !== '' &&
          formData.householdSize.trim() !== '' &&
          formData.monthlyElectricityBill.trim() !== ''

        // If natural gas is selected, require gas bill
        const naturalGasValid =
          !formData.usesNaturalGas || (formData.usesNaturalGas && formData.monthlyNaturalGasBill.trim() !== '')

        // If heating oil is selected, require fills per year and tank size
        const heatingOilValid =
          !formData.usesHeatingOil ||
          (formData.usesHeatingOil &&
            formData.heatingOilFillsPerYear.trim() !== '' &&
            formData.heatingOilTankSizeGallons.trim() !== '')

        return hasBasicHousing && naturalGasValid && heatingOilValid
      }

      case 1: {
        // Transportation - At least one transportation method should have data
        const hasCar =
          formData.carMake.trim() !== '' && formData.carModel.trim() !== '' && formData.carYear.trim() !== ''
        const hasCommute = formData.commuteMilesOneWay.trim() !== '' && formData.commuteDaysPerWeek.trim() !== ''
        const hasErrands = formData.weeklyErrandsMilesRange.trim() !== ''
        const hasPublicTransit = formData.weeklyBusMiles.trim() !== '' || formData.weeklyTrainMiles.trim() !== ''
        const hasFlights =
          formData.flightsUnder3Hours.trim() !== '' ||
          formData.flights3To6Hours.trim() !== '' ||
          formData.flightsOver6Hours.trim() !== ''

        return hasCar || hasCommute || hasErrands || hasPublicTransit || hasFlights
      }

      case 2: // Food
        return formData.dietDescription.trim() !== ''

      case 3: {
        // Consumption
        const hasShoppingFrequency = formData.shoppingFrequencyDescription.trim() !== ''
        const hasRecycling = formData.recycledMaterials.length > 0
        return hasShoppingFrequency && hasRecycling
      }

      default:
        return true
    }
  }

  useEffect(() => {
    // Check if user has an ID in localStorage
    let userId = localStorage.getItem('ecoviz_user_id')
    // If not, generate a new UUID and store it
    if (!userId) {
      userId = uuidv4()
      localStorage.setItem('ecoviz_user_id', userId)
    }

    let progressInterval: NodeJS.Timeout | undefined
    let factInterval: NodeJS.Timeout | undefined

    if (isLoading) {
      setCurrentFact(loadingFacts[Math.floor(Math.random() * loadingFacts.length)])

      progressInterval = setInterval(() => {
        setLoadingProgress(oldProgress => {
          if (oldProgress >= 100) {
            clearInterval(progressInterval)
            setIsFinalizingDetails(true)
            return 100
          }
          return oldProgress + 0.5 // Increases by 0.5% every 100ms
        })
      }, 100)

      // Change fact every 5 seconds
      factInterval = setInterval(() => {
        setCurrentFact(loadingFacts[Math.floor(Math.random() * loadingFacts.length)])
      }, 5000)
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval)
      if (factInterval) clearInterval(factInterval)
    }
  }, [isLoading])

  const transformUserInputToBackendFormat = () => {
    // Map user-friendly inputs to backend format
    const mapDietDescription = (description: string) => {
      switch (description) {
        case 'Meat in most meals':
          return 'meat-heavy'
        case 'Meat a few times a week':
          return 'average'
        case 'Vegetarian (no meat)':
          return 'vegetarian'
        case 'Vegan (no animal products)':
          return 'vegan'
        default:
          return 'average'
      }
    }

    const mapShoppingFrequency = (description: string) => {
      switch (description) {
        case 'I buy new things frequently.':
          return 'frequent'
        case 'I buy new things every now and then.':
          return 'average'
        case 'I rarely buy new things and prefer second-hand.':
          return 'minimal'
        default:
          return 'average'
      }
    }

    const mapRecyclingHabits = (materials: string[]) => {
      if (materials.includes('None of these')) {
        return 'none'
      }
      if (materials.length >= 3) {
        return 'all'
      }
      if (materials.length >= 1) {
        return 'some'
      }
      return 'none'
    }

    const mapErrandsMiles = (range: string) => {
      switch (range) {
        case '0-25':
          return 12.5
        case '25-50':
          return 37.5
        case '50-100':
          return 75
        case '100+':
          return 125
        default:
          return 37.5
      }
    }

    // Calculate annual values from user inputs
    const commuteMiles = parseFloat(formData.commuteMilesOneWay) * 2 * parseFloat(formData.commuteDaysPerWeek) * 52
    const errandsMiles = mapErrandsMiles(formData.weeklyErrandsMilesRange) * 52
    const totalMilesDriven = commuteMiles + errandsMiles

    const annualBusMiles = parseFloat(formData.weeklyBusMiles) * 52
    const annualTrainMiles = parseFloat(formData.weeklyTrainMiles) * 52

    const shortHaulFlights = parseInt(formData.flightsUnder3Hours)
    const longHaulFlights = parseInt(formData.flights3To6Hours) + parseInt(formData.flightsOver6Hours)

    const annualHeatingOil = formData.usesHeatingOil
      ? parseFloat(formData.heatingOilFillsPerYear) * parseFloat(formData.heatingOilTankSizeGallons)
      : 0

    return {
      housing: {
        type: formData.housingType || 'apartment',
        size: parseInt(formData.householdSize) || 1,
        energy: {
          electricity: (parseFloat(formData.monthlyElectricityBill) * 12) / 0.12 || 0, // Assuming $0.12/kWh average
          naturalGas: formData.usesNaturalGas
            ? (parseFloat(formData.monthlyNaturalGasBill) * 12) / 1.2 || 0 // Assuming $1.2/therm average
            : 0,
          heatingOil: annualHeatingOil,
        },
      },
      transportation: {
        car: {
          milesDriven: totalMilesDriven || 0,
          fuelEfficiency: 25, // Default, will be replaced by backend API call
        },
        publicTransit: {
          busMiles: annualBusMiles || 0,
          trainMiles: annualTrainMiles || 0,
        },
        flights: {
          shortHaul: shortHaulFlights || 0,
          longHaul: longHaulFlights || 0,
        },
      },
      food: {
        dietType: mapDietDescription(formData.dietDescription),
        wasteLevel: 'average', // Default for now
      },
      consumption: {
        shoppingHabits: mapShoppingFrequency(formData.shoppingFrequencyDescription),
        recyclingHabits: mapRecyclingHabits(formData.recycledMaterials),
      },
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setLoadingProgress(0)

    try {
      const userId = localStorage.getItem('ecoviz_user_id')

      // Create user-friendly input payload
      const userInputPayload = {
        location: { zipCode: formData.zipCode },
        housing: {
          monthlyElectricityBill: parseFloat(formData.monthlyElectricityBill) || 0,
          usesNaturalGas: formData.usesNaturalGas,
          monthlyNaturalGasBill: parseFloat(formData.monthlyNaturalGasBill) || 0,
          usesHeatingOil: formData.usesHeatingOil,
          heatingOilFillsPerYear: parseFloat(formData.heatingOilFillsPerYear) || 0,
          heatingOilTankSizeGallons: parseFloat(formData.heatingOilTankSizeGallons) || 0,
        },
        transportation: {
          car: {
            make: formData.carMake,
            model: formData.carModel,
            year: parseInt(formData.carYear) || 2020,
            commuteMilesOneWay: parseFloat(formData.commuteMilesOneWay) || 0,
            commuteDaysPerWeek: parseFloat(formData.commuteDaysPerWeek) || 0,
            weeklyErrandsMilesRange: formData.weeklyErrandsMilesRange || '25-50',
          },
          publicTransit: {
            weeklyBusMiles: parseFloat(formData.weeklyBusMiles) || 0,
            weeklyTrainMiles: parseFloat(formData.weeklyTrainMiles) || 0,
          },
          flights: {
            under3Hours: parseInt(formData.flightsUnder3Hours) || 0,
            between3And6Hours: parseInt(formData.flights3To6Hours) || 0,
            over6Hours: parseInt(formData.flightsOver6Hours) || 0,
          },
        },
        food: {
          dietDescription: formData.dietDescription,
        },
        consumption: {
          shoppingFrequencyDescription: formData.shoppingFrequencyDescription,
          recycledMaterials: formData.recycledMaterials,
        },
      }

      const requestPayload = {
        userId: userId,
        userInput: userInputPayload,
      }

      const response = await fetch(`${API_URL}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()

      const resultsData = {
        carbonFootprint: result.carbonFootprint,
        calculationData: transformUserInputToBackendFormat(), // For display purposes
        aiAnalysis: result.aiAnalysis,
        averages: result.averages,
      }

      // Save using Zustand store with Zod validation
      const saveResult = validateAndSaveData(resultsData)
      if (!saveResult.success) {
        throw new Error(`Data validation failed: ${saveResult.error}`)
      }

      navigate('/results')
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Calculation Failed',
        description: 'Failed to calculate carbon footprint. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setLoadingProgress(0)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="space-y-2 md:space-y-3">
              <div>
                <Label htmlFor="zipCode" className="text-sm md:text-base">
                  What's your ZIP code?
                </Label>
                <Input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="e.g., 90210"
                  className="text-sm md:text-base"
                />
                <p className="text-xs md:text-sm text-gray-500 mt-1">We use this to estimate local energy costs</p>
              </div>
              <div>
                <Label htmlFor="householdSize" className="text-sm md:text-base">
                  How many people live in your home?
                </Label>
                <Input
                  type="number"
                  id="householdSize"
                  name="householdSize"
                  value={formData.householdSize}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 for a couple, 4 for a family"
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label htmlFor="monthlyElectricityBill" className="text-sm md:text-base">
                  What's your average monthly electricity bill?
                </Label>
                <Input
                  type="number"
                  id="monthlyElectricityBill"
                  name="monthlyElectricityBill"
                  value={formData.monthlyElectricityBill}
                  onChange={handleInputChange}
                  placeholder="e.g., 150"
                  className="text-sm md:text-base"
                />
                <p className="text-xs md:text-sm text-gray-500 mt-1">Enter the dollar amount (without $ sign)</p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="usesNaturalGas"
                    checked={formData.usesNaturalGas}
                    onCheckedChange={handleCheckboxChange('usesNaturalGas')}
                  />
                  <Label htmlFor="usesNaturalGas">I use natural gas</Label>
                </div>
                {formData.usesNaturalGas && (
                  <div className="mt-2">
                    <Label htmlFor="monthlyNaturalGasBill">What's your average monthly natural gas bill?</Label>
                    <Input
                      type="number"
                      id="monthlyNaturalGasBill"
                      name="monthlyNaturalGasBill"
                      value={formData.monthlyNaturalGasBill}
                      onChange={handleInputChange}
                      placeholder="e.g., 40"
                    />
                    <p className="text-sm text-gray-500 mt-1">Enter the dollar amount (without $ sign)</p>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="usesHeatingOil"
                    checked={formData.usesHeatingOil}
                    onCheckedChange={handleCheckboxChange('usesHeatingOil')}
                  />
                  <Label htmlFor="usesHeatingOil">I use heating oil</Label>
                </div>
                {formData.usesHeatingOil && (
                  <div className="mt-2 space-y-2">
                    <div>
                      <Label htmlFor="heatingOilFillsPerYear">How many times per year do you fill your tank?</Label>
                      <Input
                        type="number"
                        id="heatingOilFillsPerYear"
                        name="heatingOilFillsPerYear"
                        value={formData.heatingOilFillsPerYear}
                        onChange={handleInputChange}
                        placeholder="e.g., 3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="heatingOilTankSizeGallons">What's your tank size (gallons)?</Label>
                      <Input
                        type="number"
                        id="heatingOilTankSizeGallons"
                        name="heatingOilTankSizeGallons"
                        value={formData.heatingOilTankSizeGallons}
                        onChange={handleInputChange}
                        placeholder="e.g., 275"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )
      case 1:
        return (
          <>
            <div className="space-y-2 md:space-y-3">
              <div className="space-y-1 md:space-y-2">
                <Label className="text-sm md:text-base">What is your primary car?</Label>
                <div className="grid grid-cols-3 gap-1 md:gap-2">
                  <div>
                    <Label htmlFor="carMake" className="text-xs md:text-sm">
                      Make
                    </Label>
                    <Input
                      type="text"
                      id="carMake"
                      name="carMake"
                      value={formData.carMake}
                      onChange={handleInputChange}
                      placeholder="e.g., Honda"
                      className="text-xs md:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carModel" className="text-xs md:text-sm">
                      Model
                    </Label>
                    <Input
                      type="text"
                      id="carModel"
                      name="carModel"
                      value={formData.carModel}
                      onChange={handleInputChange}
                      placeholder="e.g., Civic"
                      className="text-xs md:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carYear" className="text-xs md:text-sm">
                      Year
                    </Label>
                    <Input
                      type="number"
                      id="carYear"
                      name="carYear"
                      value={formData.carYear}
                      onChange={handleInputChange}
                      placeholder="e.g., 2021"
                      className="text-xs md:text-base"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="commuteMilesOneWay" className="text-sm md:text-base">
                  How many miles is your daily commute (one way)?
                </Label>
                <Input
                  type="number"
                  id="commuteMilesOneWay"
                  name="commuteMilesOneWay"
                  value={formData.commuteMilesOneWay}
                  onChange={handleInputChange}
                  placeholder="e.g., 15"
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label htmlFor="commuteDaysPerWeek" className="text-sm md:text-base">
                  How many days per week do you commute?
                </Label>
                <Select onValueChange={handleSelectChange('commuteDaysPerWeek')} value={formData.commuteDaysPerWeek}>
                  <SelectTrigger className="text-sm md:text-base">
                    <SelectValue placeholder="Select days per week" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 days</SelectItem>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="2">2 days</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="4">4 days</SelectItem>
                    <SelectItem value="5">5 days</SelectItem>
                    <SelectItem value="6">6 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm md:text-base">
                  Excluding commute, how many miles do you drive per week for errands, leisure, etc.?
                </Label>
                <RadioGroup
                  onValueChange={handleSelectChange('weeklyErrandsMilesRange')}
                  value={formData.weeklyErrandsMilesRange}
                  className="space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0-25" id="errands-0-25" />
                    <Label htmlFor="errands-0-25" className="text-sm md:text-base">
                      0-25 miles
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="25-50" id="errands-25-50" />
                    <Label htmlFor="errands-25-50" className="text-sm md:text-base">
                      25-50 miles
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="50-100" id="errands-50-100" />
                    <Label htmlFor="errands-50-100" className="text-sm md:text-base">
                      50-100 miles
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="100+" id="errands-100+" />
                    <Label htmlFor="errands-100+" className="text-sm md:text-base">
                      100+ miles
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="weeklyBusMiles" className="text-sm md:text-base">
                  In a typical week, how many miles do you travel by bus?
                </Label>
                <Input
                  type="number"
                  id="weeklyBusMiles"
                  name="weeklyBusMiles"
                  value={formData.weeklyBusMiles}
                  onChange={handleInputChange}
                  placeholder="e.g., 20"
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label htmlFor="weeklyTrainMiles" className="text-sm md:text-base">
                  In a typical week, how many miles do you travel by train?
                </Label>
                <Input
                  type="number"
                  id="weeklyTrainMiles"
                  name="weeklyTrainMiles"
                  value={formData.weeklyTrainMiles}
                  onChange={handleInputChange}
                  placeholder="e.g., 10"
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">In the past year, how many flights did you take?</Label>
                <div className="space-y-1 md:space-y-2 mt-1">
                  <div>
                    <Label htmlFor="flightsUnder3Hours" className="text-xs md:text-sm">
                      Under 3 hours
                    </Label>
                    <Input
                      type="number"
                      id="flightsUnder3Hours"
                      name="flightsUnder3Hours"
                      value={formData.flightsUnder3Hours}
                      onChange={handleInputChange}
                      placeholder="e.g., 4"
                      className="text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="flights3To6Hours" className="text-xs md:text-sm">
                      Between 3 and 6 hours
                    </Label>
                    <Input
                      type="number"
                      id="flights3To6Hours"
                      name="flights3To6Hours"
                      value={formData.flights3To6Hours}
                      onChange={handleInputChange}
                      placeholder="e.g., 2"
                      className="text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="flightsOver6Hours" className="text-xs md:text-sm">
                      Over 6 hours
                    </Label>
                    <Input
                      type="number"
                      id="flightsOver6Hours"
                      name="flightsOver6Hours"
                      value={formData.flightsOver6Hours}
                      onChange={handleInputChange}
                      placeholder="e.g., 1"
                      className="text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      case 2:
        return (
          <>
            <div className="space-y-3">
              <div>
                <Label>Which of these best describes your diet?</Label>
                <RadioGroup onValueChange={handleSelectChange('dietDescription')} value={formData.dietDescription}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Meat in most meals" id="meat-most" />
                    <Label htmlFor="meat-most">Meat in most meals</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Meat a few times a week" id="meat-few" />
                    <Label htmlFor="meat-few">Meat a few times a week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Vegetarian (no meat)" id="vegetarian" />
                    <Label htmlFor="vegetarian">Vegetarian (no meat)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Vegan (no animal products)" id="vegan" />
                    <Label htmlFor="vegan">Vegan (no animal products)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </>
        )
      case 3:
        return (
          <>
            <div className="space-y-3">
              <div>
                <Label>When it comes to buying new items (clothes, electronics, etc.), my style is...</Label>
                <RadioGroup
                  onValueChange={handleSelectChange('shoppingFrequencyDescription')}
                  value={formData.shoppingFrequencyDescription}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="I buy new things frequently." id="shop-frequent" />
                    <Label htmlFor="shop-frequent">I buy new things frequently.</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="I buy new things every now and then." id="shop-moderate" />
                    <Label htmlFor="shop-moderate">I buy new things every now and then.</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="I rarely buy new things and prefer second-hand." id="shop-minimal" />
                    <Label htmlFor="shop-minimal">I rarely buy new things and prefer second-hand.</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>Which materials do you consistently recycle?</Label>
                <p className="text-sm text-gray-500 mb-2">Select all that apply</p>
                <div className="space-y-2">
                  {['Paper & Cardboard', 'Plastics', 'Glass', 'Aluminum & Steel Cans', 'None of these'].map(
                    material => (
                      <div key={material} className="flex items-center space-x-2">
                        <Checkbox
                          id={`recycle-${material}`}
                          checked={formData.recycledMaterials.includes(material)}
                          onCheckedChange={(checked: boolean) => {
                            if (material === 'None of these') {
                              // Clear all others if "None of these" is selected
                              setFormData(prev => ({
                                ...prev,
                                recycledMaterials: checked ? ['None of these'] : [],
                              }))
                            } else {
                              // Remove "None of these" if any other option is selected
                              const newMaterials = checked
                                ? [...formData.recycledMaterials.filter(m => m !== 'None of these'), material]
                                : formData.recycledMaterials.filter(m => m !== material)
                              setFormData(prev => ({
                                ...prev,
                                recycledMaterials: newMaterials,
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={`recycle-${material}`}>{material}</Label>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-3 md:p-4">
      <Card className="bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="space-y-1 py-3 md:py-4">
          <CardTitle className="text-xl md:text-2xl font-bold text-green-800">Carbon Footprint Calculator</CardTitle>
          <CardDescription className="text-green-600 text-sm md:text-base">
            {isLoading
              ? isFinalizingDetails
                ? 'Finalizing details...'
                : 'Calculating your carbon footprint...'
              : `Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep]}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="py-3 md:py-4 max-h-[50vh] md:max-h-[55vh] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Progress value={loadingProgress} className="w-full" />
              <p className="text-center text-green-700 text-sm md:text-base">{currentFact}</p>
              {isFinalizingDetails && (
                <p className="text-center text-yellow-600 text-sm md:text-base">
                  We're taking a bit longer than usual to ensure accuracy. Thank you for your patience!
                </p>
              )}
            </div>
          ) : (
            renderStep()
          )}
        </CardContent>
        <CardFooter className="flex justify-between py-3 md:py-4">
          {isLoading ? (
            <Button disabled variant="outline" className="w-full">
              {isFinalizingDetails ? 'Finalizing...' : 'Calculating...'}
            </Button>
          ) : (
            <>
              <Button onClick={handlePrevious} disabled={currentStep === 0} variant="outline">
                Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} disabled={!isStepValid(currentStep)}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!isStepValid(currentStep)} variant="default">
                  Calculate
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
