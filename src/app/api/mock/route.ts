import { NextRequest, NextResponse } from "next/server";

const mockTodos = [
	{
		id: 1,
		title: "Learn TypeScript",
		completed: true,
	},
	{
		id: 2,
		title: "Learn React",
		completed: false,
	},
	{
		id: 3,
		title: "Learn Next.js",
		completed: false,
	},
	{
		id: 4,
		title: "Learn GraphQL",
		completed: false,
	},
	{
		id: 5,
		title: "Learn Prisma",
		completed: false,
	},
];

export async function GET() {
	return new NextResponse(JSON.stringify(mockTodos), {
		headers: {
			"content-type": "application/json",
		},
	});
}

export async function POST(request: NextRequest) {
	const body = await request.json();
	const newTodo = {
		id: mockTodos.length + 1,
		...body,
	};
	mockTodos.push(newTodo);
	return new NextResponse(JSON.stringify(newTodo), {
		headers: {
			"content-type": "application/json",
		},
	});
}
