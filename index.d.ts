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

interface VehicleTax {
    price: number;
    band?: string;
    category?: string;
}

declare function calculateTax(options: VehicleInfo): VehicleTax;
export default calculateTax;
