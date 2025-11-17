import React, { useEffect, useState } from 'react';
import { Image, Form, Button, Modal, FormControl } from 'react-bootstrap';
import avatars6 from '../../../assets/images/avatars/avtar_5.webp';
import { submitUser } from '../../../services/user';

const UserForm = ({ refresh, handleClose, show, mode, userToEdit }) => {
   const [formData, setFormData] = useState({
      _id: '',
      fullname: '',
      email: '',
      password: '',
      gender: '',
      address: '',
      phone: ''
   });

   useEffect(() => {
      if (userToEdit) {
         setFormData(userToEdit);
      } else {
         setFormData({
            _id: '',
            fullname: '',
            email: '',
            password: '',
            gender: '',
            address: '',
            phone: ''
         });
      }
   }, [userToEdit]);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
         ...prevData,
         [name]: value
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         await submitUser(formData, mode);
         handleClose();
         refresh();
      } catch (error) {
         console.error('Error submitting user:', error);
         alert('Failed to submit user. Check the console for details.');
      }
   };

   return (
      <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false} size="lg">
         <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
               <Modal.Title>{mode === 'create' ? 'Add New User' : 'Edit User'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div className="new-user-info">
                  <div className="row">
                     <div className="profile-img-edit position-relative col-md-2 mb-4">
                        <Image className="lazyload theme-color-yellow-img profile-pic rounded avatar-100" src={avatars6} alt="profile-pic" />
                     </div>
                     <FormControl type="hidden" name="_id" value={formData._id} readOnly />
                     <Form.Group className="col-md-10 form-group">
                        <Form.Label htmlFor="fullname">Full Name:</Form.Label>
                        <Form.Control
                           value={formData.fullname}
                           onChange={handleChange}
                           type="text"
                           id="fullname"
                           name="fullname"
                           placeholder="Full Name"
                           required
                        />
                     </Form.Group>
                     <Form.Group className="col-md-6 form-group">
                        <Form.Label htmlFor="address">Address:</Form.Label>
                        <Form.Control
                           value={formData.address}
                           onChange={handleChange}
                           type="text"
                           name="address"
                           id="address"
                           placeholder="Address"
                           required
                        />
                     </Form.Group>
                     <Form.Group className="col-md-6 form-group">
                        <Form.Label htmlFor="phone">Mobile Number:</Form.Label>
                        <Form.Control
                           value={formData.phone}
                           onChange={handleChange}
                           type="tel"
                           name="phone"
                           id="phone"
                           placeholder="Mobile Number"
                           required
                        />
                     </Form.Group>
                     <Form.Group className="col-sm-12 form-group">
                        <Form.Label>Gender:</Form.Label>
                        <Form.Control
                           as="select"
                           name="gender"
                           value={formData.gender}
                           onChange={handleChange}
                           required
                        >
                           <option value="">Select gender</option>
                           <option value="MALE">Male</option>
                           <option value="FEMALE">Female</option>
                        </Form.Control>
                     </Form.Group>
                  </div>
                  {mode === 'create' && (
                     <>
                        <hr />
                        <h5 className="mb-3">Security</h5>
                        <div className="row">
                           <Form.Group className="col-md-12 form-group">
                              <Form.Label htmlFor="email">Email:</Form.Label>
                              <Form.Control
                                 value={formData.email}
                                 onChange={handleChange}
                                 type="email"
                                 name="email"
                                 id="email"
                                 placeholder="Email"
                                 required
                              />
                           </Form.Group>
                           <Form.Group className="col-md-6 form-group">
                              <Form.Label htmlFor="password">Password:</Form.Label>
                              <Form.Control
                                 value={formData.password}
                                 onChange={handleChange}
                                 type="password"
                                 name="password"
                                 id="password"
                                 placeholder="Password"
                                 required
                              />
                           </Form.Group>
                           <Form.Group className="col-md-6 form-group">
                              <Form.Label htmlFor="rpass">Repeat Password:</Form.Label>
                              <Form.Control
                                 type="password"
                                 id="rpass"
                                 placeholder="Repeat Password"
                                 required
                              />
                           </Form.Group>
                        </div>
                     </>
                  )}
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button type="submit" variant="primary">
                  {mode === 'create' ? 'Add New User' : 'Edit User'}
               </Button>
               <Button type="button" onClick={handleClose} variant="secondary">
                  Close
               </Button>
            </Modal.Footer>
         </form>
      </Modal>
   );
};

export default UserForm;
