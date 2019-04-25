interface VehicleInfo {
    registrationDate: Date;
    engineSize: number;
    co2: number;
    value: number;
    fuel: string;
    meetsRDE2: boolean;
}
declare function calculateTax(options: VehicleInfo): number;
export default calculateTax;
