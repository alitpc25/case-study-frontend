import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import { ToastContainer } from 'react-toastify';
import NavbarComponent from '../components/NavbarComponent';
import { Button, Modal, Table } from 'react-bootstrap';
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs"
import moment from "moment"
import { Formik, Form, Field, ErrorMessage } from "formik"
import MyDatePicker from '../components/MyDatePicker';
import PaginateComponent from '../components/PaginateComponent';
import { UpdateInteractionSchema } from '../utils/yupSchemas';
import { toastSuccess, toastError } from '../utils/toastMessages';

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
    const interactionsPerPage = 9;
    const [pageNumber, setPageNumber] = useState(1); // total page number
    const [sortedByState, setSortedByState] = useState(null);
    const [sortOrderState, setSortOrderState] = useState(null);

    const getCandidateInteractions = (currentPage, interactionsPerPage) => {
        axios.get(`/api/v1/interactions?candidateId=${location.state.candidateId}&page=${currentPage}&size=${interactionsPerPage}`)
        .then(response => {
            setCandidateInteractions(response.data.content);
            setCurrentPage(response.data.number + 1);
            setPageNumber(parseInt(response.data.totalPages));
        }).catch(error => {
            if (error.response.status === 404) {
                setCandidateInteractions([]);
            }
            toastError(error.response.data);
        })
    }

    const getCandidateInteractionsSorted = (currentPage, interactionsPerPage, sortedBy, sortOrder) => {
        axios.get(`/api/v1/interactions?candidateId=${location.state.candidateId}&page=${currentPage}&size=${interactionsPerPage}&sortedBy=${sortedBy}&sortOrder=${sortOrder}`)
            .then(function (response) {
                setCandidateInteractions(response.data.content)
                setCurrentPage(response.data.number + 1);
                setPageNumber(parseInt(response.data.totalPages));
            })
            .catch(function (error) {
                if(error.response.status===404) {
                    setCandidateInteractions([])
                }
                toastError(error.response.data);
            })
    }

    const handleSort = (e, sortedBy, sortOrder) => {
        setSortedByState(sortedBy)
        setSortOrderState(sortOrder)
        getCandidateInteractionsSorted(currentPage, interactionsPerPage, sortedBy, sortOrder);
    }

    const getInteractionById = (interactionId) => {
        axios.get('/api/v1/interactions/' + interactionId)
            .then(function (response) {
                setInteractionContent(response.data.content)
            })
            .catch(function (error) {
                if(error.response.status===404) {
                    setCandidateInteractions([])
                }
                toastError(error.response.data);
            })
    }

    useEffect(() => {
        if(sortedByState === null || sortOrderState === null) {
            getCandidateInteractions(currentPage, interactionsPerPage)
        } else {
            getCandidateInteractionsSorted(currentPage, interactionsPerPage, sortedByState, sortOrderState)
        }
        setIsInteractionsChanged(false)
    }, [isInteractionsChanged, currentPage, sortOrderState, sortedByState])

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    //Modal open-close control
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleCloseEditModal = () => setShowEditModal(false);
    const handleCloseDetailsModal = () => setShowDetailsModal(false);

    const handleShowDeleteModal = (event, interactionInfo) => {
        setSelectedInteraction(interactionInfo)
        setShowDeleteModal(true);
    }

    const handleShowEditModal = (event, interactionInfo) => {
        setSelectedInteraction(interactionInfo)
        setShowEditModal(true);
    }

    const handleShowDetailsModal = (event, interactionInfo) => {
        setSelectedInteraction(interactionInfo)
        getInteractionById(interactionInfo.id)
        setShowDetailsModal(true);
    }

    const initialValuesInteraction = {
        interactionType: selectedInteraction.interactionType,
        content: selectedInteraction.content,
        date: new Date(selectedInteraction.date),
        candidateResponded: selectedInteraction.candidateResponded
    };

    const updateInteraction = (values) => {
        axios.patch('/api/v1/interactions/' + selectedInteraction.id, values)
            .then(function (response) {
                handleCloseEditModal();
                toastSuccess("Interaction info successfully updated.");
            })
            .catch(function (error) {
                toastError(error.response.data)
            })
            .finally(() => {
                setIsInteractionsChanged(true)
            }) 
    }

    const handleDeleteInteraction = (interactionId) => {
        axios.delete('/api/v1/interactions/' + interactionId)
            .then(function (response) {
                toastSuccess(response.data);
                handleCloseDeleteModal()
            })
            .catch(function (error) {
                toastError(error.response.data);
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
                        initialValues={initialValuesInteraction}
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
                                        <Field name="interactionType" as="select" className="form-control form-select">
                                            <option value="Phone">Phone</option>
                                            <option value="Mail">Mail</option>
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
                                        <Field name="candidateResponded" as="select" className="form-control form-select">
                                            <option value={true}>True</option>
                                            <option value={false}>False</option>
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