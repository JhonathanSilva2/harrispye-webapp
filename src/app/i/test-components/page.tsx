import { PageProps } from "@/app/types";
import { FabMonSpoolsProvider } from "../fabrication-monitoring/[job]/_providers/fab-mon-spool-provider";
import TestComponent from "./test-component";

const TestComponents = async ({ searchParams }: PageProps) => {
    return (
        <FabMonSpoolsProvider>
            <TestComponent />
        </FabMonSpoolsProvider>
    );
};

export default TestComponents;
