import { useState } from "react";
import "./NavbarComponent.css";
import { Modal, Button } from 'react-bootstrap';
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from 'yup';
import { toast } from "react-toastify";
import MyDatePicker from "./MyDatePicker";
import MyPhoneInput from "./MyPhoneInput";

function NavbarComponent(props) {

    const [showCandidateModal, setShowCandidateModal] = useState(false);
    const [showInteractionModal, setShowInteractionModal] = useState(false);

    const handleCloseCandidateModal = () => setShowCandidateModal(false);
    const handleShowCandidateModal = () => setShowCandidateModal(true);

    const handleCloseInteractionModal = () => setShowInteractionModal(false);
    const handleShowInteractionModal = () => setShowInteractionModal(true);

    const initialValuesCandidate = {
        name: "",
        surname: "",
        mail: "",
        phone: "",
        status: ""
    };

    const CreateCandidateSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        surname: Yup.string().required("Surname is required"),
        mail: Yup.string().email().required("Mail is required"),
        phone: Yup.string().required("Phone is required"),
        status: Yup.string().required("Status is required")
    });

    const saveCandidate = (values) => {
        return axios.post('/api/v1/candidates',
            {
                name: values.name,
                surname: values.surname,
                mail: values.mail,
                phone: values.phone,
                status: values.status,
            })
            .then(function (response) {
                handleCloseCandidateModal();
                toast.success("Candidate successfully added.", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
            .catch(function (error) {
                console.log(error);
                toast.error(error.response.data, {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
            .finally(() => {
                props.setIsCandidatesChanged(true)
            }) 
    }

    const initialValuesInteraction = {
        interactionType: "",
        content: "",
        date: "",
        candidateResponded: ""
    };

    const CreateInteractionSchema = Yup.object().shape({
        interactionType: Yup.string().required("Type is required"),
        content: Yup.string().required("Content is required"),
        date: Yup.date().required("Date is required"),
        candidateResponded: Yup.string().required("Response is required")
    });

    const saveInteraction = (values) => {
        return axios.post('/api/v1/interactions?candidateId=' + props.candidateId,
            {
                interactionType: values.interactionType,
                content: values.content,
                date: values.date,
                candidateResponded: values.candidateResponded,
            })
            .then(function (response) {
                handleCloseInteractionModal();
                toast.success("Interaction successfully added.", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
            .catch(function (error) {
                console.log(error);
                toast.error(error.response.data, {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }).finally(() => {
                props.setIsInteractionsChanged(true)
            })
    }

    return (
        <div>
            <div id='navbar' className='d-flex justify-content-between align-items-center mx-4'>
                <div>
                    <nav className="navbar navbar-light">
                        <a className="navbar-brand" href="/">
                            <img src="https://static.wixstatic.com/media/4e4126_3168670d6ed74e0c8e20ab22b237f641~mv2.png/v1/fill/w_220,h_50,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/1%20(2)%20(2).png" width="160" height="40" className="d-inline-block align-top" alt="" />
                        </a>
                    </nav>
                </div>
                <h2>Peoplist TSS</h2>
                <button type="button" className="btn btn-primary" onClick={props.addButtonName === "New Candidate" ? handleShowCandidateModal : handleShowInteractionModal}>{props.addButtonName}</button>
            </div>
                <Modal centered show={showCandidateModal} onHide={handleCloseCandidateModal}>
                    <Modal.Header closeButton>
                        <Modal.Title> New Candidate </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={initialValuesCandidate}
                            validationSchema={CreateCandidateSchema}
                            onSubmit={(values) => {
                                saveCandidate(values)
                            }}
                        >
                            {() => (
                                <Form className=''>
                                    <div className=''>
                                        <label htmlFor="name">Name</label>
                                        <div className='p-2'>
                                            <Field type="text" name="name" className='form-control' />
                                            <ErrorMessage name="name" component="div" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="surname">Surname</label>
                                        <div className='p-2'>
                                            <Field type="text" name="surname" className='form-control' />
                                            <ErrorMessage name="surname" component="div" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="mail">Mail</label>
                                        <div className='p-2'>
                                            <Field type="text" name="mail" className='form-control' />
                                            <ErrorMessage name="mail" component="div" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="phone">Phone</label>
                                        <div className='p-2'>
                                        <MyPhoneInput name="phone"></MyPhoneInput>
                                            <ErrorMessage name="phone" component="div" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="status">Status</label>
                                        <div className='p-2'>
                                            <Field name="status" as="select" placeholder="Select status" className="form-control form-select">
                                                <option defaultValue="SELECT">Select status</option>
                                                <option value="SOURCED">Sourced</option>
                                                <option value="INTERVIEWING">Interviewing</option>
                                                <option value="OFFER_SENT">Offer sent</option>
                                                <option value="HIRED">Hired</option>
                                            </Field>
                                            <ErrorMessage name="status" component="div" />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-around">
                                        <Button variant="secondary" onClick={handleCloseCandidateModal}>
                                            Close
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Create candidate
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
                
                <Modal centered show={showInteractionModal} onHide={handleCloseInteractionModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Interaction</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={initialValuesInteraction}
                            validationSchema={CreateInteractionSchema}
                            onSubmit={(values) => {
                                saveInteraction(values)
                            }}
                        >
                            {() => (
                                <Form className=''>
                                    <div className=''>
                                        <label htmlFor="interactionType">Type</label>
                                        <div className='p-2'>
                                            <Field name="interactionType" as="select" placeholder="Select type" className="form-control form-select">
                                                <option defaultValue="SELECT">Select type</option>
                                                <option value="PHONE">Phone</option>
                                                <option value="MAIL">Mail</option>
                                            </Field>
                                            <ErrorMessage name="interactionType" component="div" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="content">Content</label>
                                        <div className='p-2'>
                                            <Field component="textarea" type="textarea" name="content" className='form-control' />
                                            <ErrorMessage name="content" component="div" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="date">Date</label>
                                        <div className='p-2'>
                                            <MyDatePicker name="date" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="candidateResponded">Candidate Response</label>
                                        <div className='p-2'>
                                            <Field name="candidateResponded" as="select" placeholder="Candidate Responded" className="form-control form-select">
                                                <option defaultValue="SELECT">Select candidate responded</option>
                                                <option value="TRUE">True</option>
                                                <option value="FALSE">False</option>
                                            </Field>
                                            <ErrorMessage name="candidateResponded" component="div" />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-around">
                                        <Button variant="secondary" onClick={handleCloseInteractionModal}>
                                            Close
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Create interaction
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
        </div>
    );
}

export default NavbarComponent;