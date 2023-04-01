import FourZeroOneKPlan from "./FourZeroOneKPlan";

export default interface Company {
    name: string;
    description: string;
    industry: string;
    headquarters: string;
    phoneNumber: string;
    contact: string;
    ein: string;
    "401kPlan": FourZeroOneKPlan;
}
