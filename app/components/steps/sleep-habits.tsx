import { z } from "zod"
import { useFormStep } from "~/hooks/use-form-step"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form"
import { Moon, Sun, Coffee } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { cn } from "~/lib/utils"

const sleepHabitsSchema = z.object({
  sleepHabits: z.enum(["GOOD", "IRREGULAR", "POOR"], {
    required_error: "Please select your sleep habits",
  })
})

const sleepOptions = [
  {
    value: "GOOD",
    label: "Dober urnik spanja",
    description: "7-9 ur rednega spanja",
    icon: Moon,
    effects: ["Optimalna obnova kože", "Naravna regeneracija celic", "Uravnoteženi hormoni"],
    recommendations: ["Nočna obnova", "Nočna hidratacija"]
  },
  {
    value: "IRREGULAR",
    label: "Nereden vzorec spanja",
    description: "Nedosleden urnik spanja",
    icon: Sun,
    effects: ["Motnje kožnega cikla", "Znaki stresa", "Neenakomeren ten"],
    recommendations: ["Sproščanje stresa", "Podpora pri okrevanju"]
  },
  {
    value: "POOR",
    label: "Slaba kakovost spanja",
    description: "Manj kot 6 ur spanja",
    icon: Coffee,
    effects: ["Temni kolobarji", "Medel obraz", "Prezgodnje staranje"],
    recommendations: ["Posvetlitev", "Proti utrujenosti"]
  }
]

type SleepHabitsForm = z.infer<typeof sleepHabitsSchema>

function SleepHabitsStep({ step }: { step: number }) {
  const { form, handleBack, handleNext } = useFormStep<SleepHabitsForm>({
    schema: sleepHabitsSchema,
    currentStep: step,
  })

  return (
    <Card noScale className="border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Spalne navade</CardTitle>
        <CardDescription className="text-lg max-w-2xl mx-auto">
          Kako bi opisali svoj vzorec spanja?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
            <FormField
              control={form.control}
              name="sleepHabits"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      {sleepOptions.map((option) => (
                        <div
                          key={option.value}
                          className={cn(
                            "relative rounded-xl border min-h-[300px] transition-all duration-700 ease-in-out cursor-pointer overflow-hidden",
                            field.value === option.value
                              ? "ring-2 ring-primary shadow-lg"
                              : "hover:bg-accent/50",
                            field.value === option.value && option.value === "GOOD" && "night-mode"
                          )}
                          onClick={() => field.onChange(option.value)}
                        >
                          {/* Background Effects Container */}
                          <div className="absolute inset-0 z-0">
                            {/* Night sky background - always present but only visible for good sleep */}
                            <div
                              className={cn(
                                "absolute inset-0 transition-opacity duration-700",
                                field.value === option.value && option.value === "GOOD"
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            >
                              {/* Stars */}
                              <div className="stars absolute inset-0 z-10">
                                {[...Array(30)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="star absolute w-1 h-1 bg-white rounded-full"
                                    style={{
                                      top: `${Math.random() * 100}%`,
                                      left: `${Math.random() * 100}%`,
                                      animation: `twinkle ${1 + Math.random() * 2}s infinite ${Math.random() * 2}s`
                                    }}
                                  />
                                ))}
                              </div>

                              {/* Moon */}
                              <div
                                className={cn(
                                  "moon absolute top-4 right-4 w-16 h-16 rounded-full transition-all duration-700",
                                  "bg-gradient-to-br from-[#ECF6FF] to-[#D1E5FF]",
                                  "shadow-[0_0_50px_#4A6CF7]",
                                  field.value === option.value && option.value === "GOOD"
                                    ? "scale-100 opacity-100"
                                    : "scale-0 opacity-0"
                                )}
                              />
                            </div>
                          </div>

                          {/* Content Container */}
                          <div className="relative z-10 p-6">
                            {/* Radio button */}
                            <div className="absolute top-0 right-0">
                              <RadioGroupItem value={option.value} id={option.value} />
                            </div>

                            {/* Content */}
                            <div className={cn(
                              "transition-colors duration-700",
                              field.value === option.value && option.value === "GOOD" ? "text-white" : ""
                            )}>
                              <div className="flex items-center gap-2 mb-4">
                                <option.icon className="w-5 h-5" />
                                <h3 className="font-semibold">{option.label}</h3>
                              </div>
                              <p className="text-sm mb-4 opacity-90">{option.description}</p>

                              <div className="space-y-3">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Effects on Skin</h4>
                                  <ul className="space-y-1">
                                    {option.effects.map((effect, index) => (
                                      <li
                                        key={index}
                                        className={cn(
                                          "text-sm flex items-center gap-2",
                                          field.value === option.value && option.value === "GOOD"
                                            ? "text-white/80"
                                            : "text-muted-foreground"
                                        )}
                                      >
                                        <span className="w-1 h-1 rounded-full bg-primary" />
                                        {effect}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {option.recommendations.map((rec, index) => (
                                      <span
                                        key={index}
                                        className={cn(
                                          "inline-flex items-center px-2 py-1 rounded-full text-xs",
                                          field.value === option.value && option.value === "GOOD"
                                            ? "bg-white/20 text-white"
                                            : "bg-primary/10 text-primary"
                                        )}
                                      >
                                        {rec}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                back
              >
                Nazaj
              </Button>
              <Button
                type="submit"
                front
              >
                Nadaljuj
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SleepHabitsStep 