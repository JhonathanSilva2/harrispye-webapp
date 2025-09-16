export function calculateFabricationProgress({
    cutting,
    welding,
    coating,
}: {
    cutting: number | null;
    welding: number | null;
    coating: number | null;
}) {
    cutting = cutting ? cutting : 0;
    welding = welding ? welding : 0;
    coating = coating ? coating : 0;

    const cuttingWeight = 25 / 100;
    const weldingWeight = 60 / 100;
    const coatingWeight = 15 / 100;

    console.log(
        cutting * cuttingWeight +
            welding * weldingWeight +
            (coating * coatingWeight),
    );

    return (
        cutting * cuttingWeight +
        welding * weldingWeight +
        (coating * coatingWeight)
    );
}
