interface VehicleInfo {
    registrationDate: Date;
    engineSize: number;
    co2: number;
    value: number;
    fuel: string;
    meetsRDE2: boolean;
    type: string;
    euroStandard: number;
}
declare function calculateTax(options: VehicleInfo): number;
export default calculateTax;
