// import { DatePicker, Select } from '@noahspan/noahspan-components';
// import { Controller, useFormContext } from "react-hook-form"
// import { PilotFormMedicalProps } from "./PilotFormMedicalProps.interface";

// const PilotFormMedical = ({ isDisabled }: PilotFormMedicalProps) => {
//   const {
//     control,
//     formState: { errors },
//     setValue
//   } = useFormContext();

//   return (
//     <div>
//       <div>
//         <h5>Medical</h5>
//       </div>
//       <div>
//         <h6>Class</h6>
//       </div>
//       <div>
//         <Controller
//           name="medicalClass"
//           control={control}
//           render={({ field: { onChange, value } }) => {
//             return (
//               <Select 
//                 disabled={isDisabled}
//                 onChange={onChange}
//                 options={
//                   [
//                     {
//                       label: 'First',
//                       value: 'first'
//                     },
//                     {
//                       label: 'Second',
//                       value: 'second'
//                     },
//                     {
//                       label: 'Third',
//                       value: 'third'
//                     },
//                     {
//                       label: 'Basic Med',
//                       value: 'basicMed'
//                     }
//                   ]
//                 }
//                 value={value ? value : ''}
//               />
//             );
//           }}
//         />
//       </div>
//       <div>
//         <h6>Expiration</h6>
//       </div>
//       <div>
//         <Controller
//           name="medicalExpiration"
//           control={control}
//           render={({ field: { onChange, value } }) => {
//             return (
//               <DatePicker
//                 disabled={isDisabled}
//                 onChange={onChange}
//                 value={value}
//               />
//             );
//           }}
//         />
//       </div>
//     </div>
//   )
// }

// export default PilotFormMedical