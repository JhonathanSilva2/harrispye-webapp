import { GenericInputProps } from "@/app/types";
import { FieldValues } from "react-hook-form";

export const appraisalInputData: (GenericInputProps<FieldValues> & {
    label2?: string;
})[] = [
    {
        name: "objectives",
        label: "1. What were your objectives for last year, and what were the results?",
        label2: "1. Quais foram seus objetivos no ano passado e quais foram os resultados?",
        type: "textarea",
        placeholder: "Tip here...",
    },
    {
        name: "accomplishments",
        label: "2. List down your major work accomplishments for last year.",
        label2: "2. Liste suas principais realizações profissionais do ano passado.",
        type: "textarea",
        placeholder: "Tip here...",
    },
    {
        name: "difficulties",
        label: "3. List down any areas of difficulty you faced for last year, and anything you did to overcome them.",
        label2: "3. Liste as dificuldades que você enfrentou no ano passado e o que fez para superá-las.",
        type: "textarea",
        placeholder: "Tip here...",
    },
    {
        name: "improve_performance",
        label: "4. What could be done to improve your performance in your current position by you and/or your manager?",
        label2: "4. O que poderia ser feito por você e/ou seu gestor para melhorar seu desempenho?",
        type: "textarea",
        placeholder: "Tip here...",
    },
    {
        name: "goals",
        label: "5. Please share any career goals and aspirations that you may have.",
        label2: "5. Compartilhe suas metas e aspirações de carreira.",
        type: "textarea",
        placeholder: "Tip here...",
    },
    {
        name: "suggestions",
        label: "6. Please provide any suggestions on training that can help add value.",
        label2: "6. Dê sugestões de treinamentos que possam agregar valor.",
        type: "textarea",
        placeholder: "Tip here...",
    },
    {
        name: "year_objectives",
        label: "7. What are your objectives for this year?",
        label2: "7. Quais são seus objetivos para este ano?",
        type: "textarea",
        placeholder: "Tip here...",
    },
    {
        name: "performance",
        label: "8. How would rate your performance this past year and why?",
        label2: "8. Como você avaliaria seu desempenho no último ano e por quê?",
        type: "textarea",
        placeholder: "Tip here...",
    },
];
