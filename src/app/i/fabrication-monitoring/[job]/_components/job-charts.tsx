import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import React from 'react'
interface JobChartsProps {
    title: string
    description: string
    children: React.ReactNode

}
export default function JobCharts({title,description,children}:JobChartsProps) {
  return (
	<Card className="flex flex-col border-0 w-[80%] bg-background shadow-none">
			<CardHeader className="items-center pb-0">
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex justify-center w-full min-h-[300px] p-4 items-center" >
				{children}
			</CardContent>
	</Card>  
)
}
