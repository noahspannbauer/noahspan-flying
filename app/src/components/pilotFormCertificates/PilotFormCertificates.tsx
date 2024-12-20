// import { IPilotFormCertificates } from './IPilotFormCertificates';
// import {
//   Button,
//   DatePicker,
//   Input,
//   Option,
//   PlusIcon,
//   Select,
//   TrashIcon,
//   Typography
// } from '@noahspan/noahspan-components';
// import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

// const PilotFormCertificates: React.FC<IPilotFormCertificates> = ({
//   certificates
// }: IPilotFormCertificates) => {
//   const {
//     control,
//     formState: { errors },
//     setValue
//   } = useFormContext();

//   const { fields, append, remove } = useFieldArray({
//     name: 'certificates',
//     control
//   });

//   return (
//     <>
//       {fields.length > 0 && (
//         <>
//           <div className="col-span-1">
//             <Typography variant="h6">Type</Typography>
//           </div>
//           <div className="col-span-1">
//             <Typography variant="h6">Number</Typography>
//           </div>
//           <div className="col-span-1">
//             <Typography variant="h6">Date of Issue</Typography>
//           </div>
//           <div className="col-span-1"></div>
//         </>
//       )}
//       {fields.map((field, index) => {
//         return (
//           <>
//             <div className="col-span-1">
//               <Controller
//                 name={`certificates.${index}.type`}
//                 control={control}
//                 render={({ field }) => {
//                   return (
//                     <Select label="Type" {...field}>
//                       <Option key="student" value="Student">
//                         Student
//                       </Option>
//                       <Option key="private" value="Private">
//                         Private
//                       </Option>
//                       <Option key="instrument" value="Instrument">
//                         Instrument
//                       </Option>
//                       <Option key="recreational" value="Recreational">
//                         Recreational
//                       </Option>
//                       <Option key="sport" value="Sport">
//                         Sport
//                       </Option>
//                     </Select>
//                   );
//                 }}
//               />
//             </div>
//             <div className="col-span-1">
//               <Controller
//                 name={`certificates.${index}.number`}
//                 control={control}
//                 render={({ field }) => {
//                   return <Input label="Number" {...field} />;
//                 }}
//               />
//             </div>
//             <div className="col-span-1">
//               <Controller
//                 name={`certificates.${index}.dateOfIssue`}
//                 control={control}
//                 render={({ field }) => {
//                   return (
//                     <DatePicker
//                       handleDateChanged={(date: string) => {
//                         setValue(`certificates.${index}.dateOfIssue`, date);
//                       }}
//                       inputProps={{
//                         value: field.value
//                       }}
//                     />
//                   );
//                 }}
//               />
//             </div>
//             <div className="col-span-1">
//               <Button
//                 className="flex items-center gap-3"
//                 onClick={() => remove(index)}
//                 variant="outlined"
//               >
//                 <TrashIcon size="lg" />
//                 Delete
//               </Button>
//             </div>
//           </>
//         );
//       })}
//       <div className="col-span-4">
//         <Button
//           className="flex items-center gap-3"
//           onClick={() => {
//             append({
//               type: '',
//               number: '',
//               dateOfIssue: null
//             });
//           }}
//           variant="outlined"
//         >
//           <PlusIcon size="lg" />
//           Add Certificate
//         </Button>
//       </div>
//     </>
//   );
// };

// export default PilotFormCertificates;
