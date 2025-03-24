import { z } from "zod"
import { useFormStep } from "~/hooks/use-form-step"
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ageGroupSchema = z.object({
  ageGroup: z.enum([
    "TEENS",
    "TWENTIES",
    "THIRTIES",
    "FORTIES",
    "FIFTIES",
    "SIXTIES_PLUS"
  ], {
    required_error: "Please select your age group"
  })
})

type AgeGroupForm = z.infer<typeof ageGroupSchema>

export function AgeGroup({ step }: { step: number }) {
  const { form, handleBack, handleNext } = useFormStep<AgeGroupForm>({
    schema: ageGroupSchema,
    currentStep: step,
  })

  const ageGroupOptions = [
    {
      value: "TEENS",
      label: "najstniki (13-19)",
      description: "Osredotočenost na mastnobo in izpuščaje",
      skinFocus: "Nadzor mastnosti in preprečevanje aken",
      keyIngredients: [
        "Salicilna kislina",
        "Hialuronska kislina"
      ],
      bgColor: "bg-blue-50",
      imageUrl: "https://cdn.shopify.com/s/files/1/0924/5894/2788/files/teens.jpg?v=1742808290"
    },
    {
      value: "TWENTIES",
      label: "20 let",
      description: "Preventivna nega kože",
      skinFocus: "Ohranjanje zdravja kože in preprečevanje zgodnjih znakov staranja",
      keyIngredients: [
        "Hialuronska kislina",
        "Vitamin C",
        "Glikolna kislina"
      ],
      bgColor: "bg-pink-50",
      imageUrl: "https://cdn.shopify.com/s/files/1/0924/5894/2788/files/20s.jpg?v=1742808291"
    },
    {
      value: "THIRTIES",
      label: "30 let",
      description: "Proti staranju in hidratacija",
      skinFocus: "Obnavljanje hidratacije in zgodnje proti-staranje",
      keyIngredients: [
        "Retinol",
        "Hialuronska kislina",
        "Vitamin C"
      ],
      bgColor: "bg-purple-50",
      imageUrl: "https://cdn.shopify.com/s/files/1/0924/5894/2788/files/30s.jpg?v=1742808290"
    },
    {
      value: "FORTIES",
      label: "40 let",
      description: "Ciljanje pigmentnih madežev in finih gub",
      skinFocus: "Obravnava finih gub, gubic in neenakomerne barve kože",
      keyIngredients: [
        "Peptidi",
        "Retinol",
        "Hialuronska kislina"
      ],
      bgColor: "bg-orange-50",
      imageUrl: "https://cdn.shopify.com/s/files/1/0924/5894/2788/files/40s.jpg?v=1742808290"
    },
    {
      value: "FIFTIES",
      label: "50 let",
      description: "Obravnava teksture kože in znakov staranja",
      skinFocus: "Izboljšanje teksture kože, zmanjšanje pigmentnih madežev",
      keyIngredients: [
        "Peptidi",
        "Niacinamid"
      ],
      bgColor: "bg-green-50",
      imageUrl: "https://cdn.shopify.com/s/files/1/0924/5894/2788/files/50s.jpg?v=1742808421"
    },
    {
      value: "SIXTIES_PLUS",
      label: "60 let in več",
      description: "Intenzivna hidratacija in obnova kože",
      skinFocus: "Boj proti suhi koži in izboljšanje splošne teksture kože",
      keyIngredients: [
        "Vitamin B5",
        "Niacinamid",
        "Skvalan"
      ],
      bgColor: "bg-yellow-50",
      imageUrl: "https://cdn.shopify.com/s/files/1/0924/5894/2788/files/60s.jpg?v=1742808347"
    }
  ]

  return (
    <Card noScale className="border-none shadow-none">
      <CardHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CardTitle >
            Vaša starostna skupina
          </CardTitle>
          <CardDescription>
            Pomagajte nam prilagoditi popolno nego kože glede na vašo starostno skupino
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
            <FormField
              control={form.control}
              name="ageGroup"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {ageGroupOptions.map((option, index) => (
                        <motion.div
                          key={option.value}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div
                            className={`
                              relative rounded-xl border overflow-hidden
                              transition-all duration-300 ease-in-out
                              hover:scale-[1.02] hover:shadow-lg cursor-pointer
                              ${field.value === option.value ?
                                'ring-2 ring-primary shadow-md' :
                                'hover:bg-accent/50'}
                            `}
                            onClick={() => field.onChange(option.value)}
                          >
                            <div className="absolute top-4 right-4 z-10">
                              <RadioGroupItem
                                value={option.value}
                                id={option.value}
                                className={`
                                  ${field.value === option.value ?
                                    'bg-primary text-primary-foreground' :
                                    'bg-transparent'}
                                `}
                              />
                            </div>

                            {/* Image Section */}
                            <motion.div
                              className="w-full h-48 relative"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <img
                                src={option.imageUrl}
                                alt={`${option.label} skincare`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="text-xl font-bold">{option.label}</h3>
                                <p className="text-sm opacity-90">{option.description}</p>
                              </div>
                            </motion.div>

                            {/* Content Section */}
                            <motion.div
                              className="p-4 space-y-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <div>
                                <Label className="text-sm font-medium">Skin Focus</Label>
                                <p className="text-sm text-muted-foreground">{option.skinFocus}</p>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">Key Ingredients</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {option.keyIngredients.map((ingredient, idx) => (
                                    <motion.span
                                      key={idx}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.3 + (idx * 0.1) }}
                                      className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                                    >
                                      <Sparkles className="w-3 h-3 mr-1" />
                                      {ingredient}
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <motion.div
              className="flex justify-between pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                back
              >
                Back
              </Button>
              <Button
                type="submit"
                front
              >
                Nadaljuj
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default AgeGroup