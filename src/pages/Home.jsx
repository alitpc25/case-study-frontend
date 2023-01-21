import { useEffect, useState } from "react";
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs"
import { Modal, Button } from 'react-bootstrap';
import axios from "axios";
import NavbarComponent from "../components/NavbarComponent";
import { Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from 'yup';

function Home() {

    const [candidates, setCandidates] = useState([]);

    // Refetch if candidates changed.
    const [isCandidatesChanged, setIsCandidatesChanged] = useState(false)

    const [selectedCandidate, setSelectedCandidate] = useState({
        id: "",
        name: "",
        surname: "",
    })

    useEffect(() => {
        getCandidates();
        setIsCandidatesChanged(false)

    }, [isCandidatesChanged])

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    //Modal open-close control
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleCloseEditModal = () => setShowEditModal(false);

    const setCandidateInfo = (candidateInfo) => {
        setSelectedCandidate({
            id: candidateInfo.id,
            name: candidateInfo.name,
            surname: candidateInfo.surname
        })
    }

    const handleShowDeleteModal = (event, candidateInfo) => {
        setCandidateInfo(candidateInfo)
        setShowDeleteModal(true);
    }

    const handleShowEditModal = (event, candidateInfo) => {
        setCandidateInfo(candidateInfo)
        setShowEditModal(true);
    }

    const initialValues = {
        mail: selectedCandidate.mail,
        phone: selectedCandidate.phone,
        candidateStatus: selectedCandidate.candidateStatus
    };

    const UpdateCandidateSchema = Yup.object().shape({
        mail: Yup.string().email().required("Mail is required"),
        phone: Yup.string().required("Phone is required"),
        candidateStatus: Yup.string().required("Status is required")
    });

    const updateCandidate = (values) => {
        return axios.patch('/api/v1/candidates/updateInfo/' + selectedCandidate.id,
            {
                mail: values.mail,
                phone: values.phone,
                candidateStatus: values.candidateStatus,
            })
            .then(function (response) {
                setIsCandidatesChanged(true)
                handleCloseEditModal();
                toast.success("Candidate info successfully updated.", {
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
                setIsCandidatesChanged(false)
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
    }

    const getCandidates = () => {
        return axios.get('/api/v1/candidates')
            .then(function (response) {
                setCandidates(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const handleDeleteCandidate = (candidateId) => {
        axios.delete('/api/v1/candidates/' + candidateId)
            .then(function (response) {
                setIsCandidatesChanged(true)
                toast.success("Candidate successfully removed.", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                handleCloseDeleteModal()
            })
            .catch(function (error) {
                console.log(error);
                setIsCandidatesChanged(false)
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
    }

    const tableHeaders = ["Name", "Surname", "Phone", "Mail", "Status", "Operations"]

    return (
        <div>
            <NavbarComponent addButtonName="New Candidate" setIsCandidatesChanged={setIsCandidatesChanged}></NavbarComponent>
            <div>
                Control block
            </div>
            <div>
                <ToastContainer className="mt-4" />
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        {tableHeaders.map(headerName => {
                                return (<th scope="col" className="px-6 ">
                                <div className="flex items-center">
                                    {headerName}
                                    {(headerName = "Name" || headerName === "Surname" || headerName === "Status") ? <>
                                        <BsArrowUpShort size={20}></BsArrowUpShort>
                                        <BsArrowDownShort size={20}></BsArrowDownShort>
                                        </>
                                    : null}
                                </div>
                            </th>)
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map(c => {
                            return (
                                <tr id={c.id}>
                                    <td scope="row" className="px-6 pt-3">
                                        {c.name}
                                    </td>
                                    <td className="px-6 pt-3">
                                        {c.surname}
                                    </td>
                                    <td className="px-6 pt-3">
                                        {c.phone}
                                    </td>
                                    <td className="px-6 pt-3">
                                        {c.mail}
                                    </td>
                                    <td className="px-6 pt-3">
                                        {c.candidateStatus}
                                    </td>
                                    <td className="px-6 text-right">
                                        <div className="d-flex align-items-center justify-content-evenly">
                                            <Link to="/interactions" state={{candidateId: c.id}}>
                                                <button type="button" className="btn btn-primary">Details</button></Link>
                                            <button onClick={(event) => handleShowEditModal(event, c)} type="button" className="btn btn-primary">Edit</button>
                                            <button onClick={(event) => handleShowDeleteModal(event, c)} type="button" className="btn btn-danger">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </Table>

                <Modal centered show={showDeleteModal} onHide={handleCloseDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Remove candidate {selectedCandidate.name} {selectedCandidate.surname}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => handleDeleteCandidate(selectedCandidate.id)}>
                            Remove
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal centered show={showEditModal} onHide={handleCloseEditModal} className="modal-lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit candidate {selectedCandidate.name} {selectedCandidate.surname}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={UpdateCandidateSchema}
                            onSubmit={(values) => {
                                updateCandidate(values)
                            }}
                        >
                            {() => (
                                <Form className=''>
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
                                            <Field type="text" name="phone" className='form-control' />
                                            <ErrorMessage name="phone" component="div" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="candidateStatus">Status</label>
                                        <div className='p-2'>
                                            <Field name="candidateStatus" as="select" placeholder="Select status" className="form-control form-select">
                                                <option defaultValue="SELECT">Select status</option>
                                                <option value="SOURCED">Sourced</option>
                                                <option value="INTERVIEWING">Interviewing</option>
                                                <option value="OFFER_SENT">Offer sent</option>
                                                <option value="HIRED">Hired</option>
                                            </Field>
                                            <ErrorMessage name="candidateStatus" component="div" />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-around">
                                        <Button variant="secondary" onClick={handleCloseEditModal}>
                                            Close
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Update candidate
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    )
}


export default Home;