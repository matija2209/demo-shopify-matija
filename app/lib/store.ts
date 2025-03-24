import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {SkincareFormData} from '~/types/tool';

type FormState = {
  currentStep: number;
  formData: SkincareFormData;
  formId?: string;
  pdfUrl?: string;
  setCurrentStep: (step: number) => void;
  setFormData: (data: SkincareFormData) => void;
  setFormId: (id: string) => void;
  setPdfUrl: (url: string) => void;
  resetForm: () => void;
  getLatestState: () => FormState;
};

// Add this helper function to get the latest state
const getStorageData = () => {
  try {
    const storageData = localStorage.getItem('form-storage');
    if (!storageData) return null;

    const parsedData = JSON.parse(storageData);
    return (parsedData as {state: FormState}).state;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: {
        skinType: 'OILY',
      },
      setCurrentStep: (step) => set({currentStep: step}),
      setFormData: (data) =>
        set((state) => ({
          formData: {...state.formData, ...data},
        })),
      setFormId: (id) => set({formId: id}),
      setPdfUrl: (url) => set({pdfUrl: url}),
      resetForm: () =>
        set({
          currentStep: 1,
          formData: {},
          formId: undefined,
          pdfUrl: undefined,
        }),
      getLatestState: () => getStorageData() || get(),
    }),
    {
      name: 'form-storage',
    },
  ),
);
