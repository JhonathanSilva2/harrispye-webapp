import { PageProps } from "@/app/types";
import TestComponent from "./test-component";

const TestComponents = async ({ searchParams }: PageProps) => {
    return <TestComponent />;
};

export default TestComponents;
