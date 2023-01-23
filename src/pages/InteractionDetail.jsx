import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import * as Yup from "yup"
import { ToastContainer, toast } from 'react-toastify';
import NavbarComponent from '../components/NavbarComponent';
import { Button, Modal, Table } from 'react-bootstrap';
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs"
import moment from "moment"
import { Formik, Form, Field, ErrorMessage } from "formik"
import MyDatePicker from '../components/MyDatePicker';
import PaginateComponent from '../components/PaginateComponent';

function InteractionDetail() {

    const location = useLocation();

    const [candidateInteractions, setCandidateInteractions] = useState([]);
    const [isInteractionsChanged, setIsInteractionsChanged] = useState(false)

    const [selectedInteraction, setSelectedInteraction] = useState({
        id: "",
        candidateId: ""
    })

    const [interactionContent, setInteractionContent] = useState("")

    // Pagination 
    const handlePageClick = (e) => {
        setCurrentPage(e.selected+1)
        setIsInteractionsChanged(true)
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [interactionsPerPage, setInteractionsPerPage] = useState(9);
    const [pageNumber, setPageNumber] = useState(1); // total page number
    const [sortedByState, setSortedByState] = useState(null);
    const [sortOrderState, setSortOrderState] = useState(null);

    const getCandidateInteractions = (currentPage, interactionsPerPage) => {
        return axios.get(`/api/v1/interactions?candidateId=${location.state.candidateId}&page=${currentPage}&size=${interactionsPerPage}`)
            .then(function (response) {
                setCandidateInteractions(response.data.content)
                setCurrentPage(response.data.number + 1);
                setPageNumber(parseInt(response.data.totalPages));
            })
            .catch(function (error) {
                if(error.response.status===404) {
                    console.log(setCandidateInteractions([]))
                }
                toast.error(error.response.data, {
                    toastId:"errorMessage1",
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

    const getCandidateInteractionsSorted = (currentPage, interactionsPerPage, sortedBy, sortOrder) => {
        return axios.get(`/api/v1/interactions?candidateId=${location.state.candidateId}&page=${currentPage}&size=${interactionsPerPage}&sortedBy=${sortedBy}&sortOrder=${sortOrder}`)
            .then(function (response) {
                setCandidateInteractions(response.data.content)
                setCurrentPage(response.data.number + 1);
                setPageNumber(parseInt(response.data.totalPages));
            })
            .catch(function (error) {
                if(error.response.status==404) {
                    console.log(setCandidateInteractions([]))
                }
                toast.error(error.response.data, {
                    toastId:"errorMessage1",
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

    const handleSort = (e, sortedBy, sortOrder) => {
        setSortedByState(sortedBy)
        setSortOrderState(sortOrder)
        getCandidateInteractionsSorted(currentPage, interactionsPerPage, sortedBy, sortOrder);
    }

    const getInteractionById = (interactionId) => {
        return axios.get('/api/v1/interactions/' + interactionId)
            .then(function (response) {
                setInteractionContent(response.data.content)
            })
            .catch(function (error) {
                if(error.response.status==404) {
                    console.log(setCandidateInteractions([]))
                }
                toast.error(error.response.data, {
                    toastId:"errorMessage1",
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

    useEffect(() => {
        if(sortedByState == null || sortOrderState == null) {
            getCandidateInteractions(currentPage, interactionsPerPage)
        } else {
            getCandidateInteractionsSorted(currentPage, interactionsPerPage, sortedByState, sortOrderState)
        }
        setIsInteractionsChanged(false)
    }, [isInteractionsChanged])

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    //Modal open-close control
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleCloseEditModal = () => setShowEditModal(false);
    const handleCloseDetailsModal = () => setShowDetailsModal(false);

    const setInteractionInfo = (interactionInfo) => {
        setSelectedInteraction({
            id: interactionInfo.id,
            candidateId: interactionInfo.candidateId
        })
    }

    const handleShowDeleteModal = (event, interactionInfo) => {
        setInteractionInfo(interactionInfo)
        setShowDeleteModal(true);
    }

    const handleShowEditModal = (event, interactionInfo) => {
        setInteractionInfo(interactionInfo)
        setShowEditModal(true);
    }

    const handleShowDetailsModal = (event, interactionInfo) => {
        setInteractionInfo(interactionInfo)
        getInteractionById(interactionInfo.id)
        setShowDetailsModal(true);
    }

    const initialValues = {
        interactionType: "",
        content: "",
        date: "",
        candidateResponded: ""
    };

    const UpdateInteractionSchema = Yup.object().shape({
        interactionType: Yup.string().required("Type is required"),
        content: Yup.string().required("Content is required"),
        date: Yup.date().required("Date is required"),
        candidateResponded: Yup.string().required("Response information is required")
    });

    const updateInteraction = (values) => {
        return axios.patch('/api/v1/interactions/' + selectedInteraction.id,
            {
                interactionType: values.interactionType,
                content: values.content,
                date: values.date,
                candidateResponded: values.candidateResponded
            })
            .then(function (response) {
                
                handleCloseEditModal();
                toast.success("Interaction info successfully updated.", {
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
                })
            })
            .finally(() => {
                setIsInteractionsChanged(true)
            }) 
    }

    const handleDeleteInteraction = (interactionId) => {
        axios.delete('/api/v1/interactions/' + interactionId)
            .then(function (response) {
                toast.success(response.data, {
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
                setIsInteractionsChanged(true)
            }) 
    }

    const tableHeaders = ["Type", "Content", "Date", "Candidate Responded"]

    return (<div>
        <NavbarComponent candidateId={location.state.candidateId} addButtonName="New Interaction" setIsInteractionsChanged={setIsInteractionsChanged}></NavbarComponent>
        <div  className="d-flex justify-content-evenly p-2" >
            <PaginateComponent handlePageClick={handlePageClick} pageNumber={pageNumber}/>
        </div>
        <div>
            <ToastContainer className="mt-4" />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {tableHeaders.map(headerName => {
                            return (<th id={headerName} scope="col" className="px-6 ">
                                <div className="flex items-center">
                                    {headerName}
                                    {(headerName === "Date") ? <>
                                        <BsArrowUpShort onClick={(event) => handleSort(event, headerName.toLowerCase(), "DESC")} size={25}></BsArrowUpShort>
                                        <BsArrowDownShort onClick={(event) => handleSort(event, headerName.toLowerCase(), "ASC")} size={25}></BsArrowDownShort>
                                    </>
                                        : null}
                                </div>
                            </th>)
                        })}
                    </tr>
                </thead>
                <tbody>
                    {candidateInteractions.map(c => {
                        return (
                            <tr id={c.id}>
                                <td scope="row" className="px-6 pt-3">
                                    {c.interactionType}
                                </td>
                                <td className="px-6 pt-3">
                                <button onClick={(event) => handleShowDetailsModal(event, c)} type="button" className="btn btn-primary">View Details</button>
                                </td>
                                <td className="px-6 pt-3">
                                    {moment.utc(c.date).local().format('HH:mm:ss DD-MM-YYYY')}
                                </td>
                                <td className="px-6 pt-3">
                                    {c.candidateResponded ? "True" : "False"}
                                </td>
                                <td className="px-6 text-right">
                                    <div className="d-flex align-items-center justify-content-evenly">
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
                    Remove interaction at {moment.utc(selectedInteraction.date).local().format('HH:mm:ss DD-MM-YYYY')}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleDeleteInteraction(selectedInteraction.id)}>
                        Remove
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal centered show={showDetailsModal} onHide={handleCloseDetailsModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Interaction content</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {interactionContent}
                </Modal.Body>
            </Modal>

            <Modal centered show={showEditModal} onHide={handleCloseEditModal} className="modal-lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit interaction at {moment.utc(selectedInteraction.date).local().format('HH:mm:ss DD-MM-YYYY')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={UpdateInteractionSchema}
                        onSubmit={(values) => {
                            updateInteraction(values)
                        }}
                    >
                        {() => (
                            <Form className=''>
                                <div className=''>
                                    <label htmlFor="interactionType">Interaction Type</label>
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
                                    <label htmlFor="candidateResponded">Responded</label>
                                    <div className='p-2'>
                                        <Field name="candidateResponded" as="select" placeholder="Select responded" className="form-control form-select">
                                            <option defaultValue="SELECT">Select responded</option>
                                            <option value="TRUE">True</option>
                                            <option value="FALSE">False</option>
                                        </Field>
                                        <ErrorMessage name="candidateResponded" component="div" />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-around">
                                    <Button variant="secondary" onClick={handleCloseEditModal}>
                                        Close
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Update interaction
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
        </div>
    </div>);
}

export default InteractionDetail;