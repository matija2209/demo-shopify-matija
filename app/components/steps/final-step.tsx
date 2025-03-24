import { useFormStore } from "~/lib/store"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"

import { z } from "zod"


import SkincareSummary from "../skincare-summary"

import { SkincareSummarySheet } from "../skincare-sheet"
import { useFormStep } from "~/hooks/use-form-step"
import DeveloperProfile from "../developer-profile"


function FinalStep({ step }: { step: number }) {
  const { formData, resetForm, setCurrentStep } = useFormStore()

  const { handleBack } = useFormStep({
    currentStep: step,
    schema: z.object({}),

  })



  const handleReset = () => {
    resetForm()
    setCurrentStep(1)
  }


  return (
    <div className="space-y-6 p-4">
      <Card noScale className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Preglejte svoj popoln profil nege kože</CardTitle>
          <CardDescription>
            Prosimo, preglejte vse informacije, ki ste jih posredovali. Lahko jih uredite ali začnete znova.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex justify-end mb-4">
            <SkincareSummarySheet data={formData} />
          </div>
          <SkincareSummary data={formData}></SkincareSummary>

          <DeveloperProfile></DeveloperProfile>

        </CardContent>
        <CardFooter className="flex justify-between">
          <Button back variant="outline" onClick={handleBack}>
            Nazaj
          </Button>
          <Button onClick={handleReset}>Začni znova</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default FinalStep