// import {
//   Accordion,
//   AccordionItem,
//   Button,
//   DatePicker,
//   Input,
//   Select,
//   SelectItem
// } from '@nextui-org/react';
// import { useForm, Controller, SubmitHandler } from 'react-hook-form';

// const PilotForm: React.FC<unknown> = () => {
//   const { control, handleSubmit } = useForm();

//   const onSubmit = (data: unknown) => {
//     console.log(data);
//   };

//   return (
//     <form className="m-10" onSubmit={handleSubmit(onSubmit)}>
//       <div className="grid grid-cols-2 gap-4">
//         <div className="self-center">
//           <label>First Name</label>
//         </div>
//         <div>
//           <Controller
//             name="firstName"
//             control={control}
//             render={({ field }) => <Input />}
//           />
//         </div>
//         <div className="self-center">
//           <label>Last Name</label>
//         </div>
//         <div>
//           <Controller
//             name="lastName"
//             control={control}
//             render={({ field }) => <Input />}
//           />
//         </div>
//       </div>
//       <Accordion>
//         <AccordionItem title="Medical Certificate">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="self-center">
//               <label>Class</label>
//             </div>
//             <div>
//               <Controller
//                 name="medicalClass"
//                 control={control}
//                 render={({ field }) => (
//                   <Select>
//                     <SelectItem key="first" value="First">
//                       First
//                     </SelectItem>
//                     <SelectItem key="second" value="Second">
//                       Second
//                     </SelectItem>
//                     <SelectItem key="Third" value="Third">
//                       Third
//                     </SelectItem>
//                   </Select>
//                 )}
//               />
//             </div>
//             <div className="self-center">
//               <label>Expires</label>
//             </div>
//             <div>
//               <Controller
//                 name="medicalExpiration"
//                 control={control}
//                 render={({ field }) => <DatePicker />}
//               />
//             </div>
//           </div>
//         </AccordionItem>
//       </Accordion>
//     </form>
//   );
// };

// export default PilotForm;
