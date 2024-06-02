// import React, { useState } from 'react';
// import ApiRequest from '../utils/apiRequest';
// import { toast } from 'react-toastify';

// const UpdateBlogForm = ({ selectedTemplateId, selectedCategoryId, selectedSubCategoryId, onCreateSuccess }) => {
//   const [blogName, setBlogName] = useState('');
//   const [blogDescription, setBlogDescription] = useState('');
//   const [sections, setSections] = useState([{ name: '', text: '' }]);
//   const [images, setImages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSectionChange = (index, key, value) => {
//     const updatedSections = [...sections];
//     updatedSections[index][key] = value;
//     setSections(updatedSections);
//   };

//   const handleAddSection = () => {

//     setSections([...sections, { name: '', text: '' }]);
//   };

//   const handleRemoveSection = (index) => {
//     const updatedSections = [...sections];
//     updatedSections.splice(index, 1);
//     setSections(updatedSections);
//   };

//   const handleImageChange = (e) => {
//     const files = e.target.files;
//     setImages(Array.from(files));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const formData = new FormData();
//     formData.append('blogName', blogName);
//     formData.append('blogDescription', blogDescription);
//     formData.append('sections', JSON.stringify(sections));
//     images.forEach((image) => {
//       formData.append('images', image);
//     });

//     try {
//       const res = await ApiRequest.post(`/${selectedTemplateId}/${selectedCategoryId}/${selectedSubCategoryId}/blog`, formData);
//       console.log(res.data);
//       onCreateSuccess()
//       toast.success("Blog Created Successfully")
//     } catch (error) {
//       console.error('Error creating blog:', error);
//       toast.error("Error occured while creating blog!")
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Create Blog</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="text" value={blogName} onChange={(e) => setBlogName(e.target.value)} placeholder="Blog Name" className="w-full px-4 py-2 mb-4 border rounded-md" />
//         <textarea value={blogDescription} onChange={(e) => setBlogDescription(e.target.value)} placeholder="Blog Description" className="w-full px-4 py-2 mb-4 border rounded-md"></textarea>
//         {sections.map((section, index=0) => (
//           <div key={index} className="mb-4">
//             <input type="text" value={section.name} onChange={(e) => handleSectionChange(index, 'name', e.target.value)} placeholder={`Section ${index +1}`} className="w-full px-4 py-2 mb-2 border rounded-md" />
//             <textarea value={section.text} onChange={(e) => handleSectionChange(index, 'text', e.target.value)} placeholder={`Section Text ${index +1}`} className="w-full px-4 py-2 mb-2 border rounded-md"></textarea>
//             <button type="button" onClick={() => handleRemoveSection(index)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Remove Section</button>
//           </div>
//         ))}
//         <button type="button" onClick={handleAddSection} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4">Add Section</button>
//         <input type="file" onChange={handleImageChange} multiple className="mb-4" />
//         <button type="submit" disabled={isLoading} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
//           {isLoading ? 'Creating Blog...' : 'Create Blog'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UpdateBlogForm;
