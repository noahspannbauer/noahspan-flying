// import { IPilotFormCertificates } from './IPilotFormCertificates';
// import { Button, DatePicker, Input, Select, SelectItem } from '@nextui-org/react';
// import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

// const PilotFormCertificates: React.FC<IPilotFormCertificates> = ({ certificates }: IPilotFormCertificates) => {
//     const { control, formState: { errors } } = useFormContext();

//     const { fields, append, remove } = useFieldArray({
//         name: 'certificates',
//         control
//     })

//     return (
//         <div className='grid grid-cols-4 gap-4'>
//             <div className='self-center'>
//                 <label>Type</label>
//             </div>
//             <div className='self-center'>
//                 <label>Number</label>
//             </div>
//             <div className='self-center '>
//                 <label>Date of Issue</label>
//             </div>
//             <div className='self-center'>

//             </div>

//             {fields.map((field, index) => {
//                 return (
//                     <>
//                     {/* // <div key={field.id}> */}
//                         <div>
//                             <Controller
//                                 name={`certificates.${index}.type`}
//                                 control={control}
//                                 render={({ field }) => {
//                                     console.log(field)
//                                     return (
//                                         <Select {...field}>
//                                             <SelectItem key="student" value="Student">
//                                                 Student
//                                             </SelectItem>
//                                             <SelectItem key="private" value="Private">
//                                                 Private
//                                             </SelectItem>
//                                             <SelectItem key="instrument" value="Instrument">
//                                                 Instrument
//                                             </SelectItem>
//                                             <SelectItem key="recreational" value="Recreational">
//                                                 Recreational
//                                             </SelectItem>
//                                             <SelectItem key="sport" value="Sport">
//                                                 Sport
//                                             </SelectItem>
//                                         </Select>
//                                     )
//                                 }}
//                             />
//                         </div>
//                         <div>
//                             <Controller
//                                 name={`certificates.${index}.number`}
//                                 control={control}
//                                 render={({ field }) => {
//                                     return (
//                                         <Input {...field} />
//                                     )
//                                 }}
//                             />
//                         </div>
//                         <div>
//                             <Controller
//                                 name={`certificates.${index}.dateOfIssue`}
//                                 control={control}
//                                 render={({ field }) => {
//                                     return (
//                                         <DatePicker {...field} />
//                                     )
//                                 }}
//                             />
//                         </div>
//                         <div>
//                             <Button onClick={() => remove(index)}>Remove</Button>
//                         </div>
//                     {/* </div> */}
//                     </>
//                 )
//             })}
//             <Button
//                 onClick={() => {
//                     append({
//                         type: '',
//                         number: '',
//                         dateOfIssue: null
//                     });
//                 }}
//             >
//                 Add
//             </Button>
//         </div>
//     )
// }

// export default PilotFormCertificates;
