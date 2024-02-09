import Hr from "../Model/hr"
interface hrInputData {
    name : string,
    email :string,
    password : string,
    resume : string,
    company : string,
    website : string

}
const saveHrData =async (data :hrInputData)=>{
    try { 
       const hrData = new Hr(data) 
        await hrData.save()

    } catch (error) {
        console.log(error,'');
    }
}

export default {
    saveHrData
}