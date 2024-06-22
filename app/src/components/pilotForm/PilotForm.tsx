// import {
//   Accordion,
//   AccordionItem,
//   Button,
//   DatePicker,
//   Input,
//   Select,
//   SelectItem
// } from '@nextui-org/react';
// import { useForm, Controller, FormProvider, SubmitHandler, Form } from 'react-hook-form';
// import PilotFormCertificates from '../pilotFormCertificates/PilotFormCertificates';

// const PilotForm: React.FC<unknown> = () => {
//   const methods = useForm({
//     defaultValues: {
//         certificates: [
//             {
//                 type: '',
//                 number: '',
//                 dateOfIssue: null
//             }
//         ]
//     }
//   });
//   const { control, handleSubmit } = methods;

//   const onSubmit = (data: unknown) => {
//     console.log(data);
//   };

//   return (
//     <FormProvider {...methods}>
//         <form className="m-10" onSubmit={handleSubmit(onSubmit)}>
//             <Accordion>
//                 <AccordionItem title='Profile'>
//                     <div className="grid grid-cols-3 gap-4">
//                         <div className="self-center">
//                             <label>First Name</label>
//                         </div>
//                         <div className='col-span-2'>
//                             <Controller
//                                 name="firstName"
//                                 control={control}
//                                 render={({ field }) => <Input />}
//                             />
//                         </div>
//                         <div className="self-center">
//                             <label>Last Name</label>
//                         </div>
//                         <div className='col-span-2'>
//                             <Controller
//                                 name="lastName"
//                                 control={control}
//                                 render={({ field }) => <Input />}
//                             />
//                         </div>
//                         <div className='self-center'>
//                             <label>Address</label>
//                         </div>
//                         <div className='col-span-2'>
//                             <Controller
//                                 name='address'
//                                 control={control}
//                                 render={({ field }) => <Input />}
//                             />
//                         </div>
//                         <div className='self-center'>
//                             <label>City</label>
//                         </div>
//                         <div className='col-span-2'>
//                             <Controller
//                                 name='city'
//                                 control={control}
//                                 render={({ field }) => <Input />}
//                             />
//                         </div>
//                         <div className='self-center'>
//                             <label>State</label>
//                         </div>
//                         <div className='col-span-2'>
//                             <Controller
//                                 name='state'
//                                 control={control}
//                                 render={({ field }) => <Input />}
//                             />
//                         </div>
//                         <div className='self-center'>
//                             <label>Postal Code</label>
//                         </div>
//                         <div className='col-span-2'>
//                             <Controller
//                                 name='postalCode'
//                                 control={control}
//                                 render={({ field }) => <Input />}
//                             />
//                         </div>
//                     </div>
//                 </AccordionItem>
//             </Accordion>

//         <Accordion>
//             <AccordionItem title='Certificates'>
//                 <PilotFormCertificates certificates={[]}/>
//             </AccordionItem>
//         </Accordion>
//         <Accordion>
//             <AccordionItem title='Endorsements'>

//             </AccordionItem>
//         </Accordion>
//         <Accordion>
//             <AccordionItem title="Medical">
//             <div className="grid grid-cols-2 gap-4">
//                 <div className="self-center">
//                 <label>Class</label>
//                 </div>
//                 <div>
//                 <Controller
//                     name="medicalClass"
//                     control={control}
//                     render={({ field }) => (
//                     <Select>
//                         <SelectItem key="first" value="First">
//                         First
//                         </SelectItem>
//                         <SelectItem key="second" value="Second">
//                         Second
//                         </SelectItem>
//                         <SelectItem key="third" value="Third">
//                         Third
//                         </SelectItem>
//                         <SelectItem key="basicMed" value="Basic Med">
//                         Basic Med
//                         </SelectItem>
//                     </Select>
//                     )}
//                 />
//                 </div>
//                 <div className="self-center">
//                 <label>Expires</label>
//                 </div>
//                 <div>
//                 <Controller
//                     name="medicalExpiration"
//                     control={control}
//                     render={({ field }) => <DatePicker />}
//                 />
//                 </div>
//             </div>
//             </AccordionItem>
//         </Accordion>
//         </form>
//     </FormProvider>
//   );
// };

// export default PilotForm;
